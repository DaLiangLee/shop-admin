/**
 * Created by Administrator on 2016/11/1.
 */

/**
 * 电话号码验证   需要传检验默认根据输入的第一位来区分
 * telephoneAll       检验手机，400 ，800， 固话
 * telephonePhone     检验手机
 * telephone400       检验400
 * telephone800       检验800
 * telephoneFixed     检验固话
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbTelephoneRange', cbTelephoneRange);

  /** @ngInject */
  function cbTelephoneRange(webSiteVerification) {
    return {
      require: "ngModel",
      link: function (scope, iElement, iAttrs, iController) {
        var type = iAttrs.cbTelephoneRange || "all";
        var regular = webSiteVerification.REGULAR;
        scope.$watch(iAttrs.ngModel, function (newValue) {
          if (angular.isUndefined(newValue)){
            return "";
          }
          var filtration;
          if (angular.isString(newValue)) {
            // 过滤非数字
            filtration = newValue.replace(/[^0-9]/g, "");
            (filtration != newValue) && (iController.$setViewValue(filtration), iController.$render())
          }
          switch (type){
            case 'all':
              // 手机
              if(/^1/.test(filtration)){
                iController.$setValidity("telephoneAll", regular['phone'].test(filtration));
                iController.$setValidity("telephonePhone", regular['phone'].test(filtration));
                iController.$setValidity("telephone400", true);
                iController.$setValidity("telephone800", true);
                iController.$setValidity("telephoneFixed", true);
              }else if(/^4/.test(filtration)){
                iController.$setValidity("telephoneAll", regular['tel400'].test(filtration));
                iController.$setValidity("telephonePhone", true);
                iController.$setValidity("telephone400", regular['tel400'].test(filtration));
                iController.$setValidity("telephone800", true);
                iController.$setValidity("telephoneFixed", true);
              }else if(/^8/.test(filtration)){
                iController.$setValidity("telephoneAll", regular['tel800'].test(filtration));
                iController.$setValidity("telephonePhone", true);
                iController.$setValidity("telephone400", true);
                iController.$setValidity("telephone800", regular['tel800'].test(filtration));
                iController.$setValidity("telephoneFixed", true);
              }else if(/^0/.test(filtration)){
                iController.$setValidity("telephoneAll", regular['fixedTel'].test(filtration));
                iController.$setValidity("telephonePhone", true);
                iController.$setValidity("telephone400", true);
                iController.$setValidity("telephone800", true);
                iController.$setValidity("telephoneFixed", regular['fixedTel'].test(filtration));
              }else{
                iController.$setValidity("telephoneAll", false);
                iController.$setValidity("telephonePhone", true);
                iController.$setValidity("telephone400", true);
                iController.$setValidity("telephone800", true);
                iController.$setValidity("telephoneFixed", true);
              }
              break;
            case 'phone':
                iController.$setValidity("telephonePhone", regular['phone'].test(filtration));
              break;
            case 'tel400':
                iController.$setValidity("telephone400", regular['tel400'].test(filtration));
              break;
            case 'tel800':
                iController.$setValidity("telephone800", regular['tel800'].test(filtration));
              break;
            case 'fixedTel':
                iController.$setValidity("telephoneFixed", regular['fixedTel'].test(filtration));
              break;
          }

        }, true);
      }
    }
  }
})();

