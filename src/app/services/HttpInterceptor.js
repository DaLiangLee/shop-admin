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
        .service('httpInterceptorServiceError', httpInterceptorServiceError)
        .config(httpProviderConfig);

    /** @ngInject */
    function httpProviderConfig($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['From'] = '0';
        $httpProvider.interceptors.push(HttpInterceptor);
    }

    /** @ngInject */
    function HttpInterceptor($q, $log, $window, httpInterceptorServiceError, configuration) {
        return {
            request: function (config) {
                return config;
            },
            requestError: function (err) {
                httpInterceptorServiceError.error("请检查您的网络连接情况", "系统提醒");
                return $q.reject(err);
            },
            response: function (res) {
                return res;
            },
            responseError: function (err) {
                switch (err.status) {
                    case -1:
                        httpInterceptorServiceError.error("远程服务器无响应", "系统提醒");
                        $log.error('-1', err.data);
                        break;
                    case 401:
                        httpInterceptorServiceError.error("没有访问权限", "系统提醒");
                        $log.error('401', err.data);
                        break;
                    case 403:
                        httpInterceptorServiceError.error("未登陆", "系统提醒").then(function () {
                            $window.location.href = configuration.getAPIConfig(true) + '/logout';
                        });
                        $log.error('403', err.data);
                        break;
                    case 404:
                        $log.error('404', err.data);
                        httpInterceptorServiceError.error("找不到资源", "系统提醒");
                        break;
                    case 500:
                        $log.error('500', err.data);
                        httpInterceptorServiceError.error("系统运行错误", "系统提醒");
                        break;
                    case 0:
                        $log.error('500', err.data);
                        httpInterceptorServiceError.error("网络连接失败", "系统提醒");
                        break;
                    default:
                        $log.error('default', err.data);
                        httpInterceptorServiceError.error("发生错误，代码：" + err.status, "系统提醒");
                }
                $log.error(err.data);
                return $q.reject(err);
            }
        };
    }

    /** @ngInject */
    function httpInterceptorServiceError($rootScope, $q, $window, $animate) {
        // 获取body
        var bodyElement = angular.element($window.document.body);
        var createElement = function (message, title) {
             var str = '<div class="simple-dialog center am-fade-and-scale dialog-error" tabindex="-1" role="dialog" aria-hidden="true">\n' +
                '    <div class="dialog dialog-sm">\n' +
                '        <div class="dialog-content">\n' +
                '            <div class="dialog-header">\n' +
                '                <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
                '                <h4 class="dialog-title">'+title+'</h4>\n' +
                '            </div>\n' +
                '            <div class="dialog-body">\n' +
                '                <div class="icon">\n' +
                '                    <i class="icon-remove-circle"></i>\n' +
                '                </div>\n' +
                '                <div class="text">'+message+'</div>\n' +
                '            </div>\n' +
                '            <div class="dialog-footer">\n' +
                '                <button type="button" aria-label="Close" class="u-btn u-btn-primary u-btn-sm">确 认</button>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>';
            return angular.element(str);
        };
        var backdropElement = null;
        var dialogElement = null;
        this.error = function (message, title) {
            if(backdropElement !== null && dialogElement !== null){
                return ;
            }
            title = title || "系统提醒";
            var deferred = $q.defer();
            var dialogBaseZindex = $rootScope.dialogBaseZindex || 1060;
            backdropElement = angular.element('<div class="simple-dialog-backdrop am-fade"/>');
            dialogElement = createElement(message, title);
            backdropElement.css({ 'z-index': dialogBaseZindex  - 10 });
            dialogElement.css({ display: 'block', 'z-index': dialogBaseZindex });
            $animate.enter(backdropElement, bodyElement, null);
            $animate.enter(dialogElement, bodyElement, null);
            dialogElement.on('click', '[aria-label="Close"]', function () {
                deferred.resolve();
                destroy();
            });
            function destroy() {
                backdropElement && backdropElement.remove();
                dialogElement && dialogElement.remove();
                backdropElement = null;
                dialogElement = null;
            }
            return deferred.promise;
        }
    }
})();
