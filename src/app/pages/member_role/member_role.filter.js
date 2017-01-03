/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .filter('systemRoleFilter', systemRoleFilter);

    /** @ngInject */
    function systemRoleFilter(viewFrameworkConfigData) {
        return function(id) {
            var str;
            angular.forEach(viewFrameworkConfigData.SIDEBAR_DEFAULT_CONS.navConfig, function(k){
                if(k.category.sectionId === id) {
                    str = k.category.title;
                    return false;
                }
            });
            return str;
        }
    }

})();