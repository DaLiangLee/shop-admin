/**
 * Created by Administrator on 2017/2/23.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('vehicleSelection', vehicleSelection)
    .directive('cbVehicleSelect', cbVehicleSelect)
    .directive('cbVehicleShow', cbVehicleShow);


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
  function cbVehicleSelect($filter, $timeout, $window, cbDialog, cbAlert, vehicleSelection, treeService) {

    function getSeriesTitle(collection, target) {
      var regular = new RegExp('^' + target);
      return regular.test(collection) ? collection : collection + " " + target;
    }

    /**
     * 设置格式化数据，供页面好操作
     * @param level
     * @param data
     * @param item
     */
    var setFormatData = function (level, data, item) {
      console.log('setFormatData', level, data, item);

      _.forEach(data, function (value) {
        value.level = level;
        if (!value.title && value.level == 1) {
          value.title = value.brand;
        } else if (!value.title && value.level == 2) {
          value.title = getSeriesTitle(value.series, item.brand);
        }
        if (angular.isUndefined(value.logo)) {
          value.logo = item.logo;
        }
        if (angular.isUndefined(value.firstletter)) {
          value.firstletter = item.firstletter;
        }
        if (angular.isUndefined(value.brand)) {
          value.brand = item.brand;
        }
        if (angular.isUndefined(value.brandid) && value.level == 1) {
          value.brandid = value.id;
        } else {
          value.brandid = item.brandid;
        }
        if (angular.isUndefined(value.seriesid) && value.level > 1) {
          if (item && item.seriesid) {
            value.seriesid = item.seriesid
          } else {
            value.seriesid = value.id;
          }
        }
        if (angular.isUndefined(value.series) && value.level > 1) {
          value.series = item.series;
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
    var isRemoveChecked = function (item, key, level) {
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
        select: "=",
        handler: "&"
      },
      link: function (scope, iElement, iAttrs) {
        var getSubmitData = {
          'series': function (item) {
            return {
              brandid: item.brandid
            };
          }
        };
        var brandList = [];

        function handler(childScope) {
          /**
           * 结果数组
           * @type {Array}
           */
          console.log(angular.toJson(scope.select));
          /**
           * 加载子数据
           * @param level    当前等级
           * @param item     当前项
           * @param type     当前类型
           * @param listType 当前列表类型
           * @param callback 回调函数
           * @constructor
           */
          function loadingSubData(level, item, type, listType, callback) {
            vehicleSelection[type](getSubmitData[type](item)).then(function (data) {
              item.items = setFormatData(level, data.data.data, item);
              childScope[listType] = setFormatData(level, data.data.data, item);
              treeService.enhance(childScope.brandList);
              callback && callback();
            });
          }

          var clearSubkeys = {
            'series': function () {
              childScope.seriesList = [];
              return childScope.brandList;
            }
          };

          /**
           * 获取对应的列表，来设置状态
           * @param item
           */
          var getState = function (item) {
            var items = _.find(childScope.brandList, function (key) {
              return key.brandid == item.brandid;
            });
            if (_.isUndefined(items.items)) {
              return items;
            }
            var items2 = _.find(items.items, function (key) {
              return key.seriesid == item.seriesid;
            });
            if (_.isUndefined(items2.items)) {
              return items2;
            }
          };


          /**
           * 获取车辆品牌列表
           */
          childScope.brandList = setFormatData(1, treeService.enhance(brandList));
          if (angular.isDefined(scope.select)) {
            childScope.dataLists = [];
            if (angular.isArray(scope.select)) {
              getSelect(scope.select);
            } else {
              getSelect(angular.fromJson(scope.select));
            }
            console.log(childScope.dataLists);
          }else{
            childScope.dataLists = [];
          }


          childScope.$watch('dataLists', function () {
            console.log(arguments);
          });


          /**
           * 获取对应的列表，来设置状态
           * @param item
           */
          function getSelect(arr) {
            if (angular.isUndefined(arr) || !arr.length) {
              return [];
            }
            var results = [];
            _.forEach(arr, function (item) {
              var key = item.brand;
              key.title = key.brand;
              key.level = 1;
              if (key.isChecked) {
                getState(key).$setCheckState(true);
                results.push(key);
                childScope.dataLists.push(getState(key));
              } else {
                getState(key).$setCheckState(false);
              }
              if (_.isArray(item.series) && item.series.length) {
                _.forEach(item.series, function (value) {
                  value.level = 2;
                  results.push(value);
                });
              }
            });
            getSubKeysData(results);
            return results;
          }

          function getSubKeysData(data) {
            var result = {};
            _.forEach(data, function (item) {
              if (!result[item.level]) {
                result[item.level] = [];
              }
              result[item.level].push(item);
            });


            result[2] && _.forEach(_.uniq(result[2], 'brandid'), function (value) {
              var items = _.filter(result[2], function (n) {
                return n.brandid == value.brandid && !n.isChecked;
              });
              var parent = getState(value);

              loadingSubData(2, parent, 'series', 'seriesList', function () {
                var currentArray = _.filter(result[2], function (n) {
                  return n.brandid == value.brandid;
                });
                _.forEach(currentArray, function (value2) {
                  getState(value2).$setCheckState(true);
                });
              });
            });
          }



          /**
           * 获取车系
           */
          childScope.selecthandle = function (level, item, type, listType) {
            _.forEach(clearSubkeys[type](), function (key) {
              key.$open = false;
            });
            if (angular.isArray(item.items)) {
              childScope[listType] = item.items;
            } else {
              loadingSubData(level, item, type, listType, function () {
                item.$isChecked() && item.$setCheckState(true);
              });
            }
            item.$open = !item.$open;
          };

          /**
           * 在列表删除当前项
           * 只需要给当前项设置取消选中状态即可
           */
          childScope.removeHandle = function (item) {
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
           * 设置列表
           * 自动去重排序返回一个新列表
           * @param list
           */
          function setList(list) {
            childScope.dataLists.push(list);
            childScope.dataLists = _.sortBy(_.uniq(childScope.dataLists), 'brandid');
            console.log('setList', childScope.dataLists);
          }

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
            if (angular.isUndefined(item.$parent)) { // 第一级
              _.remove(childScope.dataLists, function (key) {
                return isRemoveChecked(item, key, item.level);
              });
              setList(item);
              return;
            }
            /**
             *  1, 当前选中，
             *  2, 不能是最后一级 level = 5
             *  3，当前的兄弟都没有选中
             *  如果以上条件都满足，就把所有子级全部在list删除
             *  添加当前的项
             */
            if (item.$checked && item.level != 5 && !(item.$parent && _.every(item.$parent.items, '$checked'))) {
              _.remove(childScope.dataLists, function (key) {
                return isRemoveChecked(item, key, item.level);
              });
              setList(item);
              return;
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
              _.remove(childScope.dataLists, function (key) {
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
            _.remove(childScope.dataLists, function (key) {
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
            if (item.$parent) {
              _.remove(childScope.dataLists, function (key) {
                return isRemoveChecked(item.$parent, key, item.level);
              });
              _.forEach(item.$siblings(), function (key) {
                if (angular.isUndefined(key.$isIndeterminate()) && key.$checked) {
                  key.$setCheckState(true);
                }
              });
              if (item.level > 2) {
                $timeout(function () {
                  removeList(item.$parent);
                }, 100);
              }
            }
          }


          /**
           * 获取结果数据
           * @param data
           */
          function getResults(data) {
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
            function getBrand(item) {
              return {
                "brand": item[0].brand,
                "firstletter": item[0].firstletter,
                "id": item[0].brandid,
                "brandid": item[0].brandid,
                "logo": item[0].logo,
                "isChecked": item.length === 1 && item[0].$checked
              }
            }

            function getSeries(item) {
              if (!item.length) {
                return;
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
                  "series": value.series,
                  "seriesid": value.seriesid
                });
              });
              return _.uniq(results, 'id');
            }

            _.forEach(brand, function (item) {
              results.push({
                brand: getBrand(item),
                series: getSeries(item)
              });
            });
            return results;
          }

          childScope.confirm = function () {
            console.log(getResults(childScope.dataLists));
            scope.handler({data: {"status": "0", "data": getResults(childScope.dataLists)}});
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status": "-1", "data": "选择适用车型打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          /**
           * 获取车辆品牌列表
           */
          vehicleSelection['brand']().then(function (results) {
            if (results.data.status == 0) {
              brandList = results.data.data;
              cbDialog.showDialogByUrl("app/components/cbVehicle/cbVehicleSelect.html", handler, {
                windowClass: "viewFramework-cb-vehicle-select-dialog"
              });
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });


        });
      }
    }
  }


  /** @ngInject */
  function cbVehicleShow($document, $timeout, configuration) {
    var link = configuration.getConfig().static;
    console.log(link);
    return {
      restrict: "A",
      scope: {
        store: "=",
        handler: "&"
      },
      templateUrl: "app/components/cbVehicle/cbVehicleShow.html",
      link: function (scope, iElement, iAttrs) {
        // 显示个数
        var size = 4;

        if(iAttrs.cbVehicleShow !== "edit"){
          iElement.find('.vehicle-edit').remove();
        }

        var listLength = 0;
        setLsit();
        addMoreClass();

        /**
         * 根据列表长度显示 设置更多class，做一些其他处理
         */
        function addMoreClass(){
          iElement.find('.brand-box').toggleClass('more', listLength > size);
        }

        /**
         * 设置页面显示列表
         * 拼合logo地址
         * 获取列表长度
         */
        function setLsit(){
          scope.list = [];
          if(angular.isDefined(scope.store)){
            scope.list = angular.fromJson(scope.store);
          }
          listLength = scope.list.length;
          _.map(scope.list, function (item) {
            item.brand.logo = link + item.brand.logo;
          });
        }

        scope.length = size;
        scope.isOpen = false;
        scope.opend = function () {
          scope.length = scope.isOpen ? size : listLength;
          scope.isOpen = !scope.isOpen;
        };

        scope.vehicleShow = function (data) {
          if (data.status == 0) {
            console.log('vehicleShow', data);
            scope.store = data.data;
            setLsit();
            addMoreClass();
            $timeout(function(){
              scope.length = listLength;
              scope.isOpen = true;
            },100);
            scope.handler({data: {"status": "0", "data": scope.store}});
          }
        };


        // 处理点击非当前位置，都会收起
        iElement.on('click', function (event) {
          event.stopPropagation();
        });
        $document.on('click', function(){
          scope.$apply(function(){
            scope.isOpen = false;
            scope.length = size;
          });
        });
      }
    }
  }
})();
