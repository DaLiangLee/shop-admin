/**
 * Created by Administrator on 2017/1/2.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('exportData', exportData);
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

  /**
   * 导出数据  exportData
   * 1，exportData上挂载api地址 以,隔开
   * 2，params 上双向绑定参数地址，实时获取用户选择的数据
   * 3，监听数据变化，赋值给href然后点击点击按钮导出
   */


  /** @ngInject */
  function exportData(webSiteApi, configuration) {
    function removePage(value){
      var obj = angular.copy(value);
      delete obj.page;
      delete obj.pageSize;
      return toKeyValue(obj);
    }
    function getRequest(api){
      var WEB_SITE_API = webSiteApi.WEB_SITE_API;
      api = api.split(',');
      return configuration.getAPIConfig() + WEB_SITE_API[api[0]][api[1]][api[2]].url;
    }
    return {
      restrict: "A",
      scope: {
        params: "="
      },
      link: function(scope, iElement, iAttrs){
        var request = getRequest(iAttrs.exportData);
        var params = scope.$watch('params', function (value) {
          (value && removePage(value)) && iElement.attr('href', request+"?"+removePage(value));
        });
        /**
         * 销毁操作
         */
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          params();
          request = null;
        });
      }
    }
  }
})();
