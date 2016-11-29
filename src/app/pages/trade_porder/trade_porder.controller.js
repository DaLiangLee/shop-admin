/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('TradePorderListController', TradePorderListController);

    /** @ngInject */
    function TradePorderListController($state, $log, $window, tradePorder, tradePorderConfig) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = $state.params;
      var total = 0;
      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(tradePorderConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(tradePorderConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          var page = angular.extend({}, currentParams, {page: data});
          $state.go(currentStateName, page);
        }
      };

      var config = angular.copy(tradePorderConfig.DEFAULT_SEARCH.config);
      config.searchParams = $state.params;
      /**
       * 搜索操作
       *
       */
      vm.gridSearch = {
        'config': config,
        'handler': function (data) {
          $log.debug(data)
        }
      };

      // 获取权限列表
      function getList() {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!currentParams.page) {
          return;
        }
        tradePorder.list(currentParams).then(function (data) {
          if (data.data.status == 0) {
            if (!data.data.data.length && currentParams.page != 1) {
              $state.go(currentStateName, {page: 1});
            }
            total = data.data.count;
            vm.gridModel.itemList = [];
            angular.forEach(data.data.data, function (item) {
              /**
               * 这段代码处理skuvalues值的问题，请勿修改 start
               */
              item.skuvalues = $window.eval(item.skuvalues);
              /**
               * 这段代码处理skuvalues值的问题，请勿修改 end
               */
              vm.gridModel.itemList.push(item);
            });
            vm.gridModel.paginationinfo = {
              page: currentParams.page * 1,
              pageSize: 10,
              total: total
            };
            vm.gridModel.loadingState = false;
          }
        }, function (data) {
          $log.debug('getListError', data);
        });
      }
      getList();

    }

})();
