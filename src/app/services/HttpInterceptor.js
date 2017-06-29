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
    .config(httpProviderConfig);

  /** @ngInject */
  function httpProviderConfig($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push(HttpInterceptor);
  }

  /** @ngInject */
  function HttpInterceptor($q, $log, $window, $timeout, cbAlert, configuration) {
    return {
      request: function (config) {
        return config;
      },
      requestError: function (err) {
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
            $log.error('-1', err.data);
            break;
          case 401:
            cbAlert.error("系统提醒", "没有访问权限");
            $log.error('401', err.data);
            break;
          case 403:
            $timeout(function(){
              cbAlert.determine("系统提醒", "未登陆", function(){
                $window.location.href = configuration.getAPIConfig(true) + '/logout';
              }, 'error');
            }, 1);
            $log.error('403', err.data);
            break;
          case 404:
            $log.error('404', err.data);
            cbAlert.error("系统提醒", "找不到资源");
            break;
          case 500:
            $log.error('500', err.data);
            cbAlert.error("系统提醒", "系统运行错误");
            break;
          default:
            $log.error('default', err.data);
            cbAlert.error("系统提醒", "发生错误，代码：" + err.status);
        }
        $log.error(err.data);
        return $q.reject(err);
      }
    };
  }

})();
