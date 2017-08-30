/**
 * Created by Administrator on 2017/6/15.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('marktingJk', marktingJk)
    .constant('marktingJkConfig', marktingJkConfig)
    .factory('copyAndCreat',copyAndCreat);


  function marktingJk(requestService) {
    return requestService.request('markting', 'jk');
  }

  function marktingJkConfig() {
    var conditionPrice = [
      {
        "label": "无门槛",
        id: "0"
      }
    ];
    var jkScopeType = [
      {
        "label": "指定消费",
        id: 1
      },
      {
        "label": "全场通用",
        id: 0
      }
    ];
    var jkStatus = [
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
          {
            "id": 0,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.name"></span>',
            "field": "name",
            "name": '积客券名称',
            "width": 210
          },
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.scopeType | stateFilter : \'scopeType\'"></span>',
            "field": "scopeType",
            "name": '类型',
            "width": 70
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span ng-if="item.availableDays" class="state-unread" >领取后<span bo-bind="item.availableDays"></span>天有效</span><span ng-if="item.availableDays === undefined"><span bo-bind="item.start"></span> 至 <span bo-bind="item.end"></span></span>',
            "name": '券有效期',
            "width":180
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="all-num"><span class="state-unread all-num" ng-if="item.num!=0" bo-bind="item.num | number : 0"></span><span class="state-unread" ng-if="item.num==0">无限量</span><span ng-if="item.num !==\'0\'" simple-editable editor="item.num" data-placeholder="发行数量" editor-handler="propsParams.editorhandler(data, item)" data-max="1000000000" data-min="-1" data-step="1">发行数量</span></span>',
            // "fieldDirective": '<span class="state-unread" bo-bind="item.num | stateFilter : \'allnum\'""></span>',
            "field": "num",
            "name": '发行数量'
            // "width": 110
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread sent-count" bo-bind="item.sentCount | stateFilter : \'num\' | number : 0" ></span>',
            "field": "sentCount",
            "name": '领取数量'
            // "width": 90
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread used-count" bo-bind="item.usedCount | stateFilter : \'num\' | number : 0"></span>',
            "field": "usedCount",
            "name": '使用数量'
            // "width": 90
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread price" bo-bind="item.price | moneyformatFilter"></span>',
            "field": "price",
            "name": '券面值'
            // "width": 90
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="state-unread condition-price" bo-bind="item.conditionPrice | stateFilter : \'threshold\' | moneyformatFilter"></div>',
            "field": "conditionPrice",
            "name": '<i class="icon-exclamation has-tips" cb-popover popover-placement="top" popover-template-id="tips.html" popover-animation="false" style="margin-right: 5px"></i>使用门槛'
            // "width": 90
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checkstatus="item.status" ng-click="propsParams.statusItem(item)"></div>',
            "name": '启用停用'
            // "width": 80
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<a class="state-unread" show-jk-detail="add" item="item" itemHandler="">详情</a>&nbsp;&nbsp;&nbsp;<a class="state-unread" ng-mouseenter="propsParams.getPackageInfo(item)" cb-popover popover-placement="top-right" popover-template-id="jkQrCode.html" popover-animation="false" popover-template-data="item">二维码</a>',
            "name": '   ',
            "width": 140
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport':  true,
          'useBindOnce': true,        // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          'paginationInfo': {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'addColumnsBarDirective': [
            '<button class="u-btn u-btn-primary u-btn-sm" ui-sref="markting.jk.new">新增积客券</button>'
            // '<button class="u-btn u-btn-primary u-btn-sm" setting-debitcard-dialog="add" item-handler="propsParams.saveorupdate(data)" >新增套餐卡</button> '
          ]
        }
      },
      DEFAULT_SEARCH: {
        conditionPrice: conditionPrice,
        jkScopeType: jkScopeType,
        jkStatus: jkStatus,
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入积客券名称",
              model: params.keywords,
              name: "keywords",
              isShow: true
            },
            searchDirective: [

              {
                label: "状态",
                all: true,
                type: "list",
                name: "status",
                list: this.jkStatus,
                model: params.status
              },
              {
                label: "类型",
                all: true,
                type: "list",
                name: "scopeType",
                list: this.jkScopeType,
                model: params.scopeType
              },
              {
                label: "使用门槛",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "conditionPrice",
                // list: this.conditionPrice,
                model: params.conditionPrice,
                start: {
                  name: "conditionPriceStart",
                  model: params.conditionPriceStart
                },
                end: {
                  name: "conditionPriceEnd",
                  model: params.conditionPriceEnd
                }
              },
              {
                label: "券面值",
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

  function copyAndCreat(){
    var jkDatas = {};
    return {
      getData:function(){
        return jkDatas;
      },
      setData:function(data){
        jkDatas = _.assign(jkDatas,data);
      },
      removeData:function(){
        jkDatas = {};
      }
    }
  }
})();
