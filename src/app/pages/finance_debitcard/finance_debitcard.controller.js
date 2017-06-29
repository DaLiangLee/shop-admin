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
  function FinanceDebitcardLsitController($state, cbAlert, financeDebitcard, financeDebitcardConfig, computeService, utils) {
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
      columns: _.clone(financeDebitcardConfig().DEFAULT_GRID.columns),
      financeDebitcard: [],
      config: _.merge(financeDebitcardConfig().DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      sortChanged: function (data) {
        var orders = [];
        angular.forEach(data.data, function (item, key) {
          orders.push({
            "field": key.replace("map.", ""),
            "direction": item
          });
        });
        var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
        getList(order);
      }
    };

    var DEFAULT_SEARCH = _.clone(financeDebitcardConfig().DEFAULT_SEARCH);
    var searchModel = _.chain(_.clone(currentParams)).tap(function (value) {
      _.forEach(_.pick(value, ['recharge0', 'recharge1', 'cost0', 'cost1', 'userbalance0', 'userbalance1']), function (item, key) {
        !_.isUndefined(item) && (value[key] = computeService.pullMoney(item));
      });
    }).value();

    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      config: DEFAULT_SEARCH.config(searchModel),
      'handler': function (data) {
        var search = _.chain(data).tap(function (value) {
          _.forEach(_.pick(value, ['recharge0', 'recharge1', 'cost0', 'cost1', 'userbalance0', 'userbalance1']), function (item, key) {
            !_.isUndefined(item) && (value[key] = computeService.pushMoney(item));
          });
        }).value();

        _.chain(currentParams).tap(function (value) {
          _.forEach(_.pick(value, ['recharge0', 'recharge1', 'cost0', 'cost1', 'userbalance0', 'userbalance1']), function (item, key) {
            !_.isUndefined(item) && (value[key] *= 1);
          });
        }).value();
        // 如果路由一样需要刷新一下
        if(angular.equals(currentParams, search)){
          $state.reload();
        }else{
          search.page = '1';
          $state.go(currentStateName, search);
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
        if (result.status*1 === 0) {
          _.forEach(result.data, function (item) {
            item.map.avatar=utils.getImageSrc(item.map.avatar,"user")
          });

          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          vm.gridModel.config.propsParams.message = result.message;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }
    getList(currentParams);

  }

  /** @ngInject */
  function FinanceDebitcardDetailController($state, cbAlert, financeDebitcard, financeDebitcardConfig, userCustomer, utils) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {page: 1, pageSize: 10});

    /**
     * 需要返回操作
     * @type {boolean}
     */
    $state.current.backspace = true;

    userCustomer.getUser({mobile: currentParams.mobile}).then(function(results){
      var result = results.data;
      if (result.status*1 === 0) {
        vm.userModel = result.data;
        vm.userModel.avatar=utils.getImageSrc(vm.userModel.avatar,"user")

      } else {
        cbAlert.error("错误提示", result.data);
      }
    });


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
      columns: _.clone(financeDebitcardConfig().DEFAULT_GRID_DETAIL.columns),
      itemList: [],
      requestParams: {
        params: currentParams,
        request: "finance,debitcard,exceldebitcardDetail",
        permission: "chebian:store:finance:debitcard:view"
      },
      config: _.merge(financeDebitcardConfig().DEFAULT_GRID_DETAIL.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        vm.gridModel.requestParams.params = page;
        getList(page);
      }
    };


    var DEFAULT_SEARCH_DETAIL = _.clone(financeDebitcardConfig().DEFAULT_SEARCH_DETAIL);
    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      config: DEFAULT_SEARCH_DETAIL.config(currentParams),
      'handler': function (data) {
        var items = _.find(DEFAULT_SEARCH_DETAIL.journaltime, function (item) {
          return item.id === data.journaltime0*1;
        });
        if (angular.isDefined(items)) {
          data.journaltime1 = undefined;
        }
        // 如果路由一样需要刷新一下
        if(angular.equals(currentParams, data)){
          $state.reload();
        }else{
          data.page = '1';
          $state.go(currentStateName, data);
        }
      }
    };

    /**
     * 获取某个会员储值卡详情列表
     */
    function getList(params) {
      financeDebitcard.detail(params).then(function (results) {
        var result = results.data;
        if (result.status*1 === 0) {
          _.forEach(result.data, function (item) {
            item.map.balance = item.userbalance;
            item.map.recharge = item.map.charge;
          });
          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          vm.gridModel.config.propsParams.message = result.message;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);

  }
})();
