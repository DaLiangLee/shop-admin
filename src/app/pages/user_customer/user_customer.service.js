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
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="editOrder"><span class="edit-More text-default" ng-click="propsParams.nextshow(item,$event) ">•••</span><p class="edits" ng-show="item.$show"><span class="text-primary edit-item" cb-access-control="chebian:store:user:customer:view" add-package-dialog item="item" item-handler="propsParams.packageItem(data)">办理套餐卡</span><span class="text-primary edit-item" cb-access-control="chebian:store:user:customer:view" charge-balance-dialog item="item" item-handler="propsParams.balanceItem(data)">充值</span></p></div>',
            "name": '',
            "width": 50
          },
          {
            "id": 1,
            "cssProperty": "state-column",
            "fieldDirective": '<div class="orderUser"><span class="state-unread" bo-text="item.worknum"><img bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""> </span><span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>&nbsp;<span class="state-unread" cb-truncate-text="{{item.nickname}}" text-length="11"></span></div>',
            "name": '头像',
            "width": 180
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"  ng-class="{\'icon-ok_circle\': item.followed == 1, \'text-success\': item.followed == 1, \'icon-exclamation\': item.followed == 0, \'text-danger\': item.followed == 0}"></span>',
            "name": '关注店铺',
            "width": 90
          },
          {
            "id": 2,
            "cssProperty": "state-column",
            "fieldDirective": '<a class="state-unread" bo-text="item.realname" ui-sref="user.customer.edit({mobile: item.mobile})"></a>',
            "name": '姓名',
            "width": 120
          },
          {
            "id": 3,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.mobile | numberFormatFilter"></span>',
            "name": '手机号',
            "width": 100
          },
          {
            "id": 5,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.storegrade"></span>',
            "name": '等级',
            "width": 80
          },
          {
            "id": 6,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-bind="item.tradeamountall | moneyformatFilter"></span>',
            "name": '累计消费',
            "width": 100
          },

          {
            "id": 7,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><a style="padding-right: 2px" title="查看储值卡详情" ui-sref="user.debitcard.detail({userid: item.guid, balance: item.balance, mobile: item.mobile})" bo-bind="item.balance | moneyformatFilter"></a></span>',
            "name": '储值余额',
            "width": 100
          },
          {
            "id": 8,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread"><a bo-if="item.packagenum > 0" style="padding-right: 2px" title="查看套餐卡详情" bo-bind="item.packagenum" ng-mouseenter="propsParams.getPackageInfo(item)" cb-popover popover-placement="bottom" popover-template-id="marktingPackageInfo.html" popover-animation="false" popover-template-data="propsParams.templateData"></a><a style="padding-right: 2px; cursor: default;" bo-bind="item.packagenum" bo-if="item.packagenum == 0"></a></span>',
            "name": '持有套餐卡数',
            "width": 100
          },
          {
            "id": 9,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
            "name": '公司名称',
            "width": 120
          },
          {
            "id": 10,
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" bo-text="item.remark"></span>',
            "name": '备注',
            "width": 100
          }
        ],
        "config": {
          'settingColumnsSupport': false,   // 设置表格列表项
          'sortSupport': true,     // 排序
          'sortPrefer': true,     //  服务端排序
          'paginationSupport': true,  // 是否有分页
          'exportDataSupport': true,
          'importDataSupport': true,
          'useBindOnce': true,  // 是否单向绑定
          "paginationInfo": {   // 分页配置信息
            maxSize: 5,
            showPageGoto: true
          },
          'addColumnsBarDirective': [
            '<a class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:user:customer:add" ui-sref="user.customer.add()">新增会员</a> ',
            '<button class="u-btn u-btn-danger" cb-access-control="chebian:store:user:customer:remove" simple-grid-remove-item="guid" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> '
          ]
        }
      },
      DEFAULT_SEARCH: {

      }
    }
  }

})();
