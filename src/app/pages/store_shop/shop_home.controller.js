/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('StoreShopHomeController', StoreShopHomeController);

    /** @ngInject */
    function StoreShopHomeController($http, $log) {
        var vm = this;
        vm.dataBase = {};
        vm.editor = "sadas";
        $http({
          method : 'get',
          url : 'http://localhost:9090/shopservice/admin/store/shop/index',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (data) {
          $log.debug(data);
          vm.dataBase = data.data.data
        });
      vm.reviewHandler = function (data) {
        $log.debug(data);

      }
      vm.uploadHandler = function (data) {
        $log.debug(data);
      }
      vm.removePhotos = function (index) {
        vm.dataBase.photos.splice(index,1);
      }
      vm.hoursHandler = function (data) {
        $log.debug(data);
        if(data.status == '-1'){
          $log.debug(data);
        }else{
          vm.dataBase.hours = data.data;
        }
      }
      vm.telephoneHandler = function (data) {
        $log.debug(data);
        if(data.status == '-1'){
          $log.debug(data);
        }else{
          vm.dataBase.telephone = data.data;
        }

      }
    }

})();
