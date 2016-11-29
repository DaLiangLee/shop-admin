/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .constant('server_order_status', {
      '0': '已预约',
      '1': '已下单',
      '2': '服务中',
      '3': '待提车',
      '4': '已完成',
      '5': '已取消',
      '6': '退款中',
      '7': '已退款'
    })
    .constant('server_order_paystatus', {
      '0': '已付款',
      '1': '未付款',
      '2': '待退款',
      '3': '已退款'
    })
    .constant('server_order_child', {
      '0': '待服务',
      '1': '服务中',
      '2': '服务完成'
    })
    .filter('tradeStatusFilter', tradeStatusFilter)
    .filter('tradePaystatusFilter', tradePaystatusFilter)
    .filter('computeTotalPriceFilter', computeTotalPriceFilter);

  /** @ngInject */
  function tradeStatusFilter(server_order_status) {
    return function(name) {

      if(angular.isUndefined(name)){
        return name;
      }
      return server_order_status[name];
    }
  }

  /** @ngInject */
  function computeTotalPriceFilter() {
    return function(price, quantity) {
      if(angular.isUndefined(quantity)){
        var num = parseFloat(name);
        return !isNaN(num) && num.toFixed(2);
      }
      if(angular.isUndefined(price)){
        return 0;
      }
      var iPrice = parseFloat(price) * 100;
      var iQuantity = parseInt(quantity, 10);
      return (iPrice*iQuantity/100).toFixed(2);
    }
  }

  /** @ngInject */
  function tradePaystatusFilter(server_order_paystatus) {
    return function(name) {
      if(angular.isUndefined(name)){
        return name;
      }
      return server_order_paystatus[name];
    }
  }

})();
