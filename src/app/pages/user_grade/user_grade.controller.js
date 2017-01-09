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
     * @param name    当前的值
     * @param index   当前的索引
     */
    // 失去焦点时候先去检查有没有重名的，如果就提示用户，把值还原回去
    vm.blurGradesName = function(name, index) {
      // 检查值是不是空的。如果是空的就停止执行了，可以为空
      if(!name){
        return ;
      }
      var items = _.filter(vm.items, function(item){
        return item.gradename === name;
      });
      if(items.length > 1){
        cbAlert.alert(name + "已经存在");
        vm.items[index].$$samegradename = true;
      }else{
        vm.items[index].$$samegradename = false;
      }
    };

    /**
     * 修改交易额达到条件
     * @param name    当前的值
     * @param index   当前的索引
     */
    // 失去焦点时候先去检查有没有重复的，如果就提示用户，把值还原回去
    vm.blurTradeamount = function(name, index) {
      // 检查值是不是空的。如果是空的就停止执行了，可以为空
      if(!name){
        return ;
      }
      var items = _.filter(vm.items, function(item){
        return item.tradeamount === name;
      });
      if(items.length > 1){
        cbAlert.alert("交易额达 "+ name + " 条件已经存在");
        vm.items[index].$$sametradeamount = true;
      }else{
        vm.items[index].$$sametradeamount = false;
      }
    };

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
      userCustomer.saveGrades(vm.items).then(function (results) {
        if (results.data.status == 0) {
          cbAlert.tips("修改成功");
        } else {
          cbAlert.error(results.data.data);
        }
      });
    };
  }
})();


