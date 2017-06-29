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
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 0,
            "cssProperty": "state-column",
            "fieldDirective": '<a class="state-unread" style="margin-left: 10px; padding-right: 10px; border-right: 1px solid #eee" add-new-package-dialog="edit" item="item">编辑</a>',
            "name": ' ',
            "width": 50
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span></span>',
            "name": ' ',
            "width": 50
          },
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread package-popover package-item" bo-text="item.name" ng-mouseenter="propsParams.getPackageInfo(item)" cb-popover popover-placement="top-left" popover-template-id="marktingPackageInfo.html" popover-animation="false" popover-template-data="propsParams.templateData"></span>',
            "name": '套餐卡名称',
            "width": 150
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
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checkstatus="item.status" ng-click="propsParams.statusItem(item)"></div>',
            "name": '售卖状态',
            "width": 80
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" style="margin-left: 10px;" cb-truncate-text="{{item.abstracts}}" text-length="10" bo-bind="item.bak"></span>',
            "name": '备注',
            "width": 150
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
            '<div class="grid-header-item">',
            '<div class="btn-group package-btns">',
            '<button class="u-btn u-btn-primary transparent u-btn-sm" ui-sref="markting.package.list({page: 1, status: 1})" ng-class="{\'active\': propsParams.currentStatus == 1}" class="text-muted">{{currentParams}}在售({{config.$on}})</button>',
            '<button class="u-btn u-btn-primary transparent u-btn-sm" ui-sref="markting.package.list({page: 1, status: 0})" ng-class="{\'active\': propsParams.currentStatus == 0}" class="text-muted">停售({{config.$off}})</button>',
            '</div>',
            '<button class="u-btn u-btn-sm u-btn-primary transparent btn-add-package" add-new-package-dialog="add" item-handler="propsParams.saveorupdate(data)">新增套餐卡</button>',
            '</div>'
            // '<button class="u-btn u-btn-primary u-btn-sm" setting-debitcard-dialog="add" ng-if="propsParams.currentStatus == 1" item-handler="propsParams.saveorupdate(data)" >新增套餐卡</button> '
          ]
        }
      },
      DEFAULT_SEARCH: {
      }

    }
  }

})();
