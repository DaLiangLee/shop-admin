/**
 * Created by Administrator on 2017/3/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleTabs', simpleTabs)
    .directive('simpleTabHeading', simpleTabHeading)
    .directive('simpleTabContent', simpleTabContent)
    .directive('simpleTab', simpleTab);

  /** @ngInject */
  function simpleTabs() {
    return {
      restrict: "A",
      transclude: true,
      replace: true,
      scope: {},
      templateUrl: "app/components/simpleTabs/simpleTabs.html",
      controller: ["$scope", function ($scope) {
        var ctrl = this,
          tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.select = function (selectedTab) {
          _.forEach(tabs, function (tab) {
            if (tab.active && tab !== selectedTab) {
              tab.active = false;
              tab.onDeselect();
            }
          });
          selectedTab.active = true;
          selectedTab.onSelect();
        };

        ctrl.addTab = function addTab(tab) {
          tabs.push(tab);
          if (tabs.length === 1) {
            tab.active = true;
          } else if (tab.active) {
            ctrl.select(tab);
          }
        };

        ctrl.removeTab = function removeTab(tab) {
          var index = tabs.indexOf(tab);
          if (tab.active && tabs.length > 1 && !destroyed) {
            var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
            ctrl.select(tabs[newActiveIndex]);
          }
          tabs.splice(index, 1);
        };

        var destroyed;
        $scope.$on('$destroy', function () {
          destroyed = true;
        });
      }],
      link: function (scope, element, attrs) {
        scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
        scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
      }
    }
  }

  /** @ngInject */
  function simpleTab($parse) {
    return {
      require: '^simpleTabs',
      restrict: 'A',
      replace: true,
      templateUrl: 'app/components/simpleTabs/tab.html',
      transclude: true,
      scope: {
        active: '=?',
        heading: '@',
        onSelect: '&select',
        onDeselect: '&deselect'
      },
      controller: function() {},
      compile: function (elm, attrs, transclude) {
        return function postLink(scope, elm, attrs, simpleTabsCtrl) {
          scope.$watch('active', function (active) {
            if (active) {
              simpleTabsCtrl.select(scope);
            }
          });

          scope.disabled = false;
          if (attrs.disabled) {
            scope.$parent.$watch($parse(attrs.disabled), function (value) {
              scope.disabled = !!value;
            });
          }

          scope.select = function () {
            if (!scope.disabled) {
              scope.active = true;
            }
          };

          simpleTabsCtrl.addTab(scope);
          scope.$on('$destroy', function () {
            simpleTabsCtrl.removeTab(scope);
          });

          scope.$transcludeFn = transclude;
        };
      }
    };
  }

  /** @ngInject */
  function simpleTabHeading() {
    return {
      restrict: 'A',
      require: '^simpleTab',
      link: function (scope, elm) {
        scope.$watch('headingElement', function updateHeadingElement(heading) {
          if (heading) {
            elm.html('');
            elm.append(heading);
          }
        });
      }
    };
  }

  /** @ngInject */
  function simpleTabContent() {
    return {
      restrict: 'A',
      require: '^simpleTabs',
      link: function (scope, elm, attrs) {
        var tab = scope.$eval(attrs.simpleTabContent);
        tab.$transcludeFn(tab.$parent, function (contents) {
          angular.forEach(contents, function (node) {
            if (isTabHeading(node)) {
              tab.headingElement = node;
            } else {
              elm.append(node);
            }
          });
        });
      }
    };
    function isTabHeading(node) {
      return node.tagName && (
          node.hasAttribute('tab-heading') ||
          node.hasAttribute('data-tab-heading') ||
          node.tagName.toLowerCase() === 'tab-heading' ||
          node.tagName.toLowerCase() === 'data-tab-heading'
        );
    }
  }
})();



