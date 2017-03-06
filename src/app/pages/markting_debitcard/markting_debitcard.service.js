/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('marktingDebitcard', marktingDebitcard)
    .factory('marktingDebitcardConfig', marktingDebitcardConfig);

  /** @ngInject */
  function marktingDebitcard(requestService) {
    return requestService.request('markting', 'debitcard');
  }


  /** @ngInject */
  function marktingDebitcardConfig() {
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.name">',
            "name": '充值活动',
            "width": 150
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.rechargeamount | number : 2"></span>',
            "name": '充值金额'
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.giveamount | number : 2"></span>',
            "name": '赠送金额',
            "width": 150
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.quantity | number : 0"></span>',
            "name": '发卡数量'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.alequantity | number : 0"></span>',
            "name": '已售'
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checkstatus="item.status" ng-click="propsParams.statusItem(item)"></div>',
            "name": '启用'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,
          'useBindOnce': true  // 是否单向绑定
        }
      },
      DEFAULT_SEARCH: {
      }
    }
  }

})();
