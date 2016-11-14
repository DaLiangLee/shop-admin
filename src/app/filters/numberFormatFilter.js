/**
 * Created by Administrator on 2016/10/10.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .filter('numberFormatFilter', numberFormatFilter);

  /** @ngInject */
  function numberFormatFilter(webSiteVerification) {
    return function(number, type){
      /**
       * 设默认值为tel 电话格式化
       * @type {any}
       */
      type = type || 'tel';
      /**
       * 根据type获取格式化的正则表达式
       */
      var format = webSiteVerification.FORMAT[type];
      /**
       * 缓存正则表达式
       * @type {any}
       */
      var REGULAR = webSiteVerification.REGULAR;
      /**
       * 验证规则map
       * @type {{tel: regular.'tel', bank: regular.'bank'}}
       */

      var regular = {
        'tel': function (str) {
          return (/^4/.test(str) && REGULAR.tel400.test(str)) || (/^8/.test(str) && REGULAR.tel800.test(str)) || (/^0/.test(str) && REGULAR.fixedTel.test(str)) || (/^1/.test(str) && REGULAR.phone.test(str));
        },
        'bank': function (str) {
          return REGULAR.bank.test(str);
        }
      };
      /**
       * 格式化规则
       * tel 400,800，固话，手机 格式: (3,4)-(4)-(3-4)
       * bank 16或19位银行卡   格式：16格式为4个（4） 19位格式4个（4）1个（3）
       */
      if(type === 'tel' && regular[type](number)){
        return number.replace(format, '$1-$2-$3');
      }
      if(type === 'bank' && regular[type](number)){
        return number.length === 16 ? number.replace(format, '$1-$2-$3-$4') : number.replace(format, '$1-$2-$3-$4-$5');
      }
      /**
       * 如没有格式化就直接返回当前值
       */
      return number;
    }
  }

})();
