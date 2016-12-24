/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('memberEmployee', memberEmployee)
    .factory('memberEmployeeConfig', memberEmployeeConfig);

  /** @ngInject */
  function memberEmployee(requestService) {
    return requestService.request('member', 'employee');
  }

  /** @ngInject */
  function memberEmployeeConfig() {
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
            "fieldDirective": '<span class="state-unread" bo-text="item.worknum"></span>',
            "name": '工号',
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<a class="state-unread" bo-text="item.realname" ui-sref="member.employee.edit({id: item.sguid})"></a>',
            "name": '员工姓名',
            "width": 150
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>',
            "name": '性别',
            "width": 50
          },
          {
            "id": 4,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>',
            "name": '手机号',
            "width": 100
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.position"></span>',
            "name": '岗位'
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
            "name": '角色名称'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checked="item.status" ng-click="propsParams.statusItem(item)"></div>',
            "name": '是否允许登录店铺后台',
            "width": 160
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<div cb-switch checked="item.inservice" ng-click="propsParams.inserviceItem(item)"></div>',
            "name": '在职状态',
            "width": 80
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.onboardDate | date : \'yyyy年mm月dd日\'"></span>',
            "name": '入职时间'
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
            '<button class="btn btn-primary" cb-access-control="member" data-parentid="90000" data-sectionid="90002" ui-sref="member.employee.add()">+添加员工</button> ',
            '<button class="btn btn-danger" cb-access-control="member" data-parentid="90000" data-sectionid="90009" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> ',
            '<button class="btn btn-warning" cb-access-control="member" data-parentid="90000" data-sectionid="90004" ng-click="propsParams.resetItem()">重置密码</button> '
          ]
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
