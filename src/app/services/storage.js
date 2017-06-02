/**
 * Created by Administrator on 2017/4/24.
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
    .factory('localstorage', localstorage)
    .factory('sessionstorage', sessionstorage);

  /** @ngInject */
  function sessionstorage($window) {
    if(!$window.sessionStorage){
      return ;
    }
    return {
      get: function (key) {
        return angular.fromJson($window.sessionStorage.getItem(key));
      },
      set: function (key, value) {
        $window.sessionStorage.setItem(key, angular.toJson(value));
      },
      remove: function (key) {
        $window.sessionStorage.removeItem(key);
      },
      clear: function () {
        $window.sessionStorage.clear();
      }
    }
  }

  /** @ngInject */
  function localstorage($window) {
    if(!$window.localstorage){
      return ;
    }
    return {
      get: function (key) {
        return angular.fromJson($window.localstorage.getItem(key));
      },
      set: function (key, value) {
        $window.localstorage.setItem(key, angular.toJson(value));
      },
      remove: function (key) {
        $window.localstorage.removeItem(key);
      },
      clear: function () {
        $window.localstorage.clear();
      }
    }
  }
})();
