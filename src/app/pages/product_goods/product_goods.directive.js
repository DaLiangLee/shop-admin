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
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          /**
           * 获取当前索引sku信息
           * @type {*}
           */
          childScope.store = [];
          angular.forEach(scope.store, function(item){
            item.$$items = angular.copy(item.items);
            childScope.store.push(item);
          });


          /**
           * 选择一个value
           * @param data  选择的数据
           * @param item  父项
           */
          childScope.selectHandler = function (data, item) {
            item.$$preValue = _.find(item.items, function (key) {
              return key.id == data;
            });
          };
          childScope.confirm = function () {
            scope.itemHandler({data: {"status":"0", "data": getData()}});
            childScope.close();
          };

          /**
           * 获取提交的数据
           */
          function getData(){
            var results = [];
            angular.forEach(childScope.store, function(item){
              item.$$preValue && results.push({
                id: item.id,
                skuname: item.skuname,
                skutype: item.skutype,
                sort: item.sort,
                items: [item.$$preValue]
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
