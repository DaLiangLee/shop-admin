/**
 * Created by Administrator on 2016/11/1.
 */

/**
 * 数字范围验证
 * valueMin        最小值
 * valueMax        最大值
 * rangeEnabled    验证范围是否开启
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbNumberRange', cbNumberRange);

  /** @ngInject */
  function cbNumberRange() {
    /**
     * 整型正则表达式
     * 1，可以输入0或者大于0数字或者小于0 没有-0
     * 2，只能输入长度1-16位，超过16会出现溢出，大于16位会被自动替换为0，四舍五入到16位
     */
    var NUMBER_INT_REGULAR = /^(0|-?[1-9][0-9]{0,15})$/,
        NUMBER_REGULAR = /[^0-9]/g;
    return {
      restrict: 'A', // 作为元素属性
      require: "?ngModel",  // 获取ngModelController
      scope: {}, // 这个指令有一个独立的作用域对象，也就是有一个独立的scope对象
      link: function (scope, iElement, iAttrs, ngModelCtrl) {
        // 如果没有ng-model则什么都不做
        if (!ngModelCtrl) {
          return;
        }
        // 最小值
        var valueMin = iAttrs.valueMin * 1 || 0,
          // 最大值
          valueMax = iAttrs.valueMax * 1 || Number.MAX_VALUE,
          // 是否启动范围验证
          rangeEnabled = iAttrs.rangeEnabled || 'true';
        // 监听属性valueMin 赋值变量valueMin
        iAttrs.$observe("valueMin", function (value) {
          valueMin = value * 1 || 0;
        });
        // 监听属性valueMax 赋值变量valueMax
        iAttrs.$observe("valueMax", function (value) {
          valueMax = value * 1 || Number.MAX_VALUE;
        });

        // $parsers接受一个数组，用于将viewValue转化成modelValue
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (angular.isUndefined(viewValue)) {
            return "";
          }
          var value;
          if (angular.isString(viewValue)) {
            var minus = "";
            // 是否是负数
            /^-\d*/g.test(viewValue) && (minus = "-");
            // 过滤非数字
            value = viewValue.replace(NUMBER_REGULAR, "");
            console.log(':'+value+":");

            if (NUMBER_INT_REGULAR.test(value)) {
              if (minus === "-" && value == "0") {
                value = "0";
              } else {
                value = minus + value;
              }
            } else {
              if (value !== "") {
                value = "0";
              } else {
                value = minus + value;
              }
            }
            if (value != viewValue) {
              ngModelCtrl.$setViewValue(value);
              ngModelCtrl.$render();
            }
          }

          var flag = true,
            result = parseInt(value, 10);
          /**
           * 检查是否有-，如果有就是负数，如果没有就是正数
           */
          if (value !== "-") {
              if (rangeEnabled === 'true') {
                flag = NUMBER_INT_REGULAR.test(value) && (valueMin < result && result < valueMax);
              } else {
                flag = NUMBER_INT_REGULAR.test(value);
              }
            ngModelCtrl.$setValidity("cbNumberRange", flag);
            return value;
          } else {
            flag = false;
            ngModelCtrl.$setValidity("cbNumberRange", flag);
            return undefined;
          }
        });
      }
    }
  }
})();

