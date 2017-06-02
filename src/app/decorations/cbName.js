/**
 * Created by Administrator on 2017/5/10.
 */
(function () {
  /**
   * 使用注意：
   *  如果在ng-repeat里面使用该指令记得一定要配合ng-form使用
   */

  'use strict';
  angular
    .module('shopApp')
    .directive('cbName', cbName);

  /** @ngInject */
  function cbName() {
    return {
      require: "ngModel",
      link: function (scope, elm, iAttrs, ngModelCtr) {
        ngModelCtr.$name = scope.$eval(iAttrs.cbName);
        var formController = elm.controller('form') || {
            $addControl: angular.noop
          };

        formController.$addControl(ngModelCtr);

        scope.$on('$destroy', function () {
          formController.$removeControl(ngModelCtr);
        });

      }
    };
  }
})();
