/**
 * Created by Administrator on 2016/10/11.
 */
(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('cbShopSidebar', cbShopSidebar)
        .directive('sidebarTooltip', sidebarTooltip)
        .directive('sidebarGroupTooltip', sidebarGroupTooltip)
        .directive('sidebarTooltipPopup', sidebarTooltipPopup);


    /** @ngInject */
    function cbShopSidebar($timeout,$rootScope, viewFrameworkHelper, permissions) {
        /**
         * 获取侧栏菜单显示
         * @param data       后台返回权限列表
         * @returns {Array}  返回显示的菜单
         */
        function getNavConfig(data){
            var results = angular.copy(data.items);
            if(results[0].display == "1" && results[0].id == 2){
                results.shift();
            }
            /**
             * 过滤不显示的菜单项
             */
            _.remove(results, function (item) {
                return item.display == "0";
            });
            angular.forEach(results, function(item){
                item.preference = [];
                item.customize = false;
                item.customizeTitle = "自定义"+ item.menuname;
                item.folded = false;
                item.show = true;
                item.icon = "icon-sidebar-"+item.category;
                item.showManageButton = true;
                item.items = setItems(item.items, item.id);
            });
            function setItems(items, parentid){
                /**
                 * 过滤不显示的菜单项
                 */
                _.remove(items, function (item) {
                    return item.display == "0";
                });
                angular.forEach(items, function(item){
                    item.openStatus = true;
                    if(item.href.indexOf("/") !== 0){
                        throw Error('API接口地址有误，请以/开头');
                    }else{
                        var router = item.href.substring(1).replace("/", ".");
                    }
                    var uisref = "";
                    if(parentid == 3 && item.id == 30000 || parentid == 6 && item.id == 60000){   // 店铺管理 and 账号管理
                        router += ".home";
                        uisref = router;
                    }else if(parentid == 10 && item.id == 100200){   // 修改密码
                        router += "";
                        uisref = router;
                    }else{
                        router += ".list";
                        uisref = router + "({page:1})";
                    }
                    item.uisref = uisref;
                    item.router = router;
                });
                return items;
            }
            return results;
        }
        return {
            restrict: "A",
            replace: true,
            scope: true,
            templateUrl: "app/components/sideBar/sideBar.html",
            link: function(scope, iElement, iAttrs) {
                var timer = null;
                getPermissions();
                var permissionsChanged = $rootScope.$on('permissionsChanged', function () {
                    getPermissions();
                });

                // 获取权限控制
                function getPermissions() {
                    timer = $timeout(function () {
                        scope.loadingState = true;
                        scope.navConfig = getNavConfig(permissions.getPermissions());
                    }, 0);
                }
                scope.loadingState = true;
                scope.isSidebarFold = viewFrameworkHelper.isSidebarFold();
                /**
                 * 收起展开二级菜单
                 * @param index  索引
                 * @param item   状态
                 */
                scope.toggleFoldStatus = function(index, status){
                    scope.navConfig[index].folded = !status;
                };
                /**
                 * 更新视图框架配置侧边栏
                 */
                scope.toggleSidebarStatus = function(){
                    scope.isSidebarFold = !scope.isSidebarFold;
                    var status = scope.isSidebarFold ? "mini" : "full";
                    setItems(status);
                    scope.$emit("updateViewFrameworkConfigSidebar", status)
                };

                /**
                 * 设置子菜单
                 */
                function setItems(status){
                  angular.forEach(scope.navConfig, function (item) {
                    item.folded = status === "mini";
                  });
                }


                /**
                * 更新自定义菜单
                 */
                scope.$on("updatePreference", function(event, data){
                    if (!data || !data.type || !data.preference){
                        return ;
                    }
                    angular.forEach(scope.navConfig, function (value) {
                        if(value.category.category === data.type){
                            value.preference = data.preference;
                        }
                    });
                });
                /**
                 * 监听navConfig
                 */
                var navConfig = scope.$watch("navConfig", function(newValue, oldValue, scope){
                    if(newValue){
                        scope.navConfig = newValue;
                    }
                });
                /**
                 * 设置type
                 */
                iAttrs.$observe("type", function(value){
                    if(value){
                        scope.type = value;
                        setItems(value);
                        scope.isSidebarFold = value === "mini";
                    }
                });

                iAttrs.$observe("productId", function(value){
                    if(value){
                        scope.productId = value;
                    }
                });
                // 确保工具提示被销毁和删除。
                scope.$on('$destroy', function() {
                  permissionsChanged();
                  navConfig();
                  $timeout.cancel(timer);
                });
            }
        }
    }

    /** @ngInject */
    function sidebarTooltip($tooltip){
        return $tooltip("sidebarTooltip", "tooltip", "mouseenter");
    }

    /** @ngInject */
    function sidebarGroupTooltip($compile, $timeout, $document){
      var template = [
        '<div class="cb-sidebar-group-tooltip">',
          '<h3 ng-bind="group.menuname"></h3>',
        '<ul class="sidebar-trans">',
        '<li ng-repeat="item in group.items track by $index" class="nav-item" ng-class="{\'active\':$state.includes(item.router)}">',
        '<a ui-sref="{{item.uisref}}" class="sidebar-trans">',
        '<span class="nav-title">{{item.menuname}}</span>',
      '</a>',
      '</li>',
      '</ul>',
      '</div>'
      ].join('');
      return {
        restrict: "A",
        replace: true,
        scope: {
          group: "=",
          states: "="
        },
        link: function (scope, iElement) {
          var isSidebarFold = angular.copy(scope.states);
          var tooltipLinker = $compile( template );
          /**
           * 如果不是迷你侧栏菜单
           */
          var states = scope.$watch('states', function (value) {
            isSidebarFold = value;
          });

          var group;
          var tooltipTimeout = null;
          iElement.on('mouseenter', function () {
            if(isSidebarFold){
              show();
            }
          });
          iElement.on('mouseleave', function () {
            hideTooltipBind();
          });
          /**
           * 显示
           */
          function show(){
            createTooltip();
            var position = iElement.offset(),
              left = position.left,
              top = position.top,
              width = iElement.width();
            group.css({ top: top, left: left + width, display: 'block' });
            hoverHandle();
          }

          /**
           * 隐藏
           */
          function hide() {
            removeTooltip();
          }
          // 创建提升
          function createTooltip() {
            // 每个指令只能同时显示一个工具提示元素。
            if (group) {
              removeTooltip();
            }
            group = tooltipLinker(scope, function (tooltip) {
                $document.find( 'body' ).append( tooltip );
            });
            scope.$digest();
          }
          function hideTooltipBind () {
            scope.$apply(function () {
              tooltipTimeout = $timeout(hide, 100)
            });
          }
          // 绑定鼠标hover到提示上处理
          function hoverHandle() {
            group && (group.on("mouseenter", mouseenterHandle), group.on("mouseleave", mouseleaveHandle));
          }

          function mouseenterHandle() {
            $timeout.cancel(tooltipTimeout);
          }

          function mouseleaveHandle() {
            tooltipTimeout = $timeout(hideTooltipBind, 100);
          }
          // 删除提示
          function removeTooltip() {
            $timeout.cancel( tooltipTimeout );
            if (group) {
              group.remove();
              group = null;
            }
          }
          // 确保工具提示被销毁和删除。
          scope.$on('$destroy', function() {
            states();
            $timeout.cancel( tooltipTimeout );
            removeTooltip();
          });
        }
      };
    }

    /** @ngInject */
    function sidebarTooltipPopup(){
        return {
            restrict: "A",
            replace: true,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "app/components/sideBar/sidebarTooltipPopup.html"
        }
    }
})();
