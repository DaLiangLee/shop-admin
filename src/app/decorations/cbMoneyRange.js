/**
 * Created by Administrator on 2016/11/8.
 */
/**
 *金钱的验证
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbMoneyRange', cbMoneyRange);

  /** @ngInject */
  function cbMoneyRange(webSiteVerification) {
    return {
      restrict: 'A', // 作为元素属性
      require: "?ngModel",  // 获取ngModelController
      scope: {}, // 这个指令有一个独立的作用域对象，也就是有一个独立的scope对象
      link: function (scope, iElement, iAttrs, ngModelCtrl) {
        var step = iAttrs.cbMoneyRange*1 || 2;
        var ellipsis = step + 1;
        var REGULAR = webSiteVerification.REGULAR.money;
        var newValue = "";
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
        ngModelCtrl.$parsers.push(function (value) {
          if (angular.isUndefined(value)){
            return "";
          }
          var filtration;
          if (angular.isString(value)) {
            // 把点开头去掉
            filtration = value.replace(/[^\d.]/g,"");
            if(/^0[0-9]/.test(filtration)){
              filtration = "0";
            }
            filtration = filtration.replace(/^\./g,"");
            filtration = filtration.replace(/\.{2,}/g,".");
            filtration = filtration.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            if(filtration.indexOf('.') > -1){
              filtration = filtration.substring(0, filtration.indexOf('.') + ellipsis);
            }
            if(filtration != value){
              filtration = setViewValue(filtration);
            }
          }
          newValue = filtration;
          var flag = true, result = parseFloat(filtration, 10);
          /**
           * 检查是否有-，如果有就是负数，如果没有就是正数
           */
          if (rangeEnabled === 'true') {
            flag = REGULAR.test(filtration) && (valueMin <= result && result <= valueMax);
          } else {
            flag = REGULAR.test(filtration);
          }
          if(_.trim(filtration) === ""){
            flag = true;
          }

          ngModelCtrl.$setValidity('cbMoneyRange', flag);
          return flag ? filtration : undefined;
        });

        iElement.on('blur', function () {
            scope.$apply(function(){
              if(/\.$/.test(newValue)){
                newValue = newValue.replace(/\./g,"");
                setViewValue(newValue);
                ngModelCtrl.$setValidity('cbMoneyRange', REGULAR.test(newValue));
              }
            });
        });

        function setViewValue(value){
          // 如果不是整数或者0
          if(!/^([1-9]\d*|0)$/.test(value)){  //整数或者0
            if(isNaN(parseFloat(value))){
              value = "";
            }else{
              value = value.substring(0, value.indexOf('.')+ ellipsis);
            }
          }
          ngModelCtrl.$setViewValue(value);
          ngModelCtrl.$render();
          return value;
        }
      }
    }
  }
})();
