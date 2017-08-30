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
    function memberEmployee(requestService) {
        return requestService.request('member', 'employee');
    }

    /** @ngInject */
    function memberEmployeeConfig() {
        return {
            DEFAULT_GRID: {
                "columns": [{
                        "id": 0,
                        "name": "序号",
                        "none": true
                    },
                    {
                        "id": 1,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.worknum"></span>',
                        "name": '工号',
                        "width": 70
                    },
                    {
                        "id": 2,
                        "cssProperty": "state-column",
                        "fieldDirective": '<a cb-access-control="shopapp:store:member:employee:edit" class="state-unread" bo-text="item.realname" ui-sref="member.employee.edit({id: item.guid})"></a><span cb-access-control="shopapp:store:member:employee:edit:forbidden" class="state-unread" bo-text="item.realname"></span>',
                        "name": '姓名',
                        "width": 80
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
                        "fieldDirective": '<span class="state-unread" bo-text="item.mobile | numberFormatFilter"></span>',
                        "name": '手机号',
                        "width": 120
                    },
                    {
                        "id": 4,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.username"></span>',
                        "name": '登录账号',
                        "width": 160
                    },
                    {
                        "id": 5,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.posname"></span>',
                        "name": '岗位',
                        "width": 100
                    },
                    {
                        "id": 6,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.score"></span>',
                        "name": '评分',
                        "width": 60
                    },
                    {
                        "id": 6,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                        "name": '权限',
                        "width": 120
                    },
                    {
                        "id": 6,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.description"></span>',
                        "name": '员工简介',
                        "width": 160
                    },

                    {
                        "id": 7,
                        "cssProperty": "state-column",
                        "fieldDirective": '<div ng-hide="item.isStorekeeper"><div cb-access-control="shopapp:store:member:employee:edit" cb-switch checkstatus="item.status" ng-click="propsParams.statusItem(item)"></div><div cb-access-control="shopapp:store:member:employee:edit:forbidden" cb-switch="forbidden" checkstatus="item.status"></div></div>',
                        "name": '登录后台',
                        "width": 80
                    },
                    {
                        "id": 8,
                        "cssProperty": "state-column",
                        "fieldDirective": '<div ng-hide="item.isStorekeeper"><div cb-access-control="shopapp:store:member:employee:edit" cb-switch checkstatus="item.inservice" ng-click="propsParams.inserviceItem(item)"></div><div cb-access-control="shopapp:store:member:employee:edit:forbidden" cb-switch="forbidden" checkstatus="item.inservice"></div></div>',
                        "name": '在离职',
                        "width": 80
                    },
                    {
                        "id": 9,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.onboarddate | date : \'yyyy-MM-dd\'"></span>',
                        "name": '入职时间',
                        "width": 82
                    }
                ],
                "config": {
                    'settingColumnsSupport': false, // 设置表格列表项
                    'checkboxSupport': true, // 是否有复选框
                    'sortSupport': true,
                    'paginationSupport': true, // 是否有分页
                    'selectedProperty': "selected", // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true, // 是否单向绑定
                    'exportDataSupport': true,
                    "paginationInfo": { // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'columnsClass': { "checkbox-hide": "isStorekeeper" },
                    'addColumnsBarDirective': [
                        '<a class="u-btn u-btn-primary u-btn-sm" cb-access-control="shopapp:store:member:employee:add" ui-sref="member.employee.add()">新增员工</a> ',
                        '<button class="u-btn u-btn-danger u-btn-sm" cb-access-control="shopapp:store:member:employee:remove" simple-grid-remove-item="guid" item="store" data-message="确定删除该员工？" remove-item="propsParams.removeItem(data)">员工删除</button> '
                    ]
                }
            },
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'member-employee',
                    "searchDirective": [{
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