/**
 * Created by Administrator on 2016/10/11.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory("previousState", previousState)
        .directive("cbBackButton",cbBackButton);

    /** @ngInject */
    function previousState(){
        var previous = null;
        return {
          get: function() {
            return previous;
          },
          set: function (state) {
            if(previous === null){
              previous = state;
            }
          },
          remove: function () {
            previous = null;
          }
        };
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
