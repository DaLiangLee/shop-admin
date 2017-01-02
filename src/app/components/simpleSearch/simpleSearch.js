/**
 * Created by Administrator on 2016/10/17.
 */
/**
 * simpleSearch是一个通用的表格组件搜索筛选
 * 包括表格
 * config  全局配置参数     必填
 * searchHandler  事件回调 返回搜索信息 必填
 *
 * config    全局配置参数
 *    searchParams    绑定的搜索对象
 *    searchPrefer    搜索形式（客户端false还是服务端true）       默认客户端
 *                    如果数据少可以选择本地排序。后期扩展使用暂不适用
 *    searchDirective                                        必填
 *       cssProperty     当前列表项的class
 *       field           绑定搜索字段
 *       name            显示的搜索字段
 *       fieldDirective  搜索内容显示
 *       selectData      下拉选择的数据                 只有在下拉选择才有效
 *    searchItems      后期扩展使用暂不适用
 *
 */



(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('simpleSearch', simpleSearch);


    /** @ngInject */
    function simpleSearch() {

        /**
         * 默认配置
         * @type {{searchParams: string, searchPrefer: boolean, searchDirective: Array}}
         */
        var DEFAULT_CONFIG = {
            searchID: "",               //表单id
            searchPrefer: false,       //过滤形式（客户端false还是服务端true）   如果数据少可以选择本地过滤。后期扩展使用暂不适用
            searchDirective: []        //自定义列表项配置    必填项
        };
        return {
            restrict: "A",
            scope: {
                config: "=",
                searchPreHandler: "&",
                searchHandler: "&"
            },
            templateUrl: "app/components/simpleSearch/simpleSearch.html",
            controller: ["$scope", function($scope) {
                // config 配置默认参数
                $scope.config = angular.extend({}, DEFAULT_CONFIG, $scope.config);
                $scope.searchID = $scope.config.searchID;
                $scope.items = $scope.config.searchDirective;
                // 给date设置默认配置
                angular.forEach($scope.items, function (value1) {
                    if(value1.type === 'date'){
                        angular.forEach(value1.data, function (value2) {
                            if(angular.isUndefined(value2.opened)){
                                value2.opened = false;
                            }
                            if(angular.isUndefined(value2.format)){
                                value2.format = 'yyyy-MM-dd';
                            }
                            if(angular.isUndefined(value2.minDate)){
                                value2.minDate = new Date();
                            }
                            if(angular.isUndefined(value2.maxDate)){
                                value2.maxDate = new Date(2020, 12, 31);
                            }
                        });
                    }
                });
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };
                $scope.searchParams = {};
                $scope.setSearch = function () {
                    var searchParams = {};
                    angular.forEach($scope.searchParams, function (key, value) {
                        if(angular.isDate(key)){
                            searchParams[value] = +(new Date(key));
                        }else{
                            searchParams[value] = key;
                        }
                    });
                    $scope.searchPreHandler({data: searchParams});
                    $scope.searchHandler({data: searchParams});
                };
                /*$scope.cancel = function () {
                    var page = angular.copy($scope.searchParams);
                    angular.forEach(page, function (value, key) {
                        if(key !== 'page'){
                            delete page[key];
                        }
                    });
                    $scope.searchParams = page;
                    $scope.searchPreHandler({data: $scope.searchParams});
                    $scope.searchHandler({data: $scope.searchParams});
                };*/
            }]
        }
    }
})();
