
/**
 * Created by Administrator on 2017/3/29.
 */
(function () {
  'use strict';
  /**
   * moneyTotalFilter 金额合计过滤
   * js精度问题，保证整个长度小于17，在做其他操作
   * @param {array} money 允许数组(字符串数字，还是数字)
   * return {string}
   */

  angular
    .module('shopApp')
    .filter('moneyTotalFilter', moneyTotalFilter);

  /** @ngInject */
  function moneyTotalFilter(numberFilter, computeService) {
    return function (money, flag) {
      flag = !_.isUndefined(flag);
      if(!_.isArray(money)){
        throw Error(money + "不是一个数组");
      }

      /**
       * 这行代码把元转成分
       */
      flag && _.map(money, function (item) {
        return parseInt(computeService.pushMoney(item), 10);
      });

      /**
       * 合计数组的值
       * @type {*}
       */
      var result = _.reduce(money, function (previous, current) {
        return previous + parseInt(current, 10);
      }, 0);

      // 最大溢出长度
      if ((""+result).length > 17) {
        throw Error(money + " 长度溢出");
      }
      // 金额保留2位小数带千分位
      return numberFilter(computeService.pullMoney(result), 2);
    }
  }
})();
