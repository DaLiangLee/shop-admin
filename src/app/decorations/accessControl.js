/**
 * Created by Administrator on 2016/10/11.
 */
(function() {
    'use strict';
    /**
     * 权限控制， 传递栏目id，如果id不存在就删除这个dom
     */
    angular
        .module('shopApp')
        .directive("cbAccessControl",cbAccessControl);

    /** @ngInject */
    function cbAccessControl(permissions){
        return {
            restrict: 'A',
            priority: 2000,
            scope: false,
            link: function(scope, iElement, iAttrs){
                if(angular.isUndefined(iAttrs.cbAccessControl)){
                    throw Error('没有写权限');
                }
                !permissions.findPermissions(iAttrs.cbAccessControl) && iElement.remove();
            }
        };
    }
})();
