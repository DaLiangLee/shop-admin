/**
 * Created by Administrator on 2016/12/5.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .constant('STATUS_COLLECTION', {
      "server_order_status": {
        '0': '已预约',
        '1': '已下单',
        '2': '服务中',
        '3': '待提车',
        '4': '已完成',
        '5': '已取消',
        '6': '退款中',
        '7': '已退款'
      },
      'server_order_paystatus': {
        '0': '未付款',
        '1': '已付款',
        '2': '待退款',
        '3': '已退款'
      },
      'server_order_child': {
        '0': '待服务',
        '1': '服务中',
        '2': '服务完成',
        "3": "已关闭"
      },
      'porder_order_status': {
        '0': '已下单',
        '1': '已使用',
        '2': '已完成'
      },
      'user_source': {
        '0': '线上',
        '1': '到店'
      },
      'user_type': {
        '0': '个人会员',
        '1': '企业会员'
      },
      'user_class': {
        '0': '平台会员',
        '1': '线下会员'
      },
      "store_shop": {
        "0": "待审核",
        "1": "正常营运",
        "2": "已冻结",
        "3": "已停业"
      },
      "billing_cycle": {
        "0": "日结",
        "1": "周结",
        "2": "月结",
        "3": "财务周期"
      },
      "billing_type": {
        "0": "线下",
        "1": "线上"
      },
      "account_type": {
        "0": "银行卡",
        "1": "支付宝",
        "2": "微信",
        "3": "第三方支付"
      },
      "currency_type": {
        "0": "人民币",
        "1": "美元",
        "2": "欧元",
        "3": "其他货币"
      }
    })
    .filter('formatStatusFilter', formatStatusFilter);

  /** @ngInject */
  function formatStatusFilter(STATUS_COLLECTION) {
    return function(name, type) {
      if(angular.isUndefined(name) || angular.isUndefined(type)){
        return name;
      }
      return STATUS_COLLECTION[type][name];
    }
  }

})();
