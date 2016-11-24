/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('productGoods', productGoods)
        .factory('productGoodsConfig', productGoodsConfig);

    /** @ngInject */
    function productGoods($http, webSiteApi, configuration) {
        var API = webSiteApi.WEB_SITE_API['product']['goods'];
        var URL = configuration.getAPIConfig();
        var result = {};
        var doRequest = function(method, url, data){
            return $http({
                method : method,
                url : url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: data
            })
        };
        angular.forEach(API, function (key, value) {
          result[value] = function (data) {
            return doRequest(key.type, URL+key.url, data);
          };
        });
        return result;
    }

    /** @ngInject */
    function productGoodsConfig() {
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
                      "name": "商品图片",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span>',
                      "width": 120
                    },
                    {
                      "id": 3,
                      "name": "商品编码",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.productid"></span>'
                    },
                    {
                      "id": 3,
                      "name": "商品名称",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.productname"></span>'
                    },
                    {
                      "id": 4,
                      "name": "商品类型",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.catename"></span>'
                    },
                    {
                      "id": 5,
                      "name": "品牌",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div style="width: 200px; overflow-x: auto; white-space: nowrap;"><span ng-repeat="img in item.motobrandids track by $index" data-id="{{item.motobrandids[$index]}}"><img bo-src-i="{{img.brand.logo}}" width="50" /> </span></div>'
                    },
                    {
                      "id": 6,
                      "name": "规格",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread">有<i bo-text="item.skuvalues.length"></i>个规格<span cb-popover="" popover-placement="bottom" popover-template-id="cbSkuvaluesTipsPopoverTemplate.html" popover-template-data="item.skuvalues">详情</span></span>'
                    },
                    {
                      "id": 7,
                      "name": "适用品牌",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.motorbrand"></span>'
                    },
                    {
                      "id": 8,
                      "name": "零售单位",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.unit"></span>'
                    },
                    /*{
                      "id": 9,
                      "name": "官方指导价（￥）",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.officialprice | moneyFilter"></span>'
                    },*/
                    {
                      "id": 10,
                      "name": "零售价（￥）",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyFilter"></span>'
                    },
                    {
                      "id": 11,
                      "name": "目前库存",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.stock"></span>'
                    },
                    {
                      "id": 12,
                      "name": "上架状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.status == 0 ? \'下架\' : \'上架\'"></span>'
                    },
                    {
                        "id": 1,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="product" data-parentid="40000" data-sectionid="40002" ui-sref="product.goods.edit({skuid: item.skuid})">编辑</button>  <button class="btn btn-primary" cb-access-control="product" data-parentid="40000" data-sectionid="40006" adjust-prices-dialog="" item="item" item-handler="propsParams.pricesItem(data)">调价</button>  <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40005" simple-grid-change-status="putup" item="item" status-item="propsParams.statusItem(data)" list="store" data-status-id="id" ng-if="item.status == 0">上架</button> <button class="btn" cb-access-control="product" data-parentid="40000" data-sectionid="40004" simple-grid-change-status="putdown" item="item" status-item="propsParams.statusItem(data)" data-status-id="id" list="store" ng-if="item.status == 1">下架</button> <button class="btn btn-danger"  cb-access-control="product" data-parentid="40000" data-sectionid="40009" simple-grid-remove-item item="item" list="store" remove-item="propsParams.removeItem(data)" ng-if="item.status == 0">删除</button>',
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
                        '<button class="btn btn-primary" cb-access-control="product" data-parentid="40000" data-sectionid="40001" ui-sref="product.goods.add()">+新增商品</button> '
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

})();
