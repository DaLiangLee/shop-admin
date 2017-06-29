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
        if (result.status*1 === 0) {
          return setGradesData(result.data);
        } else {
          cbAlert.error(result.data);
        }
      }).then(function (results) {
        beforeData = angular.copy(results);
        // 把所有价格换算成元显示
        vm.dataLists = _.map(results, function (item) {
          if(item.tradeamount){
            item.tradeamount = computeService.pullMoney(item.tradeamount);
          }
          return item;
        });
      });
    }

    list();

    vm.isDisabled = function () {
      var items = _.filter(vm.dataLists, function (item) {
        return item.$samegradename || item.$sametradeamount || item.$samegradediscount;
      });
      return items.length > 0;
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
        return _.trim(item.gradename) === _.trim(name);
      });
      if (items.length > 1) {
        vm.dataLists[index].$samegradenamemessage = name + "已经存在";
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
      if (name === "") {
        vm.dataLists[index].$sametradeamountmessage = "不能为空";
        vm.dataLists[index].$sametradeamount = true;
        return;
      }
      name *= 1;
      var items1 = _.filter(vm.dataLists, function (item) {
        return item.tradeamount !== "" && item.tradeamount*1 === name;
      });

      if (items1.length > 1) {
        vm.dataLists[index].$sametradeamountmessage = "交易额达 " + name + " 条件已经存在";
        vm.dataLists[index].$sametradeamount = true;
      } else {
        vm.dataLists[index].$sametradeamount = false;
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
      if (name === "") {
        vm.dataLists[index].$samegradediscount = false;
        return;
      }
      if (0 <= name && name <= 100) {
        vm.dataLists[index].$samegradediscount = false;
      } else {
        vm.dataLists[index].$samegradediscount = true;
        vm.dataLists[index].$samegradediscountmessage = "折扣只能填0-100";
      }
      vm.isDisabled();
    };




    /**
     * 添加新等级
     */
    vm.addGrade = function () {
      vm.dataLists.push({
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
      // 把数字转成字符串形式，后台传回来都是字符串，为后面对比做铺垫
      _.map(results, function (item) {
        item.tradeamount !== "" && (item.tradeamount = computeService.pushMoney(item.tradeamount)+"");
        item.discount !== "" && (item.discount += "");
      });
      return results;
    }

    function checkGradesName() {
      var isGradesName = false;
      _.forEach(vm.dataLists, function (item) {
        if(item.gradename === "" && (item.tradeamount !== "" && item.discount === "" || item.tradeamount !== "" && item.discount !== "")){
          item.$samegradenamemessage = "没有填写";
          item.$samegradename = true;
          isGradesName = true;
        }
      });
      return isGradesName;
    }

    function checkDiscount() {
      var isDiscount = false;
      _.forEach(vm.dataLists, function (item) {
        if(item.gradename !== "" && item.tradeamount !== "" && item.discount === ""){
          item.$samegradediscountmessage = "没有填写";
          item.$samegradediscount = true;
          isDiscount = true;
        }
      });
      return isDiscount;
    }

    function setDiscount() {
      _.forEach(vm.dataLists, function (item) {
        if(item.gradename !== "" && item.tradeamount !== "" && item.discount === ""){
          item.$samegradediscountmessage = "";
          item.$samegradediscount = false;
          item.discount = "100";
        }
      });
    }

    function checkTradeamount() {
      var isTradeamount = false;
      _.forEach(vm.dataLists, function (item) {
        if(item.gradename !== "" && item.tradeamount === ""){
          item.$sametradeamountmessage = "不能为空";
          item.$sametradeamount = true;
          isTradeamount = true;
        }
      });
      return isTradeamount;
    }




    /**
     * 保存所有等级给服务器
     */
    var anti_shake = false;
    vm.saveGrade = function () {
      if(checkTradeamount()){
        cbAlert.alert("请填写条件");
        return;
      }

      if(checkGradesName()){
        cbAlert.alert("会员等级没有填写");
        return;
      }


      if(checkDiscount()){
        cbAlert.confirm("折扣未填写，确定继续？", function (isConfirm) {
          if(isConfirm){
            setDiscount();
            save();
          }
          cbAlert.close();
        }, "如未填写折扣，默认为100%", "confirm");
        return;
      }
      save();
    };

    function save() {
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
        if (results.data.status*1 === 0) {
          cbAlert.tips("修改成功");
          list();
        } else {
          cbAlert.error(results.data.data);
        }
        anti_shake = false;
      });
    }


  }
})();


