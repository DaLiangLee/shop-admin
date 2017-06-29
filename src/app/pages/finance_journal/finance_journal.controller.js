/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('FinanceJournalListController', FinanceJournalListController);

  /** @ngInject */
  function FinanceJournalListController($state, cbAlert, financeJournal, financeJournalConfig, computeService) {
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
      columns: _.clone(financeJournalConfig().DEFAULT_GRID.columns),
      itemList: [],
      config: _.merge(financeJournalConfig().DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      sortChanged: function (data) {
        var orders = [];
        angular.forEach(data.data, function (item, key) {
          orders.push({
            "field": key,
            "direction": item
          });
        });
        var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
        getList(order);
      }
    };

    var DEFAULT_SEARCH = _.cloneDeep(financeJournalConfig().DEFAULT_SEARCH);
    var searchModel = _.chain(_.clone(currentParams)).tap(function (value) {
      _.forEach(_.pick(value, ['journalmoney0', 'journalmoney1']), function (item, key) {
        !_.isUndefined(item) && (value[key] = computeService.pullMoney(item));
      });
    }).value();

    /**
     * 搜索操作
     */
    vm.searchModel = {
      'config': DEFAULT_SEARCH.config(searchModel),
      'handler': function (data) {
        var items = _.find(DEFAULT_SEARCH.journaltime, function (item) {
          return item.id === data.journaltime0*1;
        });
        if (angular.isDefined(items)) {
          data.journaltime1 = undefined;
        }
        var search = _.chain(data).tap(function (value) {
          _.forEach(_.pick(value, ['journalmoney0', 'journalmoney1']), function (item, key) {
            !_.isUndefined(item) && (value[key] = computeService.pushMoney(item));
          });
        }).value();

        _.chain(currentParams).tap(function (value) {
          _.forEach(_.pick(value, ['journalmoney0', 'journalmoney1']), function (item, key) {
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
      financeJournal.search(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };
          vm.gridModel.config.propsParams.message = _.merge(result.message, {totalCount: result.totalCount});
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);

  }
})();


