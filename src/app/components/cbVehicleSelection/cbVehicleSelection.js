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
    /**
     * 通过本地存储来保存文件
     * sessionStorage   在关闭页面后即被清空
     * localStorage     一直保存
     * 设置数据    setItem(key,value)
     * 全部数据    valueOf()
     * 获取数据    getItem(key)
     * 删除数据    removeItem(key)
     * 清空数据    clear()
     * 存储熟练    length
     * 事件监听    storage[ie有兼容性问题]
     */
    /**
     * 汽车名字
     * @type {{}}
     */
    var vehicleNames = {};
    /**
     * 汽车品牌
     * @type {{}}
     */
    var vehicleBrands = {};
    /**
     * 汽车品牌分类
     */
    var vehicleBrandsClasses = {};
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
    function getYearTitle(collection, target){
      return collection && collection.replace(/\s\d{4}$/, "") + " " + target;
    }
    function getGroupList(arr) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.title = item.title ? item.title : item.brand;
        item.brandid = item.id;
        item.level = 1;
        results.push(item);
      });
      return results;
    }

    function getSeries(arr, data) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.logo = data.logo;
        item.title = item.title ? item.title : getSeriesTitle(item.series, data.brand);
        item.brand = data.brand;
        item.firstletter = data.firstletter;
        item.seriesid = item.id;
        item.level = 2;
        results.push(item);
      });
      return results;
    }
    function getYear(arr, data) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.logo = data.logo;
        item.title = item.title ? item.title : getYearTitle(data.title, item.year);
        item.brandid = data.brandid;
        item.brand = data.brand;
        item.firstletter = data.firstletter;
        item.series = data.series;
        item.seriesid = data.seriesid;
        item.yearid = item.id;
        item.level = 3;
        results.push(item);
      });
      return results;
    }

    function getOutput(arr, data) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.logo = data.logo;
        item.title = item.title ? item.title : data.title + ' ' + item.output;
        item.brand = data.brand;
        item.firstletter = data.firstletter;
        item.series = data.series;
        item.year = data.year;
        item.yearid = data.yearid;
        item.brandid = data.brandid;
        item.seriesid = data.seriesid;
        item.outputid = item.id;
        item.level = 4;
        results.push(item);
      });
      return results;
    }

    function getModel(arr, data) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.logo = data.logo;
        item.title = item.model;
        item.year = data.year;
        item.brand = data.brand;
        item.firstletter = data.firstletter;
        item.series = data.series;
        item.brandid = data.brandid;
        item.output = data.output;
        item.seriesid = data.seriesid;
        item.outputid = data.outputid;
        item.yearid = data.yearid;
        item.modelid = item.modelid;
        item.level = 5;
        results.push(item);
      });
      return results;
    }


    return {
      restrict: "A",
      scope: {
        select: "=",
        selectItem: '&'
      },
      templateUrl: "app/components/cbVehicleSelection/cbVehicleSelection.html",
      link: function (scope, iElement, iAttrs) {
        /**
         * 缓存数组
         * @type {Array}
         */
        var list = [];
        vehicleSelection['brand']().then(function (data) {
          list = data.data.data;
          scope.brandList = getGroupList(treeService.enhance(data.data.data));
          if(!angular.isUndefined(scope.select)){
            scope.list = [];
            getSelect($window.eval(decodeURI(scope.select)));
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
         * 删除结果数组
         */
        scope.removeHandle = function (item) {
          //console.log(item, getState(item));
         // getState(item)
          item.$setCheckState(false);
        };


        /**
         * api调用步骤：
         * 1, 获取汽车品牌列表
         * 2，根据汽车品牌id获取车系列表
         * 3，根据车系id获取年份列表
         * 4，根据汽车品牌id、车系id和年份获取排量列表
         * 5，根据汽车品牌id、车系id、排量id和年份获取型号列表
         *
         * 操作思路：
         * 1，当前项勾选，其下的所有子项全部勾选，提交api为当前项id
         * 2，当前列表全选，父项勾选选中。
         * 3，当前列表选中项大于1， 父项半选中状态。
         * 4，切换父项，子项所有的状态保留
         * 5，将当前选中的项显示结果列表，
         *
         * 结果列表显示逻辑：
         * 1，显示所有项
         * 3，只显示到当前项
         * 2，删除以后可以从新选择
         *
         */

        /**
         * 获取对应的列表，来设置状态
         * @param item
         */
        function getSelect(arr) {
          if(angular.isUndefined(arr)){
            return [];
          }
          if (!arr.length) {
            return [];
          }
          var results = [];
          _.forEach(arr, function (item) {
            var key = item.brand;
            key.brandid = key.id;
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
          console.log(results);
          setXauzn(results);
          return results;
        }
        function setXauzn(arr){
          var json = {};
          _.forEach(arr, function (item) {
            if (!json[item.level]) {
              json[item.level] = [];
            }
            json[item.level].push(item);
          });
          console.log(json);
          _.forEach(json, function (item, key) {
            switch (key){
              case '2':
                _.forEach(_.uniq(item, 'brandid'), function (value) {
                  vehicleSelection['series']({brandid: value.brandid}).then(function (data) {
                    angular.forEach(scope.brandList, function (key) {
                      if (key.id == value.brandid) {
                        key.items = getSeries(data.data.data, value);
                        return false;
                      }
                    });
                    treeService.enhance(scope.brandList);
                    var currentArray = _.filter(item, function (n) {
                      return n.brandid == value.brandid;
                    });
                    _.forEach(currentArray, function (value2) {
                      if(value2.isChecked){
                        getState(value2).$setCheckState(true);
                      }
                    });
                  });
                });
                break;
              case '3':
                _.forEach(_.uniq(item, 'seriesid'), function (value1) {
                  vehicleSelection['year']({brandid: value1.brandid, seriesid: value1.seriesid}).then(function (data) {
                    angular.forEach(scope.brandList, function (key) {
                      if (key.id == value1.brandid) {
                        angular.forEach(key.items, function (value) {
                          if (value.id == value1.seriesid) {
                            value.items = getYear(data.data.data, value1);
                            return false;
                          }
                        });
                        return false;
                      }
                    });
                    treeService.enhance(scope.brandList);
                    var currentArray = _.filter(item, function (n) {
                      return n.seriesid == value1.seriesid;
                    });
                    _.forEach(currentArray, function (value2) {
                      if(value2.isChecked){
                        getState(value2).$setCheckState(true);
                      }
                    });
                  });
                });
                break;
              case '4':
                _.forEach(_.uniq(item, 'year'), function (value1) {
                  vehicleSelection['output']({
                    brandid: value1.brandid,
                    seriesid: value1.seriesid,
                    year: value1.year
                  }).then(function (data) {
                    angular.forEach(scope.brandList, function (key) {
                      if (key.id == value1.brandid) {
                        angular.forEach(key.items, function (value) {
                          if (value.id == value1.seriesid) {
                            angular.forEach(value.items, function (key1) {
                              if (key1.year == value1.year) {
                                key1.items = getOutput(data.data.data, value1);
                                return false;
                              }
                            });
                            return false;
                          }
                        });
                        return false;
                      }
                    });
                    treeService.enhance(scope.brandList);
                    var currentArray = _.filter(item, function (n) {
                      return n.year == value1.year;
                    });
                    _.forEach(currentArray, function (value2) {
                      if(value2.isChecked){
                        getState(value2).$setCheckState(true);
                      }
                    });
                  });
                });
                break;
              case '5':
                _.forEach(_.uniq(item, 'outputid'), function (value1) {
                  vehicleSelection['model']({
                    brandid: value1.brandid,
                    seriesid: value1.seriesid,
                    outputid: value1.outputid,
                    year: value1.year
                  }).then(function (data) {
                    angular.forEach(scope.brandList, function (key) {
                      if (key.id == value1.brandid) {
                        angular.forEach(key.items, function (value) {
                          if (value.id == value1.seriesid) {
                            angular.forEach(value.items, function (key1) {
                              if (key1.year == value1.year) {
                                angular.forEach(key1.items, function (key2) {
                                  if (key2.id == value1.outputid) {
                                    key2.items = getModel(data.data.data, value1);
                                    return false;
                                  }
                                });
                                return false;
                              }
                            });
                            return false;
                          }
                        });
                        return false;
                      }
                    });
                    treeService.enhance(scope.brandList);
                    var currentArray = _.filter(item, function (n) {
                      return n.outputid == value1.outputid;
                    });
                    _.forEach(currentArray, function (value2) {
                        getState(value2).$setCheckState(true);
                    });
                  });
                });
                break;
            }
          });
        }

        scope.firsthandle = function (search) {
          if (/^[A-Z]{1}$/.test(search)) {
            scope.brandList = getGroupList($filter('filter')(list, {firstletter: search}))
          } else {
            scope.brandList = getGroupList($filter('filter')(list, {brand: search}))
          }
        };
        var motor = {
          'series': function () {
            scope.seriesList = [];
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'year': function () {
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'output': function () {
            scope.outputList = [];
            scope.modelList = [];
          },
          'model': function () {
            scope.modelList = [];
          }
        };
        var motorApi = {
          'series': function (type, item, index) {
            vehicleSelection[type]({brandid: item.id}).then(function (data) {
              scope.seriesList = getSeries(data.data.data, item);
              angular.forEach(scope.brandList, function (key) {
                if (key.id == item.id) {
                  key.items = getSeries(data.data.data, item);
                  return false;
                }
              });
              treeService.enhance(scope.brandList);
              scope.brandList[index].$isChecked() && scope.brandList[index].$setCheckState(true);
            });
          },
          'year': function (type, item, index1, index2) {
            vehicleSelection[type]({brandid: item.brandid, seriesid: item.id}).then(function (data) {
              scope.yearList = getYear(data.data.data, item);
              angular.forEach(scope.brandList, function (key) {
                if (key.id == item.brandid) {
                  angular.forEach(key.items, function (value) {
                    if (value.id == item.id) {
                      value.items = getYear(data.data.data, item);
                      return false;
                    }
                  });
                  return false;
                }
              });
              treeService.enhance(scope.brandList);
              scope.brandList[index1].items[index2].$isChecked() && scope.brandList[index1].items[index2].$setCheckState(true);
            });
          },
          'output': function (type, item, index1, index2, index3) {
            return vehicleSelection[type]({
              brandid: item.brandid,
              seriesid: item.seriesid,
              year: item.year
            }).then(function (data) {
              scope.outputList = getOutput(data.data.data, item);
              angular.forEach(scope.brandList, function (key) {
                if (key.id == item.brandid) {
                  angular.forEach(key.items, function (value) {
                    if (value.id == item.seriesid) {
                      angular.forEach(value.items, function (key1) {
                        if (key1.year == item.year) {
                          key1.items = getOutput(data.data.data, item);
                          return false;
                        }
                      });
                      return false;
                    }
                  });
                  return false;
                }
              });
              treeService.enhance(scope.brandList);
              scope.brandList[index1].items[index2].items[index3].$isChecked() && scope.brandList[index1].items[index2].items[index3].$setCheckState(true);
            });
          },
          'model': function (type, item, index1, index2, index3, index4) {
            return vehicleSelection[type]({
              brandid: item.brandid,
              seriesid: item.seriesid,
              outputid: item.id,
              year: item.year
            }).then(function (data) {
              scope.modelList = getModel(data.data.data, item);
              angular.forEach(scope.brandList, function (key) {
                if (key.id == item.brandid) {
                  angular.forEach(key.items, function (value) {
                    if (value.id == item.seriesid) {
                      angular.forEach(value.items, function (key1) {
                        if (key1.year == item.year) {
                          angular.forEach(key1.items, function (key2) {
                            if (key2.id == item.id) {
                              key2.items = getModel(data.data.data, item);
                              return false;
                            }
                          });
                          return false;
                        }
                      });
                      return false;
                    }
                  });
                  return false;
                }
              });
              treeService.enhance(scope.brandList);
              scope.brandList[index1].items[index2].items[index3].items[index4].$isChecked() && scope.brandList[index1].items[index2].items[index3].items[index4].$setCheckState(true);
            });
          }
        };
        /**
         * 选择子项
         * @param item
         */
        var brandIndex = 0, seriesindex = 0, yearIndex = 0, outputIndex = 0;
        scope.selecthandle = function (index, item, type) {
          motor[type]();
          if (type === 'series') {
            brandIndex = index;
            var tempArray = scope.brandList;
            var temporary = tempArray[brandIndex].items;
            _.isArray(tempArray) && _.forEach(tempArray, function (key) {
              key.$open = false;
            });
            if (angular.isArray(temporary)) {
              scope.seriesList = temporary;
            } else {
              motorApi[type](type, item, brandIndex);
            }
          } else if (type === 'year') {
            seriesindex = index;
            var tempArray = scope.brandList[brandIndex].items;
            var temporary = tempArray[seriesindex].items;
            _.isArray(tempArray) && _.forEach(tempArray, function (key) {
              key.$open = false;
            });
            if (angular.isArray(temporary)) {
              scope.yearList = temporary;
            } else {
              motorApi[type](type, item, brandIndex, seriesindex);
            }
          } else if (type === 'output') {
            yearIndex = index;
            var tempArray = scope.brandList[brandIndex].items[seriesindex].items;
            var temporary = tempArray[yearIndex].items;
            _.isArray(tempArray) && _.forEach(tempArray, function (key) {
              key.$open = false;
            });
            if (angular.isArray(temporary)) {
              scope.outputList = temporary;
            } else {
              motorApi[type](type, item, brandIndex, seriesindex, yearIndex);
            }
          } else if (type === 'model') {
            outputIndex = index;
            var tempArray = scope.brandList[brandIndex].items[seriesindex].items[yearIndex].items;
            var temporary = tempArray[outputIndex].items;
            _.isArray(tempArray) && _.forEach(tempArray, function (key) {
              key.$open = false;
            });
            if (angular.isArray(temporary)) {
              scope.modelList = temporary;
            } else {
              motorApi[type](type, item, brandIndex, seriesindex, yearIndex, outputIndex);
            }
          }
          item.$open = !item.$open;
        };
        var isAddChecked = function (item, key, level) {
          return {
            1: key.brandid == item.brandid,
            2: key.brandid == item.brandid,
            3: key.brandid == item.brandid && key.seriesid == item.seriesid,
            4: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year,
            5: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid
          }[level];
        };
        var isRemoveChecked = function (item, key, level) {
          return {
            "1": key.brandid == item.brandid,
            "2": key.brandid == item.brandid && key.seriesid == item.seriesid,
            "3": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year,
            "4": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid,
            "5": key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid && key.modelid == item.modelid
          }[level];
        };
        function addList(item, checked, level) {
          if (checked) {
            /**
             *  1, 如果当前的$parent为undefined 一定是第一项
             *  2, 当前等级为一级 level = 1
             *  如果以上条件都满足，就把所有子级全部在list删除
             *  添加当前的项
             */
            if(angular.isUndefined(item.$parent) && item.level === 1){ // 第一级
              _.remove(scope.list, function (key) {
                return isRemoveChecked(item, key, level);
              });
              scope.list.push(item);
            }
            /**
             *  1, 当前选中，
             *  2, 不能是最后一级 level = 5
             *  3，当前的兄弟都没有选中
             *  如果以上条件都满足，就把所有子级全部在list删除
             *  添加当前的项
             */
            if(item.$checked && item.level !== 5 && !(item.$parent && _.every(item.$parent.items, '$checked'))){
              _.remove(scope.list, function (key) {
                return isRemoveChecked(item, key, level);
              });
              scope.list.push(item);
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
              if (level > 2) {
                $timeout(function () {
                  addList(item.$parent, true, level - 1);
                }, 1);
              } else {
                scope.list.push(item.$parent);
              }
            } else {
              scope.list.push(item);
            }
            scope.list = _.sortBy(_.uniq(scope.list), 'brandid');
          } else {
            /**
             * 先全部清除
             */
            removeList(item, level);
          }
        }

        treeService.checkStateChange = function (item, checked) {
          addList(item, checked, item.level);
        };

        /**
         * 删除列表
         * @param item
         * @param level
         */
        function removeList(item, level){
            switch (level){
              case 1:
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item, key, level);
                });
                break;
              case 2:
                console.log(2);
                var items = _.filter(item.$parent.items, function(key){
                  return key.$checked;
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent, key, item.$parent.level);
                });
                var isItems = _.filter(item.$parent.items, function(key){
                  return !key.$checked && !isRemoveChecked(item, key, level);
                });
                _.forEach(isItems, function(key){
                  _.forEach(key.items, function(key2){
                    console.log(key2);
                    if(key2.$checked){
                      scope.list.push(key2);
                    }
                  });
                });
                _.forEach(items, function(key){
                  scope.list.push(key);
                });
                break;
              case 3:
                console.log(3);
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent, key, item.$parent.$parent.level);
                });
                var items1 = _.filter(item.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items1, function(key){
                  scope.list.push(key);
                });
                var items = _.filter(item.$parent.items, function(key){
                  return key.$checked;
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent, key, item.$parent.level);
                });
                var isItems = _.filter(item.$parent.items, function(key){
                  return !key.$checked && !isRemoveChecked(item, key, level);
                });
                _.forEach(isItems, function(key){
                  _.forEach(key.items, function(key2){
                    console.log(key2);
                    if(key2.$checked){
                      scope.list.push(key2);
                    }
                  });
                });
                _.forEach(items, function(key){
                  scope.list.push(key);
                });
                break;
              case 4:
                console.log(4);
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent.$parent, key, item.$parent.$parent.$parent.level);
                });
                var items2 = _.filter(item.$parent.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items2, function(key){
                  scope.list.push(key);
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent, key, item.$parent.$parent.level);
                });
                var items1 = _.filter(item.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items1, function(key){
                  scope.list.push(key);
                });
                var items = _.filter(item.$parent.items, function(key){
                  return key.$checked;
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent, key, item.$parent.level);
                });
                var isItems = _.filter(item.$parent.items, function(key){
                  return !key.$checked && !isRemoveChecked(item, key, level);
                });
                _.forEach(isItems, function(key){
                  _.forEach(key.items, function(key2){
                    console.log(key2);
                    if(key2.$checked){
                      scope.list.push(key2);
                    }
                  });
                });
                _.forEach(items, function(key){
                  scope.list.push(key);
                });
                break;
              case 5:
                console.log(5);
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent.$parent.$parent, key, item.$parent.$parent.$parent.$parent.level);
                });
                var items3 = _.filter(item.$parent.$parent.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items3, function(key){
                  scope.list.push(key);
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent.$parent, key, item.$parent.$parent.$parent.level);
                });
                var items2 = _.filter(item.$parent.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items2, function(key){
                  scope.list.push(key);
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent.$parent, key, item.$parent.$parent.level);
                });
                var items1 = _.filter(item.$parent.$parent.items, function(key){
                  return key.$checked;
                });
                _.forEach(items1, function(key){
                  scope.list.push(key);
                });
                var items = _.filter(item.$parent.items, function(key){
                  return key.$checked;
                });
                _.remove(scope.list, function (key) {
                  return isRemoveChecked(item.$parent, key, item.$parent.level);
                });
                var isItems = _.filter(item.$parent.items, function(key){
                  return !key.$checked && !isRemoveChecked(item, key, level);
                });
                _.forEach(isItems, function(key){
                  _.forEach(key.items, function(key2){
                    console.log(key2);
                    if(key2.$checked){
                      scope.list.push(key2);
                    }
                  });
                });
                _.forEach(items, function(key){
                  scope.list.push(key);
                });
                break;
            }








          /*/!**
           *  1, 如果当前的$parent为undefined 一定是第一项
           *  2, 当前等级为一级 level = 1
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           *!/
          if(angular.isUndefined(item.$parent) && level === 1){ // 第一级
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item, key, level);
            });
            return ;
          }

          /!**
           *  1, 当前选中，
           *  2, 不能是最后一级 level = 5
           *  3，当前的兄弟都没有选中
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           *!/
          if(item.$checked && item.level !== 5 && !(item.$parent && _.every(item.$parent.items, '$checked'))){
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item, key, level);
            });
            console.log(item, true, level);


            return ;
          }


          /!**
           *  1, 当前选中，
           *  2, 查询$parent 通过父$parent查找当前兄弟是否都选中状态
           *  3，根据条件2来判断，如果2位true, 先删除不匹配的项
           *  4，然后通过当前项的等级来判断，是否递归操作,否则就添加父级
           *  5，根据条件2来判断，如果2位false就直接添加当前项
           *  如果以上条件都满足，就把所有子级全部在list删除
           *  添加当前的项
           *!/
          if (item.$parent && !_.every(item.$parent.items, '$checked')) {
            console.log(item.$parent.$isIndeterminate());
            var items = _.filter(item.$parent.items, function(key){
              return key.$checked;
            });
            _.remove(scope.list, function (key) {
              return isRemoveChecked(item.$parent, key, item.$parent.level);
            });
            _.forEach(items, function(key){
              scope.list.push(key);
            });
          }
          console.log(3333);*/

        }


        /**
         * 获取车系列表
         * @param item
         */
        function getSeriesResults(item) {
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
              "seriesid": value.seriesid,
              "brandid": value.brandid,
              "brand": encodeURI(value.brand),
              "firstletter": items.firstletter,
              "logo": value.logo,
              "title": encodeURI(getSeriesTitle(value.series, value.brand)),
              "series": encodeURI(value.series),
              "isChecked": angular.isUndefined(value.year)
            });
          });
          return _.uniq(results, 'id');
        }

        /**
         * 获取年份列表
         * @param item
         */
        function getYearResults(item) {
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
              "brand": encodeURI(value.brand),
              "firstletter": value.firstletter,
              "seriesid": value.seriesid,
              "series": encodeURI(value.series),
              "year": value.year,
              "logo": value.logo,
              "title": encodeURI(getYearTitle(getSeriesTitle(value.series, value.brand), value.year)),
              "isChecked": angular.isUndefined(value.outputid)
            });
          });
          return _.uniq(results, 'id');
        }

        /**
         * 获取排量列表
         * @param item
         */
        function getOutputResults(item) {
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
              "outputid": value.outputid,
              "brand": encodeURI(value.brand),
              "firstletter": value.firstletter,
              "year": value.year,
              "logo": value.logo,
              "title": encodeURI(getYearTitle(getSeriesTitle(value.series, value.brand), value.year) + " " + value.output),
              "output": encodeURI(value.output),
              "isChecked": angular.isUndefined(value.modelid)
            });
          });
          return _.uniq(results, 'id');
        }

        /**
         * 获取车型列表
         * @param item
         */
        function getModelResults(item) {
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
              "brand": encodeURI(value.brand),
              "firstletter": value.firstletter,
              "gearid": value.gearid,
              "logo": value.logo,
              "model": encodeURI(value.model),
              "title": encodeURI(value.model),
              "outputid": value.outputid,
              "seriesid": value.seriesid,
              "structid": value.structid,
              "year": value.year
            });
          });
          return results;
        }

        /**
         * 获取格式化数据对象
         * @param item
         * @returns {{}}
         */
        var getBrandResults = function(item){
          /**
           * 如果长度为0，直接返回{}
           */
          if(!item.length){
            return {};
          }
          var items = _.find(item, function(key){
            return key.level == 1;
          });
          if(item.length === 1 && items && items.$checked){
            return {
              brand: {
                "brand": encodeURI(items.brand),
                "firstletter": items.firstletter,
                "id": items.brandid,
                "logo": items.logo,
                "title": encodeURI(items.title),
                "isChecked": true
              }
            }
          }
          return {
            brand: {
              "brand": encodeURI(item[0].brand),
              "firstletter": item[0].firstletter,
              "id": item[0].brandid,
              "logo": item[0].logo,
              "title": encodeURI(item[0].brand),
              "isChecked": false
            },
            series: getSeriesResults(item),
            year: getYearResults(item),
            output: getOutputResults(item),
            model: getModelResults(item)
          }
        };
        var getResults = function (arr) {
          var brand = {};
          var results = [];
          _.forEach(arr, function (item) {
            if (!brand[item.brandid]) {
              brand[item.brandid] = [];
            }
            brand[item.brandid].push(item);
          });
          _.forEach(brand, function (item) {
            results.push(getBrandResults(item));
          });
          return results;
        };
        var listScope = scope.$watch('list', function (value) {
          if (value) {
            console.log('list', getResults(value));
            scope.select = getResults(value);
            //console.log('cbVehicleSelection', getResults(value));
          }
        }, true);
        /*scope.$destroy(function(){
         listScope();
         });*/
      }
    }
  }
})();
