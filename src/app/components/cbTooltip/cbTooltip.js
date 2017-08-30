/**
 * Created by Administrator on 2016/10/12.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .provider("$cbtooltip", $cbtooltip)
    .directive("cbTooltipPopup", cbTooltipPopup)
    .directive("cbTooltip", cbTooltip)
    .directive("cbPopover", cbPopover)
    .directive("cbPopoverPopup", cbPopoverPopup);


  var getTemplate = function ($templateCache, $compile, $q, $http) {
    function getUrl(url) {
      return $q.when($templateCache.get(url) || $http.get(url)).then(function (data) {
        return angular.isObject(data) ? ($templateCache.put($compile, data.data), data.data) : data
      })
    }

    function init(scope, iElement, type) {
      scope.$watch("templateId", function (value) {
        if (value) {
          getUrl(value).then(function (data) {
            data = setTrim.apply(data);
            iElement.find("." + type + "-content").append(data);
            $compile(iElement.find("." + type + "-content"))(scope);
          })
        }
      });
      scope.$watch("templateData", function (value) {
        value && $compile(iElement.find("." + type + "-content"))(scope);
      });
    }

    var setTrim = String.prototype.trim || function () {
        return this.replace(/^\s+|\s+$/g, "")
      };
    return {init: init}
  };

  /** @ngInject */
  function $cbtooltip() {
    function snake_case(name) {
      var regexp = /[A-Z]/g;
      var separator = '-';
      return name.replace(regexp, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
      });
    }

    var defaultOptions = {
      placement: 'top',
      animation: true,
      popupDelay: 0
    };

    // Default hide triggers for each show trigger
    var triggerMap = {
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur'
    };

    // The options specified to the provider globally.
    var globalOptions = {};

    this.options = function (value) {
      angular.extend(globalOptions, value);
    };

    /**
     * This allows you to extend the set of trigger mappings available. E.g.:
     *
     *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
     */
    this.setTriggers = function setTriggers(triggers) {
      angular.extend(triggerMap, triggers);
    };

    this.$get = ["$window", "$compile", "$timeout", "$parse", "$document", "$position", "$interpolate", function ($window, $compile, $timeout, $parse, $document, $position, $interpolate) {
      return function (type, prefix, defaultTriggerShow) {
        function getTriggers(trigger) {
          var show = trigger || options.trigger || defaultTriggerShow;
          var hide = triggerMap[show] || show;
          return {
            show: show,
            hide: hide
          };
        }

        var options = angular.extend({}, defaultOptions, globalOptions);
        var directiveName = snake_case(type);

        var startSym = $interpolate.startSymbol();
        var endSym = $interpolate.endSymbol();
        var template = "<div " + directiveName + "-popup " + 'title="' + startSym + "tt_title" + endSym + '" ' + '  content="' + startSym + "tt_content" + endSym + '" ' + 'placement="' + startSym + "tt_placement" + endSym + '" ' + 'content-class="' + startSym + "tt_contentClass" + endSym + '" ' + 'animation="' + startSym + "tt_animation" + endSym + '" ' + 'is-open="' + startSym + "tt_isOpen" + endSym + '"' + 'template-id="' + startSym + "tt_templateId" + endSym + '" ' + 'content-html="' + startSym + "tt_contentHtml" + endSym + '" ' + 'template-data="tt_templateData" ' + ">" + "</div>";

        return {
          restrict: "EA",
          scope: true,
          compile: function () {
            var tooltipLinker = $compile(template);
            return function (scope, iElement, iAttrs) {
              var tooltip;
              var tooltipTimeout;
              var transitionTimeout;
              var popupTimeout;
              var y = false;
              var E = true;
              var triggers = getTriggers(undefined);
              var hasEnableExp = angular.isDefined(iAttrs[prefix + 'Enable']);
              var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;

              // 默认情况下，工具提示未打开。
              scope.tt_isOpen = false;

              // 根据状态来切换显示还是隐藏
              function toggleTooltipBind(event) {
                event.stopPropagation();
                if (!scope.tt_isOpen) {
                  showTooltipBind();
                } else {
                  hideTooltipBind();
                }
              }

              // 如果指定，显示带有延迟的工具提示，否则立即显示
              function showTooltipBind() {
                $timeout.cancel(tooltipTimeout);
                tooltipTimeout = null;
                if (hasEnableExp && !scope.$eval(iAttrs[prefix + 'Enable'])) {
                  return;
                }
                if (scope.tt_popupDelay) {
                  popupTimeout = $timeout(show, scope.tt_popupDelay, false);
                  popupTimeout.then(function (reposition) {
                    reposition();
                  });
                } else {
                  show()();
                }
              }

              function hideTooltipBind() {
                scope.$apply(function () {
                  tooltipTimeout = $timeout(hide, 100)
                });
              }

              // 显示工具提示弹出元素。
              function show() {
                return !scope.tt_content && !scope.tt_templateId ? angular.noop : (
                  createTooltip(),
                  transitionTimeout && $timeout.cancel(transitionTimeout),
                    tooltip.css({top: 0, left: 0, display: 'block'}),
                    positionTooltip(), scope.tt_isOpen = true,
                    scope.$digest(), positionTooltip
                )
              }

              // 创建提升
              function createTooltip() {
                // 每个指令只能同时显示一个工具提示元素。
                if (tooltip) {
                  removeTooltip();
                }
                tooltip = tooltipLinker(scope, function (tooltip) {
                  if (appendToBody) {
                    $document.find('body').append(tooltip);
                  } else {
                    iElement.after(tooltip);
                  }
                });
                scope.$digest();
                hoverHandle();
              }

              // 绑定鼠标hover到提示上处理
              function hoverHandle() {
                tooltip && E && (tooltip.bind("mouseenter", mouseenterHandle), tooltip.bind("mouseleave", mouseleaveHandle));
              }

              function mouseenterHandle() {
                $timeout.cancel(tooltipTimeout);
              }

              function mouseleaveHandle() {
                tooltipTimeout = $timeout(hideTooltipBind, 100);
              }

              // 隐藏工具提示弹出元素。
              function hide() {
                scope.tt_isOpen = false;

                $timeout.cancel(popupTimeout);
                popupTimeout = null;

                if (scope.tt_animation) {
                  if (!transitionTimeout) {
                    transitionTimeout = $timeout(removeTooltip, 500);
                  }
                } else {
                  removeTooltip();
                }
              }

              // 删除提示
              function removeTooltip() {
                transitionTimeout = null;
                if (tooltip) {
                  tooltip.remove();
                  tooltip = null;
                }
              }

              // 获取位置
              var positionTooltip = function () {
                var position = appendToBody ? $position.offset(iElement) : $position.position(iElement),
                  offsetWidth = tooltip.prop("offsetWidth"),
                  offsetHeight = tooltip.prop("offsetHeight"),
                  css = {};
                switch (scope.tt_placement) {
                  case"right":
                    css = {top: position.top + position.height / 2 - offsetHeight / 2, left: position.left + position.width};
                    break;
                  case"bottom":
                    css = {top: position.top + position.height, left: position.left + position.width / 2 - offsetWidth / 2};
                    break;
                  case"left":
                    css = {top: position.top + position.height / 2 - offsetHeight / 2, left: position.left - offsetWidth};
                    break;
                  case"top-left":
                    css = {top: position.top + position.height, left: position.left + position.width / 2 - 20};
                    break;
                  case"top-right":
                    css = {top: position.top + position.height, left: position.left - position.width / 2 - offsetWidth / 2 - 35};
                    break;
                  case"right-top":
                    css = {top: position.top + position.height / 2 - 20, left: position.left - offsetWidth};
                    break;
                  default:
                    css = {top: position.top - offsetHeight, left: position.left + position.width / 2 - offsetWidth / 2}
                }
                css.top += "px";
                css.left += "px";
                tooltip.css(css);
              };

              // 观察相关属性
              iAttrs.$observe(type, function (value) {
                scope.tt_content = value;
                !value && scope.tt_isOpen && hide();
              });
              iAttrs.$observe(prefix + "Title", function (value) {
                scope.tt_title = value;
              });
              iAttrs.$observe("contentClass", function (value) {
                value && (scope.tt_contentClass = value);
              });
              iAttrs.$observe(prefix + "Placement", function (value) {
                scope.tt_placement = angular.isDefined(value) ? value : options.placement;
              });
              iAttrs.$observe(prefix + "TemplateId", function (value) {
                scope.tt_templateId = angular.isDefined(value) ? value : options.templateId;
              });
              iAttrs.$observe(prefix + "PopupDelay", function (value) {
                var delay = parseInt(value, 10);
                scope.tt_popupDelay = isNaN(delay) ? options.popupDelay : delay
              });
              iAttrs.$observe("contentHtml", function (value) {
                scope.tt_contentHtml = angular.isDefined(value) ? $parse(value)(scope) : options.contentHtml
              });
              iAttrs[prefix + "TemplateData"] && scope.$watch(iAttrs[prefix + "TemplateData"], function (value) {
                value && (scope.tt_templateData = value);
              });

              // 注销触发器
              var unregisterTriggers = function () {
                y && (iElement.unbind(triggers.show, showTooltipBind), iElement.unbind(triggers.hide, hideTooltipBind));
              };


              // 监听属性触发器
              iAttrs.$observe(prefix + "Trigger", function (val) {
                unregisterTriggers();
                triggers = getTriggers(val);
                if (triggers.show === triggers.hide) {
                  iElement.bind(triggers.show, toggleTooltipBind);
                  $document.bind(triggers.show, closeTooltipBind);
                  triggers.show !== "mouseenter" && (E = false);
                } else {
                  iElement.bind(triggers.show, showTooltipBind);
                  iElement.bind(triggers.hide, hideTooltipBind);
                }
                y = true;
              });

              function closeTooltipBind(event) {
                if (!angular.element('div[' + directiveName + '-popup]').has(angular.element(event.target)).length && scope.tt_isOpen) {
                  hideTooltipBind();
                }
              }

              // 监听属性是否有动画效果
              var animation = scope.$eval(iAttrs[prefix + 'Animation']);
              scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation;
              // 监听属性元素插入位置
              iAttrs.$observe(prefix + "AppendToBody", function (value) {
                appendToBody = angular.isDefined(value) ? $parse(value)(scope) : appendToBody;
              });
              appendToBody && scope.$on("$locationChangeSuccess", function () {
                scope.tt_isOpen && hide();
              });

              // 确保工具提示被销毁和删除。
              scope.$on('$destroy', function () {
                $timeout.cancel(transitionTimeout);
                $timeout.cancel(popupTimeout);
                unregisterTriggers();
                removeTooltip();
              });
            }
          }
        }
      }
    }];
  }

  /** @ngInject */
  function cbTooltipPopup($templateCache, $compile, $q, $http) {
    var template = getTemplate($templateCache, $compile, $q, $http);
    return {
      restrict: "A",
      replace: true,
      scope: {
        content: "@",
        placement: "@",
        templateId: "@",
        templateData: "=",
        contentClass: "@",
        contentHtml: "@"
      },
      templateUrl: "app/components/cbTooltip/cbTooltip.html",
      link: function (scope, iElement) {
        template.init(scope, iElement, "tooltip");
      }
    }
  }

  /** @ngInject */
  function cbTooltip($cbtooltip) {
    return $cbtooltip("cbTooltip", "tooltip", "mouseenter");
  }

  /** @ngInject */
  function cbPopover($cbtooltip) {
    return $cbtooltip("cbPopover", "popover", "mouseenter");
  }

  /** @ngInject */
  function cbPopoverPopup($templateCache, $compile, $q, $http) {
    var template = getTemplate($templateCache, $compile, $q, $http);
    return {
      restrict: "A",
      replace: true,
      scope: {
        content: "@",
        placement: "@",
        templateId: "@",
        templateData: "=",
        contentClass: "@",
        contentHtml: "@"
      },
      templateUrl: "app/components/cbTooltip/cbPopover.html",
      link: function (scope, iElement) {
        template.init(scope, iElement, "popover");
      }
    }
  }
})();
