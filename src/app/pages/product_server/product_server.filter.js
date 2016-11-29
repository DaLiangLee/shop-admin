/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('moneypushFilter', moneypushFilter);

  /** @ngInject */
  function moneypushFilter() {
    return function(name) {
      if(!name){
        return name;
      }
      var num = name * 100;
      for (var i=1, len= arguments.length; i < len; i++){
        num += arguments[i]*100;
      }
      return (parseInt(num, 10)/100).toFixed(2);
    }
  }

})();
