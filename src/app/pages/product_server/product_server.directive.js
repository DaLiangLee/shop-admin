/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('productServerQuoteDialog', productServerQuoteDialog);

  /** @ngInject */
  function productServerQuoteDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        var type = iAttrs.productServerQuoteDialog;
        function handler(childScope){
          if(angular.isUndefined(scope.item)){
            childScope.items = {
              serverid: iAttrs.server,
              motorbrandids: [],
              saleprice: "",
              warranty: 12,
              productcost: 0,
              status: 1,
              psku: [{}]
            };
          }else{
            childScope.items = angular.copy(scope.item);
          }
          /**
           * 确定
           */
          childScope.confirm = function () {
            if(!childScope.items.motorbrandids.length){
              childScope.alertWarning = "至少需要选一辆车";
              return ;
            }
            /**
             * 解决后台bug
             */
            childScope.items.motorbrandids.push({});
            scope.itemHandler({data: {"status":"0", "type": type, "data": childScope.items}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          if(iAttrs.productServerQuoteDialog === "add" && !iAttrs.server){
            scope.itemHandler({data: {"status":"1", "data":"请先填写基本信息并保存"}});
            return ;
          }
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_server/product_server_quote_dialog.html", handler, {
            windowClass: "viewFramework-product_server_quote_dialog"
          });
        })
      }
    }
  }
})();
