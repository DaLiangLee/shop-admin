/**
 * Created by Administrator on 2016/10/17.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('systemRole', systemRole)
        .factory('systemRoleConfig', systemRoleConfig);

    /** @ngInject */
    function systemRole(requestService) {
        return requestService.request('system','role');
    }

    /** @ngInject */
    function systemRoleConfig() {
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
                        "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                        "name": '角色名',
                        "width": 200
                    },
                    {
                        "id": 2,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread"><span ng-repeat="role in item.items"><i bo-text="role.menuname"></i>    </span><span bo-if="!item.items.length">无</span></span>',
                        "name": '现有权限'
                    },
                    {
                        "id": 3,
                        "cssProperty": "state-column",
                        "fieldDirective": '<button class="btn btn-primary" cb-access-control="system" data-parentid="100000" data-sectionid="100002" system-role-dialog="edit" title="编辑角色" item="item" role-item="propsParams.roleItem(data)">编辑</button> <button class="btn btn-danger" cb-access-control="system" data-parentid="100000" data-sectionid="100004" simple-grid-remove-item="id" item="item" list="store" remove-item="propsParams.removeItem(data)">删除</button>',
                        "name": '操作',
                        "width": 200
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
                        '<button class="btn btn-primary" cb-access-control="system" data-parentid="100000" data-sectionid="100001" system-role-dialog="add" title="添加新角色" role-item="propsParams.roleItem(data)">+添加角色</button> '
                    ],
                    'batchOperationBarDirective': [
                        '<button class="btn btn-danger" cb-access-control="system" data-parentid="100000" data-sectionid="100004" simple-grid-remove-item="id" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> '
                    ]
                }
            },
            DEFAULT_SEARCH: {
                "config": {
                    "searchID": 'system-role',
                    "searchDirective": [
                        {
                            'label': "角色名称",
                            'type': 'text',
                            'searchText': "name",
                            'placeholder': '角色名称'
                        }
                    ]
                }
            }
        }
    }

})();
