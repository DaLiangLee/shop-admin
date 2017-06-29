/**
 * Created by Administrator on 2017/3/14.
 */
/**
 * 手机号码输入格式化
 */
/*(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbPhone', cbPhone);

  /!** @ngInject *!/
  function cbPhone(webSiteVerification) {

    /!**
     *
     *!/
    var PHONE_REGULAR = webSiteVerification.REGULAR.phone,
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

        // $parsers接受一个数组，用于将viewValue转化成modelValue
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (angular.isUndefined(viewValue)) {
            return "";
          }
          var value;
          if (angular.isString(viewValue)) {
            var minus = "";
            // 过滤非数字
            value = viewValue.replace(NUMBER_REGULAR, "");

            if (PHONE_REGULAR.test(value)) {
              if (minus === "-" && value == "0") {
                value = "0";
              } else {
                value = minus + value;
              }
            } else {
              if (value !== "") {
                if(/^0/.test(value)){
                  value = '0';
                }else{
                  value = value.substring(0, 16);
                }
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
          /!**
           * 检查是否有-，如果有就是负数，如果没有就是正数
           *!/
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
})();*/

