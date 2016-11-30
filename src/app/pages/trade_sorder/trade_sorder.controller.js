/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('TradeSorderListController', TradeSorderListController)
        .controller('TradeSorderChangeController', TradeSorderChangeController)
        .controller('TradePorderDetailController', TradePorderDetailController);

    /** @ngInject */
    function TradeSorderListController($state, $log, $window, tradeSorder, tradeSorderConfig, cbAlert) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = $state.params;
      var total = 0;
      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(tradeSorderConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(tradeSorderConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          var page = angular.extend({}, currentParams, {page: data});
          $state.go(currentStateName, page);
        }
      };

      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        complete: function (data) {   // 服务完成
          cbAlert.alert('服务完成', '等待API实现');
          //console.log('服务完成', data);
/*          cbAlert.ajax('heh', function(isConfirm){
            console.log(isConfirm);
            if(isConfirm){
              setTimeout(function(){
                cbAlert.tips('hhe', 'hahhaahshs ');
              }, 3000);
            }else{
              cbAlert.close();
            }
          });*/
        },
        confirmTakecar: function(data){ // 确认接车
          cbAlert.alert('确认接车', '等待API实现');
        },
        takecar: function(data){   // 客户提车
          //console.log('客户提车', data);
          cbAlert.alert('客户提车', '等待API实现');
        },
        refund: function(data){   // 订单退款
          //console.log('订单退款', data);
          cbAlert.alert('订单退款', '等待API实现');
        },
        reminder: function(data){   // 提醒客户
          //console.log('提醒客户', data);
          cbAlert.alert('提醒客户', '等待API实现');
        },
        cancelorder: function(data){   // 取消订单
          //console.log('提醒客户', data);
          cbAlert.alert('取消订单', '等待API实现');
        }
      };


      var config = angular.copy(tradeSorderConfig.DEFAULT_SEARCH.config);
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
        tradeSorder.list(currentParams).then(function (data) {
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

    /** @ngInject */
    function TradeSorderChangeController(tradeSorder, tradeSorderChangeConfig) {
      var vm = this;
      vm.dataBase = {

      };
      /*vm.dataBase = {
        userid: "",  // 用户id
        motorid: "",  //
        ordertype: "" //
        vin: ""   // vin码
        enginenumber: ""  //发动机编号
        totalmile: ""    // 总里程数
        totalsale: ""    // 工时总计（￥）
        totalcost: ""   // 商品总计（￥）
        meettime: ""
        details: []
      }*/

      vm.selectUserHandler = function (data) {
        if(data.status == '0'){
          vm.dataBase.userid = data.data.userid;
          vm.dataBase.realname = data.data.realname;
          vm.dataBase.username = data.data.username;
        }
      }

      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(tradeSorderChangeConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(tradeSorderChangeConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页

        }
      };

      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        complete: function (data) {   // 服务完成
          cbAlert.alert('服务完成', '等待API实现');
          //console.log('服务完成', data);
          /*          cbAlert.ajax('heh', function(isConfirm){
           console.log(isConfirm);
           if(isConfirm){
           setTimeout(function(){
           cbAlert.tips('hhe', 'hahhaahshs ');
           }, 3000);
           }else{
           cbAlert.close();
           }
           });*/
        }
      };



    }


    /** @ngInject */
    function TradePorderDetailController() {

    }

})();
