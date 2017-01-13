/**
 * Created by Administrator on 2016/11/1.
 */
/**
 * 让ie8，9支持input和textarea的Placeholder属性
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbPlaceholder', cbPlaceholder);

  /** @ngInject */
  function cbPlaceholder($compile, $document) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, iElement, iAttrs) {
        var input = $document[0].createElement('input'),
            textarea = $document[0].createElement('textarea'),
            isSupportPlaceholder = 'placeholder' in input || 'placeholder' in textarea;
        if (!isSupportPlaceholder) {
          var fakePlaceholder = angular.element(
            '<span class="placeholder">' + iAttrs['placeholder'] + '</span>');
          fakePlaceholder.on('click', function (e) {
            e.stopPropagation();
            iElement.focus();
          });
          fakePlaceholder.css({'position': 'absolute', 'color': '#ccc'});
          iElement.before(fakePlaceholder);
          $compile(fakePlaceholder)(scope);
          iElement.parent().css('position', 'relative');
          iElement.on('focus', function () {
            fakePlaceholder.hide();
          }).on('blur', function () {
            if (iElement.val() === '') {
              fakePlaceholder.show();
            }
          });
          scope.getElementPosition = function () {
            return iElement.position();
          };
          if(iElement[0].type === 'textarea'){
            scope.$watch(scope.getElementPosition, function () {
              fakePlaceholder.css({
                'top': iElement.position().top + 'px',
                'left': '0px'
              });
            }, true);
          }else{
            scope.$watch(scope.getElementPosition, function () {
              fakePlaceholder.css({
                'top': iElement.position().top + 'px',
                'left': iElement.position().left + 'px'
              });
            }, true);
          }
          scope.getElementHeight = function () {
            return iElement.outerHeight();
          };
          if(iElement[0].type === 'textarea'){
            scope.$watch(scope.getElementHeight, function () {
              fakePlaceholder.css('line-height', '44px');
            });
          }else{
            scope.$watch(scope.getElementHeight, function () {
              fakePlaceholder.css('line-height', iElement.outerHeight() + 'px');
            });
          }
          if (iElement.css('font-size')) {
            fakePlaceholder.css('font-size', iElement.css('font-size'));
          }
          if (iElement.css('text-indent')) {
            fakePlaceholder.css('text-indent',
              parseInt(iElement.css('text-indent')) +
              parseInt(iElement.css('border-left-width'))
            );
          }
          if (iElement.css('padding-left')) {
            fakePlaceholder.css('padding-left', iElement.css('padding-left'));
          }
          if (iElement.css('margin-top')) {
            fakePlaceholder.css('margin-top', iElement.css('margin-top'));
          }
          scope.isElementVisible = function () {
            return iElement.is(':visible');
          };
          scope.$watch(scope.isElementVisible, function () {
            var displayVal = iElement.is(':visible') ? 'block' : 'none';
            fakePlaceholder.css('display', displayVal);
            if (displayVal === 'blcok' && iElement.val()) {
              fakePlaceholder.hide();
            }
          });
          scope.hasValue = function () {
            return iElement.val();
          };
          scope.$watch(scope.hasValue, function () {
            if (iElement.val()) {
              fakePlaceholder.hide();
            }
          });
        }
      }
    }
  }
})();
