/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserMotorListController', UserMotorListController);

  /** @ngInject */
  function UserMotorListController($state, cbAlert, userCustomer, userMotorConfig, userCustomerConfig, configuration, computeService) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});
    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      requestParams: {
        params: currentParams,
        request: "users,customer,export",
        permission: "chebian:store:user:customer:export"
      },
      columns: angular.copy(userMotorConfig().DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(userMotorConfig().DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      selectHandler: function(item){
        // 拦截用户恶意点击
        !item.$active && item.guid && getUser(item.guid);
      }
    };

    vm.gridModel2 = {
      columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: {
        'settingColumnsSupport': false,   // 设置表格列表项
        'sortSupport': true,
        'paginationSupport': false,  // 是否有分页
        'selectedProperty': "selected",  // 数据列表项复选框
        'selectedScopeProperty': "selectedItems",
        'useBindOnce': true  // 是否单向绑定
      },
      loadingState: true      // 加载数据
    };

    vm.gridModel2.config.propsParams = {
      balanceItem: function (data) {
        if (data.status === '0') {
          data.data.rechargeamount = computeService.pushMoney(data.data.rechargeamount);
          data.data.giveamount = computeService.pushMoney(data.data.giveamount);
          userCustomer.chargeBalance(data.data).then(function (results) {
            var result = results.data;
            if (result.status === 0) {
              cbAlert.tips('充值成功');
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", result.data);
            }
          });
        }
      }
    };


    function getUser(guid){
      vm.gridModel2.loadingState = true;
      userCustomer.byMotor({motorid: guid}).then(function(results){
        var result = results.data;
        if (result.status*1 === 0) {
          return result.data;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      }).then(function(result){
        vm.gridModel2.itemList = result;
        vm.gridModel2.loadingState = false;
      });
    }

    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      'config': _.clone(userMotorConfig().DEFAULT_SEARCH.config(currentParams)),
      'handler': function (data) {
        if(_.isEmpty(data)){
          _.map(currentParams, function (item, key) {
            if(key !== 'page'){
              currentParams[key] = undefined;
            }
          });
          $state.go(currentStateName, currentParams);
        }else{
          var search = angular.extend({}, currentParams, data);
          // 如果路由一样需要刷新一下
          if(angular.equals(currentParams, search)){
            $state.reload();
          }else{
            $state.go(currentStateName, search);
          }
        }
      }
    };


    /**
     * 获取车辆列表
     */
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }
      userCustomer.motorList(params).then(function (results) {
        var result = results.data;
        if (result.status*1 === 0) {
          if (!result.data.length && params.page*1 !== 1) {
            $state.go(currentStateName, {page: 1});
          }
          var items = [];
          _.forEach(result.data, function(item){
            items.push(item);
          });
          return {
            items: items,
            totalCount: result.totalCount
          }
        } else {
          cbAlert.error("错误提示", result.data);
        }
      }).then(function(result){
        _.map(result.items, function (item) {
          item.logo = configuration.getStatic() + item.logo;
          item.baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + item.guid;
        });
        vm.gridModel.paginationinfo = {
          page: params.page * 1,
          pageSize: params.pageSize,
          total: result.totalCount
        };
        if(result.items[0]){
          getUser(result.items[0].guid);
        }else{
          vm.gridModel2.itemList = [];
          vm.gridModel2.loadingState = false;
        }
        vm.gridModel.itemList = result.items;
        vm.gridModel.itemList[0] && (vm.gridModel.itemList[0].$active = true);
        vm.gridModel.loadingState = false;
      });
    }

    getList(currentParams);
  }
})();


