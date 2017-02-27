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
    return function(name) {
      if(!name){
        return name;
      }
      var result = "";
      if(angular.isString(name)){
        name = angular.fromJson(name);
      }
      if(angular.isArray(name)){
        angular.forEach(name, function (item) {
          result += item.skuname +": " + item.items[0].skuvalue +" | "
        });
      }
      return result.substring(0,result.length-3);
    }
  }

})();
