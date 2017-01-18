/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('TradeOrderListController', TradeOrderListController)
        .controller('TradeOrderChangeController', TradeOrderChangeController);

    /** @ngInject */
    function TradeOrderListController($state, $log, cbAlert, tadeOrder, tadeOrderConfig) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});
      var total = 0;
      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(tadeOrderConfig.DEFAULT_GRID.columns),
        requestParams: {
          params: currentParams,
          request: "trade,porder,excelProduct",
          permission: "chebian:store:trade:porder:export"
        },
        itemList: [],
        config: angular.copy(tadeOrderConfig.DEFAULT_GRID.config),
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
        currentStatus: currentParams.status,
        closed: function (item) {   // 关闭

        },
        received: function (item) {  // 收款

        },
        completed: function (item) { // 完工

        },
        checkout: function (item) {  // 离店

        }
      };

      var createtime = [
        {
          "label": "今日",
          id: 0,
          start: 0,
          end: 0
        },
        {
          "label": "本周",
          id: 1,
          start: 1,
          end: 1
        },
        {
          "label": "本月",
          id: 2,
          start: 2,
          end: 2
        },
        {
          "label": "本年度",
          id: 3,
          start: 3,
          end: 3
        }
      ];

      /**
       * 获取评价时间的model
       * @param list
       * @param current
       * @returns {number}
       */
      function getCreatetime(list, current){
        var start = current.createtime0,
          end = current.createtime1,
          items;
        if(angular.isUndefined(end)){
          end = start;
        }
        if(angular.isUndefined(start) || angular.isUndefined(end)){
          return -1;
        }
        items = _.filter(list, function (item) {
          return item.start == start && item.end == end;
        });
        return items.length === 1 ? items[0].id : -2;
      }

      /**
       * 搜索操作
       *
       */
      vm.searchModel = {
        'config': {
          keyword: {
            placeholder: "请输入订单编号、会员信息、车辆信息等",
            model: currentParams.keyword,
            name: "keyword",
            isShow: true
          },
          searchDirective: [
            {
              label: "订单状态",
              all: true,
              type: "list",
              name: "status",
              model: currentParams.status,
              list: [
                {
                  id: 1,
                  label: "服务中"
                },
                {
                  id: 2,
                  label: "完工待离店"
                },
                {
                  id: 3,
                  label: "完成"
                },
                {
                  id: 4,
                  label: "已取消"
                }
              ]
            },
            {
              label: "付款状态",
              all: true,
              type: "list",
              name: "paystatus",
              model: currentParams.paystatus,
              list: [
                {
                  id: 0,
                  label: "已收款"
                },
                {
                  id: 1,
                  label: "待收款"
                }
              ]
            },
            {
              label: "时间",
              all: true,
              custom: true,
              region: true,
              type: "date",
              name: "createtime",
              model: getCreatetime(createtime, currentParams),
              list: createtime,
              start: {
                name: "createtime0",
                model: currentParams.createtime0,
                config: {
                  minDate: new Date("2017/01/01 00:00:00")
                }
              },
              end: {
                name: "createtime1",
                model: currentParams.createtime1,
                config: {
                  minDate: new Date("2017/01/05 00:00:00")
                }
              }
            }
          ]
        },
        'handler': function (data) {
          if(_.isEmpty(data)){
            _.map(currentParams, function (item, key) {
              if(key !== 'page'){
                currentParams[key] = undefined;
              }
            });
            console.log(currentParams);
            $state.go(currentStateName, currentParams);
          }else{
            var items = _.find(createtime, function(item){
              return item.id == data.createtime0;
            });
            if(angular.isDefined(items)){
              data.createtime1 = undefined;
            }
            var search = angular.extend({}, currentParams, data);
            console.log(search);
            $state.go(currentStateName, search);
          }
        }
      };

      // 获取订单列表
      function getList(params) {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!params.page) {
          return;
        }
        tadeOrder.list(params).then(function (data) {
          if (data.data.status == 0) {
            if (!data.data.data.length && params.page != 1) {
              $state.go(currentStateName, {page: 1});
            }
            total = data.data.count;
            vm.gridModel.itemList = data.data.data;
            _.map(vm.gridModel.itemList, function (item) {
              item.status = 1;
              item.paystatus = 1;
            });
            /*angular.forEach(data.data.data, function (item) {
              /!**
               * 这段代码处理skuvalues值的问题，请勿修改 start
               *!/
              item.skuvalues = $window.eval(item.skuvalues);
              /!**
               * 这段代码处理skuvalues值的问题，请勿修改 end
               *!/
              vm.gridModel.itemList.push(item);
            });*/
            vm.gridModel.paginationinfo = {
              page: params.page * 1,
              pageSize: params.pageSize,
              total: data.data.totalCount
            };
            vm.gridModel.loadingState = false;
          }
        }, function (data) {
          $log.debug('getListError', data);
        });
      }
      getList(currentParams);

    }

    /** @ngInject */
    function TradeOrderChangeController($state, $log, tadeOrder) {
      var vm = this;

      function completedMaxDate(date){
        // 一天的毫秒数
        var DAY_TIME = 24 * 60 * 60 * 1000;
        return new Date(date.getTime() + DAY_TIME * 30)
      }

      // 预计完工时间
      vm.completedDate = {
        opened: false,
        config: {
          startingDay: 1,
          placeholder: "请选择预计完工时间",
          isHour: true,
          isMinute: true,
          formatTimeTitle: "HH:mm",
          format: "yyyy-MM-dd HH:mm",
          minDate: new Date(),
          maxDate: completedMaxDate(new Date())
        },
        open: function(){

        },
        model: "",
        handler: function (data) {
          console.log('completedDate', data);
        }
      };
    }
})();
