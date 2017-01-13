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
        checkstatus: "="
      },
      templateUrl: "app/components/cbSwitch/cbSwitch.html",
      link: function(scope){
        scope.cbswitch = {
          checkstatus: true,
          setStatus: function(value){
            this.checkstatus = value == 1;
          }
        };
        var status = scope.$watch('checkstatus', function (value) {

          angular.isDefined(value) && scope.cbswitch.setStatus(value);
        });

        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          status();
        });
      }
    }
  }

})();
