/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('adjustPricesDialog', adjustPricesDialog)
    .directive('addSkuvaluesDialog', addSkuvaluesDialog);

  /** @ngInject */
  function adjustPricesDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          childScope.item = angular.copy(scope.item);
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            scope.itemHandler({data: {"status":"0", "data": childScope.item}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_goods/product_goods_adjust_prices_dialog.html", handler, {
            windowClass: "viewFramework-adjust-prices-dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function addSkuvaluesDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        store: "=",
        exist: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          childScope.message = false;
          /**
           * 获取当前索引sku信息
           * @type {*}
           */
          childScope.store =  _.chain(scope.store)
            .tap(function(array) {
              _.map(array, function(item){
                item.$select = undefined;
                item.$preValue = undefined;
                item.$items = angular.copy(item.items);
              });
            })
            .tap(function(array) {
              _.map(array, function(item){
                item.$items = angular.copy(item.items);
              });
            })
            .tap(function(array) {
              _.map(array, function(item){
                _.forEach(findExistData(item.id), function(items){
                  _.remove(item.$items, {'id': items.items[0].id});
                });
              });
            })
            .value();
          function findExistData(id){
            var items = [];
            _.forEach(scope.exist, function(item){
              _.find(item.skuvalues, {'id': id}) && items.push(_.find(item.skuvalues, {'id': id}));
            });
            return items;
          }

          /**
           * 选择一个value
           * @param data  选择的数据
           * @param item  父项
           */
          childScope.selectHandler = function (data, item) {
            item.$preValue = _.find(item.items, function (key) {
              return key.id == data;
            });
            childScope.message = false;
          };
          childScope.confirm = function () {
            var results = getData();
            if(childScope.store.length && !results.length){
              childScope.message = true;
              return ;
            }
            scope.itemHandler({data: {"status":"0", "data": results}});
            childScope.close();
          };

          /**
           * 获取提交的数据
           */
          function getData(){
            var results = [];
            _.forEach(childScope.store, function(item){
              item.$preValue && item.$items.length && results.push({
                id: item.id,
                skuname: item.skuname,
                skutype: item.skutype,
                sort: item.sort,
                items: [item.$preValue]
              });
            });
            return results;
          }

        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_goods/product_goods_add_skuvalues_dialog.html", handler, {
            windowClass: "viewFramework-add-skuvalues-dialog"
          });
        })
      }
    }
  }
})();
