/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';



  angular
      .module('shopApp')
      .factory('userDebitcard', userDebitcard)
      .constant('userDebitcardConfig', userDebitcardConfig);

  /** @ngInject */
  function userDebitcard(requestService) {
    return requestService.request('users', 'debitcard');
  }


  /** @ngInject */
  function userDebitcardConfig() {
    var createtime = [
      {
        "label": "今日",
        id: 0,
        start: "0",
        end: "0"
      },
      {
        "label": "本周",
        id: 1,
        start: "1",
        end: "1"
      },
      {
        "label": "本月",
        id: 2,
        start: "2",
        end: "2"
      },
      {
        "label": "本年度",
        id: 3,
        start: "3",
        end: "3"
      }
    ];
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="state-unread orderUser"><span class="state-unread" ng-class="{\'default-user-image\': !item.avatar}" style="display: inline-block; width: 24px; height: 24px;"><img bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""></span><span class="state-unread" bo-text="item.map.realname"></span></div>',
            "name": '姓名',
            "field": "map.realname",
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.map.mobile | numberFormatFilter"></span>',
            "field": "map.mobile",
            "name": '手机号'
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.recharge | moneyformatFilter"></span>',
            "name": '充值',
            "field": "map.recharge",
            "width": 150
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.gift | moneyformatFilter"></span>',
            "field": "map.gift",
            "name": '赠送'
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.cost | moneyformatFilter"></span>',
            "field": "map.cost",
            "name": '消费'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.balance | moneyformatFilter"></span>',
            "field": "map.balance",
            "name": '余额'
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<a ui-sref="user.debitcard.detail({userid: item.map.userid, balance: item.map.balance, mobile: item.map.mobile})" class="u-btn-link">查看详情</a>',
            "name": '操作'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,    // 排序支持
          'sortPrefer': true,     //  服务端排序
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'batchOperationBarDirective': [
            '<ul class="total"><li><p><strong>充值：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.charge | moneyformatFilter"></span></label></p><p><strong>消费：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.cost | moneyformatFilter"></span></label></p></li><li><p><strong>赠送：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.gift | moneyformatFilter"></span> </label></p><p> <strong>余额：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.balance | moneyformatFilter"></span></label></p></li></ul>'
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
            "fieldDirective": '<span class="state-unread" bo-if="item.tradetype == 0">订单编号：<a bo-text="item.credentialsid" bo-if="item.tradetype == 6" ui-sref="user.package.list({page:1, keyword: item.credentialsid})"></a><a bo-text="item.credentialsid" ui-sref="trade.order.list({page:1, keyword: item.credentialsid})"></a></span><span class="state-unread" bo-if="item.tradetype == 2">储值卡购买</span>',
            "name": '交易内容'
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.recharge | moneyformatFilter"></span>',
            "name": '充值',
            "width": 150
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.gift | moneyformatFilter"></span>',
            "name": '赠送'
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.cost | moneyformatFilter"></span>',
            "name": '消费'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.map.balance | moneyformatFilter"></span>',
            "name": '余额'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.memberinfo"></span>',
            "name": '制单人'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,    // 排序支持
          'sortPrefer': true,     //  服务端排序
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          'exportDataSupport': true,
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'batchOperationBarDirective': [
            '<ul class="total"><li><p><strong>充值：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.charge | moneyformatFilter"></span></label></p><p><strong>消费：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.cost | moneyformatFilter"></span></label></p></li><li><p><strong>赠送：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.gift | moneyformatFilter"></span> </label></p><p> <strong>余额：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.balance | moneyformatFilter"></span></label></p></li></ul>'
          ]
        }
      },
      DEFAULT_SEARCH: {
        createtime: createtime,
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
        journaltime: createtime,
        config: function(params){
          return {
            other: params,
            searchDirective: [
              {
                label: "时间",
                all: true,
                custom: true,
                region: true,
                type: "date",
                name: "journaltime",
                model: "",
                list: this.journaltime,
                start: {
                  name: "journaltime0",
                  model: params.journaltime0,
                  config: {
                    minDate: new Date("2017/01/01 00:00:00"),
                    maxDate: new Date()
                  }
                },
                end: {
                  name: "journaltime1",
                  model: params.journaltime1,
                  config: {
                    minDate: new Date("2017/01/05 00:00:00"),
                    maxDate: new Date()
                  }
                }
              }
            ]
          }
        }
      }
    }
  }

})();
