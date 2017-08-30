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
    function productGoods(requestService) {
        return requestService.request('product', 'goods');
    }

    /** @ngInject */
    function productGoodsConfig() {
        return {
            /*DEFAULT_GRID: {
              "columns": [
                {
                  "id": 0,
                  "name": "序号",
                  "none": true
                },
                {
                  "id": 1,
                  "name": "商品类目",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread" bo-bind="item.catename"></span>',
                  "field": "catename",
                  "width": 90
                },
                {
                  "id": 2,
                  "name": "商品编码",
                  "cssProperty": "state-column",
                  "fieldDirective": '<p bo-text="item.code"></p>',
                  "field": "code",
                  "width": 100
                },
                {
                  "id": 2,
                  "name": "商品名称",
                  "cssProperty": "state-column",
                  "fieldDirective": '<div class="img-wrap"><span class="state-unread" style="width: 24px; height: 20px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-product-image" style="width: 24px; height: 20px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span><a ui-sref="product.goods.edit({pskuid: item.guid})" class="state-unread" cb-truncate-text="{{item.productname}}" text-length="6" bo-if="propsParams.currentStatus == 1"></a><span class="state-unread" cb-truncate-text="{{item.productname}}" text-length="6" bo-if="propsParams.currentStatus == 0"></span></div>',
                  "field": "productname",
                  "width": 160
                },
                {
                  "id": 4,
                  "name": "品牌",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.cnname}}" text-length="8"></span>',
                  "width": 150
                },
                {
                  "id": 8,
                  "name": "零售单价",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread" bo-text="item.salepriceText"></span>',
                  "width": 170
                },
                {
                  "id": 8,
                  "name": "销量",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread"><span bo-text="item.skusalenum"></span> 件</span>',
                  "width": 78
                },
                {
                  "id": 9,
                  "name": "库存",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread"><span bo-text="item.$$stockShow"></span> 件</span>',
                  "width": 78
                },
                {
                  "id": 9,
                  "name": "保质期(天)",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread" bo-text="item.shelflife"></span>',
                  "width": 102
                },
                {
                  "id": 10,
                  "name": "创建时间",
                  "cssProperty": "state-column",
                  "fieldDirective": '<span class="state-unread" bo-text="item.createtime"></span>',
                  "width": 140
                }

              ],
              "config": {
                'settingColumnsSupport': false,   // 设置表格列表项
                'checkboxSupport': true,  // 是否有复选框
                'sortSupport': true,     // 排序
                'sortPrefer': false,     //  服务端排序
                'paginationSupport': true,  // 是否有分页
                'selectedProperty': "selected",  // 数据列表项复选框
                'selectedScopeProperty': "selectedItems",
                'exportDataSupport': true,
                'useBindOnce': true,  // 是否单向绑定
                'statusShow': [
                  {
                    sClass: 'downline',
                    key: 'status',
                    value: '0'
                  },
                  {
                    sClass: 'online',
                    key: 'status',
                    value: '1'
                  }
                ],
                "paginationInfo": {   // 分页配置信息
                  maxSize: 5,
                  showPageGoto: true
                },
                'addColumnsBarDirective': [
                  '<a class="u-btn u-btn-primary u-btn-sm" cb-access-control="shopapp:store:product:goods:add" ui-sref="product.goods.add()" ng-if="propsParams.currentStatus == 0">新增商品</a> ',
                  '<button class="u-btn u-btn-warning u-btn-sm" cb-access-control="shopapp:store:product:goods:putdown" simple-grid-change-status="removeProduct" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="确定将所选商品下架？" ng-if="propsParams.currentStatus == 0">下架商品</button> ',
                  '<button class="u-btn u-btn-primary u-btn-sm" cb-access-control="shopapp:store:product:goods:putup" simple-grid-change-status="resetRemoveProduct" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="确定将所选商品上架？" ng-if="propsParams.currentStatus == 1">上架商品</button> ',
                  '<button class="u-btn u-btn-danger u-btn-sm" cb-access-control="shopapp:store:product:goods:remove" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)" data-message="确定将所选商品删除？删除后将不可恢复。" ng-if="propsParams.currentStatus == 1">删除商品</button> '
                ]
              }
            },*/
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'product-goods',
                    "searchDirective": [{
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
                            'list': [{
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