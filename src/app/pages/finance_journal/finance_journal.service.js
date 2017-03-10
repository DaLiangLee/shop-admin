/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('financeJournal', financeJournal)
    .factory('financeJournalConfig', financeJournalConfig);

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
            "fieldDirective": '<span class="state-unread" bo-text="item.journaltime">',
            "name": '时间',
            "width": 150
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.tradetype | formatStatusFilter : \'tradetype\'"></span>',
            "name": '业务类型'
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.details"></span>',
            "name": '交易详情',
            "width": 150
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.userinfo"></span>',
            "name": '交易对象'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.journalmoney | number : 2"></span>',
            "name": '交易金额'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.paytype | formatStatusFilter : \'paytype\'"></span>',
            "name": '支付方式'
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.memberinfo"></span>',
            "name": '制单人'
          }
        ],
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
            '<p><strong>现金：</strong> <span ng-bind="propsParams.message.cardOrCash | number : 2"></span> <strong>微信支付：</strong> <span ng-bind="propsParams.message.weixin | number : 2"></span> <strong>储值卡：</strong> <span ng-bind="propsParams.message.gift | number : 2"></span> <strong>银行卡：</strong> <span ng-bind="propsParams.message.userAccount | number : 2"></span> <strong>支付宝：</strong> <span ng-bind="propsParams.message.alipay | number : 2"></span> <strong>笔数：</strong> <span ng-bind="propsParams.message.totalCount | number : 0"></span>  <strong>合计：</strong> <span ng-bind="propsParams.message.totolMoney | number : 2"></span> </p>'
          ]
        }
      },
      DEFAULT_SEARCH: {
      }

    }
  }

})();
