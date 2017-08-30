/**
 * Created by Administrator on 2017/06/08.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('showJkDetail', showJkDetail)
    // .directive('jkProductDialog', orderProductDialog)
    // .directive('jkServiceDialog', orderServiceDialog)
    .directive('qr', showQR);


  /* function formatMoney(price) {
   if (_.isUndefined(price)) {
   price = 0;
   }
   if (!angular.isString(price)) {
   price = price.toString();
   }

   var index = price.lastIndexOf('.');
   if (index === -1) {
   return price + '.00';
   } else {
   var precision = price.split('.')[1].length;

   if (precision === 1) {
   return price + '0';
   }
   return price;
   }
   }*/

  /** @ngInject */
  function showJkDetail(cbDialog, marktingJk, cbAlert, copyAndCreat,tadeOrder, utils, computeService, $state, $window) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          if (scope.item.availableInWeek) {
            scope.item.availableInWeek = angular.fromJson(scope.item.availableInWeek);
          }

          /**
           * 弹窗数据源dataBase
           * @type {*}
           */
          childScope.dataBase = scope.item;
          /**
           * 增加二维码信息配置
           */
          childScope.dataBase.qrConfig = {
            render: "canvas",
            text: scope.item.qrcode,
            height: 200,
            width: 200
          };

          /**
           * 复制并新建按钮功能函数，将当前积客券信息存入localStorage中，并跳转到新增积客券页面
           */

          /**
           * 停用
           * @type {*}
           */

          function changeStatus(item) {  // cb-switch
            var tips = item.status == '0' ? '确定开启积客券？' : '确定停用积客券？';
            cbAlert.ajax(tips, function (isConform) {
              if (isConform) {
                var items = {};
                items.status = item.status == '0' ? 1 : 0;
                items.id = item.id;
                marktingJk.changeStatus(items).then(function (results) {
                  if (results.data.status === 0) {
                    cbAlert.tips('修改成功');
                    // getList(currentParams);
                    childScope.close();
                    $state.reload();
                  } else {
                    cbAlert.error(results.data.data);
                  }
                });
              } else {
                cbAlert.close();
              }
            }, '', 'confirm');
          }


          var flag = scope.item;
          childScope.savePackage = function () {
            var sendData = {
              name: flag.name,
              price: computeService.pullMoney(flag.price),
              num: flag.num === "0" ? "" : flag.num,
              numPerUser: flag.numPerUser,
              itemScope: flag.itemScope,
              scopeType: flag.scopeType ? flag.scopeType : 0,
              conditionPrice: flag.conditionPrice ? computeService.pullMoney(flag.conditionPrice) : "0",
              canMix: flag.canMix,
              availableDays: flag.availableDays,
              start: flag.start,
              end: flag.end,
              dateOrtime: !flag.availableDays,
              availableInWeek: flag.availableInWeek,
              instruction: flag.instruction,
              status:1
            };
            /*var sendData = _.assign({},flag);
            sendData.price = computeService.pullMoney(flag.price);
            sendData.num = flag.num === "0" ? "" : flag.num;
            sendData.scopeType = flag.scopeType ? flag.scopeType : 0;
            sendData.conditionPrice = computeService.pullMoney(flag.conditionPrice);
            sendData.dateOrtime = !flag.availableDays;
            sendData.status = flag.status?1:0;*/
            // $window.sessionStorage.setItem("newJkData", angular.toJson(sendData));
            // sendData = _.omit(sendData,["qrConfig","qrcode"]);
            copyAndCreat.setData(sendData);
          };

          /*childScope.stopUse = function(){
            changeStatus(scope.item);
          };*/
          childScope.showWarningTips = false;
          childScope.showTips = function(){
            childScope.showWarningTips = true;
          };
          childScope.changeState = function(){
            var items = {};
            items.status = scope.item.status == '0' ? 1 : 0;
            items.id = scope.item.id;
            marktingJk.changeStatus(items).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('修改成功');
                childScope.close();
                $state.reload();
              } else {
                cbAlert.error(results.data.data);
              }
            });
          };
          /*childScope.startUse = function(){
            var items = {};
            items.status = scope.item.status == '0' ? 1 : 0;
            items.id = scope.item.id;
            marktingJk.changeStatus(items).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('修改成功');
                childScope.close();
                $state.reload();
              } else {
                cbAlert.error(results.data.data);
              }
            });
          };*/
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/markting_jk/jk_detail.html", handler, {
            windowClass: "viewFramework-add-jk-dialog"
          });
        });
      }
    }
  }

  function showQR() {
    return {
      restrict: "A",
      scope: {
        // config: '=',
        text: '@',
        render: '@',
        width: '@',
        height: '@'
      },
      link: function (scope, iElement) {
        /**
         * 使用jquery.qrcode.js绘制二维码
         * render:渲染方式，tabel和canvas中可选，默认为canvas、非必传
         * text：二维码内容，必传
         * width/height：二维码宽高，默认都为200，非必传
         */
        if (!scope.text) {
          //如果没有传入text、直接返回
          console.log('没有传入text字段');
          return false;
        }
        var DEFAULT_CONFIG = {render: "canvas", width: 200, height: 200};
        var config = {render: scope.render, text: scope.text, width: scope.width, height: scope.height};
        config = _.merge({}, DEFAULT_CONFIG, config);
        angular.element(iElement).qrcode(config);
      }
    }
  }

  /** @ngInject */
  /*function orderProductDialog(cbDialog, category, cbAlert, computeService, productGoods, tadeOrder) {
   return {
   restrict: "A",
   scope: {
   items: "=",
   handler: "&"
   },
   link: function (scope, iElement) {
   var product = null;
   var isOpen = false;

   function handler(childScope) {
   /!**
   * 初始化数据
   *!/
   initData();
   childScope.tabindex = 0;

   childScope.toggleTab = function (index) {
   childScope.tabindex = index;
   };

   /!**
   * 点击获取常用商品
   * @param $event
   * @param item
   *!/
   childScope.productcommonlyusedHandler = function ($event, item) {
   if (item.$disabled) {
   return;
   }
   if (!item.$folded) {
   item.$folded = true;
   childScope.dataSources.push(item);
   } else {
   childScope.removeItem(null, item);
   }
   };

   tadeOrder.getOrderProduct({pageSize: 100000, commonlyused: true, status: "1"}).then(function (results) {
   if (results.data.status === 0) {
   // console.log(results.data.data);
   _.forEach(results.data.data, function (item) {
   item.itemsku = angular.toJson(item);
   item.$folded = isExist(item.guid);
   item.$disabled = isDisabled(item.guid);
   item.itemname = item.cnname + " " + item.productname + " " + item.manualskuvalues;
   item.itemid = item.productid;
   item.pskuid = item.guid;
   item.remark = "";
   item.price = formatMoney(computeService.pullMoney(item.salepriceText));
   item.num = 1;
   item.$allprice = computeService.multiply(item.num, item.price);
   });
   childScope.productcommonlyused = results.data.data;
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });

   /!**
   * 点击一级类目获取二级类目
   * @param $event
   * @param item
   *!/
   childScope.parentclassHandler = function ($event, item) {
   if (!item.$folded) {
   _.forEach(childScope.parentclass, function (item) {
   item.$folded = false;
   });
   item.$folded = true;
   childScope.subclass = item.items;
   childScope.productname = [];
   }
   };

   /!**
   * 点击二级类目获取商品名称
   * @param $event
   * @param item
   *!/
   childScope.subclassHandler = function ($event, item) {
   if (!item.$folded) {
   _.forEach(childScope.subclass, function (item) {
   item.$folded = false;
   });
   item.$folded = true;
   getProductname(item.parentid, item.id);
   childScope.productspec = [];
   }
   };

   /!**
   * 点击商品名称获取规格属性
   * @param $event
   * @param item
   *!/
   childScope.productnameHandler = function ($event, item) {
   if (!item.$folded) {
   _.forEach(childScope.productname, function (item) {
   item.$folded = false;
   });
   item.$folded = true;
   getProductspec(item.guid);
   }
   };

   childScope.productspecHandler = function ($event, item) {
   if (item.$disabled) {
   return;
   }
   if (!item.$folded) {
   item.$folded = true;
   childScope.dataSources.push(item);
   } else {
   childScope.removeItem(null, item);
   }
   };

   /!**
   * 用户点击删除某个提交的数据
   * @param $event
   * @param item
   *!/
   childScope.removeItem = function ($event, item) {
   var index = _.findIndex(childScope.productspec, {'guid': item.guid});
   if (index > -1) {
   childScope.productspec[index].$folded = false;
   }
   var index2 = _.findIndex(childScope.productcommonlyused, {'guid': item.guid});
   if (index2 > -1) {
   childScope.productcommonlyused[index2].$folded = false;
   }
   _.remove(childScope.dataSources, {'guid': item.guid});
   };

   /!**
   * 获取所有的商品名称
   * @param pcateid1
   * @param pcateid2
   *!/
   function getProductname(pcateid1, pcateid2) {
   productGoods.list({
   pcateid1: pcateid1,
   pcateid2: pcateid2,
   page: 1,
   pageSize: 1000000000
   }).then(function (results) {
   if (results.data.status === 0) {
   childScope.productname = results.data.data;
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });
   }

   /!**
   * 获取商品名称下面所有规格属性
   * @param id
   *!/
   function getProductspec(id) {
   productGoods.getProductSkus({id: id}).then(function (results) {
   if (results.data.status === 0) {
   if (results.data.data.items) {
   var items = _.omit(results.data.data, ['items']);
   _.forEach(results.data.data.items, function (item) {
   var itemsku = _.clone(items);
   itemsku['items'] = [item];
   item.itemsku = angular.toJson(itemsku);
   item.$folded = isExist(item.guid);
   item.$disabled = isDisabled(item.guid);
   item.itemname = results.data.data.brandname + " " + results.data.data.productname + " " + item.manualskuvalues;
   item.itemid = results.data.data.guid;
   item.pskuid = item.guid;
   item.remark = "";
   item.price = formatMoney(computeService.pullMoney(item.saleprice));
   item.num = 1;
   item.$allprice = computeService.multiply(item.num, item.price);
   });
   childScope.productspec = _.filter(results.data.data.items, {"status": "1"});
   } else {
   childScope.productspec = [];
   }
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });
   }

   /!**
   * 检查当前这些是否在提交列表中
   * @param id
   * @returns {boolean}
   *!/
   function isExist(id) {
   return !_.isUndefined(_.find(childScope.dataSources, {'guid': id}));
   }

   /!**
   * 存在需要禁用选择
   *!/
   function isDisabled(id) {
   return scope.items && scope.items.length && !_.isUndefined(_.find(scope.items, {'pskuid': id}));
   }

   /!**
   * 获取提交数据
   * @param data
   *!/
   function getData(data) {
   var results = {
   productprice: 0,
   itemList: null
   };
   // results.itemList = _.map(data, function (item) {
   //   return _.pick(item, ['$allprice', 'itemname', 'price', 'num', 'servicer', 'servicername', 'remark', 'itemsku', 'itemid', 'pskuid', 'itemtype', 'commonlyused']);
   // });
   results.itemList = data;
   results.productprice = _.reduce(results.itemList, function (result, value) {
   return computeService.add(result, value.$allprice);
   }, 0);
   return results;
   }

   /!**
   * 确定
   *!/
   childScope.confirm = function () {
   var data = getData(childScope.dataSources);
   scope.handler({data: {"status": "0", "data": data.itemList}});
   childScope.closed();
   };

   childScope.closed = function () {
   isOpen = false;
   childScope.close();
   };


   /!**
   * 初始化数据
   *!/
   function initData() {
   /!**
   * 获取一级类目列表
   *!/
   childScope.parentclass = _.cloneDeep(product);

   /!**
   * 获取二级类目列表
   *!/
   childScope.subclass = null;

   /!**
   * 服务名称列表
   *!/
   childScope.productname = null;

   /!**
   * 服务规格列表
   * @type {Array}
   *!/
   childScope.productspec = null;

   /!**
   * 提交选择的服务列表
   * @type {Array}
   *!/
   childScope.dataSources = [];
   }
   }

   /!**
   * 点击按钮
   *!/
   iElement.click(function (t) {
   if (isOpen) {
   return false;
   }
   isOpen = true;
   scope.handler({data: {"status": "-1", "data": "打开成功"}});
   t.preventDefault();
   t.stopPropagation();
   /!**
   * 获取筛选类目
   *!/
   category.goods().then(function (results) {
   product = results;
   cbDialog.showDialogByUrl("app/pages/trade_order/order-product-dialog.html", handler, {
   windowClass: "viewFramework-order-product-dialog"
   });
   });
   });
   }
   }
   }*/

  /** @ngInject */
  /*  function orderServiceDialog($filter, cbDialog, cbAlert, computeService, category, productServer, tadeOrder) {
   return {
   restrict: "A",
   scope: {
   items: "=",
   handler: "&"
   },
   link: function (scope, iElement) {
   var service = null;

   function handler(childScope) {
   /!**
   * 数据初始化
   *!/
   initData();

   childScope.tabindex = 0;

   childScope.toggleTab = function (index) {
   childScope.tabindex = index;
   };

   /!**
   * 点击获取常用商品
   * @param $event
   * @param item
   *!/
   childScope.productcommonlyusedHandler = function ($event, item) {
   if (item.$disabled) {
   return;
   }
   if (!item.$folded) {
   item.$folded = true;
   childScope.dataSources.push(item);
   } else {
   childScope.removeItem(null, item);
   }
   };

   tadeOrder.getOrderServer({pageSize: 100000, commonlyused: true, status: "1"}).then(function (results) {
   if (results.data.status === 0) {
   _.forEach(results.data.data, function (item) {
   item.itemsku = angular.toJson(item);
   item.$folded = isExist(item.guid);
   // item.$disabled = isDisabled(item.guid);
   item.itemname = item.servername + " " + item.manualskuvalues;
   item.itemid = item.serverid;
   item.itemskuid = item.guid;
   item.remark = "";
   item.price = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
   item.num = 1;
   item.$allprice = computeService.multiply(item.num, item.price);
   item.$totalPrice = item.$allprice;
   item.$productCount = 0;
   item.$productprice = 0;
   });
   childScope.productcommonlyused = results.data.data;
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });


   /!**
   * 点击类目获服务名称
   * @param $event
   * @param item
   *!/
   childScope.categoryHandler = function ($event, item) {
   if (!item.$folded) {
   _.forEach(childScope.category, function (item) {
   item.$folded = false;
   });
   item.$folded = true;
   getServicename(item.id);
   childScope.servicespec = [];
   }
   };

   /!**
   * 点击服务名称获取服务规格
   * @param $event
   * @param item
   *!/
   childScope.servicenameHandler = function ($event, item) {
   if (!item.$folded) {
   _.forEach(childScope.servicename, function (item) {
   item.$folded = false;
   });
   item.$folded = true;
   getServicespec(item.guid);
   }
   };

   /!**
   * 点击选择服务规格到服务列表
   * @param $event
   * @param item
   *!/
   childScope.servicespecHandler = function ($event, item) {
   if (item.$disabled) {
   return;
   }
   if (!item.$folded) {
   item.$folded = true;
   childScope.dataSources.push(item);
   } else {
   childScope.removeItem(null, item);
   }
   };

   /!**
   * 用户点击删除某个提交的数据
   * @param $event
   * @param item
   *!/
   childScope.removeItem = function ($event, item) {
   var index = _.findIndex(childScope.servicespec, {'guid': item.guid});
   if (index > -1) {
   childScope.servicespec[index].$folded = false;
   }
   _.remove(childScope.dataSources, {'guid': item.guid});
   };

   /!**
   * 检查当前这些是否在提交列表中
   * @param id
   * @returns {boolean}
   *!/
   function isExist(id) {
   return !_.isUndefined(_.find(childScope.dataSources, {'guid': id}));
   }

   /!**
   * 存在需要禁用选择
   *!/
   // function isDisabled(id) {
   //   return scope.items.length && !_.isUndefined(_.find(scope.items, {'itemskuid': id}));
   // }

   /!**
   * 获取会员列表
   *!/
   function getServicespec(id) {
   productServer.getServerSkus({id: id}).then(function (results) {
   var result = results.data;
   if (result.status === 0) {
   var items = _.omit(results.data.data, ['serverSkus']);
   if (results.data.data.serverSkus) {
   _.forEach(results.data.data.serverSkus, function (item) {
   var itemsku = _.clone(items);
   itemsku['serverSkus'] = [item];
   item.itemsku = angular.toJson(itemsku);
   item.$folded = isExist(item.guid);
   // item.$disabled = isDisabled(item.guid);
   item.itemname = results.data.data.servername + " " + item.manualskuvalues;
   item.itemid = results.data.data.guid;
   item.itemskuid = item.guid;
   item.remark = "";
   item.itemtype = "0";
   item.price = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
   item.num = 1;
   item.$allprice = computeService.multiply(item.num, item.price);
   item.$totalPrice = item.$allprice;
   item.$productCount = 0;
   item.$productprice = 0;
   });
   childScope.servicespec = _.filter(results.data.data.serverSkus, {"status": "1"});
   } else {
   childScope.servicespec = [];
   }
   } else {
   cbAlert.error("错误提示", result.data);
   }
   });
   }

   /!**
   * 获取当前类目下创建的服务名称
   * @param id
   *!/
   function getServicename(id) {
   productServer.list({
   scateid1: id,
   page: 1,
   pageSize: 100000000
   }).then(function (results) {
   if (results.data.status === 0) {
   childScope.servicename = results.data.data;
   } else {
   cbAlert.error("错误提示", results.data.data);
   }
   });
   }


   /!**
   * 获取提交的数据
   * @returns {[]}
   *!/
   function getData() {
   return _.map(childScope.dataSources, function (item) {
   return _.pick(item, ['$allprice', '$totalPrice', '$productCount', '$productprice', 'itemname', 'price', 'num', 'servicer', 'servicername', 'remark', 'itemsku', 'itemid', 'itemskuid', 'itemtype', 'commonlyused']);
   });
   }

   /!*{
   itemname: 服务名称+sku名称
   price: 单价*工时
   num: 数量 默认1
   servicer：施工人员id
   servicername：施工人员姓名
   remark：备注
   itemsku：当前sku
   itemid：当前服务id
   itemskuid：当前skuid
   itemtype：订单项类型（服务0、商品1）
   }*!/


   /!**
   * 把数据提交给控制器
   *!/
   childScope.confirm = function () {
   scope.handler({data: {"status": "0", "data": getData()}});
   childScope.close();
   service = null;
   initData();
   };

   /!**
   * 初始化数据
   *!/
   function initData() {
   /!**
   * 获取类目列表
   *!/
   childScope.category = _.cloneDeep(service);

   /!**
   * 服务名称列表
   *!/
   childScope.servicename = null;

   /!**
   * 服务规格列表
   * @type {Array}
   *!/
   childScope.servicespec = null;
   /!**
   * 提交选择的服务列表
   * @type {Array}
   *!/
   childScope.dataSources = [];
   }
   }


   /!**
   * 点击按钮
   *!/
   iElement.click(function (t) {
   scope.handler({data: {"status": "-1", "data": "打开成功"}});
   t.preventDefault();
   t.stopPropagation();
   /!**
   * 获取筛选类目
   *!/
   category.server().then(function (results) {
   service = results;
   cbDialog.showDialogByUrl("app/pages/trade_order/order-service-dialog.html", handler, {
   windowClass: "viewFramework-order-service-dialog"
   });
   });
   });
   }
   }
   }*/


})();
