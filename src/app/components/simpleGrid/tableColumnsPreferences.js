/**
 * Created by Administrator on 2016/10/17.
 */
(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('tableColumnsPreferences', tableColumnsPreferences);


    /** @ngInject */
    function tableColumnsPreferences(cbDialog) {

        return {
            restrict: "A",
            scope: {
                settings: "=",
                necessarySettings: "=",
                currentCustomSettings: "=",
                remixCustomSettings: "="
            },
            link: function(scope, iElement, iAttrs){
                var iEle = angular.element(iElement);
                function handler(childScope){
                    var setting = angular.copy(scope.settings),
                        remixCustom = setting.remixCustomSettings,
                        results = [],necessary,currentCustom;
                    /**
                     * 处理异常情况
                     */
                    // 如果没有传所有项目就抛出错误
                    if(angular.isUndefined(remixCustom) || angular.isArray(remixCustom) && !remixCustom.length){
                        throw new Error("没有配置所有的表格列表项");
                    }
                    // 如果不能修改项没有填写，就取第一个和最后一个项
                    if(angular.isUndefined(setting.necessarySettings) || (angular.isArray(setting.necessarySettings) && !setting.necessarySettings.length)){
                        necessary = [].concat(_.first(remixCustom), _.last(remixCustom));
                    }else{
                        necessary = setting.necessarySettings;
                    }
                    // 没有设置当前的配置项目就和必选一致；
                    if(angular.isUndefined(setting.currentCustomSettings) || angular.isArray(setting.currentCustomSettings) && !setting.currentCustomSettings.length){
                        currentCustom = angular.copy(necessary);
                    }else{
                        currentCustom = setting.currentCustomSettings;
                    }
                    // 设置数据
                    angular.forEach(remixCustom, function(key){
                        results.push({
                            id: key.id,
                            cssClass: "",
                            canModify: false,
                            value: false,
                            name: key.name
                        });
                    });
                    // 设置当前栏目
                    angular.forEach(results, function(key1){
                        angular.forEach(currentCustom, function(key2){
                            if(key1.id === key2.id){
                                key1.value = true;
                                return false;
                            }
                        });
                    });
                    // 设置必选栏目
                    angular.forEach(results, function(key1){
                        angular.forEach(necessary, function(key2){
                            if(key1.id === key2.id){
                                key1.value = true;
                                key1.canModify = true;
                                return false;
                            }
                        });
                    });
                    childScope.title = iAttrs.title;
                    childScope.dialogObj = results;
                    childScope.saveContent = function () {
                        childScope.close();
                        childScope.dialogObj = _.filter(childScope.dialogObj, function(item){
                            return item.value;
                        });
                        scope.$emit("updateGridColumnsPreferences", childScope.dialogObj);
                    }
                }
                iEle.on("click", function () {

                    cbDialog.showDialogByUrl("app/components/simpleGrid/tableColumnsPreferences.html", handler, {
                        windowClass: "viewFramework-tableColumnsPreferences"
                    });
                });
            }
        }
    }
})();
