/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('financeJournal', financeJournal)
    .constant('financeJournalConfig', financeJournalConfig);

  /** @ngInject */
  function financeJournal(requestService) {
    return requestService.request('finance', 'journal');
  }


  /** @ngInject */
  function financeJournalConfig() {
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.journaltime"></span>',
            "name": '时间',
            "field": "journaltime",
            "width": 160
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.tradetype | formatStatusFilter : \'tradetype\'"></span>',
            "name": '业务类型',
            "width": 100
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="u-truncate-wrapper"><div class="finance-details-wrapper"><span class="state-unread finance-details u-truncate-text" bo-title="item.details" bo-bind="item.details"></span></div><span class="journaltype journaltype{{item.journaltype}} f-fl trade-icon" bo-bind="item.journaltype | formatStatusFilter : \'journaltype\'"></span></div>',
            "name": '交易详情',
            "field": "details",
            "width": 150
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.userinfo}}" text-length="12"></span>',
            "name": '交易对象',
            "width": 150
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.journalmoney | moneyformatFilter"></span>',
            "name": '交易金额',
            "field": "journalmoney",
            "width": 100
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.paytype | formatStatusFilter : \'paytype\'"></span>',
            "name": '支付方式',
            "width": 100
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.memberinfo"></span>',
            "name": '制单人',
            "width": 100
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.remarks"></span>',
            "name": '备注',
            "width": 100
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,     // 排序
          'sortPrefer': true,     //  服务端排序
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'batchOperationBarDirective': [
            '<ul class="total"> <li><p><strong>现金：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.cardOrCash | moneyformatFilter"></span></label></p><p><strong>储值卡：</strong><label>&yen;&nbsp; <span ng-bind="propsParams.message.userAccount | moneyformatFilter"></span></label>  </p><p><strong>银行卡：</strong><label>&yen;&nbsp; <span ng-bind="propsParams.message.card | moneyformatFilter"></span></label>  </p><p class="sum"><strong>笔数：</strong> <label> <span ng-bind="propsParams.message.totalCount | number : 0"></span>&nbsp;笔</label> </p></li><li><p><strong>微信支付：</strong> <label>&yen;&nbsp;<span ng-bind="propsParams.message.weixin | moneyformatFilter"></span></label> </p> <p><strong>支付宝：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.alipay | moneyformatFilter"></span></label></p><p class="sum" style="margin-top: 30px;"><strong>合计：</strong><label>&yen;&nbsp;<span ng-bind="propsParams.message.totolMoney | moneyformatFilter"></span></label> </p></li></ul>'
          ]
        }
      },
      DEFAULT_SEARCH: {
        journaltime: [
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
        ],
        tradetype: [
          {
            id: 0,
            label: "订单"
          },
          /*{
            id: 1,
            label: "退款"
          },*/
          {
            id: 2,
            label: "充值"
          },
          /*{
            id: 3,
            label: "提现"
          },*/
          /*{
            id: 4,
            label: "满赠"
          }*//*,
          {
            id: 5,
            label: "平台佣金"
          },*/
          {
            id: 6,
            label: "办理套餐卡"
          }
        ],
        journaltype: [
          {
            id: 0,
            label: "收入"
          },
          {
            id: 2,
            label: "预收"
          },
          {
            id: 1,
            label: "支出"
          }
        ],
        paytype: [
          {
            id: 1,
            label: "现金"
          },
          {
            id: 5,
            label: "银行卡"
          },
          {
            id: 0,
            label: "储值卡"
          },
          {
            id: 6,
            label: "套餐卡"
          },
          /*{
            id: 3,
            label: "微信支付"
          },
          {
            id: 2,
            label: "支付宝"
          },*/
          {
            id: 7,
            label: '其他'
          }
        ],
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入 订单编号、交易对象、制单人",
              model: params.keyword,
              name: "keyword",
              isShow: true
            },
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
                    minDate: new Date("2017/01/01 00:00:00")
                  }
                },
                end: {
                  name: "journaltime1",
                  model: params.journaltime1,
                  config: {
                    minDate: new Date("2017/01/05 00:00:00")
                  }
                }
              },
              {
                label: "业务类型",
                all: true,
                type: "list",
                name: "tradetype",
                model: params.tradetype,
                list: this.tradetype
              },
              {
                label: "交易金额",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "journalmoney",
                start: {
                  name: "journalmoney0",
                  model: params.journalmoney0
                },
                end: {
                  name: "journalmoney1",
                  model: params.journalmoney1
                }
              },
              {
                label: "流水类型",
                all: true,
                type: "list",
                name: "journaltype",
                model: params.journaltype,
                list: this.journaltype
              },
              {
                label: "支付方式",
                all: true,
                type: "list",
                name: "paytype",
                model: params.paytype,
                list: this.paytype
              }
            ]
          }
        }
      }
    }
  }

})();
