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
      require: "ngModel",
      link: function (scope, iElement, iAttrs, ngModel) {
        var REGULAR = webSiteVerification.REGULAR.money;
        var newValue = "";
        ngModel.$parsers.push(function (value) {
          if (angular.isUndefined(value)){
            return "";
          }
          var filtration;
          if (angular.isString(value)) {
            filtration = value.replace(/[^0-9.]/g, "");
            if(filtration.indexOf('.')){
              var i = 0;
              filtration = filtration.replace(/(\.)/g, function(){
                i++;
                return i==1 ? ".": "";
              });
              i = null;
            }
            if(filtration != value){
              filtration = setViewValue(filtration);
            }
          }
          newValue = filtration;
          ngModel.$setValidity('cbMoneyRange', REGULAR.test(filtration));
          return REGULAR.test(filtration) ? filtration : undefined;
        });

        iElement.on('blur', function () {
            scope.$apply(function(){
              if(newValue){
                //setViewValue(newValue);
                ngModel.$setValidity('cbMoneyRange', REGULAR.test(newValue));
              }
            });
        });

        function setViewValue(value){
          if(!/^[1-9]+(.)?$/.test(value)){
            if(isNaN(parseFloat(value, 10))){
              value = value.replace(/[^0-9.]/g, "");
              console.log(value);
            }else{
              if(/^(0|[1-9][0-9]*)(\.[0-9]{1})?$/.test(value)){
                value = parseFloat(value, 10).toFixed(2);
                console.log(value);
              }else{
                console.log(value);
                if(/^0$/.test(value)){

                }
                value = value.substring(0, value.indexOf('.')+3);
              }

            }
          }else{
            console.log(value);
            value = parseFloat(value, 10);
          }
          console.log(value);

          ngModel.$setViewValue(value);
          ngModel.$render();
          return value;
        }
      }
    }
  }
})();
