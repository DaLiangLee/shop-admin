/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('userMotorConfig', userMotorConfig);


  /** @ngInject */
  function userMotorConfig() {
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
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.licence">',
            "name": '车牌',
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<div><img class="pull-left" width="60px" bo-src-i="{{item.logo}}" alt=""><div class="pull-left"><p><span bo-text="item.model"></span></p><p bo-if="item.vin || item.engine"><span bo-if="item.vin">VIN码：<span bo-text="item.vin"></span></span><span bo-if="item.engine">发动机号：<span bo-text="item.engine"></span></span> 前轮：<span bo-text="item.frontwheel"></span>后轮：<span bo-text="item.rearwheel"></span></p><p bo-if="item.buydate">购车日期：<span bo-bind="item.buydate"></span></p></div></div>',
            "name": '车辆信息',
            "width": 500
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.totalmile"></span>',
            "name": '当前里程'
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.countdownmiles"></span>',
            "name": '剩余保养里程',
            "width": 150
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<div><span bo-bind="item.errorcode ? item.errorcode : \'正常\'" bo-class="{\'text-danger\': item.errorcode , \'text-success\': !item.errorcode}"></span><br><a target="_blank" ng-href="{{item.$$baoyang}}">保养手册</a></div>',
            "name": '车辆健康状况',
            "width": 150
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.gradename"></span>',
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
          'checkboxSupport': true,  // 是否有复选框
          'sortSupport': true,
          'paginationSupport': true,  // 是否有分页
          'selectedProperty': "selected",  // 数据列表项复选框
          'selectedScopeProperty': "selectedItems",
          'exportDataSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          }
        }
      },
      DEFAULT_SEARCH: {
        "config": {
          "searchID": 'member-employee',
          "searchDirective": [
            {
              'label': "员工姓名",
              'type': 'text',
              'searchText': "name",
              'placeholder': '员工姓名'
            },
            {
              'label': "账号",
              'searchText': "account",
              'placeholder': '账号名称'
            },
            {
              'label': "角色名称",
              'type': 'select',
              'searchText': "role",
              'placeholder': '角色名称',
              'list': []
            }
          ]
        }
      }
    }
  }

})();
