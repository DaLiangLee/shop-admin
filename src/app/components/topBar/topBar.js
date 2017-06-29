/**
 * Created by Administrator on 2016/10/11.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbShopTopbar', cbShopTopbar);
        //.directive('cbShopTopbarSearch', cbShopTopbarSearch);

    /** @ngInject */
    function cbShopTopbar(shopHome, viewFrameworkConfigData, configuration, shophomeService){

        // // 获取sessionStorage中的缓存
        // function getSessionStorage(item) {
        //     if (!window.sessionStorage || !sessionStorage.getItem(item)) {
        //         return;
        //     }
        //     return JSON.parse(sessionStorage.getItem(item));
        // }

        /**
         * 默认数据
         * @type {any}
         */
        var DEFAULT_DATA = viewFrameworkConfigData;
        return {
            restrict: "A",
            replace: true,
            scope: {
                workorderId: "=",
                productId: "=",
                topbarNavLinks: "="
            },
            templateUrl: "app/components/topBar/topBar.html",
            link: function(scope) {

                shophomeService.getInfo().then(function(results) {
                    scope.navLinks.storeName = results.data.store.storename;
                });

                scope.navLinks = DEFAULT_DATA.TOPBAR_DEFAULT_CONS.navLinks;
                scope.navLinks.user.account = configuration.getUserConfig();

                angular.forEach(scope.navLinks.user.links, function (item) {
                    item.href = configuration.getAPIConfig(true)+item.href;
                });
                scope.messages = {
                    "messageList": configuration.getMessage(),
                    "total": configuration.getMessage().length
                };
                scope.readMessage = function () {

                };
            }
        }
    }

    /** @ngInject */
    /*function cbShopTopbarSearch($timeout, $window){
        return {
            restrict: "A",
            scope: {
                searchLink: "="
            },
            templateUrl: "app/components/topBar/topBarSearch.html",
            transclude: false,
            link: function (scope, iElement, iAttrs) {
                var iEle = angular.element(iElement),
                    doc = angular.element(document);
                // 点击document关闭输入框
                function close(obj) {
                    angular.element(obj.target).closest(".m-topbar-search").length == 0 && $timeout(function () {
                        scope.dropdownOpen = false;
                    })
                }
                scope.model = {askInput: ""};
                iAttrs.$observe("searchUrl", function (e) {
                    e && (scope.searchUrl = e)
                });
                iEle.on("keypress", ".topbar-search-ask", function (e) {
                    e.keyCode == 13 && $window.open(scope.searchUrl + scope.model.askInput, "_blank");
                });
                scope.isActive = false;
                scope.activeInput = function () {
                    scope.isActive = true;
                };
                scope.inactiveInput = function () {
                    $timeout(function () {
                        scope.isActive = false;
                    }, 150);
                };
                scope.searchClick = function (e) {
                    scope.isActive || (scope.isActive = true, iEle.find(".topbar-search-ask").focus(), e.preventDefault())
                };
                scope.dropdownOpen = false;
                scope.toggleDropdownStatus = function (e) {
                    e.preventDefault();
                    scope.dropdownOpen = !scope.dropdownOpen;
                    scope.dropdownOpen || doc.off("click", close);
                };
                doc.on("click", close);
                scope.$on("$destroy", function () {
                    doc.off("click", close)
                })
            }
        }
    }*/
})();
