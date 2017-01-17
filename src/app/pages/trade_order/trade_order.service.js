/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('tadeOrder', tadeOrder)
        .factory('tadeOrderConfig', tadeOrderConfig);

    /** @ngInject */
    function tadeOrder(requestService) {
      return requestService.request('trade', 'order');
    }

    /** @ngInject */
    function tadeOrderConfig() {
        return {
            DEFAULT_GRID: {
                "columns": [
                    {
                        "id": 0,
                        "name": "序号",
                        "none": true
                    },
                    {
                      "id": 1,
                      "name": "操作",
                      "cssProperty": "state-column",
                      "fieldDirective": '<a href="javascript:;" class="state-unread text-danger" bo-if="item.status == 1 && item.paystatus == 1" ng-click="propsParams.closed(item)">关闭</a> <a href="javascript:;" class="state-unread" bo-if="item.paystatus == 1" ng-click="propsParams.received(item)">收款</a> <a href="javascript:;" class="state-unread" bo-if="item.status == 1" ng-click="propsParams.completed(item)">完工</a>  <a href="javascript:;" class="state-unread" bo-if="item.status == 2" ng-click="propsParams.checkout(item)">离店</a>'
                    },
                    {
                      "id": 2,
                      "name": "车牌号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.carno"></span>'
                    },
                    {
                      "id": 3,
                      "name": "客户留言",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.remark}}" text-length="10"></span>'
                    },
                    {
                      "id": 4,
                      "name": "订单状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.status | formatStatusFilter : \'server_order_status\'"></span>'
                    },
                    {
                      "id": 5,
                      "name": "付款状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread"><i bo-title="item.status | formatStatusFilter : \'server_order_paystatus\'">付款状态</i></span>'
                    },
                    {
                      "id": 6,
                      "name": "服务/项目",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.serviceinfo"></span>'
                    },
                    {
                      "id": 7,
                      "name": "商品/材料",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.productinfo"></span>'
                    },
                    {
                      "id": 8,
                      "name": "工时费(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | moneyFilter"></span>'
                    },
                    {
                      "id": 9,
                      "name": "商品/材料费(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.psaleprice | moneyFilter"></span>'
                    },
                    {
                      "id": 10,
                      "name": "总费用(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice + item.psaleprice"></span>'
                    },
                    {
                      "id": 11,
                      "name": "优惠金额(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.preferentialprice | moneyFilter"></span>'
                    },
                    {
                      "id": 12,
                      "name": "实收金额(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.actualprice | moneyFilter"></span>'
                    },
                    {
                      "id": 13,
                      "name": "支付方式",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.paytype | formatStatusFilter : \'server_order_paytype\'"></span>'
                    },
                    {
                      "id": 14,
                      "name": "订单编号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.guid"></span>'
                    },
                    {
                      "id": 15,
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.createtime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>',
                      "name": '开单时间'
                    },
                    {
                        "id": 16,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.creatorname"></span>',
                        "name": '开单人'
                    }
                ],
                "config": {
                    'settingColumnsSupport': false,   // 设置表格列表项
                    'checkboxSupport': true,  // 是否有复选框
                    'sortSupport': true,
                    'paginationSupport': true,  // 是否有分页
                    'selectedProperty': "selected",  // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true,  // 是否单向绑定
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': [
                      '<a class="btn btn-primary" cb-access-control="chebian:store:trade:porder:add" ui-sref="trade.order.add()">开单</a> '
                    ]
                }
            },
            DEFAULT_SEARCH: {}
        }
    }

})();
