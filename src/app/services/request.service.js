/**
 * Created by Administrator on 2016/11/17.
 */
(function() {
  'use strict';
  /**
   * requestService api请求服务
   * @method setConfig             设置配置    广播一个事件configurationChanged 供其他调用
   * @method getConfig             获取配置
   * @method getAPIConfig          获取api地址供其他地方调用
   * @method getUserConfig         获取用户信息相关
   */
  angular
    .module('shopApp')
    .service('requestService', requestService);

  /** @ngInject */
  function requestService($http, webSiteApi, configuration) {
    var URL = configuration.getAPIConfig();
    var doRequest = function(method, url, data){
      return $http({
        method : method,
        url : url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: data
      });
    };
    this.request = function(parent, current){
      var API = webSiteApi.WEB_SITE_API[parent][current];
      var result = {};
      angular.forEach(API, function (key, value) {
        result[value] = function (data) {
          return doRequest(key.type, URL + key.url, data);
        };
      });
      return result;
    }
  }

})();
