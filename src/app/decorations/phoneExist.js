/**
 * Created by Administrator on 2016/11/2.
 */
/**
 * 验证手机号码是否已经注册
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbPhoneExist', cbPhoneExist);

  /** @ngInject */
  function cbPhoneExist($http, configuration, webSiteVerification) {
    //var url = configuration.getAPIConfig(true) + '/exist';
    //var url = 'http://192.168.2.11:9090/shopservice/exist';
    return {
      require: "ngModel",
      link: function (scope, iElement, iAttrs, iController) {
        var phone = webSiteVerification.REGULAR.phone;
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
          iController.$setValidity("cbPhoneExist", phone.test(filtration));

          /*if(phone.test(filtration)){
            $http({
              method : 'post',
              url : url,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              params: {
                "username": filtration
              }
            }).then(function (data) {

            });
          }*/

        }, true);


      }
    }
  }
})();
