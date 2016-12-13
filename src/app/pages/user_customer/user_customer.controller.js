/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserCustomerListController', UserCustomerListController);

  /** @ngInject */
  function UserCustomerListController($state, userCustomer, userCustomerConfig) {
    /**
     *
     * @type {UserCustomerListController}
     */
    var vm = this;
    /**
     * 当前路由相关信息
     */
    var currentState = $state.current,
      currentStateName = currentState.name,
      currentParams = $state.params,
      total = 0;
    /**
     * 表格配置
     * @type {{columns: (*), itemList: Array, config: (*), loadingState: boolean, pageChanged: pageChanged}}
     */
    vm.gridModel = {
      columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(userCustomerConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };

    var config = angular.copy(userCustomerConfig.DEFAULT_SEARCH.config);
    config.searchParams = currentParams;
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

    /**
     * 获取列表
     */
    function getList() {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!currentParams.page) {
        return;
      }
      userCustomer.list(currentParams).then(function (results) {
        var data = results.data;
        if (data.status == 0) {
          /**
           * 如果输入page大于当前的页码，就强制跳转到第一页
           */
          if (currentParams.page * 1 > Math.ceil(data.count / 10)) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.count;
          vm.gridModel.itemList = data.data.concat([]);
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
