/**
 * Created by Administrator on 2016/10/15.
 */
/*
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('simpleSelectVehicle', simpleSelectVehicle);

  /!** @ngInject *!/
  function simpleSelectVehicle(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        function handler(childScope){

          /!**
           * 确定
           *!/
          childScope.confirm = function () {
            if(!childScope.items.motorbrandids.length){
              childScope.alertWarning = "至少需要选一辆车";
              return ;
            }
            /!**
             * 解决后台bug
             *!/
            childScope.items.motorbrandids.push({});
            scope.itemHandler({data: {"status":"0", "type": type, "data": childScope.items}});
            childScope.close();
          };
        }
        /!**
         * 点击按钮
         *!/
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/user_customer/simple-select-vehicle.html", handler, {
            windowClass: "viewFramework-simple-select-vehicle-dialog"
          });
        })
      }
    }
  }
})();
*/
