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
 *    searchDirective    必填
 *       label           当前项名称          必填
 *       cssProperty     当前列表项的class
 *       list            当前项列表          如果没有all就必填，如果有all可以不填
 *       all             是否有全部
 *       custom          是否有自定义
 *       type            当前类型
 *              list     列表
 *              all      自定义搜索无类型
 *              number   自定义搜索数字类型
 *              int      自定义搜索整型
 *              float    自定义搜索浮点数
 *              money    自定义搜索金额
 *              date     自定义搜索时间
 *       name            显示的搜索字段         必填
 *       model           当前值
 *       start           自定义区间开始配置
 *              name     显示的自定义开始搜索字段
 *              model    显示的自定义开始搜索当前值
 *              config   显示的自定义开始配置信息
 *
 *       end             自定义区间结束配置
*               name     显示的自定义结束搜索字段
 *              model    显示的自定义结束搜索当前值
 *              config   显示的自定义结束配置信息
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
    return {
      restrict: "A",
      scope: {
        config: "=",
        searchHandler: "&"
      },
      templateUrl: "app/components/simpleSearch/simpleSearch.html",
      controller: ["$scope", function ($scope) {
        $scope.items = [];
        $scope.searchParams = {};
        var config = $scope.$watch('config', function(value){
          if(value){
            $scope.items = [];
            $scope.searchParams = {};
            if(angular.isDefined(value.keyword)){
              $scope.searchParams = {
                "keyword": value.keyword
              };
            }
            var model = 0;
            angular.forEach($scope.config.searchDirective, function (item) {
              if(!angular.isArray(item.list) && !item.all){
                throw Error(item.label + '：的配置项不全');
              }
              if(angular.isArray(item.list) && !item.list.length && !item.all){
                throw Error(item.label + '：的配置项list为0');
              }
              /**
               * 如果是自定义需要吧当前想绑定的name+$$在后期处理
               */
              item.custom && (item.name = "$$" + item.name);
              /**
               * 如果model没有填就默认是全部
               */
              if(angular.isDefined(item.model)){
                model++;
              }
              angular.isUndefined(item.model) && (item.model = -1);
              if(item.custom && (angular.isDefined(item.start.model) || angular.isDefined(item.end.model))){
                item.model = -2;
                model++;
              }
              /**
               * 生成绑定的默认数据
               */
              $scope.searchParams[item.name] = item.model;
              angular.isDefined(item.start) && ($scope.searchParams[item.start.name] = item.start.model);
              angular.isDefined(item.end) && ($scope.searchParams[item.end.name] = item.end.model);
              /**
               * 检查list是不是数组
               */
              if (!angular.isArray(item.list)) {
                item.list = [];
              }
              // 全部 添加在数组第一项
              if (item.all) {
                item.list.unshift({
                  id: -1,
                  label: "全部"
                });
              }
              // 自定义 添加在数组第最后一项项
              if (item.custom) {
                item.list.push({
                  id: -2,
                  label: "自定义"
                });
              }
              (!item.custom && !item.type) && (item.type = 'list');
              (item.custom && !item.type) && (item.type = 'number');
              $scope.items.push(item);
            });
            $scope.config.showMore = model > 0;
          }
        });

        // 给date设置默认配置
        angular.forEach($scope.items, function (value1) {
          if (value1.type === 'date') {
            angular.forEach(value1.data, function (value2) {
              if (angular.isUndefined(value2.opened)) {
                value2.opened = false;
              }
              if (angular.isUndefined(value2.format)) {
                value2.format = 'yyyy-MM-dd';
              }
              if (angular.isUndefined(value2.minDate)) {
                value2.minDate = new Date();
              }
              if (angular.isUndefined(value2.maxDate)) {
                value2.maxDate = new Date(2020, 12, 31);
              }
            });
          }
        });
        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.setSearch = function () {
          console.log($scope.searchParams);

           $scope.searchHandler({data: getParams($scope.searchParams)});
        };

        function getCustom(value, params){
          console.log(value, params);
          var temp = [];
          angular.forEach(params, function (key, value) {
            if(/^\$\$/.test(value) && key === -1){
              temp.push(value.replace(/^\$\$/ig, ""));
            }
          });
          var result = false;
          temp.length && angular.forEach(temp, function (key) {
            if(value.indexOf(key) > -1){
              result = true;
              return false;
            }
          });
          return result;
        }
        function getParams(params){
          var searchParams = {};
          angular.forEach(params, function (key, value) {
            if(!angular.isUndefined(key) && value.indexOf('$$') != 0){
              (key != -1) && (searchParams[value] = key);
              ((key == -1) || getCustom(value, params)) && (searchParams[value] = undefined);
            }
          });
          return searchParams;
        }

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
