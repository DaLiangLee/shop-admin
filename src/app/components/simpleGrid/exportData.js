/**
 * Created by Administrator on 2017/1/2.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('exportData', exportData);


  /** @ngInject */
  function exportData() {
    function toKeyValue(obj) {
      var parts = [];
      angular.forEach(obj, function(value, key) {
        if (angular.isArray(value)) {
          forEach(value, function(arrayValue) {
            parts.push(encodeUriQuery(key, true) +
              (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
          });
        } else {
          parts.push(encodeUriQuery(key, true) +
            (value === true ? '' : '=' + encodeUriQuery(value, true)));
        }
      });
      return parts.length ? parts.join('&') : '';
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function removePage(value){
      var obj = angular.copy(value);
      delete obj.page;
      delete obj.pageSize;
      return toKeyValue(obj);
    }

    return {
      restrict: "A",
      scope: {
        params: "="
      },
      link: function(scope, iElement, iAttrs){
        var request = iAttrs.exportData;
        scope.$watch('params', function (value) {
          (value && removePage(value)) && iElement.attr('href', request+"?"+removePage(value));
        });
      }
    }
  }
})();
