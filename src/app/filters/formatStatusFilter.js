/**
 * Created by Administrator on 2016/12/5.
 */
(function() {
  'use strict';

    angular
        .module('shopApp')
        .constant('STATUS_COLLECTION', {
            "am_msgtype": {
                '0': '订单',
                '1': '储值卡',
                '2': '套餐卡',
                '3': '积客券',
                '4': '友情关怀',
                '5': '会员设置'
            },
            "server_order_status": {
                '0': '已预约',
                '1': '服务中',
                '2': '已完工',
                '3': '已完成',
                '4': '已关闭'
            },
            'server_order_paystatus': {
                '0': '已结算',
                '1': '未结算',
                '2': '部分结算'
            },
            'server_order_paytype': {
                '0': '储值卡',
                '1': '现金',
                '2': '支付宝',
                '3': '微信支付',
                '4': '优惠券',
                '5': '银行卡'
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
            },
            "sex": {
                "0": "女",
                "1": "男"
            },
            "storeContactPeople": {
                "0": "店铺运营联系人",
                "1": "店铺财务联系人"
            },
            "store_type": {
                "0": "4S店",
                "1": "非4S店"
            },
            "store_reg_type": {
                "0": "个体工商户",
                "1": "企业工商户"
            },
            "gradeTradeamount": {
                "0": "无条件"
            },
            "gradeDiscount": {
                "10": "无折扣"
            },
            "followed": {
                "0": "未关注",
                "1": "已关注"
            },
            "discounttype": {
                "1": "会员折扣",
                "2": "优惠",
                "0": "无优惠"
            },
            "paytype": {
                "0": "储值卡",
                "1": "现金",
                "2": "支付宝",
                "3": "微信支付",
                "4": "优惠券",
                "5": "银行卡",
                "6": "套餐卡",
                "7": "其他"
            },
            "tradetype": {
                "0": "订单",
                "1": "退款",
                "2": "充值",
                "3": "提现",
                "4": "满赠",
                "5": "平台佣金",
                "6": "办理套餐卡"
            },
            "journaltype": {
                "0": "收",
                "1": "支",
                "2": "预"
            },
            "packageState": {
                "0": "有效",
                "1": "用完",
                "2": "过期"
            },
            "packageType": {
                "0": "服务",
                "1": "商品"
            },
            "couponWay": {
                "0": "会员领取",
                "1": "开单赠送"
            },
            "couponStatus": {
                "0": "已使用",
                "1": "未使用",
                "2": "已过期"
            },
          "serviceStatus":{
            "0":"停售",
            "1":"在售"
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
