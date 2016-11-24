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
  function cbVehicleSelection($filter, $timeout, vehicleSelection, treeService) {
    function getGroupList(arr) {
      var results = [];
      angular.forEach(arr, function (item) {
        item.title = item.brand;
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
        item.title = data.brand + ' ' + item.series;
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
        item.title = data.title + ' ' + item.year;
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
        item.title = data.title + ' ' + item.output;
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
        item.modelid = item.structid;
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
        /*var select = scope.$watch('select', function(value){
         if(value){
         //scope.list = getGroupList(value);
         getSelect(value);

         }
         });*/
        scope.list = [];
        vehicleSelection['brand']().then(function (data) {
          list = data.data.data;
          scope.brandList = getGroupList(treeService.enhance(data.data.data));
          scope.list = getSelect(window.eval(decodeURI('[{"brand":{"brand":"AC%20Schnitzer","firstletter":"A","id":1,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","isChecked":2},"series":[{"id":2,"brandid":1,"series":"AC%20Schnitzer%20X5"},{"id":3,"brandid":1,"series":"AC%20Schnitzer%20X6"}],"year":[{"id":12,"brandid":1,"seriesid":1,"year":"2014"},{"id":13,"brandid":1,"seriesid":1,"year":"2015"},{"id":14,"brandid":1,"seriesid":1,"year":"2016"}],"output":[{"id":111,"brandid":1,"seriesid":1,"year":"2013","output":"2.5T"},{"id":110,"brandid":1,"seriesid":1,"year":"2013","output":"2.0T"}],"model":[{"brandid":1,"gearid":23,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","model":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E9%99%90%E9%87%8F%E7%89%88","outputid":112,"seriesid":1,"structid":2,"year":"2013"},{"brandid":1,"gearid":23,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","model":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E8%BF%90%E5%8A%A8%E7%89%88","outputid":112,"seriesid":1,"structid":2,"year":"2013"}]}]')));
        });
        /**
         * 结果数组
         * @type {Array}
         */
        var list = [];


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
            return key.yearid == item.yearid;
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
          console.log(item);
          getState(item).$setCheckState(false);
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


        var getState2 = function (item) {
          var items = _.find(scope.brandList, function (key) {
            return key.brandid == item.brandid;
          });
          var items2 = _.find(items.items, function (key) {
            return key.seriesid == item.seriesid;
          });
          return items2;
        };
        var getState3 = function (item) {
          var items = _.find(scope.brandList, function (key) {
            return key.brandid == item.brandid;
          });


          var items2 = _.find(items.items, function (key) {
            return key.seriesid == item.seriesid;
          });
          console.log('item', items2);
          var items3 = _.find(items2.items, function (key) {
            return key.year == item.year;
          });

          return items3;
        };

        /**
         * 获取对应的列表，来设置状态
         * @param item
         */
        function getSelect(items) {
          if (!items.length) {
            return [];
          }
          var results = [];
          _.forEach(items, function (item) {
            var key = item.brand;
            key.brandid = key.id;
            key.title = key.brand;
            key.level = 1;
            if(angular.isUndefined(key.isChecked)){
              getState(key).$setCheckState(true);
              results.push(key);
            }
            //getState(key).$setCheckState(true);
            console.log(key);

            if (angular.isArray(item.series) && item.series.length) {
              var series = getSeries(item.series, key)[0];
              _.forEach(getSeries(item.series, key), function (value) {
                results.push(value);
              });
            }
            if (angular.isArray(item.year) && item.year.length) {
              var year = getYear(item.year, series)[0];
              _.forEach(getYear(item.year, series), function (value) {
                results.push(value);
              });
            }
            if (angular.isArray(item.output) && item.output.length) {
              var output = getOutput(item.output, year)[0];
              _.forEach(getOutput(item.output, year), function (value) {
                results.push(value);
              });
            }
            if (angular.isArray(item.model) && item.model.length) {
              _.forEach(getModel(item.model, output), function (value) {
                results.push(value);
              });
            }
            /*if (angular.isArray(item.series) && item.series.length) {
              vehicleSelection['series']({brandid: key.brandid}).then(function (data) {
                angular.forEach(scope.brandList, function (key2) {
                  if (key2.id == key.brandid) {
                    key2.items = getSeries(data.data.data, key);
                    return false;
                  }
                });
                treeService.enhance(scope.brandList);
              });
            }
            _.forEach(item.series, function (item2) {
              item2.seriesid = item2.id;
              if (angular.isArray(item.year) && item.year.length) {
                vehicleSelection['year']({brandid: item2.brandid, seriesid: item2.seriesid}).then(function (data) {
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
                });
                _.forEach(item.year, function (item3) {
                  if (angular.isArray(item.output) && item.output.length) {
                    vehicleSelection['output']({
                      brandid: item3.brandid,
                      seriesid: item3.seriesid,
                      year: item3.year
                    }).then(function (data) {
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
                    });
                    _.forEach(item.output, function (item4) {
                      vehicleSelection['model']({
                        brandid: item4.brandid,
                        seriesid: item4.seriesid,
                        outputid: item4.id,
                        year: item4.year
                      }).then(function (data) {
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
                      });
                    });
                  }
                });
              }
            });
            /!*if (angular.isArray(item.series) && item.series.length) {
              vehicleSelection['series']({brandid: key.brandid}).then(function (data) {
                angular.forEach(scope.brandList, function (key2) {
                  if (key2.id == key.brandid) {
                    key2.items = getSeries(data.data.data, key);
                    return false;
                  }
                });
                treeService.enhance(scope.brandList);
              });
              _.forEach(item.series, function (item2) {
                item2.seriesid = item2.id;
                if (angular.isArray(item.year) && item.year.length) {
                  vehicleSelection['year']({brandid: item2.brandid, seriesid: item2.seriesid}).then(function (data) {
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
                  });
                  _.forEach(item.year, function (item3) {
                    if (angular.isArray(item.output) && item.output.length) {
                      vehicleSelection['output']({
                        brandid: item3.brandid,
                        seriesid: item3.seriesid,
                        year: item3.year
                      }).then(function (data) {
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
                      });
                      _.forEach(item.output, function (item4) {
                        vehicleSelection['model']({
                          brandid: item4.brandid,
                          seriesid: item4.seriesid,
                          outputid: item4.id,
                          year: item4.year
                        }).then(function (data) {
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
                        });
                      });
                    }
                  });
                }
              });
            }*!/*/
          });
          console.log(results);

          return results;
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

        var isChecked = function (item, key, level) {
          return {
            1: key.brandid == item.brandid,
            2: key.brandid == item.brandid,
            3: key.brandid == item.brandid && key.seriesid == item.seriesid,
            4: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year,
            5: key.brandid == item.brandid && key.seriesid == item.seriesid && key.year == item.year && key.outputid == item.outputid
          }[level];
        };

        function addList(item, checked, level) {
          if (checked) {
            /**
             * 防止点击也添加当前勾选的
             */
            if (item.$parent && _.every(item.$parent.items, '$checked')) {
              _.remove(scope.list, function (key) {
                return isChecked(item, key, item.level);
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
            scope.list = _.uniq(scope.list);
          } else {
            /**
             * 先全部清除
             */
            _.remove(scope.list, function (key) {
              return isChecked(item, key, 1);
            });
            /**
             * 显示列表
             */
            getRemoveList(item);
          }
        }

        function getRemoveList(item) {
          var results = [];

          function setList(item) {
            if (!item.$parent) {
              return;
            }
            var items = _.filter(item.$parent.items, function (key) {
              return key.$checked;
            });
            _.forEach(items, function (key) {
              results.push(key);
            });
            setList(item.$parent);
          }

          $timeout(function () {
            var items2 = _.filter(results.reverse(), function (key) {
              return key.$checked;
            });
            _.forEach(items2, function (key) {
              scope.list.push(key);
            });
          }, 1);
          setList(item);
        }

        treeService.checkStateChange = function (item, checked) {
          addList(item, checked, item.level);
        };


        /**
         * 获取车品牌
         * @param item
         */
        function getBrandResults(item) {
          if (item.length) {
            return {
              "brand": encodeURI(item[0].brand),
              "firstletter": item[0].firstletter,
              "id": item[0].brandid,
              "logo": item[0].logo,
              "isChecked": item[0].brandid && item[0].seriesid
            }
          }
        }

        /**
         * 获取车系列表
         * @param item
         */
        function getSeriesResults(item) {
          if (!item.length) {
            return;
          }
          var results = [];
          var items = _.filter(item, function (key) {
            return key.brandid && key.seriesid && !key.year && !key.outputid && !key.model;
          });
          if (!items.length) {
            return;
          }
          _.forEach(items, function (value) {
            results.push({
              "id": value.seriesid,
              "brandid": value.brandid,
              "series": encodeURI(value.series)
            });
          });
          return results;
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
            return key.brandid && key.seriesid && key.year && !key.outputid && !key.model;
          });
          if (!items.length) {
            return;
          }
          _.forEach(items, function (value) {
            results.push({
              "id": value.yearid,
              "brandid": value.brandid,
              "seriesid": value.seriesid,
              "year": value.year
            });
          });
          return results;
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
            return key.brandid && key.seriesid && key.year && key.outputid && !key.model;
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
              "output": encodeURI(value.output)
            });
          });
          return results;
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
              "brandid": value.brandid,
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
            results.push({
              brand: getBrandResults(item),
              series: getSeriesResults(item),
              year: getYearResults(item),
              output: getOutputResults(item),
              model: getModelResults(item)
            });
          });
          return results;
        };
        var listScope = scope.$watch('list', function (value) {
          if (value) {
            //console.log('list', getResults(value));
            scope.select = getResults(value);
          }
        }, true);
        /*scope.$destroy(function(){
         listScope();
         });*/
      }
    }
  }
})();
