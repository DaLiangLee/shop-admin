/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
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
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 0,
            "name": "序号",
            "none": true
          },
          {
            "id": 1,
            "name": "类目",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.catename"></span>',
            "field": "catename"
          },
          {
            "id": 2,
            "name": "编码/图片",
            "cssProperty": "state-column",
            "fieldDirective": '<div><p bo-text="item.code"></p><span class="state-unread" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-product-image" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span></div>',
            "width": 120
          },
          {
            "id": 2,
            "name": "商品名称",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.productname}}" text-length="10"></span>',
            "width": 170
          },
          {
            "id": 4,
            "name": "品牌",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.cnname"></span>'
          },
          {
            "id": 8,
            "name": "零售价（元）",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.salepriceText"></span>'
          },
          {
            "id": 8,
            "name": "销量",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><span bo-text="item.skusalenum"></span>件</span>'
          },
          {
            "id": 9,
            "name": "库存",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><span bo-text="item.$$stockShow"></span>件</span>'
          },
          {
            "id": 9,
            "name": "保质期（天）",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.shelflife"></span>'
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
            '<a class="btn btn-primary" cb-access-control="chebian:store:product:goods:add" ui-sref="product.goods.add()" ng-if="propsParams.currentStatus == 0">+新增商品</a> ',
            '<button class="btn btn-warning" cb-access-control="chebian:store:product:goods:putdown" simple-grid-change-status="removeProduct" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="是否将所选的商品下架" ng-if="propsParams.currentStatus == 0">批量下架</button> ',
            '<button class="btn btn-success" cb-access-control="chebian:store:product:goods:putup" simple-grid-change-status="resetRemoveProduct" item="store" status-item="propsParams.statusItem(data)" data-status-id="guid" data-message="是否将所选的商品上架" ng-if="propsParams.currentStatus == 1">批量上架</button> ',
            '<button class="btn btn-danger" cb-access-control="chebian:store:product:goods:remove" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)" data-message="是否将所选的商品删除？删除后将不可恢复。" ng-if="propsParams.currentStatus == 1">批量删除</button> '
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
