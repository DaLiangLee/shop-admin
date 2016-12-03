/**
 * Created by Administrator on 2016/11/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('vehicleSelection', vehicleSelection)
    .directive('cbVehicleSelection', cbVehicleSelection);


  /** @ngInject */
  function vehicleSelection(requestService) {
    return requestService.request('vehicle', 'motor');
  }

  /**
   * data         获取交互数据
   * config       配置信息
   * selectItem   返回数据
   */

  /** @ngInject */
  function cbVehicleSelection($filter, $timeout, $window, vehicleSelection, treeService) {
    function getSeriesTitle(collection, target){
      var regular = new RegExp('^'+target);
      return regular.test(collection) ? collection : collection + " " + target;
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
        value.level = level;
        if(!value.title && value.level == 1){
          value.title = value.brand;
        }else if(!value.title && value.level == 2){
          value.title = getSeriesTitle(value.series, item.brand);
        }else if(!value.title && value.level == 3){
          value.title = item.title +" "+ value.year;
        }else if(!value.title && value.level == 4){
          value.title = item.title +" "+ value.output;
        }else if(!value.title && value.level == 5){
          value.title = value.model;
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
        if(angular.isUndefined(value.brandid) && value.level == 1){
          value.brandid = value.id;
        }else{
          value.brandid = item.brandid;
        }
        if(angular.isUndefined(value.seriesid) && value.level > 1){
          if(item && item.seriesid){
            value.seriesid = item.seriesid
          }else{
            value.seriesid = value.id;
          }
        }
        if(angular.isUndefined(value.series) && value.level > 1){
          value.series = item.series;
        }
        if(angular.isUndefined(value.yearid) && value.level > 2){
          if(item && item.yearid){
            value.yearid = item.yearid
          }else{
            value.yearid = value.id;
          }
        }
        if(angular.isUndefined(value.year) && value.level > 2){
          value.year = item.year;
        }
        if(angular.isUndefined(value.outputid) && value.level > 3){
          if(item && item.outputid){
            value.outputid = item.outputid
          }else{
            value.outputid = value.id;
          }
          if(angular.isUndefined(value.output)){
            value.output = item.output;
          }
        }
      });
      return data;
    };

    /**
     * 根据等级来定义删除项
     * @param item     当前项
     * @param key      列表当前项
     * @param level    当前等级
     */
    var isRemoveChecked = function(item, key, level){
      return {
        "1": key.brandid == item.brandid && angular.isUndefined(key.seriesid),
        "2": key.brandid == item.brandid && key.seriesid == item.seriesid && angular.isUndefined(key.year),
        "3": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && angular.isUndefined(key.outputid),
        "4": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid && angular.isUndefined(key.modelid),
        "5": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid && key.modelid == item.modelid
      }[level];
    };

    /**
     * 是否可以添加
     * @param item
     * @param key
     * @param level
     * @returns {*}
     */
    var isAddChecked = function (item, key, level) {
      return {
        1: key.brandid == item.brandid,
        2: key.brandid == item.brandid,
        3: key.brandid == item.brandid && key.seriesid == item.seriesid,
        4: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year,
        5: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid
      }[level];
    };
    return {
      restrict: "A",
      scope: {
        select: "="
      },
      templateUrl: "app/components/cbVehicleSelection/cbVehicleSelection.html",
      link: function (scope, iElement, iAttrs) {
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
          scope.brandList = setFormatData(1, treeService.enhance(data.data.data));
          scope.list = [];
          if (!angular.isUndefined(scope.select)) {
            if(angular.isArray(scope.select)){
              getSelect(scope.select);
            }else{
              getSelect($window.eval(decodeURI(scope.select)));
            }
          }
        });
        /**
         * 获取对应的列表，来设置状态
         * @param item
         */
        var getState = function(item){
          var items = _.find(scope.brandList, function(key){
            return key.brandid == item.brandid;
          });
          if(_.isUndefined(items.items)){
            return items;
          }
          var items2 = _.find(items.items, function(key){
            return key.seriesid == item.seriesid;
          });
          if(_.isUndefined(items2.items)){
            return items2;
          }
          var items3 = _.find(items2.items, function(key){
            return key.year == item.year;
          });
          if(_.isUndefined(items3.items)){
            return items3;
          }
          var items4 = _.find(items3.items, function(key){
            return key.outputid == item.outputid;
          });
          if(_.isUndefined(items4.items)){
            return items4;
          }
          return _.find(items4.items, function(key){
            return key.modelid == item.modelid;
          });
        };

        /**
         * 获取对应的列表，来设置状态
         * @param item
         */
        function getSelect(arr) {
          if(angular.isUndefined(arr) || !arr.length){
            return [];
          }
          var results = [];
          console.log(arr);
          _.forEach(arr, function (item) {
            var key = item.brand;
            key.title = key.brand;
            key.level = 1;
            if(key.isChecked){
              getState(key).$setCheckState(true);
              results.push(key);
            }else{
              getState(key).$setCheckState(false);
            }
            if (angular.isArray(item.series) && item.series.length) {
              _.forEach(item.series, function (value) {
                value.level = 2;
                results.push(value);
              });
            }
            if (angular.isArray(item.year) && item.year.length) {
              _.forEach(item.year, function (value) {
                value.level = 3;
                results.push(value);
              });
            }
            if (angular.isArray(item.output) && item.output.length) {
              _.forEach(item.output, function (value) {
                value.level = 4;
                results.push(value);
              });
            }
            if (angular.isArray(item.model) && item.model.length) {
              _.forEach(item.model, function (value) {
                value.level = 5;
                results.push(value);
              });
            }
          });
          getSubKeysData(results);
          return results;
        }
        function getSubKeysData(data){
          var result = {};
          _.forEach(data, function (item) {
            if (!result[item.level]) {
              result[item.level] = [];
            }
            result[item.level].push(item);
          });
          result[2] && _.forEach(_.uniq(result[2], 'brandid'), function (value) {
            var items = _.filter(result[2], function(n){
              return n.brandid == value.brandid && !n.isChecked;
            });
            var parent = getState(value);
            loadingSubData(2, parent, 'series', 'seriesList', function () {
              var currentArray = _.filter(result[2], function (n) {
                return n.brandid == value.brandid;
              });
              _.forEach(currentArray, function (value2) {
                if(value2.isChecked){
                  getState(value2).$setCheckState(true);
                }
              });
              result[3] && setYear(items);
            });

          });
          function setYear(list){
            _.forEach(list, function (value) {
              var items = _.filter(result[3], function(n){
                return n.brandid == value.brandid && n.seriesid == value.seriesid && !n.isChecked;
              });
              var parent = getState(value);
              loadingSubData(3, parent, 'year', 'yearList', function () {
                var currentArray = _.filter(result[3], function (n) {
                  return n.seriesid == value.seriesid;
                });
                _.forEach(currentArray, function (value2) {
                  if(value2.isChecked){
                    getState(value2).$setCheckState(true);
                  }
                });
                result[4] && setOutput(items);
              });
            });
          }
          function setOutput(list){
            _.forEach(list, function (value) {
              var items = _.filter(result[4], function(n){
                return n.brandid == value.brandid && n.seriesid == value.seriesid && n.year == value.year && !n.isChecked;
              });
              var parent = getState(value);
              loadingSubData(4, parent, 'output', 'outputList', function () {
                var currentArray = _.filter(result[4], function (n) {
                  return n.year == value.year;
                });
                _.forEach(currentArray, function (value2) {
                  if(value2.isChecked){
                    getState(value2).$setCheckState(true);
                  }
                });
                result[5] && setModel(items);
              });
            });
          }
          function setModel(list){
            _.forEach(list, function (value) {
              var parent = getState(value);
              loadingSubData(5, parent, 'model', 'modelList', function () {
                var currentArray = _.filter(result[5], function (n) {
                  return n.outputid == value.outputid;
                });
                _.forEach(currentArray, function (value2) {
                    getState(value2).$setCheckState(true);
                });
              });
            });
          }
        }

        /**
         * 在列表删除当前项
         * 只需要给当前项设置取消选中状态即可
         */
        scope.removeHandle = function (item) {
          item.$setCheckState(false);
        };

        /**
         * tree每次操作复选框都是调用的事件
         * @param item        当前项
         * @param checked     选中状态
         */
        treeService.checkStateChange = function (item, checked) {
          console.log('checkStateChange', item);
          toggle(item, checked);
        };

        /**
         * 根据当前项状态切换
         * @param item      当前项
         * @param checked   选中状态
         */
        function toggle(item, checked) {
          if (checked) {
            addList(item);
          } else {
            removeList(item);
          }
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

        /**
         * 当前项添加到列表
         * @param item     当前项
         */
        function addList(item) {
          /**
           *  1, 如果当前的$parent为undefined 一定是第一项
           *  2, 当前等级为一级 level = 1
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           */
          if(angular.isUndefined(item.$parent)){ // 第一级
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item, key, item.level);
            });
            setList(item);
            return ;
          }
          /**
           *  1, 当前选中，
           *  2, 不能是最后一级 level = 5
           *  3，当前的兄弟都没有选中
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           */
          if(item.$checked && item.level != 5 && !(item.$parent && _.every(item.$parent.items, '$checked'))){
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item, key, item.level);
            });
            setList(item);
            return ;
          }
          /**
           *  1, 当前选中，
           *  2, 查询$parent 通过父$parent查找当前兄弟是否都选中状态
           *  3，根据条件2来判断，如果2位true, 先删除不匹配的项
           *  4，然后通过当前项的等级来判断，是否递归操作,否则就添加父级
           *  5，根据条件2来判断，如果2位false就直接添加当前项
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           */
          if (item.$parent && _.every(item.$parent.items, '$checked')) {
            _.remove(scope.list, function (key) {
              return isAddChecked(item, key, item.level);
            });
            if (item.level > 2) {
              $timeout(function () {
                addList(item.$parent);
              }, 1);
            } else {
              setList(item.$parent);
            }
          } else {
            setList(item);
          }
        }

        /**
         * 删除列表指定项
         * @param item     当前项
         */
        function removeList(item) {
          _.remove(scope.list, function (key) {
            return isRemoveChecked(item, key, item.level);
          });
          /**
           *  1, 当前取消，
           *  2, 查询$parent 通过父$parent查找当前兄弟是否都选中状态
           *  3，根据条件2来判断，如果2位true, 先删除不匹配的项
           *  4，然后通过当前项的等级来判断，是否递归操作,否则就添加父级
           *  5，根据条件2来判断，如果2位false就直接添加当前项
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           */
          if(item.$parent){
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item.$parent, key, item.level);
            });
            _.forEach(item.$siblings(), function (key) {
              if(angular.isUndefined(key.$isIndeterminate()) && key.$checked){
                key.$setCheckState(true);
              }
            });
            if(item.level > 2){
              $timeout(function () {
                removeList(item.$parent);
              }, 100);
            }
          }
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
            treeService.enhance(scope.brandList);
            callback && callback();
          });
        }
        scope.selecthandle = function (level, item, type, listType) {
          _.forEach(clearSubkeys[type](), function (key) {
            key.$open = false;
          });
          if (angular.isArray(item.items)) {
            scope[listType] = item.items;
          } else {
            loadingSubData(level, item, type, listType, function(){
              item.$isChecked() && item.$setCheckState(true);
            });
          }
          item.$open = !item.$open;
        };

        /**
         * 获取结果数据
         * @param data
         */
        function getResults(data){
          var brand = {};
          var results = [];
          _.forEach(data, function (item) {
            if (!brand[item.brandid]) {
              brand[item.brandid] = [];
            }
            brand[item.brandid].push(item);
          });
          /**
           * brand 格式化
           *  {
                "brand": "AC Schnitzer",
                "firstletter": "A",
                "id": 1,
                "logo": "A_AC-Schnitzer.png"
              }
           * series 格式化
           *  {
           *    brandid:1,
                id:1,
                series:"AC Schnitzer 7系"
           *  }
           * year   格式化
           *  {
           *    brandid:1,
                id:1,
                seriesid:2,
                year:"2015"
           *  }
           * output 格式化
           *  {
           *    id:45,
                output:"3.0T",
                year:"2015"
           *  }
           * model  格式化
           *  {
                "modelid": 1,
                "firstletter": "A",
                "brandid": 1,
                "seriesid": 2,
                "year": "2015",
                "outputid": 45,
                "structid": 2,
                "gearid": 23,
                "model": "AC Schnitzer X5 2015款 ACS35 35i"
              }
           */
            function getBrand(item){
                return {
                  "brand": encodeURI(item[0].brand),
                  "firstletter": item[0].firstletter,
                  "id": item[0].brandid,
                  "brandid": item[0].brandid,
                  "logo": item[0].logo,
                  "isChecked": item.length === 1 && item[0].$checked
                }
            }
            function getSeries(item){
              if (!item.length) {
                return ;
              }
              var results = [];
              var items = _.filter(item, function (key) {
                return key.brandid && key.seriesid;
              });
              if (!items.length) {
                return;
              }
              _.forEach(items, function (value) {
                results.push({
                  "id": value.seriesid,
                  "brandid": value.brandid,
                  "series": encodeURI(value.series),
                  "seriesid": value.seriesid,
                  "isChecked": angular.isUndefined(value.year)
                });
              });
              return _.uniq(results, 'id');
            }
            function getYear(item){
              if (!item.length) {
                return;
              }
              var results = [];
              var items = _.filter(item, function (key) {
                return key.brandid && key.seriesid && key.year;
              });
              if (!items.length) {
                return;
              }
              _.forEach(items, function (value) {
                results.push({
                  "id": value.yearid,
                  "brandid": value.brandid,
                  "seriesid": value.seriesid,
                  "year": value.year,
                  "isChecked": angular.isUndefined(value.outputid)
                });
              });
              return _.uniq(results, 'id');
            }
            function getOutput(item){
              if (!item.length) {
                return;
              }
              var results = [];
              var items = _.filter(item, function (key) {
                return key.brandid && key.seriesid && key.year && key.outputid;
              });
              if (!items.length) {
                return;
              }
              _.forEach(items, function (value) {
                results.push({
                  "id": value.outputid,
                  "brandid": value.brandid,
                  "seriesid": value.seriesid,
                  "year": value.year,
                  "output": encodeURI(value.output),
                  "outputid": value.outputid,
                  "isChecked": angular.isUndefined(value.modelid)
                });
              });
              return _.uniq(results, 'id');
            }
            function getModel(item){
              if (!item.length) {
                return;
              }
              var results = [];
              var items = _.filter(item, function (key) {
                return key.brandid && key.seriesid && key.year && key.outputid && key.model;
              });
              if (!items.length) {
                return;
              }
              _.forEach(items, function (value) {
                results.push({
                  "id": value.modelid,
                  "modelid": value.modelid,
                  "brandid": value.brandid,
                  "firstletter": value.firstletter,
                  "gearid": value.gearid,
                  "logo": value.logo,
                  "model": encodeURI(value.model),
                  "outputid": value.outputid,
                  "seriesid": value.seriesid,
                  "structid": value.structid,
                  "year": value.year
                });
              });
              return results;
            }
            _.forEach(brand, function(item){
              results.push({
                brand: getBrand(item),
                series: getSeries(item),
                year: getYear(item),
                output: getOutput(item),
                model: getModel(item)
              });
            });
          return results;
        }

        var listScope = scope.$watch('list', function (value) {
          if (value) {
            //console.log('list', getResults(value));
            console.log(value);
            scope.select = getResults(value);
            console.log('cbVehicleSelection', getResults(value));
          }
        }, true);
      }
    }
  }
})();
