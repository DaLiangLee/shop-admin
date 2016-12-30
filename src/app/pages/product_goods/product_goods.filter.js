/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('moneyFilter', moneyFilter)
    .filter('skuvaluesFilter', skuvaluesFilter);

  /** @ngInject */
  function moneyFilter() {
    return function(name) {
      if(!name){
        return name;
      }
      var num = parseFloat(name);
      return !isNaN(num) && num.toFixed(2);
    }
  }

  /** @ngInject */
  function skuvaluesFilter() {
    return function(name, num) {
      num = num || 16;
      if(!name){
        return name;
      }
      if(angular.isString(name)){
        name = JSON.parse(name);
      }
      var result = "";
      if(angular.isArray(name)){
        angular.forEach(name, function (item) {
          result += item.skuname + "/"
        });
      }
      result = result.substring(0, result.length - 1);
      if(result.length > num){
        result = result.substring(0, num);
        if(result.lastIndexOf("/") === num - 1){
          result = result.substring(0, result.length - 1);
        }
        result += " 等";
      }
      return result;
    }
  }

})();
