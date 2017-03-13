/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('FinanceDebitcardLsitController', FinanceDebitcardLsitController)
    .controller('FinanceDebitcardDetailController', FinanceDebitcardDetailController);


  /** @ngInject */
  function FinanceDebitcardLsitController($state, cbAlert, financeDebitcard, financeDebitcardConfig, computeService, configuration) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 10});

    /**
     * 组件数据交互
     *
     */
    var propsParams = {

    };

    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: _.clone(financeDebitcardConfig.DEFAULT_GRID.columns),
      financeDebitcard: [],
      config: _.merge(financeDebitcardConfig.DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true      // 加载数据
    };

    var DEFAULT_SEARCH = _.clone(financeDebitcardConfig.DEFAULT_SEARCH);
    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      config: DEFAULT_SEARCH.config(currentParams),
      'handler': function (data) {
        console.log(data);

        // 如果路由一样需要刷新一下
        if(angular.equals(currentParams, data)){
          $state.reload();
        }else{
          $state.go(currentStateName, data);
        }
      }
    };

    /**
     * 获取列表
     * @param params   传递参数
     */
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }
      financeDebitcard.search(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          _.forEach(result.data, function (item) {
            item.map.balance = computeService.pullMoney(item.map.balance);
            item.map.cost = computeService.pullMoney(item.map.cost);
            item.map.gift = computeService.pullMoney(item.map.gift);
            item.map.recharge = computeService.pullMoney(item.map.recharge);
          });
          console.log(result.data);

          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          _.forEach(result.message, function (value, key, obj) {
            if(value > 0){
              obj[key] = computeService.pullMoney(value);
            }
          });
          vm.gridModel.config.propsParams.message = result.message;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }
    getList(currentParams);

  }

  /** @ngInject */
  function FinanceDebitcardDetailController($state, cbAlert, financeDebitcard, financeDebitcardConfig, computeService, userCustomer, configuration) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 10});

    userCustomer.getUser({mobile: currentParams.mobile}).then(function(results){
      var result = results.data;
      if (result.status == 0) {
        vm.userModel = result.data;
      } else {
        cbAlert.error("错误提示", result.data);
      }
    });





    console.log(currentParams);

    /**
     * 组件数据交互
     *
     */
    var propsParams = {
      statusItem: function(item){
        var tips = item.status === "0" ? '是否确认启用该活动？' : '是否确认禁用该活动？';
        cbAlert.ajax(tips, function (isConfirm) {
          if (isConfirm) {
            item.status = item.status === "0" ? "1" : "0";
            var items = _.pick(item, ['guid', 'status']);
            financeDebitcard.saveorupdate(items).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.success('修改成功');
                getList(params);
                var statusTime = $timeout(function () {
                  cbAlert.close();
                  $timeout.cancel(statusTime);
                  statusTime = null;
                }, 1200, false);
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "", 'warning');
      }
    };

    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: _.clone(financeDebitcardConfig.DEFAULT_GRID_DETAIL.columns),
      itemList: [],
      config: _.merge(financeDebitcardConfig.DEFAULT_GRID_DETAIL.config, {propsParams: propsParams}),
      loadingState: true      // 加载数据
    };

    /**
     * 获取员工列表
     */
    function getList(params) {
      financeDebitcard.detail(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          _.forEach(result.data, function (item) {
            item.map.balance = computeService.pullMoney(item.map.balance);
            item.map.cost = computeService.pullMoney(item.map.cost);
            item.map.gift = computeService.pullMoney(item.map.gift);
            item.map.recharge = computeService.pullMoney(item.map.recharge);
          });
          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          _.forEach(result.message, function (value, key, obj) {
            if(value > 0){
              obj[key] = computeService.pullMoney(value);
            }
          });
          vm.gridModel.config.propsParams.message = result.message;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);

  }
})();
