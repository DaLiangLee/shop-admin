/**
 * Created by Administrator on 2017/2/20.
 */
(function () {
  'use strict';
  /*
   s: 表示字符串String
   i: 表示整型Int(它是Number中的整数类型)
   fl: 表示浮点Float(它是Number中的小数类型)
   b: 表示布尔Boolean
   a: 表示数组Array
   o: 表示对象Object
   fn: 不示函数Function
   re: 表示正则Regular Expression
   * */

  /**
   * moneyformatFilter 金额过滤
   * js精度问题，保证整个长度小于17，在做其他操作
   * @param money 允许字符串数字，数字（正或负数）
   * @param num   保留小数位
   * return {string}
   */

  angular
    .module('shopApp')
    .constant('moneyRegular', /^(\-|\+)?([\d]+(\.[\d]+)?|Infinity)$/)
    .filter('moneyformatFilter', moneyformatFilter);

  /** @ngInject */
  function moneyformatFilter(moneyRegular) {
    return function (money, num) {
      // 最大溢出长度
      var iMaximum = 17,flNum = 0;
      if ((""+money).length > iMaximum) {
        throw Error(money + " 长度溢出");
      }
      // 默认保留2位小数
      num = num || 2;
      if(typeof money === 'number'){
        flNum = money;
      }else{
        // 先把money转换成数字
        flNum = parseFloat(money);
        // 如果为NaN都直接返回空
        if (!isNaN(flNum)) {
          return "";
        }
      }
      if(flNum === 0){
        return "0";
      }

      // 求最大小数位，num值
      var sNum = "" + flNum;
      var iMax = 0;
      // 点的占位符
      var placeholder = 1;
      // 如果有负号，给占位符+1
      if(/^\-/){
        placeholder = 1;
      }
      if (moneyRegular.test(sNum)) {
        sNum = sNum.split('.');
        switch (sNum.length) {
          case 1:
            // 小数点占一位
            iMax = iMaximum - placeholder - sNum[0].length;
            break;
          case 2:
            iMax = iMaximum - placeholder - sNum[0].length - sNum[1].length;
            break;
        }
      }
      if(num > iMax){
        num = iMax;
      }

      if(sNum[1]){
        if(sNum[1].length > num){
          return [sNum[0], sNum[1].substring(0, num)].join('.')
        }else if(sNum[1].length < num){
          return flNum.toFixed(num);
        }else{
          return sNum.join('.');
        }
      }else{
        return flNum.toFixed(num);
      }
    }
  }

})();
