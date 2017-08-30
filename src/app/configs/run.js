/**
 * Created by Administrator on 2016/10/10.
 */

(function () {
    'use strict';
    angular.module('shopApp')
        .run(permissionsRun)
        .run(configurationRun)
        .run(backRun)
        .run(routerRun);

    /** @ngInject */
    function permissionsRun(permissions) {
        permissions.setPermissions(userPermissionList.permissions);
    }

    /** @ngInject */
    function configurationRun(configuration) {
        configuration.setConfig(
            _.pick(userPermissionList, ['storeid', 'storecode', 'api', 'static', 'avatar', 'message', 'role', 'username', 'menu'])
        );
    }

    /** @ngInject */
    function backRun($rootScope, $state, previousState) {
        //back button function called from back button's ng-click="back()"
        $rootScope.back = function (router) {//实现返回的函数
            // 如果这2个值为空，一定是当前页面刷新，需要手动返回上一页
            var state, params;
            if (previousState.get() === null) {
                // 只设置状态，不设置参数给默认值为对象，防止路由跳转BUG
                params = angular.extend({}, router.params);
                state = router.name;
            } else {
                state = previousState.get().state.name;
                params = previousState.get().params;
            }
            $state.go(state, params);
            previousState.remove()
        };
    }

    /** @ngInject */
    function routerRun($rootScope, $state, $window, $document, $log, permissions, cbAlert, previousState, storageListAndView) {
        $rootScope.userPermissionList = permissions.getPermissions();
        $rootScope.$state = $state;

        /*$rootScope.$on('$viewContentLoading', function(event, viewConfig){
         $log.debug('$viewContentLoading-event', event);
         $log.debug('$viewContentLoading-viewConfig', viewConfig);
         });*/

        /**
         * event, toState, toParams, fromState, fromParams
         *
         */
        /* eslint-disable */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);

            // 离开拦截
            if (fromState.interceptor) {
                event.preventDefault(); // 取消默认跳转行为
                cbAlert.confirm(fromState.interceptorMsg ? fromState.interceptorMsg : '您还没有保存，是否离开', function (isConfirm) {
                    if (isConfirm) {
                        fromState.interceptor = false;
                        $state.go(toState.name, toParams);
                    }
                    cbAlert.close();
                });
            }

            /**
             * 列表切换视图保存数据，如果listAndView不相等，就把storageListAndView数据干掉
             */
            if (!toState.listAndView || fromState.listAndView !== toState.listAndView) {
                storageListAndView.remove();
            }

            // 返回上一页
            if (toState.backspace) {
                previousState.set({
                    state: fromState,
                    params: fromParams
                });
            }


            /**
             * 如果没有权限访问会跳到没有权限403页面
             */
            if (!permissions.findPermissions(toState.permission)) {
                event.preventDefault();// 取消默认跳转行为
                return $state.go('forbidden');
            }
            // 跳转到新页面时滚动到顶部
            $window.scrollTo(0, 0);
        });
        /* eslint-enable */
        /**
         * 路由加载出错
         * @type {any}
         */
        /* eslint-disable */
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
            $log.debug('error', error);
        });
        /* eslint-enable */

        /* eslint-disable */
        $rootScope.$on("$stateChangeSuccess", function () {
            // 保证每次切换路由页面内容都是从顶部开始
            if ($document[0].getElementById('j-viewFramework-scrollTop')) {
                $document[0].getElementById('j-viewFramework-scrollTop').scrollTop = 0;
            }
        });
        /* eslint-enable */

        /**
         * 销毁操作
         */
    }

    //buildstart
    // TODO 注意：调试登录用，buildstart 和 buildend 注释千万别删除，里面东西可以随意修改，
    $.post('http://localhost:3000/shopservice/login', {storecode: 'A3', username: '15871812356', password: '111111'});
    //buildend


    /**
     * TODO 手动启动angular
     * 保证在Angular运行之前获取到permission的映射关系
     */
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['shopApp']);
    });
})();
