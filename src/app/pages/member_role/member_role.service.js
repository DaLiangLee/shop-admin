/**
 * Created by Administrator on 2016/10/17.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('memberRole', memberRole)
        .factory('memberRoleConfig', memberRoleConfig);

    /** @ngInject */
    function memberRole(requestService) {
        return requestService.request('member','role');
    }

    /** @ngInject */
    function memberRoleConfig() {
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
                        "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span> <span class="text-primary" style="cursor: pointer;" cb-access-control="chebian:store:member:role:view" member-role-dialog="edit" title="编辑角色" item="item" role-item="propsParams.roleItem(data)"><i  class="icon-pen"></i></span>',
                        "name": '权限名称',
                        "width": 150
                    },
                    {
                        "id": 2,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread"><span ng-repeat="role in item.items"><i bo-text="role.menuname"></i>    </span><span bo-if="!item.items.length">无</span></span>',
                        "name": '权限范围',
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
                        '<button class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:member:role:view" member-role-dialog="add" title="新增权限" role-item="propsParams.roleItem(data)">新增权限</button> ',
                      '<button class="u-btn u-btn-danger u-btn-sm" cb-access-control="chebian:store:member:role:view" simple-grid-remove-item item="store" data-message="确定删除该权限？" remove-item="propsParams.removeItem(data)">删除权限</button> '
                    ]
                }
            }
        }
    }

})();
