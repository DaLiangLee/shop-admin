/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .constant('userMotorConfig', userMotorConfig);


  /** @ngInject */
  function userMotorConfig() {
    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<div><div class="f-fl" style="width: 80px"><img width="60px" bo-src-i="{{item.logo}}" alt=""><p class="state-unread" bo-text="item.licence"></p></div><div class="f-fl"><p><span bo-text="item.model"></span></p><p bo-if="item.vin || item.engine"><span bo-if="item.vin">VIN码：<span bo-text="item.vin"></span></span><span bo-if="item.engine">发动机号：<span bo-text="item.engine"></span></span> 前轮：<span bo-text="item.frontwheel"></span>后轮：<span bo-text="item.rearwheel"></span></p><p bo-if="item.buydate">购车日期：<span bo-bind="item.buydate"></span></p></div><a class="f-fl" target="_blank" ng-href="{{item.baoyang}}"><i class="icon-book"></i></a></div>',
            "name": '车辆信息',
            "width": 400
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.totalmile"></span>',
            "name": '当前里程(km)',
            "width": 100
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.countdownmiles"></span>',
            "name": '距下次保养(km)',
            "width": 100
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<div><span bo-bind="item.errorcode ? item.errorcode : \'无\'" bo-class="{\'text-danger\': item.errorcode , \'text-success\': !item.errorcode}"></span></div>',
            "name": '故障码',
            "width": 150
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<a ui-sref="trade.order.list({page:1, motorid: item.guid})">历史订单</a>',
            "name": '历史订单'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
            "name": '保险及车审情况'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,
          'paginationSupport': true,  // 是否有分页
          'exportDataSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          }
        }
      },
      DEFAULT_SEARCH: {
        countdownMile: [
          {
            "label": "0-100km",
            id: 100,
            start: 0,
            end: 100
          },
          {
            "label": "0-300km",
            id: 300,
            start: 0,
            end: 300
          },
          {
            "label": "0-500km",
            id: 500,
            start: 0,
            end: 500
          }
        ],
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入会员姓名、手机号、车牌号、车辆品牌",
                model: params.keyword,
                name: "keyword",
                isShow: true
            },
            searchDirective: [
              {
                label: "剩余保养里程",
                all: true,
                custom: true,
                region: true,
                type: "integer",
                name: "CountdownMile",
                start: {
                  name: "startCountdownMile",
                  model: params.startCountdownMile,
                  config: {

                  }
                },
                end: {
                  name: "endCountdownMile",
                  model: params.endCountdownMile,
                  config: {

                  }
                }
              },
              {
                label: "当前里程",
                name: "TotalMile",
                all: true,
                custom: true,
                type: "integer",
                start: {
                  name: "startTotalMile",
                  model: params.startTotalMile,
                  config: {

                  }
                },
                end: {
                  name: "endTotalMile",
                  model: params.endTotalMile,
                  config: {

                  }
                }
              },
              {
                label: "购车时间",
                name: "BuyDate",
                all: true,
                custom: true,
                type: "date",
                model: _.isUndefined(params.startBuyDate) ? '-1': '-2',
                start: {
                  name: "startBuyDate",
                  model: params.startBuyDate,
                  config: {
                    minDate: new Date("2010/01/01 00:00:00")
                  }
                },
                end: {
                  name: "endBuyDate",
                  model: params.endBuyDate,
                  config: {
                    minDate: new Date("2010/01/01 00:00:00")
                  }
                }
              }
            ]
          }
        }
      }
    }
  }

})();
