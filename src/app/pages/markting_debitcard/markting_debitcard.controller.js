/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
    'use strict';

    angular
      .module('shopApp')
      .controller('MarktingDebitcardController', MarktingDebitcardController);

    /** @ngInject */
    function MarktingDebitcardController($state, $filter, cbAlert, marktingDebitcard, marktingDebitcardConfig, configuration) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {status: -1});
      var itemList = [];
      /**
       * 组件数据交互
       *
       */
      var propsParams = {
        statusItem: function (item) {
          var status = item.status;
          var tips = item.status === "0" ? '是否确认启用该活动？' : '是否确认禁用该活动？';
          cbAlert.ajax(tips, function (isConfirm) {
            if (isConfirm) {
              item.status = item.status === "0" ? "1" : "0";
              var items = _.pick(item, ['guid', 'status']);
              marktingDebitcard.saveorupdate(items).then(function (results) {
                if (results.data.status == '0') {
                  cbAlert.success('修改成功');
                  getList(currentParams, status);
                } else {
                  cbAlert.error(results.data.data);
                }
              });
            } else {
              cbAlert.close();
            }
          }, "", 'warning');
        },
        saveorupdate: function (data) {
          if (data.status === '0') {
            var status = _.isUndefined(data.data.guid) ? 1 : 0;
            marktingDebitcard.saveorupdate(data.data).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
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
      console.log(marktingDebitcardConfig);

      var started = _.clone(marktingDebitcardConfig.DEFAULT_GRID.columns),
          unstarted = _.clone(marktingDebitcardConfig.DEFAULT_GRID.columns);
          started.pop();
          console.log(started);


      /**
       * 根据状态设置表格列
       * @param status
       */
      function setColumns(status){
        if(status == 0){
          vm.gridModel.columns = unstarted;
        }else{
          vm.gridModel.columns = started;
        }
        console.log(vm.gridModel.columns);
        vm.gridModel.itemList = $filter('filter')(itemList, {status:　status});
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
       * 获取员工列表
       */
      function getList(params, status) {
        marktingDebitcard.list(params).then(function (results) {
          var result = results.data;
          if (result.status == 0) {
            itemList = result.data;
            vm.gridModel.itemList = $filter('filter')(itemList, {status:　status});
            vm.gridModel.loadingState = false;
          } else {
            cbAlert.error("错误提示", result.data);
          }
        });
      }

      getList(currentParams, 1);

    }
  })();


