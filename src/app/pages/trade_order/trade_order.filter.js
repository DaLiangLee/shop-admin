/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('computeTotalPriceFilter', computeTotalPriceFilter);

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

})();
