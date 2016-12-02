/**
 * Created by Administrator on 2016/11/21.
 */
(function() {
  /**
   *  store              列表选择数据
   *  select             已经选择数据
   *  selectHandler      选择值以后的回调
   */
  'use strict';

  angular
    .module('shopApp')
    .directive('cbModifiedItems', cbModifiedItems);

  /** @ngInject */
  function cbModifiedItems(cbAlert, utils){
    /**
     * 根据scope.skuQueue 获取返回结果的值
     * @param arr      skuQueue
     */
    var getSelect = function (arr, data) {
      if(!arr.length){
        return [];
      }
      var results = [];
      arr = angular.copy(arr);
      data = angular.copy(data);
      angular.forEach(arr, function (item) {
        var items = _.find(data, function(n){
          return n.id == item.sku;
        });
        _.remove(items.items, function (n) {
          return n.id != item.skuid;
        });
        results.push(items);
      });
      return results;
    };
    /**
     * 根据入口数据来格式化sku数据
     * @param list
     * @returns {Array}
     */
    function getSkuQueue(list){
      if(angular.isUndefined(list)){
        return [];
      }
      var results = [];
      angular.forEach(list, function (item) {
        results.push({
          sku: item.id,
          skuid: item.items[0].id
        });
      });
      return results;
    }
    return {
      restrict: "A",
      scope: {
        store: "=",
        select: "=",
        selectHandler: "&"
      },
      templateUrl: "app/components/cbModifiedItems/cbModifiedItems.html",
      link: function(scope){
        var dataLists = [];
        /**
         * 监听数据变化
         * @type {(()=>void)|*|(())}
         */
        var store = scope.$watch('store', function (value) {
          console.log(value);
          if(value){
            scope.skuQueue = getSkuQueue(scope.select);
            scope.size = angular.copy(value);
            dataLists = angular.copy(value);
            scope.items = setItems(scope.skuQueue, scope.size);
            scope.skuDataLength = value.length - scope.skuQueue.length;
            console.log(value , scope.skuQueue);
            scope.selectHandler({data: {data: scope.select || [], every: _.every(scope.skuQueue, 'skuid')}});
          }
        });
        /**
         * 创建一个sku项目
         * @param arr    sku数据列表
         * @param sku    sku属性id
         * @param skuid  sku值id
         * @returns {}   一个对象供view使用
         */
        function createSkuItem(arr, sku, skuid) {
          var result = {
            sku: {
              select: sku,
              $store: arr || [],
              $handler: function (data) {
                result.skuid.$store = getSkuidItems(arr, data);
                scope.skuQueue.push({
                  sku: data,
                  skuid: undefined
                });
                _.remove(scope.size, function (item) {
                  return item.id == data;
                });
                scope.selectHandler({data: {data: getSelect(scope.skuQueue, dataLists), every: _.every(scope.skuQueue, 'skuid')}});
              }
            },
            skuid: {
              select: skuid,
              $store: getSkuidItems(arr, sku),
              $handler: function (data) {
                result.skuid.select = data;
                _.find(scope.skuQueue, {sku: sku || result.sku.select}).skuid = data;
                scope.select = getSelect(scope.skuQueue, dataLists);
                scope.selectHandler({data: {data: scope.select, every: _.every(scope.skuQueue, 'skuid')}});
              }
            }
          };
          return result;
        }
        function getSkuidItems(arr, id){
          if(angular.isUndefined(id)){
            return [];
          }
          return angular.isUndefined(utils.getData(arr, id)) ? [] : utils.getData(arr, id).items;
        }
        /**
         * 设置sku，编辑时候使用
         */
        function setItems(list, data) {
          if(!list.length){
            return [createSkuItem(data)];
          }
          var results = [];
          angular.forEach(list, function (item) {
            var sku = _.remove(data, function(n){
              return n.id == item.sku;
            });
            results.push(createSkuItem(sku, item.sku, item.skuid));
          });
          return results;
        }
        /**
         * 规格添加删除
         * @param index    当前列表索引
         * @param id       当前项的sku
         * @param status   当前是添加还是删除，true是添加，false是删除
         */
        scope.changeSize = function (index, id, status) {
          if (status) {
            // 添加
            if(angular.isObject(scope.skuQueue[index]) && angular.isUndefined(scope.skuQueue[index].skuid)){
              cbAlert.alert('请选择对应的规格值');
              return ;
            }
            // 添加
            if(angular.isUndefined(scope.skuQueue[index])){
              cbAlert.alert('请选择规格属性');
              return ;
            }
            scope.items.splice(index + 1, 0, createSkuItem(scope.size));
            scope.skuDataLength--;

          } else {
            // 删除
            // 至少要保留一项
            if (scope.items.length < 2) {
              return;
            }
            scope.items.splice(index, 1);
            scope.skuDataLength++;
            _.remove(scope.skuQueue, {sku: id});
            if (scope.size.length < dataLists.length) {
              angular.isDefined(id) && scope.size.push(utils.getData(dataLists, id));
            }
          }
        };

        /**
         * 销毁操作
         */
        scope.$on('$destroy', function() {
          store();
          dataLists = null;
        });
      }
    }
  }

})();
