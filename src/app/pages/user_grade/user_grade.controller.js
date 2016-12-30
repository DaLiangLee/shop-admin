/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserGradeListController', UserGradeListController);

  /** @ngInject */
  function UserGradeListController(cbAlert, userCustomer) {
    var vm = this;
    vm.items = [];
    userCustomer.grades().then(function (results) {
      if (results.data.status == 0) {
        return setGradesData(results.data.data);
      } else {
        cbAlert.error(results.data.rtnInfo);
      }
    }).then(function (results) {
      console.log(results);
      vm.items = results;
    });

    function setGradesData(list) {
      list = list.concat([]);
      angular.forEach(list, function (item) {
        if (item.isdefault === "0" && item.tradeamount === "0") {
          item.tradeamount = "";
        }
        if (item.isdefault === "0" && item.discount === "0") {
          item.discount = "";
        }
      });
      return list;
    }

    /**
     * 修改会员等级名称
     *
     */
    // 失去焦点时候先去检查有没有重名的，如果就提示用户，把值还原回去
    vm.blurGradesName = function(name, index) {
      var items = _.filter(vm.items, function(item){
        return item.gradename === name;
      });
      console.log(items);
      if(items.length > 1){
        cbAlert.alert(name + "已经存在");
        vm.items[index].$$samegradename = true;
      }else{
        vm.items[index].$$samegradename = false;
      }
    };

    vm.blurTradeamount = function(name, index) {
      var items = _.filter(vm.items, function(item){
        return item.tradeamount === name;
      });
      console.log(items);
      if(items.length > 1){
        cbAlert.alert("交易额达"+ name + "条件已经存在");
        vm.items[index].$$sametradeamount = true;
      }else{
        vm.items[index].$$sametradeamount = false;
      }
    };

/*    vm.focusGradesName = function (item) {
      item.$$beforeChangeGradesName = item.gradename;
    };

    vm.blurGradesName = function(items) {
      console.log(item);
      angular.forEach(vm.items, function (item) {
        if (item.gradename === items.gradename) {
          cbAlert.alert(name + "已经存在，请重新填写");
          items.gradename = item.$$beforeChangeGradesName;
          return false;
        }
      });
    };*/

    /**
     * 添加新等级
     */
    vm.addGrade = function () {
      vm.items.push({
        "gradename": "",
        "discount": "",
        "tradeamount": "",
        "isdefault": "0"
      });
    };

    /**
     * 保存所有等级给服务器
     */
    vm.saveGrade = function () {
      console.log(vm.items);

      userCustomer.saveGrades(vm.items).then(function (results) {
        console.log(results);
        if (results.data.status == 0) {
          cbAlert.tips("修改成功");
        } else {
          cbAlert.error(results.data.rtnInfo);
        }
      });
    };
  }
})();

