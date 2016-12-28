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
    function UserCustomerListController($state, cbAlert, userCustomer, userCustomerConfig) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = $state.params;

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
          $log.debug('updateGridPaginationInfo', page);
          //console.log(page);
          $state.go(currentStateName, page);
        }
      };

      userCustomer.grades().then(function (results) {
        console.log(results);

      });


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
            vm.gridModel.itemList = result.data;
            vm.gridModel.paginationinfo = {
              page: currentParams.page * 1,
              pageSize: 10,
              total: result.totalCount
            };
            vm.gridModel.loadingState = false;
          } else {
            cbAlert.error("错误提示", result.rtnInfo);
          }
        }, function (data) {
          $log.debug('getListError', data);
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
  function UserCustomerChangeController($state, cbAlert, userCustomer, userCustomerConfig) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = $state.params;
    vm.isLoadData = false;
    vm.dataBase = {};
    vm.dataLists = [];
    userCustomer.getUser(currentParams).then(function(results){
      console.log(results);
      var result = results.data;
      if (result.status == 0) {

        if(!result.data){
          vm.dataBase.username =  currentParams.mobile;
          vm.dataBase.mobile =  currentParams.mobile;
        }else{
          vm.dataBase = angular.copy(result.data);
        }
        vm.isLoadData = true;
      } else {
        cbAlert.error("错误提示", result.rtnInfo);
      }
    });

    userCustomer.getMotors(currentParams).then(function(results){
      var result = results.data;
      if (result.status == 0) {
        vm.dataLists = angular.copy(result.data);
        showMotor(vm.dataLists[0]);
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


    function getUserData(){
      var user = {};
      user = angular.extend({}, vm.dataBase);

      return user;
    }

    vm.submitBtn = function(){
      userCustomer.add(getUserData()).then(function (results) {

      });
    }
  }
})();
