/**
 * Created by Administrator on 2016/10/13.
 */
(function () {
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
      setPermissions: function (permissions) {
        permissionList = permissions;
        $rootScope.$broadcast('permissionsChanged');
      },
      getPermissions: function () {
        return permissionList;
      },
      findPermissions: function (permission) {
        /**
         * 没有访问权限和页面没找到做特殊处理
         */
        if (permission === 'forbidden' || permission === 'notfound' || permission === "desktop") {
          return true;
        }
        var forbidden = false;
        if(/\:forbidden$/.test(permission)){
          forbidden = true;
          permission = permission.replace(/\:forbidden$/, "");
        }
        var index = _.findIndex(permissionList, function(item){
          return item === permission;
        });
        if(forbidden){
          return index === -1;
        }
        return index > -1;
      }
    };
  }

})();
