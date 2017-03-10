/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .factory('userCustomer', userCustomer)
    .factory('userCustomerConfig', userCustomerConfig);

  /** @ngInject */
  function userCustomer(requestService) {
    return requestService.request('users', 'customer');
  }

  /** @ngInject */
  function userCustomerConfig() {
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
            "fieldDirective": '<span class="state-unread" bo-text="item.worknum"><img width="30px" height="30px" bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""><span bo-if="item.userclass == 0">车边认证</span></span>',
            "name": '头像',
            "width": 150
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.nickname" ></span>',
            "name": '昵称',
            "width": 150
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<a class="state-unread" bo-text="item.realname" ui-sref="user.customer.edit({mobile: item.mobile})"></a>',
            "name": '姓名'
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
            "fieldDirective": '<span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>',
            "name": '性别',
            "width": 50
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.storegrade"></span>',
            "name": '等级'
          },
          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><span bo-bind="item.balance | number : \'2\'"></span> <span class="text-primary" style="cursor: pointer;"><i class="icon-full"></i></span></span>',
            "name": '储值余额',
            "field": "balance"
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
            "name": '公司名称'
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.followed | formatStatusFilter :\'followed\'"></span>',
            "name": '关注状态'
          },
          {
            "id": 10,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.remark"></span>',
            "name": '备注'
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'checkboxSupport': true,  // 是否有复选框
          'sortSupport': true,     // 排序
          'sortPrefer': true,     //  服务端排序
          'paginationSupport': true,  // 是否有分页
          'selectedProperty': "selected",  // 数据列表项复选框
          'selectedScopeProperty': "selectedItems",
          'exportDataSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'addColumnsBarDirective': [
            '<a class="btn btn-primary" cb-access-control="chebian:store:user:customer:add" ui-sref="user.customer.add()">新增会员</a> ',
            '<button class="btn btn-danger" cb-access-control="chebian:store:user:customer:remove" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> '
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
