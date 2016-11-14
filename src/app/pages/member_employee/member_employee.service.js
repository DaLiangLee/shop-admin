/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('memberEmployee', memberEmployee)
        .factory('memberEmployeeConfig', memberEmployeeConfig);

    /** @ngInject */
    function memberEmployee($http, webSiteApi, configuration) {
        var API = webSiteApi.WEB_SITE_API['member']['employee'];
        var URL = configuration.getAPIConfig();
        var result = {};
        var doRequest = function(method, url, data){
            return $http({
                method : method,
                url : url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: data
            })
        };
        angular.forEach(API, function (key, value) {
          result[value] = function (data) {
            return doRequest(key.type, URL+key.url, data);
          };
        });
        return result;
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
                        "fieldDirective": '<span class="state-unread" bo-text="item.name"></span>',
                        "name": '员工姓名'
                    },
                    {
                        "id": 2,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.account"></span>',
                        "name": '账号'
                    },
                    {
                        "id": 3,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.status"></span>',
                        "name": '状态'
                    },
                    {
                        "id": 4,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                        "name": '角色名称'
                    },
                    {
                        "id": 5,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="member" data-parentid="90000" data-sectionid="90003" member-employee-dialog="edit" title="编辑员工" item="item" employee-item="propsParams.employeeItem(data)" employee-role="propsParams.roleItems">编辑</button>  <button class="btn" cb-access-control="member" data-parentid="90000" data-sectionid="90005" simple-grid-change-status="disable" item="item" status-item="propsParams.statusItem(data)" list="store" data-status-id="id" ng-if="item.status == 0">冻结</button> <button class="btn" cb-access-control="member" data-parentid="90000" data-sectionid="90006" simple-grid-change-status="enable" item="item" status-item="propsParams.statusItem(data)" data-status-id="id" list="store" ng-if="item.status == 1">恢复</button> <button class="btn btn-danger" simple-grid-remove-item item="item" list="store" remove-item="propsParams.removeItem(data)">删除</button> <button class="btn btn-warning" member-employee-reset="60" item="item" cb-access-control="member" data-parentid="90000" data-sectionid="90004" reset-item="propsParams.resetItem(data)">重置密码</button>',
                        "name": '操作',
                        "width": 300
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
                        '<button class="btn btn-primary" cb-access-control="member" data-parentid="90000" data-sectionid="90002" member-employee-dialog="add" title="添加新员工" employee-item="propsParams.employeeItem(data)" employee-role="propsParams.roleItems">+添加员工</button> '
                    ],
                    'batchOperationBarDirective': [
                        '<button class="btn btn-danger" cb-access-control="member" data-parentid="90000" data-sectionid="90009" simple-grid-remove-item="id" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> '
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
