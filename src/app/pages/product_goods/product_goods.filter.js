/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('skuvaluesFilter', skuvaluesFilter);


  /** @ngInject */
  function skuvaluesFilter() {
    return function(name, num) {
      num = num || 16;
      if(!name){
        return name;
      }
      var result = "";
      if(angular.isString(name)){
        name = angular.fromJson(name);
      }
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
