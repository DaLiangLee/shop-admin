/**
 * Created by Administrator on 2016/10/15.
 */

(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('userAddVehicleDialog', userAddVehicleDialog);

  /** @ngInject */
  function userAddVehicleDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        var type = iAttrs.userAddVehicleDialog;
        function handler(childScope){

          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.itemHandler({data: {"status":"0", "type": type, "data": childScope.select}});
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
          cbDialog.showDialogByUrl("app/pages/user_customer/user-add-vehicle-dialog.html", handler, {
            windowClass: "viewFramework-user-add-vehicle-dialog"
          });
        })
      }
    }
  }
})();

