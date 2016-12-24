/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('StoreShopHomeController', StoreShopHomeController);

    /** @ngInject */
    function StoreShopHomeController($log, shopHome, cbAlert) {
        var vm = this;
        vm.dataBase = {};
        vm.editor = "sadas";
      shopHome.manager().then(function(results){
        if(results.data.status == '0'){
          vm.dataBase = results.data.data;
          vm.dataBase.store.photos = vm.dataBase.store.photos.split(',');
        }else{
          cbAlert.error(results.data.rtnInfo);
        }
      });
      vm.getScopeStatus = function(item, list){
        return angular.isDefined(_.find(list, function(key){return key.id == item.id;}));
      };
      vm.reviewHandler = function (data) {
        if(data.status == '0'){
          shopHome.saveDescription({
            description: encodeURI(data.content)
          }).then(function(results){
            if(results.data.status == '0'){
              cbAlert.tips("修改商户介绍成功");
              vm.dataBase.store.description = data.content;
            }else{
              cbAlert.error(results.data.rtnInfo);
            }
          });
        }
      };
      vm.uploadHandler = function (data, index) {
        if (data.status == 0) {
          if (angular.isDefined(index)) {
            vm.dataBase.store.photos[index] = data.data[0].url;
          } else {
            angular.forEach(data.data, function (item) {
              vm.dataBase.store.photos.push(item.url);
            });
          }
        }
      };
      vm.removePhotos = function (index) {
        var data = angular.copy(vm.dataBase.store.photos);
        data.splice(index,1).join(",");
        shopHome.savePhotos({
          photos: data
        }).then(function(results){
          if(results.data.status == '0'){
            cbAlert.tips("修改店招图片成功");
            vm.dataBase.store.photos.splice(index,1);
          }else{
            cbAlert.error(results.data.rtnInfo);
          }
        });
      };
      vm.hoursHandler = function (data) {
        if(data.status == '0'){
          shopHome.saveTime(data.data).then(function(results){
            if(results.data.status == '0'){
              cbAlert.tips("修改营业时间成功");
              vm.dataBase.store.opentime = data.data.opentime;
              vm.dataBase.store.closetime = data.data.closetime;
            }else{
              cbAlert.error(results.data.rtnInfo);
            }
          });
        }
      };
      vm.telephoneHandler = function (data) {
        if(data.status == '0'){
          shopHome.saveTelephone({telephone: data.data}).then(function(results){
            if(results.data.status == '0'){
              cbAlert.tips("修改客服电话成功");
              vm.dataBase.store.telephone = data.data;
            }else{
              cbAlert.error(results.data.rtnInfo);
            }
          });
        }
      }
    }

})();
