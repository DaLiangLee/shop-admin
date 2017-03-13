/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('financeDebitcard', financeDebitcard)
    .factory('financeDebitcardConfig', financeDebitcardConfig);

  /** @ngInject */
  function financeDebitcard(requestService) {
    return requestService.request('finance', 'debitcard');
  }


  /** @ngInject */
  function financeDebitcardConfig() {
    var GRID = [
      {
        "id": 3,
        "cssProperty": "state-column",
        "fieldDirective": '<span class="state-unread" bo-bind="item.map.recharge | number : 2"></span>',
        "name": '充值',
        "width": 150
      },
      {
        "id": 4,
        "cssProperty": "state-column",
        "fieldDirective": '<span class="state-unread" bo-bind="item.map.gift | number : 2"></span>',
        "name": '赠送'
      },
      {
        "id": 5,
        "cssProperty": "state-column",
        "fieldDirective": '<span class="state-unread" bo-bind="item.map.cost | number : 2"></span>',
        "name": '消费'
      },
      {
        "id": 6,
        "cssProperty": "state-column",
        "fieldDirective": '<span class="state-unread" bo-bind="item.map.balance | number : 2"></span>',
        "name": '余额'
      }
    ];
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><img bo-src-i="{{item.map.avatar}}" alt=""><span bo-text="item.map.realname"></span></span>',
            "name": '姓名',
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.map.mobile"></span>',
            "name": '手机号'
          }
        ].concat(GRID).concat([
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<a ui-sref="finance.debitcard.detail({userid: item.map.userid, balance: item.map.balance, mobile: item.map.mobile})" class="u-btn-link">查看详情</a>',
            "name": '操作'
          }]),
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'batchOperationBarDirective': [
            '<p><strong>充值：</strong> <span ng-bind="propsParams.message.charge | number : 2"></span> <strong>赠送：</strong> <span ng-bind="propsParams.message.gift | number : 2"></span> <strong>消费：</strong> <span ng-bind="propsParams.message.cost | number : 2"></span> <strong>余额：</strong> <span ng-bind="propsParams.message.balance | number : 2"></span> </p>'
          ]
        }
      },
      DEFAULT_GRID_DETAIL: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><span bo-text="item.journaltime"></span></span>',
            "name": '时间',
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread">订单编号：<span bo-text="item.credentialsid"></span></span>',
            "name": '交易内容'
          }
        ].concat(GRID).concat([
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.memberinfo"></span>',
            "name": '制单人'
          }]),
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'batchOperationBarDirective': [
            '<p><strong>充值：</strong> <span ng-bind="propsParams.message.charge | number : 2"></span> <strong>赠送：</strong> <span ng-bind="propsParams.message.gift | number : 2"></span> <strong>消费：</strong> <span ng-bind="propsParams.message.cost | number : 2"></span> <strong>余额：</strong> <span ng-bind="propsParams.message.balance | number : 2"></span> </p>'
          ]
        }
      },
      DEFAULT_SEARCH: {
        createtime: [
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
        ],
        config: function(params){
          return {
            other: params,
            keyword: {
              placeholder: "请输入姓名、手机号",
              model: params.keyword,
              name: "keyword",
              isShow: true
            },
            searchDirective: [
              {
                label: "充值",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "recharge",
                start: {
                  name: "recharge0",
                  model: params.recharge0
                },
                end: {
                  name: "recharge1",
                  model: params.recharge1
                }
              },
              {
                label: "消费",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "cost",
                start: {
                  name: "cost0",
                  model: params.cost0
                },
                end: {
                  name: "cost1",
                  model: params.cost1
                }
              },
              {
                label: "余额",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "userbalance",
                start: {
                  name: "userbalance0",
                  model: params.userbalance0
                },
                end: {
                  name: "userbalance1",
                  model: params.userbalance1
                }
              }
            ]
          }
        }
      },
      DEFAULT_SEARCH_DETAIL: {

      }
    }
  }

})();
