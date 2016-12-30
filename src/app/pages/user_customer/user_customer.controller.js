/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('UserCustomerListController', UserCustomerListController)
        .controller('UserCustomerChangeController', UserCustomerChangeController)
        .controller('UserCustomerAddController', UserCustomerAddController);

    /** @ngInject */
    function UserCustomerListController($state, cbAlert, userCustomer, userCustomerConfig, userMotorConfig) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});

      /**
       * 表格配置
       *
       */
      vm.gridModel = {
        columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(userCustomerConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          var page = angular.extend({}, currentParams, {page: data});
          $state.go(currentStateName, page);
        },
        selectHandler: function(item){
          console.log(item);
          getMotor(item.mobile);
        }
      };

      userCustomer.grades().then(function (results) {
        console.log(results);
      });
      vm.gridModel2 = {
        columns: angular.copy(userMotorConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: {
          'settingColumnsSupport': false,   // 设置表格列表项
          'checkboxSupport': true,  // 是否有复选框
          'sortSupport': true,
          'paginationSupport': false,  // 是否有分页
          'selectedProperty': "selected",  // 数据列表项复选框
          'selectedScopeProperty': "selectedItems",
          'useBindOnce': true  // 是否单向绑定
        },
        loadingState: true      // 加载数据
      };
      function getMotor(mobile){
        vm.gridModel2.loadingState = true;
        userCustomer.getMotors({mobile: mobile}).then(function(results){
          var result = results.data;
          if (result.status == 0) {
            return result.data;
          } else {
            cbAlert.error("错误提示", result.rtnInfo);
          }
        }, function (data) {
          $log.debug('getListError', data);
        }).then(function(result){
          vm.gridModel2.itemList = result;
          vm.gridModel2.loadingState = false;
        });
      }

      /**
       * 获取员工列表
       */
      function getList() {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!currentParams.page) {
          return;
        }
        console.log(currentParams);
        userCustomer.userList(currentParams).then(function (results) {
          var result = results.data;
          if (result.status == 0) {
            if (!result.data.length && currentParams.page != 1) {
              $state.go(currentStateName, {page: 1});
            }
            var items = [];
            _.forEach(result.data, function(item){
              item.gradename = _.find(result.usergrades, function(key){
                return key.guid === item.storegrade;
              }).gradename;
              items.push(item);
            });
            return {
              items: items,
              totalCount: result.totalCount
            }
          } else {
            cbAlert.error("错误提示", result.rtnInfo);
          }
        }, function (data) {
          $log.debug('getListError', data);
        }).then(function(result){
          vm.gridModel.itemList = result.items;
          vm.gridModel.paginationinfo = {
            page: currentParams.page * 1,
            pageSize: currentParams.pageSize,
            total: result.totalCount
          };
          getMotor(result.items[0].mobile);
          vm.gridModel.loadingState = false;
        });
      }

      getList();
    }


  /** @ngInject */
  function UserCustomerAddController($state, cbAlert, userCustomer, userCustomerConfig) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = $state.params;

    vm.countdown = "获取验证码";

    vm.setCountdown = function(){
      userCustomer.verifyCode(vm.form.mobile).then(function(results){
        console.log(results);
      });
    };
    vm.myUsers = -1;
    vm.existMobile = function(valid){
      valid && userCustomer.exist({mobile: vm.form.mobile}).then(function(results){
        var result = results.data;
        if (result.status == 0) {
          vm.myUsers = result.data ? 1 : 0;
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      });
    };

    vm.submitBtn = function(){
      if(vm.myUsers){
        $state.go('user.customer.add2', {mobile: vm.form.mobile});
        return ;
      }
      userCustomer.verifyCodeCheck(vm.form).then(function(results){
        console.log(results);
        var result = results.data;
        if (result.status == 0) {
          if (result.data === "") {
            $state.go('user.customer.add2', {mobile: vm.form.mobile});
          } else {
            cbAlert.warning("错误提示", result.data);
          }
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      });
    }
  }


  /** @ngInject */
  function UserCustomerChangeController($state, $q, cbAlert, userCustomer, vehicleSelection) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = $state.params;
    vm.isLoadData = false;
    vm.dataBase = {};
    vm.dataLists = [];

    vm.insuranceModel = {

    };


    $q.all([userCustomer.grades(), userCustomer.getUser(currentParams), userCustomer.getMotors(currentParams)]).then(function(results){
      var grades = results[0].data,
          getUser = results[1].data,
          getMotors = results[2].data;
      console.log(grades, getUser);

      if(getUser.status == 0 && grades.status == 0){
        if(!getUser.data){
          vm.dataBase.username =  currentParams.mobile;
          vm.dataBase.mobile =  currentParams.mobile;
        }else{
          vm.dataBase = angular.copy(getUser.data);
          vm.dataBase.$$gradename = _.find(grades.data, function(item){
            return item.guid === vm.dataBase.storegrade;
          }).gradename;
        }
        vm.isLoadData = true;
      }else {
        if(grades.status != 0){
          cbAlert.error("错误提示", grades.rtnInfo);
        }
        if(getUser.status != 0){
          cbAlert.error("错误提示", getUser.rtnInfo);
        }
      }

      if (getMotors.status == 0) {
        vm.dataLists = angular.copy(getMotors.data);
        showMotor(vm.dataLists[0]);
      } else {
        cbAlert.error("错误提示", result.rtnInfo);
      }

    });

    vehicleSelection.insurances().then(function(results){
      var result = results.data;
      if (result.status == 0) {
        vm.insuranceModel.store = angular.copy(result.data);
      } else {
        cbAlert.error("错误提示", result.rtnInfo);
      }
    });

    vm.currentSelect = function ($event, item) {
      if(item.guid === vm.item.guid){
        return ;
      }
      console.log(item);
      vm.item = undefined;
      showMotor(item);
    };

    vm.addMotor = function(){
      showMotor({});
    };

    function showMotor(item){
      vm.item = item;
    }

    vm.vehicleHandler = function(data){
      console.log(data);
      if(data.type === 'add'){
        vm.dataLists.push(data.data);
        showMotor(vm.dataLists[vm.dataLists.length-1]);
      }
    };

    vm.submitBtn = function(){
      userCustomer.add(vm.dataBase).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          var motors = _.filter(vm.dataLists, function(item){
            return angular.isUndefined(item.guid);
          });
          _.forEach(motors, function(item){
            item.userId = result.data;
          });
          return motors;
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      }).then(function(results){
        if(!results.length){
          $state.go('user.customer.list', {'page': 1});
        }
        userCustomer.addMotors(results).then(function (results) {
          var result = results.data;
          if (result.status == 0) {
            $state.go('user.customer.list', {'page': 1})
          } else {
            cbAlert.error("错误提示", result.rtnInfo);
          }
        });
      });
    }
  }
})();
