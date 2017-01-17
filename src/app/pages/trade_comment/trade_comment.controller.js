/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('TradeCommentListController', TradeCommentListController);

    /** @ngInject */
    function TradeCommentListController($state, tradeComment, tradeCommentConfig, cbAlert) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});

      /**
       * 表格配置
       */
      vm.gridModel = {
        requestParams: {
          params: currentParams,
          request: "product,server,excelServer",
          permission: "chebian:store:product:server:export"
        },
        columns: angular.copy(tradeCommentConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(tradeCommentConfig.DEFAULT_GRID.config),
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
          var order = angular.extend({}, currentParams, {orders: JSON.stringify(orders)});
          vm.gridModel.requestParams.params = order;
          getList(order);
        }
      };


      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        currentStatus: currentParams.status,
        replyConfig: {
          placeholder: "回复点什么吧!",
          interceptor: {
            text: '你确定要这样回复吗，回复不能修改',
            confirmText: '确定',
            closeText: '取消'
          }
        },
        replyItem: function (data, item) {
          if (data.status == 0) {
            tradeComment.reply({
              "reply": data.content,
              "id": item.id
            }).then(function (results) {
              if(results.data.status == 0){
                cbAlert.tips("回复成功");
              }else{
                cbAlert.error(results.data.data);
              }
              getList(currentParams);
            });
          }
        }
      };

      var commenttime = [
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

      var scoreList = [
        {
          id: 1,
          label: "一星"
        },
        {
          id: 2,
          label: "二星"
        },
        {
          id: 3,
          label: "三星"
        },
        {
          id: 4,
          label: "四星"
        },
        {
          id: 5,
          label: "五星"
        }
      ];

      /**
       * 获取评价时间的model
       * @param list
       * @param current
       * @returns {number}
       */
      function getCommenttime(list, current){
        var start = current.commenttime0,
          end = current.commenttime1,
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
          searchDirective: [
            {
              label: "评价时间",
              all: true,
              custom: true,
              region: true,
              type: "date",
              name: "commenttime",
              model: getCommenttime(commenttime, currentParams),
              list: commenttime,
              start: {
                name: "commenttime0",
                model: currentParams.commenttime0,
                config: {
                  minDate: new Date("2017/01/01 00:00:00")
                }
              },
              end: {
                name: "commenttime1",
                model: currentParams.commenttime1,
                config: {
                  minDate: new Date("2017/01/05 00:00:00")
                }
              }
            },
            {
              label: "回复状态",
              all: true,
              type: "list",
              name: "replyflag",
              model: currentParams.replyflag,
              list: [
                {
                  id: 0,
                  label: "已回复"
                },
                {
                  id: 1,
                  label: "未回复"
                }
              ]
            },
            {
              label: "技术评分",
              all: true,
              type: "list",
              name: "skill",
              model: currentParams.skill,
              list: angular.copy(scoreList)
            },
            {
              label: "服务评分",
              all: true,
              type: "list",
              name: "service",
              model: currentParams.service,
              list: angular.copy(scoreList)
            },
            {
              label: "环境评分",
              all: true,
              type: "list",
              name: "environment",
              model: currentParams.environment,
              list: angular.copy(scoreList)
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
            var items = _.find(commenttime, function(item){
              return item.id == data.commenttime0;
            });
            if(angular.isDefined(items)){
              data.commenttime1 = undefined;
            }
            var search = angular.extend({}, currentParams, data);
            console.log(search);
            $state.go(currentStateName, search);
          }
        }
      };


      // 获取服务列表
      function getList(params) {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!params.page) {
          return;
        }
        tradeComment.list(params).then(function (results) {
          if (results.data.status == 0) {
            vm.gridModel.itemList = results.data.data;
            vm.gridModel.paginationinfo = {
              page: params.page * 1,
              pageSize: params.pageSize,
              total: results.data.totalCount
            };
            vm.gridModel.loadingState = false;
          }else{
            cbAlert.error("错误提示1", results.data.data);
          }
        });
      }
      getList(currentParams);

    }

})();
