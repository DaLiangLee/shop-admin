/**
 * Created by Administrator on 2016/10/21.
 */
(function() {
    'use strict';
    /**
     * configuration 配置服务
     * @method setConfig             设置配置    广播一个事件configurationChanged 供其他调用
     * @method getConfig             获取配置
     * @method getAPIConfig          获取api地址供其他地方调用
     * @method getUserConfig         获取用户信息相关
     */
    angular
        .module('shopApp')
        .factory('configuration', configuration);

    /** @ngInject */
    function configuration($rootScope) {
        var config;
        return {
            setConfig: function(data) {
                config = data;
                $rootScope.$broadcast('configurationChanged');
            },
            getConfig: function () {
                return config;
            },
            getMenu: function () {
              return config.menu;
            },
            getAPIConfig: function(admin) {
                /**
                 * 如果有传这个就表示是logout
                 */
                return admin ? (config.api || "") : (config.api ? config.api + "/admin" : "/admin");
            },
            getStatic: function(){
              return (angular.isUndefined(config.static) || config.static == "") ? "" : config.static;
            },
            getUserConfig: function() {
                return {
                    "username": config.username,
                    "role": config.role,
                    "avatar": config.avatar
                };
            },
            getMessage: function() {
                return config.message || [];
            }
        };
    }

})();
