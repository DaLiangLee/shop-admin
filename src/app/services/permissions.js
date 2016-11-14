/**
 * Created by Administrator on 2016/10/13.
 */
(function() {
    'use strict';
    /**
     * permissions 权限服务
     * @method setPermissions        设置权限列表 广播一个事件permissionsChanged 供其他调用
     * @method getPermissions        获取权限列表
     * @method findPermissions       查找是否拥有权限  菜单分组名 当前id
     */
    angular
        .module('shopApp')
        .factory('permissions', permissions);

    /** @ngInject */
    function permissions($rootScope) {
        var permissionList;
        return {
            setPermissions: function(permissions) {
                permissionList = permissions;
                $rootScope.$broadcast('permissionsChanged');
            },
            getPermissions: function() {
                return permissionList;
            },
            findPermissions: function (permission) {
                var result = false;
                /**
                 * 控制台权限
                 */
                if(permission.category === "desktop" && permission.parentid === 1 && permission.sectionid === 2){
                    return true;
                }
                /**
                 * 查找权限
                 * @param item
                 * @param childrenName
                 * @param parent
                 */
                var findItem = function (item, childrenName) {
                    /**
                     * 如果找不到category 就直接返回 避免死循环报错
                     */
                    if(item.category !== permission.category){
                        return ;
                    }else{
                        /**
                         * 比对id和父id  如果有就直接返回，没有就继续递归查询
                         */
                        if(item.id === permission.sectionid && item.parentid === permission.parentid){
                            result = true;
                            return ;
                        }
                    }
                    /**
                     * 循环递归查询子项
                     */
                    var subItems = item[childrenName] || [];
                    angular.forEach(subItems, function (subItem) {
                        findItem(subItem, childrenName);
                    });
                };
                /**
                 * 循环调用
                 */
                angular.forEach(permissionList.items, function (item) {
                    findItem(item, 'items');
                });
                return result;
            }
        };
    }

})();