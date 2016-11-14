/**
 * Created by Administrator on 2016/10/11.
 */
(function () {
    'use strict';
    angular
        .module('shopApp')
        .factory('viewFrameworkContributor', viewFrameworkContributor)
        .factory("viewFrameworkSetting", viewFrameworkSetting);
    /** @ngInject */
    function viewFrameworkContributor() {
        var service = {
            sidebarFold: true,
            toggleSidebarStatus: toggleSidebarStatus
        };
        return service;
    }

    function toggleSidebarStatus(status) {
        this.sidebarFold = status;
    }
    /** @ngInject */
    function viewFrameworkSetting($window, $rootScope, $state, $q, viewFrameworkHelper) {
        if(!$rootScope.viewFrameworkConfig){
            var setting = {
                version: null,   //版本
                hideTopbar: false,  //是否隐藏顶栏
                hideSidebar: false, //是否隐藏侧边栏
                disableNavigation: false, //是否禁用导航
                embed: false,  //是否嵌入
                sidebar: "full", //侧边栏显示状态mini收缩full展开
                productId: "", //产品编号
                productNavBar: "col-1", //产品导航栏
                workorderId: "", //工单编号
                topbarSpm: "101",
                sidebarSpm: "102",
                productNavSpm: "103",
                topbarNavLinks: null,
                ramTag: "",
                exclusiveStates: []
            };
            viewFrameworkHelper.init(setting);
            $window.viewFrameworkConfig = $rootScope.viewFrameworkConfig = setting;
        }
        var promise = $q.defer();
        return {
            promise: promise,
            config: $rootScope.viewFrameworkConfig,
            setConfig: function (n, r) {
                r ? $rootScope.viewFrameworkConfig = n : ($rootScope.viewFrameworkConfig = angular.extend($rootScope.viewFrameworkConfig, n),
                    viewFrameworkHelper.init($rootScope.viewFrameworkConfig));
            },
            setVersion: function (n) {
                $rootScope.viewFrameworkConfig.version = n;
                viewFrameworkHelper.init($rootScope.viewFrameworkConfig);
            },
            setShowTopbar: function (e) {
                $rootScope.viewFrameworkConfig.hideTopbar = !e;
            },
            setShowSidebar: function (e) {
                $rootScope.viewFrameworkConfig.hideSidebar = !e;
            },
            setHideTopbar: function (e) {
                $rootScope.viewFrameworkConfig.hideTopbar = e;
            },
            setHideSidebar: function (e) {
                $rootScope.viewFrameworkConfig.hideSidebar = e;
            },
            setDisableNavigation: function (e) {
                $rootScope.viewFrameworkConfig.disableNavigation = e;
            },
            setProductId: function (e) {
                $rootScope.viewFrameworkConfig.productId = e;
            },
            setSidebar: function (e) {
                $rootScope.viewFrameworkConfig.sidebar = e;
            },
            setProductNavBar: function (e) {
                $rootScope.viewFrameworkConfig.productNavBar = e;
            },
            setWorkorderId: function (e) {
                $rootScope.viewFrameworkConfig.workorderId = e;
            },
            setExclusiveStates: function (e) {
                $rootScope.viewFrameworkConfig.exclusiveStates = e;
            },
            setTopbarNavLinks: function (e) {
                $rootScope.viewFrameworkConfig.topbarNavLinks = e;
            },
            setRamTag: function (e) {
                $rootScope.viewFrameworkConfig.ramTag = e;
            },
            onReady: function (e) {
                promise.promise.then(function () {
                    e();
                });
            },
            isExclusiveOperation: function () {
                var r = $rootScope.viewFrameworkConfig.exclusiveStates,
                    i = false;
                return angular.forEach(r, function (e) {
                    !i && $state.includes(e) && (i = true)
                }), i
            }
        }
    }
})();