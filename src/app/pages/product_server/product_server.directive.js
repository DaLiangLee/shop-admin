/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('serverCategory', serverCategory)
    .directive('dragItem', dragItem)
    .directive('productServerQuoteDialog', productServerQuoteDialog)
    .directive('showMoreMotorsLogo',showMoreMotorsLogo);

  /** @ngInject */
  function serverCategory() {
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/product_server/server_category.html",
      scope: {
        store: "=",
        step: "=",
        servername: "=",
        handler: "&"
      },
      link: function(scope){
        scope.folded = false;
        scope.category = _.pick(scope.servername, ['servername', 'scateid2']);
        _.forEach(scope.store, function (subItem) {
          subItem.$active = subItem.id*1 === scope.category.scateid2*1;
        });
        scope.select = function ($event, item) {
          _.forEach(scope.store, function (subItem) {
            subItem.$active = false;
          });
          item.$active = true;
          scope.category = {
            servername: item.catename,
            scateid2: item.id
          };
          scope.folded = true;
          console.log(scope.category);
          scope.handler({data: scope.category});
        };
        scope.folded = false;
        scope.params = {
          catename: ""
        };

        scope.input = {
          search: function () {
            scope.params = {
              catename: scope.input.name
            }
          }
        };
        scope.process = {
          toggle: function () {
            scope.folded = !scope.folded;
          }
        };
        scope.getServername = function () {
          if(!_.isEmpty(scope.category.servername)){
            scope.process.toggle();
            scope.handler({data: scope.category});
          }
        };

        scope.getServername();
      }
    }
  }

  /** @ngInject */
  function dragItem() {
    return {
      restrict: "A",
      scope: {
        dragEnd: "&"
      },
      link: function(scope, iElement){
        var parent = iElement.parent();
        var dragSrcEl = null;
        var lastDrag = null;
        iElement.on('dragstart', function (event) {
          /*拖拽开始*/
          event.originalEvent.dataTransfer.effectAllowed = "move";
          event.originalEvent.dataTransfer.setData("index", angular.element(iElement).index());
          event.originalEvent.dataTransfer.setDragImage(event.target, 0, 0);
          dragSrcEl = event.target;
          return true;
        });
        iElement.on('dragenter', function () {
          if(dragSrcEl !== this){
            angular.element(this).addClass('drag');
          }
          return true;
        });
        iElement.on('dragover', function (event) {
          //console.log('拖动过程中 dragover')
          /*拖拽元素在目标元素头上移动的时候*/
          event.preventDefault();
          event.originalEvent.dataTransfer.dropEffect = 'move';
          return false;
        });
        iElement.on('dragleave', function () {
          /*拖拽元素进入目标元素头上的时候*/
          angular.element(this).removeClass('drag');
          return true;
        });
        iElement.on('drop', function (event) {
          scope.dragEnd({data: {targetIndex: angular.element(this).index(), currentIndex:  event.originalEvent.dataTransfer.getData('index') * 1}});
          scope.$apply();
        });
        iElement.on('dragend', function () {
          /*拖拽结束*/
          dragSrcEl = null;
          lastDrag = null;
          parent.children().removeClass('drag');
          return false
        });
      }
    }
  }

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

  function showMoreMotorsLogo(){
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/product_server/showMoreMotorsLogo",
      scope: {
        store: "=",
        step: "=",
        servername: "=",
        handler: "&"
      },
      link: function (scope) {

      }
    }
  }
})();
