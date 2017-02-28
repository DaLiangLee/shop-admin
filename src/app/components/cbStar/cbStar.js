/**
 * Created by Administrator on 2017/2/25.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('cbStar', cbStar);

  /** @ngInject */
  function cbStar() {
    return {
      restrict: "A",
      replace: true,
      scope: {
        star: "="
      },
      templateUrl: "app/components/cbStar/cbStar.html",
      link: function (scope, iElement, iAttrs) {
        scope.items = [];
        var total = iAttrs.cbStar * 1 || 5;
        for (var i=0; i< total; i++){
          scope.items.push({
            flag: scope.star > i
          })
        }
      }
    }
  }

})();
