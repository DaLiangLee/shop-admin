/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('MarktingDebitcardController', MarktingDebitcardController);

  /** @ngInject */
  function MarktingDebitcardController($state, $filter, cbAlert, marktingDebitcard, marktingDebitcardConfig, computeService) {
    var vm = this;
    var currentParams = angular.extend({}, $state.params, {status: -1});
    var itemList = [];
    /**
     * 组件数据交互
     *
     */
    var propsParams = {
      statusItem: function (item) {
        var status = item.status;
        var tips = item.status === "0" ? '确定启用该活动？' : '确定禁用该活动？';
        cbAlert.ajax(tips, function (isConfirm) {
          if (isConfirm) {
            item.status = item.status === "0" ? "1" : "0";
            var items = _.pick(item, ['guid', 'status']);
            marktingDebitcard.saveorupdate(items).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('修改成功');
                getList(currentParams, status);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "", 'confirm');
      },
      saveorupdate: function (data) {
        if (data.status === '0') {
          var status = _.isUndefined(data.data.guid) ? 1 : 0;
          data.data.rechargeamount = computeService.pushMoney(data.data.rechargeamount);
          data.data.giveamount = computeService.pushMoney(data.data.giveamount);
          marktingDebitcard.saveorupdate(data.data).then(function (results) {
            var result = results.data;
            if (result.status === 0) {
              getList(currentParams, status);
            } else {
              cbAlert.error("错误提示", result.data);
            }
          });
        }
      }
    };
    vm.selectTabs = function (data) {
      setColumns(data);
    };

    var started = _.clone(marktingDebitcardConfig.DEFAULT_GRID.columns),
      unstarted = _.clone(marktingDebitcardConfig.DEFAULT_GRID.columns);
    started.pop();


    /**
     * 根据状态设置表格列
     * @param status
     */
    function setColumns(status) {
      if (status == 0) {
        vm.gridModel.columns = unstarted;
      } else {
        vm.gridModel.columns = started;
      }
      vm.gridModel.itemList = $filter('filter')(itemList,{status: status});
      vm.gridModel.config.propsParams.currentStatus = status;
    }


    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: [],
      itemList: [],
      config: _.merge(marktingDebitcardConfig.DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true      // 加载数据
    };

    /**
     * 获取活动列表
     */
    function getList(params, status) {
      marktingDebitcard.list(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          _.map(result.data, function (item) {
            item.rechargeamount = computeService.pullMoney(item.rechargeamount);
            item.giveamount = computeService.pullMoney(item.giveamount);
          });
          itemList = result.data;
          vm.gridModel.itemList = $filter('filter')(itemList,{status: status});
          vm.gridModel.loadingState = false;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams, 1);
  }
})();


