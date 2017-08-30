/**
 * Created by Administrator on 2017/06/08.
 */
(function() {
  'use strict';

  angular
      .module('shopApp')
      .factory('marktingPackage', marktingPackage)
      .factory('marktingPackageConfig', marktingPackageConfig);

  /** @ngInject */
  function marktingPackage(requestService) {
    return requestService.request('markting', 'package');
  }

  /** @ngInject */
  /*  function productServerAddGoods() {
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
   }*/


  /** @ngInject */
  function marktingPackageConfig() {

    var packageStatus = [
      {
        "label": "启用",
        id: 1
      },
      {
        "label": "停用",
        id: 0
      }
    ];

    return {
      DEFAULT_GRID: {
        "columns": [

          // {
          //   "id": 9,
          //   "cssProperty": "state-column",
          //   "fieldDirective": '<span></span>',
          //   "name": ' ',
          //   "width": 50
          // },
          {
            "id": 1,
            "cssProperty": "state-column package-tips",
            "fieldDirective": '<span class="state-unread package-popover package-item" bo-text="item.name" ng-mouseenter="propsParams.getPackageInfo(item)" cb-popover popover-placement="top-left" popover-template-id="marktingPackageInfo.html" popover-animation="false" popover-template-data="propsParams.templateData"></span>',
            "name": '套餐卡名称',
            "width": 200
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.originprice | number : 2"></span>',
            "name": '原价',
            "width": 80
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.price | number : 2"></span>',
            "name": '套餐价',
            "width": 80
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.$$num"></span>',
            "name": '发行数量',
            "width": 80
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.soldnum | number : 0"></span>',
            "name": '已售数量',
            "width": 80
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.restnum"></span>',
            "name": '剩余数量',
            "width": 80
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" style="margin-left: 10px;" cb-truncate-text="{{item.abstracts}}" text-length="10" bo-bind="item.bak"></span>',
            "name": '备注',
            "width": 150
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checkstatus="item.status" ng-click="propsParams.statusItem(item)"></div>',
            "name": '状态',
            "width": 80
          },
          {
            "id": 0,
            "cssProperty": "state-column",
            // "fieldDirective": '<a class="state-unread" style="margin-left: 10px; padding-right: 10px;" add-new-package-dialog="edit" item="item">编辑{{propsParams.currentStatus}}</a>',
            "fieldDirective": '<span ng-if=" item.status == 0 "><a class="state-unread" style="margin-left: 10px; padding-right: 10px; color: #038ae3;" add-new-package-dialog="edit" item="item">编辑</a></span><span ng-if=" item.status == 1 " class="package-list-popover"><span class="state-unread text-muted" cb-popover popover-placement="top" popover-template-id="package-edit.html" popover-animation="false" style="margin-left: 10px; padding-right: 10px;">编辑</span></span>',
            "name": ' ',
            "width": 50
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          // 'sortSupport':  true,
          'useBindOnce': true,        // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          'paginationInfo': {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'addColumnsBarDirective': [
            '<button class="u-btn u-btn-sm u-btn-primary btn-add-package" add-new-package-dialog="add" item-handler="propsParams.saveorupdate(data)">新增套餐卡</button>'
            // '<button class="u-btn u-btn-primary u-btn-sm" setting-debitcard-dialog="add" ng-if="propsParams.currentStatus == 1" item-handler="propsParams.saveorupdate(data)" >新增套餐卡</button> '
          ]
        }
      },
      DEFAULT_SEARCH: {
        packageStatus: packageStatus,
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入套餐卡名称或备注关键字",
              model: params.keyword,
              name: "keyword",
              isShow: true
            },
            searchDirective: [

              {
                label: "状态",
                all: true,
                type: "list",
                name: "status",
                list: this.packageStatus,
                model: params.status
              },
             /* {
                label: "类型",
                all: true,
                type: "list",
                name: "scopeType",
                list: this.jkScopeType,
                model: params.scopeType
              },*/
              {
                label: "原价",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "originprice",
                // list: this.conditionPrice,
                model: params.originprice,
                start: {
                  name: "originprice0",
                  model: params.originprice0
                },
                end: {
                  name: "originprice1",
                  model: params.originprice1
                }
              },
              {
                label: "套餐价",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "price",
                // list: this.conditionPrice,
                model: params.price,
                start: {
                  name: "price0",
                  model: params.price0
                },
                end: {
                  name: "price1",
                  model: params.price1
                }
              }
            ]
          }
        }
      }

    }
  }

})();
