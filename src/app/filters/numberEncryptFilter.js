/**
 * Created by Administrator on 2016/12/6.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('numberEncryptFilter', numberEncryptFilter);

  /** @ngInject */
  function numberEncryptFilter() {
    return function(number, type){
      if(!/^\d+$/.test(number) || number.length < 7){
        return number;
      }
      /**
       * 设默认值为tel 电话格式化
       * @type {any}
       */
      type = type || 'tel';
      /**
       * 正则表达式
       * @type {any}
       */
      var REGULAR = /^(\d{3})\d+(\d{4})$/;
      /**
       * 验证规则map
       * @type {{tel: regular.'tel', bank: regular.'bank'}}
       */

      var regular = {
        'tel': "****",
        'bank': "******"
      };
      /**
       * 返回加密的结果
       */
      return number.replace(REGULAR, "$1"+regular[type]+"$2");
    }
  }

})();
