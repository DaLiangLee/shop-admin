/**
 * Created by Administrator on 2016/10/10.
 */

(function() {
    'use strict';
    angular.module('shopApp')
        .run(permissionsRun)
        .run(configurationRun)
        .run(backRun)
        .run(routerRun);

        /** @ngInject */
        function permissionsRun(permissions) {
          permissions.setPermissions(userPermissionList.menu);
        }

        /** @ngInject */
        function configurationRun(configuration) {
          configuration.setConfig({
            api: userPermissionList.api,
            avatar: userPermissionList.avatar,
            message: userPermissionList.message,
            role: userPermissionList.role,
            username: userPermissionList.username
          });
        }

        /** @ngInject */
        function backRun($rootScope, previousState){
          //back button function called from back button's ng-click="back()"
          $rootScope.back = function(router) {//实现返回的函数
            // 如果这2个值为空，一定是当前页面刷新，需要手动返回上一页
            var state,params;
            if(_.isEmpty(previousState.get().name) && _.isEmpty(previousState.get().params)){
              // 只设置状态，不设置参数给默认值为对象，防止路由跳转BUG
              params = angular.extend({}, router.params);
              state = router.name;
            }else{
              state = previousState.get().name;
              params = undefined;
            }
            previousState.go(state, params);
          };
        }

        /** @ngInject */
        function routerRun($rootScope, $state, $log, permissions, preferencenav) {
          $rootScope.userPermissionList = permissions.getPermissions();
          $rootScope.$state = $state;
          /**
           * event, toState, toParams, fromState, fromParams
           *
           */
          var stateChangeStart = $rootScope.$on('$stateChangeStart', function(event, toState){
            /*$log.debug('event',event);
             $log.debug('toState',toState);
             $log.debug('toParams',toParams);
             $log.debug('fromState',fromState);
             $log.debug('fromParams',fromParams);*/
            preferencenav.setPreferences(toState);
            /**
             * 如果没有权限访问会跳到没有权限403页面
             */
            if(!permissions.getPermissions(toState.permission)){
              return $state.go('forbidden');
            }
          });
          /**
           * 路由加载出错
           * @type {any}
           */
          var stateChangeError = $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
             $log.debug('event',event);
             $log.debug('toState',toState);
             $log.debug('toParams',toParams);
             $log.debug('fromState',fromState);
             $log.debug('fromParams',fromParams);
             $log.debug('error',error);
          });
          /**
           * 销毁操作
           */
          $rootScope.$on('$destroy',function() {
            stateChangeStart();
            stateChangeStart = null;
            stateChangeError();
            stateChangeError = null;
          });
        }

    /**
     * 手动启动angular
     * 保证在Angular运行之前获取到permission的映射关系
     */
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['shopApp']);
    });
})();
