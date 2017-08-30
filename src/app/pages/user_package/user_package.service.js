(function (angular) {
  'use strict';
  angular
    .module('shopApp')
    .factory('userPackage', userPackage)
    .constant('userPackageConfig', userPackageConfig);


  /** @ngInject */
  function userPackage(requestService) {
    return requestService.request('users', 'package');
  }

  /** @ngInject */
  function userPackageConfig() {
    var createtime = [
      {
        "label": "今日",
        // id: "0",
        id: 0,
        start: "0",
        end: "0"
      },
      {
        "label": "本周",
        // id: "1",
        id: 1,
        start: "1",
        end: "1"
      },
      {
        "label": "本月",
        // id: "2",
        id: 2,
        start: "2",
        end: "2"
      },
      {
        "label": "本年度",
        // id: "3",
        id: 3,
        start: "3",
        end: "3"
      }
    ];
    var packagestate = [
      {
        "label": "有效",
        id: 0
      },
      {
        "label": "过期",
        id: 1
      },
      {
        "label": "用完",
        id: 2
      }
    ];

    return {
      DEFAULT_GRID: {
        "columns": [
          {
            "id": 11,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="state-unread orderUser"><span class="state-unread" ng-class="{\'default-user-image\': !item.avatar}" style="display: inline-block; width: 24px; height: 24px;"><img bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""></span><span class="state-unread" bo-text="item.gender | formatStatusFilter : \'sex\'"></span></div>',
            "name": '姓名',
            "width": 50
          },
          // {
          //   "id": 12,
          //   "cssProperty": "state-column",
          //   "fieldDirective": '<div class="state-unread orderUser"></span><span class="state-unread" bo-text="item.$gender"></span></div>',
          //   "name": '',
          //   "width": 50
          // },
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="state-unread orderUser"><span class="state-unread" bo-text="item.realname"></span></div>',
            "name": '',
            "width": 50
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.mobile | numberFormatFilter"></span>',
            "name": '',
            "width": 150
          },
          /*{
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.mobile | numberFormatFilter"></span>',
            "name": '手机号'
          },*/
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.packagename"></span>',
            "name": '套餐卡名称',
            "width": 150
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyformatFilter"></span>',
            // "field": "saleprice",
            "name": '套餐价'
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.createdate"></span>',
            "name": '办理时间'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.expire | timeState : \'date\' " ng-class="{\'warning\':item.$packageState==2}"></span>',
            "name": '到期时间'
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-if="item.$packageState!=1"  bo-bind="item.expireDay | timeState : \'time\'" ng-class="{\'warning\':item.$packageState==2}"></span>',
            "name": '剩余天数'
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread package-status" ng-class="{\'vaild\':item.$packageState==0,\'finished\':item.$packageState==1,\'expired\':item.$packageState==2}" bo-bind="item.$packageState | formatStatusFilter : \'packageState\'"></span>',
            "name": '套餐卡状态'
          },
          {
            "id": 10,
            "cssProperty": "state-column",
            "fieldDirective": '<a ui-sref="user.package.detail({userpackageid: item.id, mobile: item.mobile})" class="u-btn-link">详情</a>',
            "name": ''
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,    // 排序支持
          'sortPrefer': true,     //  服务端排序
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          }
        }
      },
      DEFAULT_GRID_DETAIL: {
        "columns": [
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><span bo-text="item.createdate"></span></span>',
            "name": '时间',
            "width": 180
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><a bo-text="item.orderid" ui-sref="trade.order.list({page:1, keyword: item.orderid})"></a></span>',
            "name": '订单编号'
          }
          ,
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.itemname"></span>',
            "name": '名称',
            "width": 150
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.usenum"></span>',
            "name": '使用数量'
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.availablenum"></span>',
            "name": '剩余数量'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.ordercreator"></span>',
            "name": '制单人'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,    // 排序支持
          'sortPrefer': true,     //  服务端排序
          'useBindOnce': true,  // 是否单向绑定
          'paginationSupport': true,  // 是否有分页
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          }
        }
      },
      DEFAULT_SEARCH: {
        createtime: createtime,
        packagestate: packagestate,
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入姓名、手机号、套餐卡名称",
              model: params.keyword,
              name: "keyword",
              isShow: true
            },
            searchDirective: [
              {
                label: "办理时间",
                all: true,
                custom: true,
                region: true,
                type: "date",
                name: "createtime",
                list: this.createtime,
                model: "",
                start: {
                  name: "createtime0",
                  model: params.createtime0,
                  config: {
                    minDate: new Date("2017/01/01 00:00:00")
                  }
                },
                end: {
                  name: "createtime1",
                  model: params.createtime1,
                  config: {
                    minDate: new Date("2017/01/05 00:00:00")
                  }
                }
              },
              {
                label: "套餐卡状态",
                all: true,
                type: "list",
                name: "con",
                list: this.packagestate,
                model: params.con
              }

            ]
          }
        }
      },
      DEFAULT_SEARCH_DETAIL: {
        createtime: createtime,
        config: function (params) {
          return {
            other: params,
            keyword: {
              placeholder: "请输入订单编号、服务名称",
              model: params.keywords,
              name: "keywords",
              isShow: true
            },
            searchDirective: [
              {
                label: "消费时间",
                all: true,
                custom: true,
                region: true,
                type: "date",
                name: "createtime",
                model: "",
                list: this.createtime,
                start: {
                  name: "createtime0",
                  model: params.createtime0,
                  config: {
                    minDate: new Date("2017/01/01 00:00:00"),
                    maxDate: new Date()
                  }
                },
                end: {
                  name: "createtime1",
                  model: params.createtime1,
                  config: {
                    minDate: new Date("2017/01/05 00:00:00"),
                    maxDate: new Date()
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
})(angular);
