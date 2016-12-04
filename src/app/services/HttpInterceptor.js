/**
 * Created by Administrator on 2016/12/4.
 */
(function () {
  'use strict';
  /**
   * HttpInterceptor 统一处理 HTTP 的错误
   * @method setConfig             设置配置    广播一个事件configurationChanged 供其他调用
   * @method getConfig             获取配置
   * @method getAPIConfig          获取api地址供其他地方调用
   * @method getUserConfig         获取用户信息相关
   */
  angular
    .module('shopApp')
    .factory('HttpInterceptor', HttpInterceptor)
    .config(['$httpProvider', function($httpProvider){
      $httpProvider.interceptors.push(HttpInterceptor);
    }]);
  /** @ngInject */
  function HttpInterceptor($q, cbAlert) {
    return {
      request: function (config) {
        return config;
      },
      requestError: function (err) {
        console.log(err);
        cbAlert.error("系统提醒", "请检查您的网络连接情况");
        return $q.reject(err);
      },
      response: function (res) {
        return res;
      },
      responseError: function (err) {
        switch (err.status){
          case -1:
            cbAlert.error("系统提醒", "远程服务器无响应");
            break;
          case 404:
            cbAlert.error("系统提醒", "找不到资源");
            break;
          case 403:
            cbAlert.error("系统提醒", "没有访问权限");
            break;
          case 500:
            cbAlert.error("系统提醒", "系统运行错误");
            break;
          default:
            cbAlert.error("系统提醒", "发生错误，代码：" + err.status);
        }
        return $q.reject(err);
      }
    };
  }

})();
