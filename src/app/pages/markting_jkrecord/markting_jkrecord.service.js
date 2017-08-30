/**
 * Created by Administrator on 2017/6/15.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    // .factory('marktingJk', marktingJk)
    .constant('marktingJkRecordConfig', marktingJkConfig);


  function marktingJkConfig() {

    var getStyle = [
      {
        "label": "会员领取",
        id: "0"
      },
      {
        "label": "开单赠送",
        id: "1"
      }
    ];
    var useStatus = [
      {
        "label": "已使用",
        id: "0"
      },
      {
        "label": "未使用",
        id: "1"
      },
      {
        "label": "已过期",
        id: "2"
      }
    ];
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 0,
            "cssProperty": "state-column",
            "fieldDirective": '<div><span class="state-unread" ng-class="{\'default-user-image\': !item.avatar}" style="display: inline-block; width: 24px; height: 24px;"><img bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""></span><span bo-text="item.user.gender | formatStatusFilter :\'sex\'" style="margin:0 10px;min-width: 15px;display: inline-block"></span><span class="state-unread" bo-text="item.user.realname"></span></div>',
            // "field": "name",
            "name": '姓名'
            // "width": 200
          },
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.user.mobile | numberFormatFilter"></span>',
            // "field": "scopeType",
            "name": '',
            "width": 100
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span  class="state-unread" bo-text="item.couponNum"></span>',
            "name": '券号'
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.coupon.name"></span>',
            "name": '积客券名称'
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.way | formatStatusFilter : \'couponWay\'""></span>',
            // "field": "num",
            "name": '领取方式',
            "width": 60
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.createDate.slice(0,10)"></span>',
            // "field": "sentCount",
            "name": '领取时间'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.end"></span>',
            // "field": "usedCount",
            "name": '到期时间'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" ng-class="{\'has-used\':item.coupon.state==0,\'never-used\':item.coupon.state==1,\'has-expired\':item.coupon.state==2}" bo-text="item.coupon.state  | formatStatusFilter : \'couponStatus\'"></span>',
            // "field": "price",
            "name": '使用状态'
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span ng-if="!item.order.guid">无</span><a ng-if="item.order.guid" bo-text="item.order.guid"  ui-sref="trade.order.list({page:1, keyword: item.order.guid})"></a>',
            // "field": "conditionPrice",
            "name": '关联订单'
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
            // '<button class="u-btn u-btn-primary u-btn-sm" ui-sref="markting.jk.new">新增积客券</button>'
            // '<button class="u-btn u-btn-primary u-btn-sm" setting-debitcard-dialog="add" item-handler="propsParams.saveorupdate(data)" >新增套餐卡</button> '
          ]
        }
      },
      DEFAULT_SEARCH: {
        getStyle: getStyle,
        useStatus: useStatus,
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入会员姓名、手机号码、积客券名称、券号",
              model: params.keywords,
              name: "keywords",
              isShow: true
            },
            searchDirective: [

              {
                label: "领取方式",
                all: true,
                type: "list",
                name: "way",
                list: this.getStyle,
                model: params.way
              },
              {
                label: "使用状态",
                all: true,
                type: "list",
                name: "status",
                list: this.useStatus,
                model: params.status
              }
              /*{
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
                  name: "priceStart",
                  model: params.conditionPriceStart
                },
                end: {
                  name: "priceEnd",
                  model: params.conditionPriceEnd
                }
              }*/
            ]
          }
        }
      }
    }
  }
})();