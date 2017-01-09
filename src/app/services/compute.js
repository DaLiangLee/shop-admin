/**
 * Created by Administrator on 2017/1/9.
 */
/**
 * Created by Administrator on 2016/10/18.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .service('computeService', computeService);

  /** @ngInject */
  function computeService(){
    var plus = function(augend, addend){
      var length;
      try
      {
        augend = augend.toString().split(".")[1].length;
      }
      catch (e)
      {
        augend = 0;
      }
      try
      {
        addend = addend.toString().split(".")[1].length;
      }
      catch (e)
      {
        addend = 0;
      }
      length = Math.pow(10, Math.max(augend, addend));

      return (augend * length + addend * length) / length;
    };

    var multiply = function(multiplier, multiplicand){
      var m = 0;
      var s1 = multiplier.toString();
      var s2 = multiplicand.toString();
      try
      {
        m += s1.split(".")[1].length;
      }
      catch (e)
      {
      }
      try
      {
        m += s2.split(".")[1].length;
      }
      catch (e)
      {
      }

      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };



    /**
     * 加法
     * @param augend
     * @param addend
     */
    this.plus = function(augend, addend){
      return plus(augend, addend);
    };

    /**
     * 乘法
     * @param multiplier
     * @param multiplicand
     */
    this.multiply = function(multiplier, multiplicand){
      return multiply(multiplier, multiplicand);
    };

  }

})();
