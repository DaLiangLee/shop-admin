/**
 * Created by Administrator on 2016/11/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .service('treeVehicleService', treeVehicleService)
    .factory('vehicleSelection', vehicleSelection)
    .directive('cbVehicleSelection', cbVehicleSelection);

  /** @ngInject */
  function treeVehicleService(){
    var _this = this;
    var enhanceItem = function (item, childrenName, parent) {
      if (parent) {
        item.$parent = parent;
      }
      item.$hasChildren = function () {
        var subItems = this.$children();
        return angular.isArray(subItems) && subItems.length;
      };
      item.$children = function () {
        return this[childrenName] || [];
      };
      var getFlattenData = function (items) {
        var result = items || [];
        angular.forEach(items, function (item) {
          result = result.concat(getFlattenData(item.items));
        });
        return result;
      };

      item.$allChildren = function() {
        return getFlattenData(this.$children());
      };

      item.$foldToggle = function () {
        this.$folded = !this.$folded;
      };
      item.$isFolded = function () {
        return this.$folded;
      };
      var hasCheckedNode = function (node) {
        return _.find(node.$allChildren(), function(subNode) {
          return subNode.$checked;
        });
      };
      var hasUncheckedNode = function (node) {
        return _.find(node.$allChildren(), function(subNode) {
          return !subNode.$checked;
        });
      };
      var updateAncestorsState = function(node) {
        var parent = node.$parent;
        while(parent) {
          // 只有选中的子节点，没有未选中的子节点时，当前节点才设置为选中状态
          parent.$checked = hasCheckedNode(parent) && !hasUncheckedNode(parent);
          // 同时有选中的子节点和未选中的子节点时视为待定状态 （会让没有全选的父级多一个横杠）
          parent.$indeterminate = hasCheckedNode(parent) && hasUncheckedNode(parent);
          parent = parent.$parent;
        }
      };
      var setCheckState = function (node, checked) {
        node.$checked = checked;
        if (node.$hasChildren()) {
          angular.forEach(node.$children(), function (subNode) {
            setCheckState(subNode, checked);
          });
        }
        updateAncestorsState(node);
      };
      item.$check = function () {
        setCheckState(this, true);
      };
      item.$unCheck = function () {
        setCheckState(this, false);
      };
      item.$setCheckState = function(checked) {
        _this.checkStateChange(this, checked);
        //console.log('$setCheckState', this, checked);
        setCheckState(this, checked)
      };
      item.$isChecked = function () {
        return this.$checked;
      };
      item.$checkToggle = function () {
        if (this.$isChecked()) {
          this.$unCheck();
        } else {
          this.$check();
        }
      };
      item.$isIndeterminate = function () {
        return this.$indeterminate;
      };
      angular.forEach(item.$children(), function (subItem) {
        enhanceItem(subItem, childrenName, item);
      });
    };
    /**
     * 暴露选择状态改变的接口
     */
    this.checkStateChange = function(){};
    /**
     * 初始化树形菜单
     * @param items
     * @param childrenName
     * @returns {*}
     */
    this.enhance = function (items, childrenName) {
      if (angular.isUndefined(childrenName)) {
        childrenName = 'items';
      }
      angular.forEach(items, function (item) {
        enhanceItem(item, childrenName);
      });
      return items;
    };
  }


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
  function cbVehicleSelection($filter, vehicleSelection, treeVehicleService) {
    /*function getGroupList(arr){
      var result = {};
      angular.forEach(arr, function (item) {
          if(!result[item.firstletter]){
            result[item.firstletter] = [];
          }
          result[item.firstletter].push(item);
      });
      var data = [];
      angular.forEach(result, function (item, key) {
        data.push({
          group: key
        });
        angular.forEach(item, function (value) {
          data.push(value);
        });
      });
      return data;
    }*/
    function getGroupList(arr){
      return arr.concat([]);
    }
    function getSeries(arr, data){
      var results = [];
      angular.forEach(arr, function (item) {
        item.logo = data.logo;
        item.title = data.brand + ' ' +item.series;
        item.brandid = data.id;
        results.push(item);
      });
      return results;
    }
    function getYear(arr, data){
      var results = [];
      angular.forEach(arr, function (item) {
        item.title = data.title + ' ' +item.year;
        item.brandid = data.brandid;
        item.seriesid = data.id;
        results.push(item);
      });
      return results;
    }
    function getOutput(arr, data){
      var results = [];
      angular.forEach(arr, function (item) {
        item.title = data.title + ' ' +item.output;
        item.year = data.year;
        item.brandid = data.brandid;
        item.seriesid = data.seriesid;
        results.push(item);
      });
      return results;
    }
    function getModel(arr, data){
      var results = [];
      angular.forEach(arr, function (item) {
        item.title = item.model;
        item.year = data.year;
        item.brandid = data.brandid;
        item.seriesid = data.seriesid;
        item.outputid = data.id;
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










        var list = [];
        vehicleSelection['brand']().then(function(data){
          list = data.data.data;
          scope.brandList = getGroupList(treeVehicleService.enhance(data.data.data));

        });

        scope.firsthandle = function (search) {
          if (/^[A-Z]{1}$/.test(search)) {
            scope.brandList = getGroupList($filter('filter')(list, {firstletter: search}))
          } else {
            scope.brandList = getGroupList($filter('filter')(list, {brand: search}))
          }
        };
        var motor = {
          'series': function(){
            scope.seriesList = [];
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'year': function(){
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'output': function(){
            scope.outputList = [];
            scope.modelList = [];
          },
          'model': function(){
            scope.modelList = [];
          }
        };
        var clear = {
          'brand': function(){
            scope.seriesList = [];
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'series': function(){
            scope.yearList = [];
            scope.outputList = [];
            scope.modelList = [];
          },
          'year': function(){
            scope.outputList = [];
            scope.modelList = [];
          },
          'output': function(){
            scope.modelList = [];
          }
        };
        var motorApi = {
          'series': function(type, item, index){
            vehicleSelection[type]({brandid: item.id}).then(function(data){
              scope.seriesList = getSeries(data.data.data, item);
              console.log('seriesList', scope.seriesList);
              angular.forEach(scope.brandList, function (key) {
                  if(key.id && key.id == item.id){
                    key.items = getSeries(data.data.data, item);
                    return false;
                  }
              });
              treeVehicleService.enhance(scope.brandList);
              scope.brandList[index].$isChecked() && scope.brandList[index].$setCheckState(true);
            });
          },
          'year': function(type, item, index1, index2){
            vehicleSelection[type]({brandid: item.brandid, seriesid: item.id}).then(function(data){
              scope.yearList = getYear(data.data.data, item);
              console.log('yearList', scope.yearList);
              angular.forEach(scope.brandList, function (key) {
                if(key.id && key.id == item.brandid){
                  angular.forEach(key.items, function (value) {
                    if(value.id == item.id){
                      value.items = getYear(data.data.data, item);
                      return false;
                    }
                  });
                  return false;
                }
              });
              treeVehicleService.enhance(scope.brandList);
              scope.brandList[index1].items[index2].$isChecked() && scope.brandList[index1].items[index2].$setCheckState(true);
            });
          },
          'output': function(type, item, index1, index2, index3){
            return vehicleSelection[type]({brandid: item.brandid, seriesid: item.seriesid, year: item.year}).then(function(data){
              scope.outputList = getOutput(data.data.data, item);
              console.log('outputList', scope.outputList);
              angular.forEach(scope.brandList, function (key) {
                if(key.id && key.id == item.brandid){
                  angular.forEach(key.items, function (value) {
                    if(value.id == item.seriesid){
                      angular.forEach(value.items, function (key1) {
                        if(key1.year == item.year){
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
              treeVehicleService.enhance(scope.brandList);
              scope.brandList[index1].items[index2].items[index3].$isChecked() && scope.brandList[index1].items[index2].items[index3].$setCheckState(true);
            });
          },
          'model': function(type, item, index1, index2, index3, index4){
            return vehicleSelection[type]({brandid: item.brandid, seriesid: item.seriesid, outputid: item.id, year: item.year}).then(function(data){
              scope.modelList = getModel(data.data.data, item);
              console.log('modelList', scope.modelList);
              angular.forEach(scope.brandList, function (key) {
                if(key.id && key.id == item.brandid){
                  angular.forEach(key.items, function (value) {
                    console.log('model', value.id , item.seriesid);
                    if(value.id == item.seriesid){
                      angular.forEach(value.items, function (key1) {
                        if(key1.year == item.year){
                          angular.forEach(key1.items, function (key2) {
                            if(key2.id == item.id){
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
              treeVehicleService.enhance(scope.brandList);
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
          console.log(motor[type]);
          motor[type]();

          if(type === 'series'){
            brandIndex = index;
            var temporary = scope.brandList[brandIndex].items;
            if(angular.isArray(temporary)){
              scope.seriesList = temporary;
            }else{
              motorApi[type](type, item, brandIndex);
            }
          }else if(type === 'year'){
            seriesindex = index;
            var temporary = scope.brandList[brandIndex].items[seriesindex].items;
            if(angular.isArray(temporary)){
              scope.yearList = temporary;
            }else{
              motorApi[type](type, item, brandIndex, seriesindex);
            }
          }else if(type === 'output'){
            yearIndex = index;
            var temporary = scope.brandList[brandIndex].items[seriesindex].items[yearIndex].items;
            if(angular.isArray(temporary)){
              scope.outputList = temporary;
            }else{
              motorApi[type](type, item, brandIndex, seriesindex, yearIndex);
            }
          }else if(type === 'model'){
            outputIndex = index;
            console.log();
            var temporary = scope.brandList[brandIndex].items[seriesindex].items[yearIndex].items[outputIndex].items;
            if(angular.isArray(temporary)){
              scope.modelList = temporary;
            }else{
              motorApi[type](type, item, brandIndex, seriesindex, yearIndex, outputIndex);
            }
          }



         /* if(!item.open){

          }
          item.open = !item.open;*/
        };
        /**
         * 结果数组
         * @type {Array}
         */
        scope.list = [];
        /**
         * 复选框选择
         * @param item
         * @param id
         * @param type
         */
        scope.checkedHandle = function (item, id, type) {
          /*clear[type]();
          var index = _.findIndex(scope.list, function(n){
            return n.brandid == item.id;
          });
          if(index > -1 && angular.isDefined(type)){
            if(!angular.isArray(scope.list[index][type])){
              scope.list[index][type] = [];
            }
            scope.list[index][type].push(item[type]);
          }else{
            scope.list.push({brandid: item.brandid, logo: item.logo})
          }
          console.log(scope.list);*/
        };
      }
    }
  }
})();
