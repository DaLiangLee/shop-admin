/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserGradeListController', UserGradeListController);

  /** @ngInject */
  function UserGradeListController(cbAlert, userCustomer, computeService) {
    var vm = this;
    vm.dataLists = [];
    var beforeData = null;

    function list() {
      userCustomer.grades().then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          return setGradesData(result.data);
        } else {
          cbAlert.error(result.data);
        }
      }).then(function (results) {
        beforeData = angular.copy(results);
        // 把所有价格换算成元显示
        _.map(results, function (item) {
          item.tradeamount = (angular.isDefined(item.tradeamount) && item.tradeamount !== "") ? computeService.divide(item.tradeamount, 100) : "";
        });
        vm.dataLists = results;
      });
    }

    list();

    vm.isDisabled = function () {
      var isDisabled = 0;
      angular.forEach(vm.dataLists, function (item) {
        if (item.$samegradename || item.$sametradeamount || item.$samegradediscount) {
          isDisabled++;
        }
      });
      return isDisabled > 0;
    };


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
    vm.blurGradesName = function (name, index) {
      // 检查值是不是空的。如果是空的就停止执行了，可以为空
      if (!name) {
        return;
      }
      var items = _.filter(vm.dataLists, function (item) {
        return item.gradename === name;
      });
      if (items.length > 1) {
        cbAlert.alert(name + "已经存在");
        vm.dataLists[index].$samegradename = true;
      } else {
        vm.dataLists[index].$samegradename = false;
      }
      vm.isDisabled();
    };

    /**
     * 修改交易额达到条件
     * @param name    当前的值
     * @param index   当前的索引
     */
    // 失去焦点时候先去检查有没有重复的，如果就提示用户，把值还原回去
    vm.blurTradeamount = function (name, index) {
      // 检查值是不是空的。如果是空的就停止执行了，可以为空
      if (!name) {
        return;
      }
      var items = _.filter(vm.dataLists, function (item) {
        return item.tradeamount === name;
      });
      if (items.length > 1) {
        cbAlert.alert("交易额达 " + name + " 条件已经存在");
        vm.items[index].$sametradeamount = true;
      } else {
        vm.items[index].$sametradeamount = false;
      }
      vm.isDisabled();
    };

    /**
     * 修改修改折扣只能0-100
     * @param name    当前的值
     * @param index   当前的索引
     */
    // 失去焦点时候先去检查有没有重复的，如果就提示用户，把值还原回去
    vm.blurDiscount = function (name, index) {
      if (angular.isUndefined(name)) {
        return;
      }
      if (0 > name || name > 100) {
        vm.items[index].$samegradediscount = true;
        cbAlert.alert("折扣只能填0-100");
      } else {
        vm.items[index].$samegradediscount = false;
      }
      vm.isDisabled();
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
     * 格式化 vm.dataBase数据供提交使用
     * @param data
     * @returns {{}}
     */
    function getDataBase(data) {
      var results = angular.copy(data);
      // 把所有价格换算成分保存给后台
      _.map(results, function (item) {
        item.tradeamount = (angular.isDefined(item.tradeamount) && item.tradeamount !== "") ? computeService.multiply(item.tradeamount, 100) : "";
      });
      return results;
    }

    /**
     * 保存所有等级给服务器
     */
    var anti_shake = false;
    vm.saveGrade = function () {
      if (vm.isDisabled()) {
        return;
      }
      // 如果发现对比没有修改，就不提交给后台，减少服务器请求压力
      if (angular.equals(beforeData, getDataBase(vm.dataLists))) {
        cbAlert.tips("修改成功");
        return;
      }
      // 仿抖 防止用户快速点击多次提交
      if (anti_shake) {
        return;
      }
      anti_shake = true;
      // 提交数据给后台
      userCustomer.saveGrades(getDataBase(vm.dataLists)).then(function (results) {
        if (results.data.status == 0) {
          cbAlert.tips("修改成功");
          list();
        } else {
          cbAlert.error(results.data.data);
        }
        anti_shake = false;
      });
    };
  }
})();


