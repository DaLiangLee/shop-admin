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
   * @param num   保留2位小数位
   * return {string}
   */

  angular
    .module('shopApp')
    .filter('moneyformatFilter', moneyformatFilter)
    .filter('moneySubtotalFilter', moneySubtotalFilter)
    .filter('moneyTotalFilter', moneyTotalFilter);

  /** @ngInject */
  function moneyformatFilter(numberFilter, computeService) {
    return function (money) {
      // 最大溢出长度
      if ((""+money).length > 17) {
        throw Error(money + " 长度溢出");
      }
      // 金额保留2位小数带千分位
      return numberFilter(computeService.pullMoney(money), 2);
    }
  }

  /** @ngInject */
  function moneySubtotalFilter($filter, computeService) {
    return function (money) {
      if(!_.isArray(money) || !money.length){
        throw Error(money + " 不是一个数组或没有值");
      }
      if(money.length < 2){
        return $filter('moneyformatFilter')(money[0]);
      }
      var num = _.reduce(money, function (result, value) {
        return computeService.multiply(result, value);
      }, 1);
      // 金额保留2位小数带分位 小数位大于分全部干掉
      return computeService.pullMoney(parseInt(computeService.pushMoney(num), 10));
    }
  }

  /** @ngInject */
  function moneyTotalFilter($filter, computeService) {
    return function (money) {
      if(!_.isArray(money) || !money.length){
        throw Error(money + " 不是一个数组或没有值");
      }
      if(money.length < 2){
        return money[0];
      }
      var num = _.reduce(money, function (result, value) {
        return computeService.add(result, value);
      }, 0);
      // 金额保留2位小数带千分位
      return $filter('moneyformatFilter')(num);
    }
  }
})();
