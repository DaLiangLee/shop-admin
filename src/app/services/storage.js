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
    .factory('cachestorage', cachestorage)
    .factory('sessionstorage', sessionstorage);

  /** @ngInject */
  function cachestorage() {
      var CACHE_STORAGE = {};
      return {
          get: function (key) {
              return CACHE_STORAGE[key];
          },
          set: function (key, value) {
              CACHE_STORAGE[key] = value;
          },
          remove: function (key) {
              delete CACHE_STORAGE[key];
          },
          clear: function () {
              CACHE_STORAGE = {};
          }
      }
  }

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
    if(!$window.localStorage){
      return ;
    }
    return {
      get: function (key) {
        return angular.fromJson($window.localStorage.getItem(key));
      },
      set: function (key, value) {
        $window.localStorage.setItem(key, angular.toJson(value));
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      },
      clear: function () {
        $window.localStorage.clear();
      }
    }
  }
})();
