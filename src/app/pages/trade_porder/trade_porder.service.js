/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('tradePorder', tradePorder)
        .factory('tradePorderConfig', tradePorderConfig);

    /** @ngInject */
    function tradePorder(requestService) {
      return requestService.request('trade', 'porder');
    }

    /** @ngInject */
    function tradePorderConfig() {
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
                      "name": "订单编号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.orderid"></span>'
                    },
                    {
                      "id": 2,
                      "name": "订单创建时间",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.createtime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>'
                    },
                    {
                      "id": 3,
                      "name": "商品名称",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.productname"></span>'
                    },
                    {
                      "id": 4,
                      "name": "商品规格",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread">有<i bo-text="item.skuvalues.length"></i>个规格<span cb-popover="" popover-placement="bottom" popover-template-id="cbSkuvaluesTipsPopoverTemplate.html" popover-template-data="item.skuvalues">详情</span></span>'
                    },
                    {
                      "id": 5,
                      "name": "商品类型",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.pcatename"></span>'
                    },
                    {
                      "id": 6,
                      "name": "单位",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.unit"></span>'
                    },
                    {
                      "id": 7,
                      "name": "商品单价（￥）",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyFilter"></span>'
                    },
                    {
                      "id": 8,
                      "name": "总价格（￥）",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | computeTotalPriceFilter : item.servernum"></span>'
                    },
                    {
                      "id": 9,
                      "name": "数量",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.servernum"></span>'
                    },
                    {
                      "id": 10,
                      "name": "客户信息",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.realname + item.username"></span>'
                    },
                    {
                      "id": 11,
                      "name": "车辆信息",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.model"></span>'
                    },
                    {
                      "id": 12,
                      "name": "订单备注",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.remark"></span>'
                    },
                    {
                      "id": 13,
                      "name": "订单状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.status | tradeStatusFilter"></span><span bo-if="item.status == 4" cb-popover="" popover-placement="bottom" popover-template-id="cbTradePorderStatusTipsPopoverTemplate.html" popover-template-data="item.finishtime">详情</span>'
                    },
                    {
                      "id": 14,
                      "name": "付款状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.paystatus | tradePaystatusFilter"></span><span bo-if="item.paystatus == 0" cb-popover="" popover-placement="bottom" popover-template-id="cbTradePorderPaystatusTipsPopoverTemplate.html" popover-template-data="item.paytime">详情</span>'
                    },
                    {
                        "id": 15,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50103" ui-sref="trade.sorder.detail({detailid: item.detailid})">查看服务订单</button>',
                        "name": '操作',
                        "width": 50
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
                    'addColumnsBarDirective': []
                }
            },
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'product-goods',
                    "searchDirective": [
                        {
                            'label': "订单编号",
                            'type': 'text',
                            'searchText': "orderid",
                            'placeholder': '订单编号'
                        },
                        {
                            'label': "商品名称",
                            'type': 'text',
                            'searchText': "productname",
                            'placeholder': '商品名称'
                        },
                        {
                          'label': "客户名称",
                          'type': 'text',
                          'searchText': "realname",
                          'placeholder': '客户名称'
                        },
                        {
                            'label': "订单状态",
                            'type': 'select',
                            'searchText': "status",
                            'placeholder': '订单状态',
                            'list': [
                              {
                                id: -1,
                                name: "全部"
                              },
                              {
                                id: 0,
                                name: "下架"
                              },
                              {
                                id: 1,
                                name: "上架"
                              },
                              {
                                id: 2,
                                name: "禁用"
                              }
                            ]
                        }
                    ]
                }
            }
        }
    }

})();
