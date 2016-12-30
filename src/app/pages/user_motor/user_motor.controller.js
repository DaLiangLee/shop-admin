/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserMotorListController', UserMotorListController);

  /** @ngInject */
  function UserMotorListController($state, cbAlert, userCustomer, userMotorConfig, userCustomerConfig) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});
    /**
     * 表格配置
     *
     */
    var usergrades = [];
    vm.gridModel = {
      columns: angular.copy(userMotorConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(userMotorConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      selectHandler: function(item){
        console.log(item);
        getUser(item.guid);
      }
    };

    vm.gridModel2 = {
      columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
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

    function getUser(guid){
      vm.gridModel2.loadingState = true;
      userCustomer.byMotor({motorid: guid}).then(function(results){
        var result = results.data;
        if (result.status == 0) {
          return result.data;
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      }, function (data) {
        $log.debug('getListError', data);
      }).then(function(result){
        _.forEach(result, function(item){
          item.gradename = _.find(usergrades, function(key){
            return key.guid === item.storegrade;
          }).gradename;
        });
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
      userCustomer.motorList(currentParams).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && currentParams.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          var items = [];
          _.forEach(result.data, function(item){
            items.push(item);
          });
          usergrades = result.usergrades;
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
        getUser(result.items[0].guid);
        vm.gridModel.loadingState = false;
      });
    }

    getList();
  }
})();


