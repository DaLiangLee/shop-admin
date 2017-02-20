/**
 * Created by Administrator on 2017/1/9.
 */
/**
 * Created by Administrator on 2016/10/18.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .service('computeService', computeService);

  /** @ngInject */
  function computeService() {
    var add = function (augend, addend) {
      var r1,r2, length;
      try {
        r1 = augend.toString().split(".")[1].length;
      }
      catch (e) {
        r1 = 0;
      }
      try {
        r2 = addend.toString().split(".")[1].length;
      }
      catch (e) {
        r2 = 0;
      }
      length = Math.pow(10, Math.max(r1, r2));
      return (parseInt(augend * length, 10) + parseInt(addend * length, 10)) / length;
    };

    var multiply = function (multiplier, multiplicand) {
      var m = 0;
      var s1 = multiplier.toString();
      var s2 = multiplicand.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {
        m += 0;
      }
      try {
        m += s2.split(".")[1].length;
      } catch (e) {
        m += 0;
      }

      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };

    var divide = function (dividend, divisor) {
      var t1 = 0, t2 = 0, r1, r2;
      try {
        t1 = dividend.toString().split(".")[1].length
      } catch (e) {
        t1 = 0;
      }
      try {
        t2 = divisor.toString().split(".")[1].length
      } catch (e) {
        t1 = 0;
      }
      r1 = Number(dividend.toString().replace(".", ""));
      r2 = Number(divisor.toString().replace(".", ""));
      return (r1 / r2) * Math.pow(10, t2 - t1);
    };

    var subtract = function (minuend, subtrahend) {
      var r1, r2, m, n;
      try {
        r1 = minuend.toString().split(".")[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = subtrahend.toString().split(".")[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = (r1 >= r2) ? r1 : r2;
      return ((parseInt(minuend * m, 10) - parseInt(subtrahend * m, 10)) / m).toFixed(n);
    };


    /**
     * 加法
     * @param augend
     * @param addend
     */
    this.add = function (augend, addend) {
      return add(augend || 0, addend || 0);
    };

    /**
     * 减法
     * @param minuend
     * @param subtrahend
     */
    this.subtract = function (minuend, subtrahend) {
      return subtract(minuend || 0, subtrahend || 0);
    };

    /**
     * 乘法
     * @param multiplier
     * @param multiplicand
     */
    this.multiply = function (multiplier, multiplicand) {
      return multiply(multiplier || 0, multiplicand || 0);
    };

    /**
     * 除法
     * @param dividend
     * @param divisor
     */
    this.divide = function (dividend, divisor) {
      return divide(dividend || 0, divisor || 0);
    }
  }

})();
