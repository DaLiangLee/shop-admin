/**
 * Created by Administrator on 2016/12/28.
 */
/**
 * Created by Administrator on 2016/11/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleSelectVehicle', simpleSelectVehicle);

  /**
   * data         获取交互数据
   * config       配置信息
   * selectItem   返回数据
   */

  /** @ngInject */
  function simpleSelectVehicle($filter, $timeout, $window, vehicleSelection) {
    function getSeriesTitle(collection, target){
      var regular = new RegExp('^'+target);
      console.log(regular.test(collection));
      return regular.test(collection) ? collection : target + " " + collection;
    }
    /**
     * 设置格式化数据，供页面好操作
     * @param level
     * @param data
     * @param item
     */
    var setFormatData = function(level, data, item){
      console.log('setFormatData', level, data, item);
      _.forEach(data, function(value){
        value.$$level = level;
        if(!value.$$title && value.$$level == 1){
          value.$$title = value.brand;
        }else if(!value.$$title && value.$$level == 2){
          value.$$title = getSeriesTitle(value.series, item.brand);
        }else if(!value.$$title && value.$$level == 3){
          value.$$title = item.$$title +" "+ value.year;
        }else if(!value.$$title && value.$$level == 4){
          value.$$title = item.$$title +" "+ value.output;
        }else if(!value.$$title && value.$$level == 5){
          value.$$title = value.model;
        }
        if(angular.isUndefined(value.logo)){
          value.logo = item.logo;
        }
        if(angular.isUndefined(value.firstletter)){
          value.firstletter = item.firstletter;
        }
        if(angular.isUndefined(value.brand)){
          value.brand = item.brand;
        }
        if(angular.isUndefined(value.brandid) && value.$$level == 1){
          value.brandid = value.id;
        }else{
          value.brandid = item.brandid;
        }
        if(angular.isUndefined(value.seriesid) && value.$$level > 1){
          if(item && item.seriesid){
            value.seriesid = item.seriesid
          }else{
            value.seriesid = value.id;
          }
        }
        if(angular.isUndefined(value.series) && value.$$level > 1){
          value.series = item.series;
        }
        if(angular.isUndefined(value.yearid) && value.$$level > 2){
          if(item && item.yearid){
            value.yearid = item.yearid
          }else{
            value.yearid = value.id;
          }
        }
        if(angular.isUndefined(value.year) && value.$$level > 2){
          value.year = item.year;
        }
        if(angular.isUndefined(value.output) && value.$$level > 3){
          value.output = item.output;
        }
        if(angular.isUndefined(value.outputid) && value.$$level > 3){
          if(item && item.outputid){
            value.outputid = item.outputid
          }else{
            value.outputid = value.id;
          }
        }
      });
      return data;
    };

    return {
      restrict: "A",
      scope: {
        select: "="
      },
      templateUrl: "app/components/simpleSelectVehicle/simpleSelectVehicle.html",
      link: function (scope, iElement, iAttrs) {
        console.log(1);

        /**
         * 缓存数组
         * @type {Array}
         */
        var list = [];

        /**
         * 获取车辆品牌列表
         */
        vehicleSelection['brand']().then(function (data) {
          list = data.data.data;
          scope.brandList = setFormatData(1, data.data.data);
          scope.list = [];
          scope.select && getSelect(scope.select);
        });


        /**
         * 设置数据
         */
        function getSelect() {

        }

        /**
         * 设置列表
         * 自动去重排序返回一个新列表
         * @param list
         */
        function setList(list) {
          scope.list.push(list);
          scope.list = _.sortBy(_.uniq(scope.list), 'brandid');
        }


        var clearSubkeys = {
          'series': function () {
            scope.seriesList = [];
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
            return scope.brandList;
          },
          'year': function () {
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
            return scope.seriesList;
          },
          'output': function () {
            scope.outputList = [];
            scope.modelList = [];
            return scope.yearList;
          },
          'model': function () {
            scope.modelList = [];
            return scope.outputList;
          }
        };
        var getSubmitData = {
          'series': function (item) {
            return {
              brandid: item.brandid
            };
          },
          'year': function (item) {
            return {
              brandid: item.brandid,
              seriesid: item.seriesid
            };
          },
          'output': function (item) {
            return {
              brandid: item.brandid,
              seriesid: item.seriesid,
              year: item.year
            };
          },
          'model': function (item) {
            return {
              brandid: item.brandid,
              seriesid: item.seriesid,
              year: item.year,
              outputid: item.outputid
            };
          }
        };
        scope.selectitle = "";
        scope.selecthandle = function (level, item, type, listType) {
          if(level === 6){
            _.forEach(scope.modelList, function (key) {
              key.$$open = false;
            });
            console.log(6,item);
            scope.select = item;
          }else{
            _.forEach(clearSubkeys[type](), function (key) {
              key.$$open = false;
            });

            if (angular.isArray(item.items)) {
              scope[listType] = item.items;
            } else {
              loadingSubData(level, item, type, listType);
            }
          }
          scope.selectitle = item.$$title;
          item.$$open = !item.$$open;
        };

        /**
         * 加载子数据
         * @param level    当前等级
         * @param item     当前项
         * @param type     当前类型
         * @param listType 当前列表类型
         * @param callback 回调函数
         * @constructor
         */
        function loadingSubData(level, item, type,listType, callback){
          vehicleSelection[type](getSubmitData[type](item)).then(function (data) {
            item.items = setFormatData(level, data.data.data, item);
            scope[listType] = setFormatData(level, data.data.data, item);
            callback && callback();
          });
        }

        // 车型选择组件中输入车型的首字母或汉字无法查询
        scope.searchBrand = {
          searchText: "",
          firsthandle: function(){
            if(/^[A-Z]$/.test(this.searchText)){
              this.searchData = {
                firstletter: this.searchText
              }
            }else{
              this.searchData = {
                brand: this.searchText
              }
            }
          },
          searchData: {}
        };

        /**
         * 获取结果数据
         * @param data
         */
        function getResults(data) {
          var result = angular.copy(data);
          /*_.forEach(data, function (item) {
            if (!brand[item.brandid]) {
              brand[item.brandid] = [];
            }
            brand[item.brandid].push(item);
          });*/
          console.log(result);
          return result;
        }
      }
    }
  }
})();
