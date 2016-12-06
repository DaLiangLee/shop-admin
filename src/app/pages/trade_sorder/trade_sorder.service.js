/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('tradeSorder', tradeSorder)
        .factory('tradeSorderConfig', tradeSorderConfig)
        .factory('tradeSorderChangeConfig', tradeSorderChangeConfig);

    /** @ngInject */
    function tradeSorder(requestService) {
      return requestService.request('trade', 'sorder');
    }

    /** @ngInject */
    function tradeSorderConfig() {
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
                      "name": "创建时间",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.createtime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>'
                    },
                    {
                      "id": 3,
                      "name": "预约到店",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.meettime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>'
                    },
                    {
                      "id": 4,
                      "name": "接车时间",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.motortime | date : \'yyyy-MM-dd HH:mm:ss\'"></span>'
                    },
                    {
                      "id": 5,
                      "name": "订单内容",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.content}}" text-length="10"></span>'
                    },
                    {
                      "id": 6,
                      "name": "工时总计(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.totalsale | moneyFilter"></span>'
                    },
                    {
                      "id": 7,
                      "name": "商品总计(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.totalcost | moneyFilter"></span>'
                    },
                    {
                      "id": 8,
                      "name": "总价格(元)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.totalcost | moneypushFilter : item.totalsale"></span>'
                    },
                    {
                      "id": 9,
                      "name": "客户信息",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.realname + item.mobile"></span>'
                    },
                    {
                      "id": 10,
                      "name": "车辆信息",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.motormodel"></span>'
                    },
                    {
                      "id": 11,
                      "name": "订单状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.status | formatStatusFilter : \'server_order_status\'"></span><br  /><u class="text-primary" style="cursor: pointer;" bo-if="item.status == 4" cb-popover="" popover-placement="bottom" popover-template-id="cbTradePorderStatusTipsPopoverTemplate.html" popover-template-data="item.finishtime">详情</u>'
                    },
                    {
                      "id": 12,
                      "name": "客户确认状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.confirm == 0 ? \'已确认\' : \'未确认\'"></span>'
                    },
                    {
                      "id": 14,
                      "name": "付款状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.paystatus | formatStatusFilter : \'server_order_paystatus\'"></span><br /><u class="text-primary" style="cursor: pointer;" bo-if="item.paystatus == 1" cb-popover="" popover-placement="bottom" popover-template-id="cbTradePorderPaystatusTipsPopoverTemplate.html" popover-template-data="item.paytime">详情</u>'
                    },
                    {
                        "id": 15,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50103" ui-sref="trade.sorder.detail({orderid: item.orderid})">订单详情</button> <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50102" bo-if="item.status == 0" ng-click="propsParams.reminder(item)" ng-disabled="item.disabled">提醒客户</button> <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50102" bo-if="item.status == 2" ng-click="propsParams.complete(item)"  ng-disabled="item.disabled">服务完成</button> <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50102" bo-if="item.status == 3" ng-click="propsParams.takecar(item)" ng-disabled="item.disabled">客户提车</button> <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50104" bo-if="item.status == 0 || item.status == 1" trade-sorder-confirm-takecar-dialog item="item" item-handler="propsParams.confirmTakecar(data)" >确认接车</button> <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50102" bo-if="item.status == 4" ng-click="propsParams.refund(item)"  ng-disabled="item.disabled">订单退款</button>  <button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50105" bo-if="item.status == 0 || item.status == 1 || item.status == 2 || item.status == 3" ng-click="propsParams.cancelorder(item)" ng-disabled="item.disabled">取消订单</button>',
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
                    'addColumnsBarDirective': [
                      '<button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50101" ui-sref="trade.sorder.add()">+新增订单</button> '
                    ]
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

    /** @ngInject */
    function tradeSorderChangeConfig() {
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
              "name": "服务项目",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.scatename2"></span>'
            },
            {
              "id": 2,
              "name": "项目类型",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.scatename1"></span>'
            },
            {
              "id": 3,
              "name": "工时费（￥）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | moneyFilter"></span>'
            },
            {
              "id": 4,
              "name": "商品费用（￥）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.psaleprice | moneyFilter"></span>'
            },
            {
              "id": 5,
              "name": "单项小计（￥）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | moneypushFilter : item.psaleprice"></span>'
            },
            {
              "id": 6,
              "name": "子订单状态",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.status | formatStatusFilter : \'server_order_child\'"></span>'
            },
            {
              "id": 7,
              "cssProperty": "state-column",
              "fieldDirective": '<button class="btn btn-danger" bo-if="item.status == 0" simple-grid-remove-item="offerid" item="item" list="store" remove-item="propsParams.removeItem(data)">删除</button>',
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
            'addColumnsBarDirective': [
              '<button class="btn btn-primary" trade-sorder-add-items="{{propsParams.userid}}" item-handler="propsParams.addItems(data)">+新增项目</button> '
            ]
          }
        }
      }
    }
})();
