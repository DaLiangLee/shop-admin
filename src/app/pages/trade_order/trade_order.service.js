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
                      "fieldDirective": '<a href="javascript:;" class="state-unread text-danger" ng-if="item.status == 1 && item.paystatus == 1" ng-click="propsParams.closed(item)">关闭</a> <a href="javascript:;" class="state-unread" ng-if="item.paystatus == 1 && item.status != 4" orader-received-dialog item="item" item-handler="propsParams.received(data)">收款</a> <a href="javascript:;" class="state-unread" ng-if="item.status == 1" ng-click="propsParams.completed(item)">完工</a>  <a href="javascript:;" class="state-unread" ng-if="item.status == 2 && item.paystatus == 0" ng-click="propsParams.checkout(item)">离店</a>',
                      "width": 120
                    },
                    {
                      "id": 2,
                      "name": "车牌号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.carno"></span>',
                      "width": 90
                    },
                    {
                      "id": 3,
                      "name": "客户留言",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.remark}}" text-length="10"></span>',
                      "width": 150
                    },
                    {
                      "id": 4,
                      "name": "订单状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-bind="item.status | formatStatusFilter : \'server_order_status\'"></span>',
                      "width": 90
                    },
                    {
                      "id": 5,
                      "name": "付款状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread"><span ng-class="{\'icon-ok_circle\': item.paystatus == 0, \'text-success\': item.paystatus == 0, \'icon-exclamation\': item.paystatus == 1, \'text-danger\': item.paystatus == 1}" title="{{item.paystatus | formatStatusFilter : \'server_order_paystatus\'}}"></span></span>',
                      "width": 80
                    },
                    {
                      "id": 6,
                      "name": "服务/项目",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread text-danger" cb-truncate-text="{{item.serviceinfo}}" text-length="10"></span>',
                      "width": 150
                    },
                    {
                      "id": 7,
                      "name": "商品/材料",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread text-danger" cb-truncate-text="{{item.productinfo}}" text-length="9"></span>',
                      "width": 150
                    },
                    {
                      "id": 8,
                      "name": "工时费(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | number : \'2\'"></span>',
                      "width": 100
                    },
                    {
                      "id": 9,
                      "name": "商品/材料费(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.psaleprice | number : \'2\'"></span>',
                      "width": 120
                    },
                    {
                      "id": 10,
                      "name": "总费用(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.totalprice | number : \'2\'"></span>',
                      "width": 100
                    },
                    {
                      "id": 11,
                      "name": "优惠金额(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.preferentialprice | number : \'2\'"></span>',
                      "width": 100
                    },
                    {
                      "id": 12,
                      "name": "实收金额(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-bind="item.actualprice | number : \'2\'"></span>',
                      "width": 100
                    },
                    {
                      "id": 13,
                      "name": "支付方式",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-bind="item.paytype | formatStatusFilter : \'server_order_paytype\'"></span>',
                      "width": 110
                    },
                    {
                      "id": 14,
                      "name": "订单编号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.guid"></span>',
                      "width": 160
                    },
                    {
                      "id": 15,
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.createtime"></span>',
                      "name": '开单时间',
                      "width": 150
                    },
                    {
                        "id": 16,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.creatorname"></span>',
                        "name": '开单人',
                        "width": 100
                    }
                ],
                "config": {
                    'settingColumnsSupport': false,   // 设置表格列表项
                    'checkboxSupport': true,  // 是否有复选框
                    'sortSupport': true,     // 排序
                    'sortPrefer': true,     //  服务端排序
                    'paginationSupport': true,  // 是否有分页
                    'selectedProperty': "selected",  // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true,  // 是否单向绑定
                    'exportDataSupport': true, // 导出
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': [
                      '<a class="btn btn-primary" cb-access-control="chebian:store:trade:porder:add" ui-sref="trade.order.add()">开单</a> '
                    ],
                    'batchOperationBarDirective': [
                      '<p bindonce=""><strong>数据汇总:</strong> 服务/项目 <span bo-bind="propsParams.statistics.servercount"></span> 项，共 <span bo-bind="propsParams.statistics.ssalepriceAll | number : \'2\'"></span> 元 | 商品 / 材料 <span bo-text="propsParams.statistics.productcount"></span> 项，共 <span bo-bind="propsParams.statistics.psalepriceAll | number : \'2\'"></span> 元 | 合计 <span bo-bind="propsParams.statistics.totalprice | number : \'2\'"></span> 元</p>'
                    ]
                }
            },
            DEFAULT_SEARCH: {}
        }
    }

})();
