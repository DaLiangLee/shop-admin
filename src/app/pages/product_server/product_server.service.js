/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('productServer', productServer)
        .factory('productServerAddGoods', productServerAddGoods)
        .factory('productServerConfig', productServerConfig)
        .factory('productServerChangeConfig', productServerChangeConfig);

    /** @ngInject */
    function productServer(requestService) {
        return requestService.request('product', 'server');
    }

    /** @ngInject */
    function productServerAddGoods() {
      var result = {};
      return {
        get: function(){
          return result;
        },
        set: function (data) {
          result = data;
        },
        remove: function () {
          result = {};
        }
      }
    }

    /** @ngInject */
    function productServerConfig() {
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
                      "name": "项目ID",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.serverid"></span>'
                    },
                    {
                      "id": 2,
                      "name": "项目名称",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.scatename2"></span>'
                    },
                    {
                      "id": 3,
                      "name": "项目类型",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.scatename1"></span>'
                    },
                    {
                      "id": 4,
                      "name": "服务品牌",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div cb-carbrand store="item.motorbrandids"></div>'
                    },
                    {
                      "id": 5,
                      "name": "项目简介",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.abstracts}}" text-length="10"></span>'
                    },
                    {
                      "id": 6,
                      "name": "服务状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.status == 0 ? \'暂停服务\' : \'正常服务\'"></span>'
                    },
                    {
                        "id": 7,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="product" data-parentid="40000" data-sectionid="40002" ui-sref="product.server.edit({serverid: item.serverid})">编辑</button>  <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40005" simple-grid-change-status="putupserver" item="item" status-item="propsParams.statusItem(data)" list="store" data-status-id="id" ng-if="item.status == 0">正常</button> <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40004" simple-grid-change-status="putdownserver" item="item" status-item="propsParams.statusItem(data)" data-status-id="id" list="store" ng-if="item.status == 1">暂停</button> <button class="btn btn-danger"  cb-access-control="product" data-parentid="40000" data-sectionid="40009" simple-grid-remove-item item="item" list="store" remove-item="propsParams.removeItem(data)" ng-if="item.status == 0">删除</button>',
                        "name": '操作',
                        "width": 200
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
                        '<button class="btn btn-primary" cb-access-control="product" data-parentid="40000" data-sectionid="40001" ui-sref="product.server.add()">+新增服务</button> '
                    ]
                }
            },
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'product-goods',
                    "searchDirective": [
                        {
                            'label': "商品编码",
                            'type': 'text',
                            'searchText': "name",
                            'placeholder': '商品编码'
                        },
                        {
                            'label': "商品名称",
                            'type': 'text',
                            'searchText': "account",
                            'placeholder': '商品名称'
                        },
                        {
                            'label': "上架状态",
                            'type': 'select',
                            'searchText': "role",
                            'placeholder': '上架状态',
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
                        },
                        {
                          'label': "商品类型",
                          'type': 'select2',
                          'searchText': "role",
                          'placeholder': '上架状态',
                          'list': []
                        },
                        {
                          'label': "品牌",
                          'type': 'select',
                          'searchText': "role",
                          'placeholder': '品牌',
                          'list': []
                        }
                    ]
                }
            }
        }
    }

    /** @ngInject */
    function productServerChangeConfig() {
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
              "name": "服务品牌",
              "cssProperty": "state-column",
              "fieldDirective": '<div cb-carbrand store="item.motorbrandids"></div>'
            },
            {
              "id": 2,
              "name": "工时费（元）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyFilter"></span>'
            },
            {
              "id": 3,
              "name": "商品费用（元）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" ng-bind="item.productcost | moneyFilter"></span>'
            },
            {
              "id": 4,
              "name": "总价格（元）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" ng-bind="item.saleprice  | moneypushFilter : item.productcost"></span>'
            },
            {
              "id": 5,
              "name": "保修期（月）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.warranty"></span>'
            },
            {
              "id": 6,
              "name": "报价状态",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" ng-bind="item.status == 0 ? \'暂停报价\' : \'正常报价\'"></span>'
            },
            {
              "id": 7,
              "cssProperty": "state-column",
              "fieldDirective": '<button class="btn btn-primary" product-server-quote-dialog="edit" item="item" item-handler="propsParams.addItem(data)">编辑</button>  <button class="btn btn-primary" ng-click="propsParams.goAddGoods(item)">管理商品</button> <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40005" simple-grid-change-status="putupofferprice" item="item" status-item="propsParams.statusItem(data)" list="store" data-status-id="id" ng-if="item.status == 0">恢复</button> <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40004" simple-grid-change-status="putdownofferprice" item="item" status-item="propsParams.statusItem(data)" data-status-id="id" list="store" ng-if="item.status == 1">暂停</button> <button class="btn btn-danger"  cb-access-control="product" data-parentid="40000" data-sectionid="40009" simple-grid-remove-item item="item" list="store" remove-item="propsParams.removeItem(data)" ng-if="item.status == 0">删除</button>',
              "name": '操作',
              "width": 300
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
              '<button class="btn btn-primary" product-server-quote-dialog="add" data-server="{{propsParams.serverid}}"  item="propsParams.offerprices" item-handler="propsParams.addItem(data)">+新增报价</button> '
            ]
          }
        },
        DEFAULT_GRID_GOODS: {
          "columns": [
            {
              "id": 0,
              "name": "商品名称",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.productname"></span>'
            },
            {
              "id": 2,
              "name": "品牌",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.cnname"></span>'
            },
            {
              "id": 3,
              "name": "商品类目",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-text="item.pcatename2"></span>'
            },
            {
              "id": 4,
              "name": "商品单价（元）",
              "cssProperty": "state-column",
              "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyFilter"></span>'
            },
            {
              "id": 5,
              "cssProperty": "state-column",
              "fieldDirective": '<button class="btn btn-primary" ng-click="propsParams.addItem(item)">添加</button>',
              "name": '操作',
              "width": 100
            }
          ],
          "config": {
            'settingColumnsSupport': false,   // 设置表格列表项
            'paginationSupport': true,  // 是否有分页
            'useBindOnce': true,  // 是否单向绑定
            "paginationInfo": {   // 分页配置信息
              maxSize: 5,
              showPageGoto: true
            }
          }
        }
      }
    }
})();
