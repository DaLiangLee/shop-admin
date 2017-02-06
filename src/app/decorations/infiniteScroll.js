/**
 * Created by Administrator on 2017/2/6.
 */
(function() {
  'use strict';
  /**
   * 实现页面滚动到底自动加载数据的功能
   */
  angular
    .module('shopApp')
    .value('THROTTLE_MILLISECONDS', null)
    .directive("cbInfiniteScroll",cbInfiniteScroll);

  /** @ngInject */
  function cbInfiniteScroll($rootScope, $window, $interval, THROTTLE_MILLISECONDS){
    return {
      restrict: 'A',
      scope: {
        infiniteScroll: '&',    // 滚动时执行函数
        infiniteScrollContainer: '=',   //
        infiniteScrollDistance: '=',    // 延迟加载
        infiniteScrollDisabled: '=',    // 禁止滚动
        infiniteScrollUseDocumentBottom: '=',
        infiniteScrollListenForEvent: '@'
      },
      link: function(scope, iElement, iAttrs){
        var windowElement = angular.element($window);
        var scrollDistance = null;
        var scrollEnabled = null;
        var checkWhenEnabled = null;
        var container = null;
        var immediateCheck = true;
        var useDocumentBottom = false;
        var unregisterEventListener = null;
        var checkInterval = false;

        function height(element) {
          const el = element[0] || element;
          if (isNaN(el.offsetHeight)) {
            return el.document.documentElement.clientHeight;
          }
          return el.offsetHeight;
        }

        function pageYOffset(element) {
          const el = element[0] || element;

          if (isNaN(window.pageYOffset)) {
            return el.document.documentElement.scrollTop;
          }
          return el.ownerDocument.defaultView.pageYOffset;
        }

        function offsetTop(element) {
          if (!(!element[0].getBoundingClientRect || element.css('none'))) {
            return element[0].getBoundingClientRect().top + pageYOffset(element);
          }
          return undefined;
        }

        function defaultHandler() {
          var containerBottom;
          var elementBottom;
          if (container === windowElement) {
            containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
            elementBottom = offsetTop(iElement) + height(iElement);
          } else {
            containerBottom = height(container);
            var containerTopOffset = 0;
            if (offsetTop(container) !== undefined) {
              containerTopOffset = offsetTop(container);
            }
            elementBottom = (offsetTop(iElement) - containerTopOffset) + height(iElement);
          }

          if (useDocumentBottom) {
            elementBottom = height((iElement[0].ownerDocument || iElement[0].document).documentElement);
          }

          var remaining = elementBottom - containerBottom;
          var shouldScroll = remaining <= (height(container) * scrollDistance) + 1;

          if (shouldScroll) {
            checkWhenEnabled = true;

            if (scrollEnabled) {
              if (scope.$$phase || $rootScope.$$phase) {
                scope.infiniteScroll();
              } else {
                scope.$apply(scope.infiniteScroll);
              }
            }
          } else {
            if (checkInterval) { $interval.cancel(checkInterval); }
            checkWhenEnabled = false;
          }
        }

        var handler = (THROTTLE_MILLISECONDS != null) ?
          _.debounce(defaultHandler, THROTTLE_MILLISECONDS) :
          defaultHandler;

        function handleDestroy() {
          container.off('scroll', handler);
          if (unregisterEventListener != null) {
            unregisterEventListener();
            unregisterEventListener = null;
          }
          if (checkInterval) {
            $interval.cancel(checkInterval);
          }
        }


        function handleInfiniteScrollDistance(v) {
          scrollDistance = parseFloat(v) || 0;
        }

        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);

        function handleInfiniteScrollDisabled(v) {
          scrollEnabled = !v;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            handler();
          }
        }

        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);

        function handleInfiniteScrollUseDocumentBottom(v) {
          useDocumentBottom = v;
        }

        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);

        function changeContainer(newContainer) {
          if (container != null) {
            container.off('scroll', handler);
          }
          console.log(newContainer);

          container = newContainer;
          if (newContainer != null) {
            container.on('scroll', handler);
          }
        }

        changeContainer(windowElement);

        if (scope.infiniteScrollListenForEvent) {
          unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
        }

        function handleInfiniteScrollContainer(newContainer) {
          if ((!(newContainer != null)) || newContainer.length === 0) {
            return;
          }

          var newerContainer;

          if (newContainer.nodeType && newContainer.nodeType === 1) {
            newerContainer = angular.element(newContainer);
          } else if (typeof newContainer.append === 'function') {
            newerContainer = angular.element(newContainer[newContainer.length - 1]);
          } else if (typeof newContainer === 'string') {
            newerContainer = angular.element(newContainer);
          } else {
            newerContainer = newContainer;
          }

          if (newerContainer == null) {
            throw new Error('invalid infinite-scroll-container attribute.');
          }
          changeContainer(newerContainer);
        }

        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);

        // infinite-scroll-parent establishes this element's parent as the
        // container infinitely scrolled instead of the whole window.
        if (iAttrs.infiniteScrollParent != null) {
          changeContainer(angular.element(iElement.parent()));
        }

        // infinte-scoll-immediate-check sets whether or not run the
        // expression passed on infinite-scroll for the first time when the
        // directive first loads, before any actual scroll.
        if (iAttrs.infiniteScrollImmediateCheck != null) {
          immediateCheck = scope.$eval(iAttrs.infiniteScrollImmediateCheck);
        }

        function intervalCheck() {
          if (immediateCheck) {
            handler();
          }
          return $interval.cancel(checkInterval);
        }

        checkInterval = $interval(intervalCheck);

        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          handleDestroy();
        });
      }
    };
  }
})();
