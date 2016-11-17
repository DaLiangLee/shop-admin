/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('adjustPricesDialog', adjustPricesDialog);

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

})();
