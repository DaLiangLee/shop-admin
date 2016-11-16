/**
 * Created by Administrator on 2016/10/13.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('preferencenav', preferencenav)
        .directive('cbShopPreferencenav', cbShopPreferencenav);

    /** @ngInject */
    function preferencenav($rootScope) {
        var preferenceList = [];
        return {
            setPreferences: function(toState, toParams) {
              console.log(toState, toParams);
                var preference = toState;
                preference.params = toParams;
                preferenceList.push(preference);
                $rootScope.$broadcast('preferencenavsChanged');
            },
            getPreferences: function() {
                return preferenceList;
            },
            removePreference: function (preferences) {
                _.remove(preferenceList, function (item) {
                    return item.name === preferences.name;
                });
                $rootScope.$broadcast('preferencenavsChanged');
            }
        };
    }

    /** @ngInject */
    function cbShopPreferencenav($rootScope, $state, preferencenav) {
        return {
            restrict: "A",
            replace: true,
            scope: true,
            templateUrl: "app/components/preferenceNav/preferenceNav.html",
            link: function(scope, iElement, iAttrs) {
                var maxWidth = 130,minwidth = 40, spanWidth = maxWidth + 30;
                scope.items = preferencenav.getPreferences();
                var preferencenavsChanged = $rootScope.$on('preferencenavsChanged', function () {
                    var list = preferencenav.getPreferences();
                    scope.items = _.uniq(list, 'name');
                    getWidth()
                });

                function getWidth(){
                    var width = iElement.width() - 40;
                    var length = scope.items.length;
                    if(width - length*spanWidth < spanWidth){
                      console.log(Math.floor(width/(length+1)) -30);
                      setWidth(Math.floor(width/(length+1)) -30);
                    }
                }
                function setWidth(width){
                  angular.forEach(scope.items, function (item) {
                    item.width = width
                  });
                }
                scope.removePreference = function (item, index) {
                    if(scope.items.length == 1){
                        if(item.name == "desktop.home"){
                            return false;
                        }
                        $state.go('desktop.home');
                    }else{
                        if(index > 0){    // 如果当前索引大于0就可以访问上一个路由 如果没有就跳过
                            $state.go(scope.items[index-1].name);
                        }else{
                            /**
                             * 如果删除第一个 默认会显示第二
                             * 可能会没有第二项，那么就直接跳回控制台
                             */
                            if(_.isEmpty(scope.items[1])){
                                $state.go('desktop.home');
                            }else{
                                $state.go(scope.items[1].name);
                            }
                        }
                    }
                    preferencenav.removePreference(item);
                };
                // 确保工具提示被销毁和删除。
                scope.$on('$destroy', function() {
                    preferencenavsChanged();
                });
            }
        }
    }

})();
