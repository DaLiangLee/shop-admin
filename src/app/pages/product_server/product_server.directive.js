/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('productServerGoodsDialog', productServerGoodsDialog)
    .directive('productServerQuoteDialog', productServerQuoteDialog);

  /** @ngInject */
  function productServerGoodsDialog(cbDialog, productGoods, productServerChangeConfig) {
    return {
      restrict: "A",
      scope: {
        pskuids: "=",
        productcost: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        /**
         * 获取可添加的列表项
         * @param data      搜索的结果
         * @param items     已添加的列表
         */
        function getAddItmes(data, items){
          /**
           * 如果data为空，搜索返回结果为空，直接返回空数组
           */
          if(!data.length){
            return [];
          }
          /**
           * 如果items为空或者undefined，说明没有添加一项
           */
          if(!items.length){
            return data;
          }
          var results = [];
          /**
           * 循环返回的数据
           */
          angular.forEach(data, function (item) {
            if(!_.find(items, {skuid: item.skuid})){
              results.push(item);
            }
          });
          return results;
        }


        // 获取数据列表
        function getList(page, vm) {
          /**
           * 路由分页跳转重定向有几次跳转，先把空的选项过滤
           */
          if (!page) {
            return;
          }
          productGoods.list({page:page}).then(function (data) {
            if (data.data.status == 0) {
              vm.gridModel.itemList = [];
              data.data.data.length && angular.forEach(getAddItmes(data.data.data, vm.items), function (item) {
                if(item){
                  /**
                   * 这段代码处理skuvalues值的问题，请勿修改 start
                   */
                  item.skuvalues = window.eval(item.skuvalues);
                  /**
                   * 这段代码处理skuvalues值的问题，请勿修改 end
                   */
                  vm.gridModel.itemList.push(item);
                }
              });

              vm.gridModel.paginationinfo = {
                page: page * 1,
                pageSize: 10,
                total: data.data.count
              };
              vm.gridModel.loadingState = false;
            }
          }, function (data) {
            $log.debug('getListError', data);
          });
        }

        function handler(childScope){
          childScope.items = angular.copy(scope.item);
          childScope.interceptor = false;
          childScope.items = [];
          productGoods.category().then(function (data) {
            console.log(data.data.data);
            childScope.selectModel.search1.store = data.data.data;
            childScope.selectModel.search1.select = childScope.selectModel.search1.store[0].id;
            childScope.selectModel.search2.store = childScope.selectModel.search1.store[0].items;
            childScope.selectModel.search2.select = childScope.selectModel.search2.store[0].id;
          });
          console.log(productServerChangeConfig);
          /**
           * 在数组里面根据value参数获取数组中对应的数据
           * @param arr      数据
           * @param id       查询id
           * @param value    比较的字段 默认id
           */
          var getData = function (arr, id, value) {
            value = value || 'id';
            return _.find(arr, function (item) {
              return item[value] == id;
            });
          };
          /**
           * 搜索配置
           */
          childScope.selectModel = {
            search1: {
              handler: function (data) {
                console.log(getData(this.store, data));
                childScope.selectModel.search2.store = getData(this.store, data).items;

              }
            },
            search2: {

            },
            searchText: "",
            searchHandler: function () {
              console.log(this.search1.select, this.search2.select, this.searchText);

            }
          };

          /**
           * 表格配置
           */
          childScope.gridModel = {
            columns: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.columns),
            itemList: [],
            config: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.config),
            loadingState: true,      // 加载数据
            pageChanged: function (page) {    // 监听分页
              getList(page, childScope);
            }
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            addItem: function (data) {
              if(!data){
                return ;
              }
              if(!!_.find(childScope.items, {skuid: data.skuid})){
                return ;
              }
              var item = _.remove(childScope.gridModel.itemList, {skuid: data.skuid});
              if(item.length){
                item[0].count = 1;
                item[0].subtotal = item[0].saleprice;
                childScope.items.push(item[0]);
                getTotalprice();
                /**
                 * 如果当前列表小于多少项从新拉取数据
                 */
                if(childScope.gridModel.itemList.length < 5){
                  getList(childScope.gridModel.paginationinfo.page, childScope);
                }
              }

            }
          };
          /**
           * 初始化获取第一页数据
           */
          getList(1, childScope);
          /**
           * 删除一条列表
           * @param index
           */
          childScope.remove = function (index) {
            childScope.items.splice(index, 1);
            getTotalprice();
          };
          /**
           * 失去焦点，计算小计
           * @param index
           * @param item
           */
          childScope.compute = function (index, item) {
            childScope.items[index].subtotal = item.saleprice * 100 * item.count / 100;
            getTotalprice();
          };

          /**
           * 计算商品总计
           */
          function getTotalprice(){
            var price = 0;
            angular.forEach(childScope.items, function (item) {
              price += item.subtotal;
            });
            childScope.totalprice = price;
          }
          /**
           * 初始化获取商品总计
           */
          getTotalprice();

          /**
           * 确定按钮
           */
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          /**
           * 拦截确定
           */
          childScope.interceptorConfirm = function () {
              scope.pskuids = childScope.items;
              scope.productcost = childScope.totalprice;
            scope.itemHandler({data: {"status":"0", "data": childScope.item}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          if(angular.isUndefined(iAttrs.server)){

          }
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/product_server/product_server_goods_dialog.html", handler, {
            windowClass: "viewFramework-product_server_goods_dialog"
          });
        })
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
            if(angular.isUndefined(scope.item) && childScope.items.motorbrandids.length == 1){
              childScope.items.motorbrandids.push({});
            }
            scope.itemHandler({data: {"status":"0", "type": type, "data": childScope.items}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          console.log(iAttrs.server);
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
