/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('FinanceJournalListController', FinanceJournalListController);

  /** @ngInject */
  function FinanceJournalListController($state, cbAlert, marktingDebitcard, marktingDebitcardConfig, configuration) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params);

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
            marktingDebitcard.saveorupdate(items).then(function (results) {
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
      columns: _.clone(marktingDebitcardConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: _.merge(marktingDebitcardConfig.DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true      // 加载数据
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
      marktingDebitcard.list(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          vm.gridModel.itemList = result.data;
          vm.gridModel.loadingState = false;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);

  }
})();


