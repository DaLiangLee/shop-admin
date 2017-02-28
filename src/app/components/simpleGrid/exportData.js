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
      _.forEach(obj, function(value, key) {
        if (_.isArray(value)) {
          _.forEach(value, function(arrayValue) {
            parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
          });
        } else {
          parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
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
    function removePage(data){
      var params = {};
      angular.forEach(data, function (key, value) {
        if(value !== "page" && value !== "pageSize"){
          angular.isDefined(key) && (params[value] = key);
        }
      });
      return toKeyValue(params);
    }
    function getRequest(api){
      var WEB_SITE_API = webSiteApi.WEB_SITE_API;
      api = api.split(',');
      if(api.length !== 3){
        throw Error("传递配置参数不是3个");
      }
      var params = WEB_SITE_API[api[0]][api[1]][api[2]];
      if(_.isEmpty(params)){
        throw Error("api.js配置和传入参数不对应");
      }
      return configuration.getAPIConfig() + params.url;
    }
    return {
      restrict: "A",
      scope: {
        params: "="
      },
      link: function(scope, iElement, iAttrs){
        var request = _.isEmpty(removePage(scope.params)) ? getRequest(iAttrs.exportData) : getRequest(iAttrs.exportData)+"?"+removePage(scope.params);
        iElement.attr('href', request);
      }
    }
  }
})();
