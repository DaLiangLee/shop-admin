/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('moneyFilter', moneyFilter);

  /** @ngInject */
  function moneyFilter() {
    return function(name) {
      var num = parseFloat(name);
      return !isNaN(num) && num.toFixed(2);
    }
  }

})();
