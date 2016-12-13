/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('userCustomer', userCustomer)
        .factory('userCustomerConfig', userCustomerConfig);

    /** @ngInject */
    function userCustomer(requestService) {
      return requestService.request('user', 'customer');
    }

    /** @ngInject */
    function userCustomerConfig() {
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
                      "name": "会员姓名",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.realname"></span>'
                    },
                    {
                      "id": 2,
                      "name": "联系方式",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>'
                    },
                    {
                      "id": 3,
                      "name": "会员类别",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.userClass | formatStatusFilter : \'user_class\'" ></span>'
                    },
                    {
                      "id": 4,
                      "name": "性别",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.userClass | formatStatusFilter : \'sex\'" ></span>'
                    },
                    {
                      "id": 5,
                      "name": "年龄",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.age"></span>'
                    },
                    {
                      "id": 6,
                      "name": "所有车辆",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div cb-carbrand store="item.motorbrandids"></div>'
                    },
                    {
                      "id": 7,
                      "name": "最近订单",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | moneyFilter"></span>'
                    },
                    {
                      "id": 8,
                      "name": "备注",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | computeTotalPriceFilter : item.salenums"></span>'
                    },
                    {
                        "id": 9,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50103" ui-sref="trade.sorder.detail({orderid: item.orderid})">查看服务订单</button>',
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
