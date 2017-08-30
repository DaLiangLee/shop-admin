/**
 * Created by Administrator on 2016/10/11.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('viewFramework', viewFramework);

  /** @ngInject */
  function viewFramework($window, $document) {
    return {
      restrict: "A",
      replace: true,
      scope: true,
      transclude: true,
      templateUrl: "app/components/viewFramework/viewFramework.html",
      link: function(scope, element) {
        $window.onscroll = function () {
          var top = $document[0].documentElement.scrollTop || $document[0].body.scrollTop;
          if(top > 100 && !element.hasClass('less-top-bar')) {
              element.addClass('less-top-bar');
          }
          if(top <= 100 && element.hasClass('less-top-bar')){
              element.removeClass('less-top-bar');
          }
        };
      },
      controller: ["$scope", "$rootScope", "$timeout", "viewFrameworkSetting", "viewFrameworkConfigData", "viewFrameworkHelper", function ($scope, $rootScope, $timeout, viewFrameworkSetting, viewFrameworkConfigData, viewFrameworkHelper) {
        var vm = this;
        /**
         * 默认数据
         * @type {any}
         */
        var DEFAULT_DATA = viewFrameworkConfigData;
        viewFrameworkSetting.setVersion("1.0.0");
        vm.config = $rootScope.viewFrameworkConfig;
        var viewContentLoaded = $rootScope.$on("$viewContentLoaded", function () {
          viewFrameworkSetting.promise.resolve();
        });

        $scope.$watch("view.config", function (newValue) {
          (newValue.sidebar != $window.sidebar) && $timeout(function () {
            angular.element(window).resize();
          }, 500, false);
        }, true);
        $scope.$on("updateViewFrameworkConfigSidebar", function (event, data) {
          if (vm.config) {
            vm.config.sidebar = data;
            viewFrameworkHelper.setCookie(DEFAULT_DATA.SIDEBAR_FOLD_COOKIENAME, data, DEFAULT_DATA.SIDEBAR_FOLD_COOKIEDOMAIN);
          }
        });
        $scope.$on("$destroy", function () {
          viewContentLoaded();
        });
      }],
      controllerAs: "view"
    }
  }
})();
