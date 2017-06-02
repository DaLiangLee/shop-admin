/**
 * Created by Administrator on 2017/5/2.
 */
/**
 * 数字验证
 * 1. 只能输入数字
 * 2. 可以输入小数 根据
 *
 *
 *
 * valueMin        最小值
 * valueMax        最大值
 * rangeEnabled    验证范围是否开启
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('numberRange', numberRange);

  /** @ngInject */
  function numberRange($filter) {
    /**
     * 整型正则表达式
     * 1，可以输入0或者大于0数字或者小于0 没有-0
     * 2，只能输入长度1-16位，超过16会出现溢出，大于16位会被自动替换为0，四舍五入到16位
     */
    var NUMBER_INT_REGULAR = /^(0|-?[1-9][0-9]{0,15})$/,
      NUMBER_REGULAR = /[^0-9]/g,
      NUMBER_FLOAT_REGULAR;

    /**
     * 处理整型
     * @param value      当前数值
     * @return {string}
     */
    function integerProcess(value) {
      if (value === "") {
        return value;
      }
      var minus = "",
        length = 16;
      // 是否是负数
      /^-\d*/g.test(value) && (minus += "-", length += 1);
      // 过滤非数字
      value = minus + value.replace(NUMBER_REGULAR, "");
      if (!NUMBER_INT_REGULAR.test(value)) {
        if (/^(0|-0)/.test(value)) {
          value = '0';
        } else {
          value = value.substring(0, length);
        }
      }
      return value;
    }

    /**
     * 处理浮点数
     * @param value
     * @returns {string}
     */
    function floatProcess(value, ellipsis) {
      if (value === "") {
        return value;
      }
      var minus = "",
        length = 16;
      // 是否是负数
      /^-\d*/g.test(value) && (minus += "-", length += 1);
      value = minus + value.replace(/[^\d.]/g, "");
      if (!NUMBER_FLOAT_REGULAR.test(value)) {
        if (/^(00|-00)/.test(value)) {
          value = '0';
        }
        value = value.replace(/^\./g, "");
        value = value.replace(/\.{2,}/g, ".");
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (value.indexOf('.') > -1) {
          value = value.substring(0, value.indexOf('.') + ellipsis);
        }
      }
      return value;
    }

    return {
      restrict: 'A', // 作为元素属性
      require: "?ngModel",  // 获取ngModelController
      scope: {}, // 这个指令有一个独立的作用域对象，也就是有一个独立的scope对象
      link: function (scope, iElement, iAttrs, ngModelCtrl) {
        // 如果没有ng-model则什么都不做
        if (!ngModelCtrl) {
          return;
        }
        /**
         * 默认值
         * 整型
         * 负数
         * 步长
         * 支持加减按钮
         */
        var integer = true,   // 整型 or 负数
          rangeEnabled = !_.isUndefined(iAttrs.rangeEnabled),   // 是否需要验证
          step = 1,      // 步长
          ellipsis = 0,  // 是否有小数点，长度是多少
          valueMin = iAttrs.valueMin * 1 || 0,  // 最小值
          valueMax = iAttrs.valueMax * 1 || Number.MAX_VALUE,  // 最大值
          amount = _.isUndefined(iAttrs.numberRange);   // 支持加减按钮

        /**
         * 保留几位小数
         * @type {number}
         */
        // 监听属性valueMin 赋值变量valueMin
        iAttrs.$observe("valueMin", function (value) {
          valueMin = value * 1 || 0;
        });
        // 监听属性valueMax 赋值变量valueMax
        iAttrs.$observe("valueMax", function (value) {
          valueMax = value * 1 || Number.MAX_VALUE;
        });

        // 监听属性valueMax 赋值变量valueMax
        iAttrs.$observe("valueStep", function (value) {
          if (value) {
            /**
             * 判断步长 如果传值了，不是一个数字
             */
            if (!_.isUndefined(value) && (isNaN(value) || (!isNaN(value) && step < 0))) {
              throw Error('value-step不是一个数字并且不能小于0');
            }
            /**
             * 如果没有填默认就是整型，步长为1
             */
            if (_.isUndefined(value)) {
              step = 1;
            } else {
              /**
               * 如果有小数就需要截取输入了
               */
              if (!isNaN(value) && value.indexOf('.') > -1) {
                ellipsis = value.substring(value.indexOf('.') + 1).length + 1;
                integer = false;
                NUMBER_FLOAT_REGULAR = new RegExp('(^([1-9]|-[1-9])([0-9]){0,15}?(\.[0-9]{1,' + (ellipsis - 1) + '})?$)|(^0$)|(^([0-9]|-[0-9])\.[0-9]{1,' + (ellipsis - 1) + '}?$)');
              }
            }
          }
        });

        // $parsers接受一个数组，用于将viewValue转化成modelValue
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (angular.isUndefined(viewValue)) {
            return "";
          }
          var value;
          if (angular.isString(viewValue)) {
            if (integer) {
              value = integerProcess(viewValue);
            } else {
              value = floatProcess(viewValue, ellipsis);
            }
            if (value !== viewValue) {
              ngModelCtrl.$setViewValue(value);
              ngModelCtrl.$render();
            }
          }

          var flag = true,
            result = parseFloat(value);
          /**
           * 检查是否有-，如果有就是负数，如果没有就是正数
           */

          if (rangeEnabled) {
            if (value !== "-") {
              if (integer) {
                flag = NUMBER_INT_REGULAR.test(value) && (valueMin <= result && result <= valueMax);
              } else {
                flag = NUMBER_FLOAT_REGULAR.test(value) && (valueMin <= result && result <= valueMax);
              }
              ngModelCtrl.$setValidity("numberRange", flag);
              return value;
            } else {
              ngModelCtrl.$setValidity("numberRange", false);
              return undefined;
            }
          } else {
            ngModelCtrl.$setValidity("numberRange", true);
            return value;
          }
        });

        if (amount) {
        }

        iElement.on('blur', function () {
          if (!_.isNaN(parseFloat(ngModelCtrl.$viewValue)) && ellipsis > 0) {
            scope.$apply(function () {
              ngModelCtrl.$setViewValue($filter('number')(ngModelCtrl.$viewValue, ellipsis - 1));
              ngModelCtrl.$render();
            });
          }
        });
      }
    }
  }
})();



