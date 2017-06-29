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
                      "name": "服务类目",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.scatename1"></span>',
                      "field": "scatename1",
                      "width": 100
                    },
                    {
                      "id": 2,
                      "name": "服务编码",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div><p bo-text="item.code"></p></div>',
                      "field": "code",
                      "width": 100
                    },
                    {
                      "id": 3,
                      "name": "服务名称",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div class="img-wrap"><span class="state-unread" style="width: 24px; height: 20px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-service-image" style="width:24px; height: 20px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span><a ui-sref="product.server.edit({serverid: item.guid})" class="state-unread" cb-truncate-text="{{item.servername}}" text-length="10" bo-if="propsParams.currentStatus == 0"></a><span class="state-unread" cb-truncate-text="{{item.servername}}" text-length="10" bo-if="propsParams.currentStatus == 1"></span></div>',
                      "field": "servername",
                      "width": 150
                    },
                    {
                      "id": 4,
                      "name": "工时费",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.serverprice"></span>',
                      "width": 150
                    },
                    {
                      "id": 5,
                      "name": "销量",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread"><span bo-text="item.countso"></span> 笔</span>',
                      "width": 100
                    },
                    {
                      "id": 6,
                      "name": "保修期(天)",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.shelflife"></span>',
                      "width": 100
                    },
                    {
                      "id": 7,
                      "name": "描述",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.abstracts}}" text-length="10"></span>',
                      "width": 150
                    },
                    {
                      "id": 8,
                      "name": "创建时间",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.createtime"></span>',
                      "width": 150
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
                    'exportDataSupport': true,
                    'useBindOnce': true,  // 是否单向绑定
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': [
                      '<button class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:product:server:edit" ui-sref="product.server.add()" ng-if="propsParams.currentStatus == 1">新增服务</button> ',
                      '<button class="u-btn u-btn-warning u-btn-sm" cb-access-control="chebian:store:product:server:putdown" simple-grid-change-status="removeServers" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="确定将所选服务下架？" ng-if="propsParams.currentStatus == 1">下架服务</button> ',
                      '<button class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:product:server:putup" simple-grid-change-status="resetRemoveServers" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="确定将所选服务上架？" ng-if="propsParams.currentStatus == 0">上架服务</button> ',
                      '<button class="u-btn u-btn-danger u-btn-sm" cb-access-control="chebian:store:product:server:remove" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)" data-message="是否将所选的服务删除？删除后将不可恢复。" ng-if="propsParams.currentStatus == 0">删除服务</button> '
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
