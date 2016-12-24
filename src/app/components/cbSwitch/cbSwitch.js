/**
 * Created by Administrator on 2016/12/17.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('cbSwitch', cbSwitch);

  /** @ngInject */
  function cbSwitch() {
    return {
      restrict: "A",
      replace: true,
      scope: {
        checked: "="
      },
      templateUrl: "app/components/cbSwitch/cbSwitch.html",
      controller: ["$scope", function($scope) {
        var vm = this;
        var checked = $scope.$watch('checked', function (value) {
          value && (vm.checked = value);
        });
        // 确保工具提示被销毁和删除。
        $scope.$on('$destroy', function() {
          checked();
        });
      }],
      controllerAs: "switch"
    }
  }

})();
