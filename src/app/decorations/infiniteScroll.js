/**
 * Created by Administrator on 2017/2/6.
 */
(function () {
  'use strict';
  /**
   * 实现页面滚动到底自动加载数据的功能
   */
  angular
    .module('shopApp')
    .value('THROTTLE_MILLISECONDS', 250)
    .directive("cbInfiniteScroll", cbInfiniteScroll);

  /** @ngInject */
  function cbInfiniteScroll($rootScope, $window, $document, $interval, THROTTLE_MILLISECONDS) {
    return {
      restrict: 'A',
      scope: {
        infiniteScroll: '&',    // 滚动时执行函数
        infiniteScrollContainer: '=',   // 滚动对象
        infiniteScrollDistance: '=',    // 延迟加载
        infiniteScrollDisabled: '=',    // 禁止滚动
        infiniteScrollListenForEvent: '@'
      },
      link: function (scope, iElement, iAttrs) {
        var query = angular.element;
        var win, doc, win_height, doc_height, win_top, scrollDistance = 0;
        if(false){
          win = query($window);
          doc = query($document);
        }else{
          doc = query(iElement);
          win = doc.parent();
        }
        win_height = win.height();
        win_top = win.offset().top;

        var handler = (THROTTLE_MILLISECONDS != null) ?
          _.debounce(defaultHandler, THROTTLE_MILLISECONDS) :
          defaultHandler;

        /**
         * 事件函数
         */
        function defaultHandler() {
          var containerBottom = doc.height();
          var containerTopOffset = doc.offset().top;
          var elementBottom = (win_top - containerTopOffset) + win_height;
          var remaining = elementBottom - containerBottom;
          console.log(remaining, elementBottom , containerBottom , win_top, win_height, containerTopOffset);

          var shouldScroll = remaining <= (win_height * scrollDistance) + 1;
          if(shouldScroll){
            if (scope.$$phase || $rootScope.$$phase) {
              scope.infiniteScroll();
            } else {
              scope.$apply(scope.infiniteScroll);
            }
          }
        }

        /**
         * 滚动距离
         * @param num
         */
        function handleInfiniteScrollDistance(num) {
          scrollDistance = parseFloat(num) || 0;
        }
        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);


        function handleInfiniteScrollDisabled(flag) {
          flag && win.on('scroll', handler);
        }

        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);


        scope.infiniteScroll();

        function handleDestroy(){
          console.log('我背销毁了');
          win.off('scroll', handler);
        }

        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          handleDestroy();
        });
      }
    }
  }


  /** @ngInject */
  /*function cbInfiniteScroll($rootScope, $window, $interval, THROTTLE_MILLISECONDS){
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
   var windowElement = angular.element(iElement);
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
   console.log(1);

   var containerBottom;
   var elementBottom;

   if (container !== windowElement) {
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
   console.log('remaining', elementBottom,containerBottom);
   var remaining = elementBottom - containerBottom;
   var shouldScroll = remaining <= (height(container) * scrollDistance) + 1;
   console.log(shouldScroll,scrollEnabled);
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






   function handleInfiniteScrollDistance(v) {
   scrollDistance = parseFloat(v) || 0;
   }

   scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
   handleInfiniteScrollDistance(scope.infiniteScrollDistance);

   function handleInfiniteScrollDisabled(flag) {
   console.log('handleInfiniteScrollDisabled',flag);
   scrollEnabled = !flag;
   if (scrollEnabled && checkWhenEnabled) {
   checkWhenEnabled = false;
   handler();
   }
   }

   scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
   handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);

   function handleInfiniteScrollUseDocumentBottom(v) {
   console.log('handleInfiniteScrollUseDocumentBottom', v);
   useDocumentBottom = v;
   }

   scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
   handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);

   function changeContainer(newContainer) {
   console.log('changeContainer', container);
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


   // 确保工具提示被销毁和删除。
   scope.$on('$destroy', function() {
   handleDestroy();
   });
   }
   };
   }*/
})();
