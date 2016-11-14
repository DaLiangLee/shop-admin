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
                if(angular.isUndefined(iAttrs.cbAccessControl) || angular.isUndefined(iAttrs.parentid) || angular.isUndefined(iAttrs.sectionid)){
                    throw Error('没有写category或父id或当前id');
                }
                var category = iAttrs.cbAccessControl,
                    parentid = iAttrs.parentid*1,
                    sectionid = iAttrs.sectionid*1;
                !permissions.findPermissions({
                    parentid: parentid,
                    category: category,
                    sectionid: sectionid
                }) && iElement.remove();
            }
        };
    }
})();