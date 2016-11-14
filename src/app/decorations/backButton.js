/**
 * Created by Administrator on 2016/10/11.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .service("previousState", previousState)
        .directive("cbBackButton",cbBackButton);

    /** @ngInject */
    function previousState($rootScope, $document, $state, $stateParams, $log){
        var previous = null,memos = {},lastPrevious = null;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        var stateChangeStart = $rootScope.$on("$stateChangeStart", function(evt, toState, toStateParams, fromState, fromStateParams) {
            lastPrevious = previous;
            previous = {
                state: fromState,
                params: fromStateParams
            };
        });
        var stateChangeError = $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            previous = lastPrevious;
            lastPrevious = null;
            // 出错提醒
          $log.debug("ERROR " + error + " . From state: " + fromState.name + " to state: " + toState.name)
        });
        var stateChangeSuccess = $rootScope.$on("$stateChangeSuccess", function() {
            // 保证每次切换路由页面内容都是从顶部开始

            if($document[0].getElementById('j-viewFramework-scrollTop')){
                $document[0].getElementById('j-viewFramework-scrollTop').scrollTop = 0;
            }
            lastPrevious = null;
        });
        var previousState = {
            get: function(memoName) {
                return memoName ? memos[memoName] : previous;
            },
            go: function(name, params) {
                var to;
                if(angular.isUndefined(params)){
                    to = previousState.get(name);
                }else{
                    to = {
                        "state": name,
                        "params": params
                    };
                }
                return $state.go(to.state, to.params)
            },
            memo: function(memoName) {
                memos[memoName] = previous;
            }
        };
        /**
         * 销毁操作
         */
        $rootScope.$on('$destroy',function() {
          stateChangeStart();
          stateChangeStart = null;
          stateChangeError();
          stateChangeError = null;
          stateChangeSuccess();
          stateChangeSuccess = null;
        });
        return previousState;
    }

    /** @ngInject */
    function cbBackButton($rootScope){
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, iElement, iAttrs){
                // 获取返回上一页路由信息
                var router = scope.$eval(iAttrs.cbBackButton);
                iElement.on('click',function(){
                    if(angular.isUndefined(router)){
                        throw new Error("没有填写返回上一页路由信息");
                    }
                    $rootScope.back(router);
                });
            }
        };
    }
})();
