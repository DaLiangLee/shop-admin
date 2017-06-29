/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('tradeOrderCustomer', tradeOrderCustomer)
    .directive('tradeOrderItems', tradeOrderItems)
    .directive('flexibleEllipsis', flexibleEllipsis)
    .directive('oraderReceivedDialog', oraderReceivedDialog)
    .directive('orderServiceDialog', orderServiceDialog)
    .directive('oraderPackageDialog', oraderPackageDialog)
    .directive('orderProductDialog', orderProductDialog)
    .directive('orderOffersReceivedDialog', orderOffersReceivedDialog)
    .directive('oraderOffersDialog', oraderOffersDialog);

  function formatMoney(price) {
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
  }

  /**
   * 超过1百万上限
   * @param num
   * @returns {boolean}
   */
  function isExceedlimit(num) {
    return num > 1000000;
  }


  /** @ngInject */
  function flexibleEllipsis($window) {
    return {
      restrict: "A",
      link: function (scope, iElement, iAttrs) {
        var blank = iAttrs.flexibleEllipsis * 1 || 0;
        var defaultWidth = iElement.width();
        var parent = iElement.parent();
        if (parent.width() - blank >= defaultWidth) {
          iElement.width(defaultWidth);
        } else {
          iElement.width(parent.width() - blank);
        }
        angular.element($window).on('resize', _.throttle(function () {
          if (parent.width() - blank >= defaultWidth) {
            iElement.width(defaultWidth);
          } else {
            iElement.width(parent.width() - blank);
          }
        }, 300))
      }
    }
  }

  /** @ngInject */
  function tradeOrderItems($filter, cbAlert, utils, computeService, tadeOrderItems, productGoods, productServer) {
    /**
     * 计算单个服务下所有商品总数
     * @param products
     * @returns {number}
     */
    function computeProductTotalPrice(products) {
      if (_.isUndefined(products) || products.length === 0) {
        return 0;
      }
      return _.reduce(products, function (result, value) {
        return computeService.add(result, value.$allprice);
      }, 0);
    }

    /**
     * 统计商品个数
     * @param products
     * @returns {number}
     */
    function conputeProductCount(products) {
      if (_.isUndefined(products) || products.length === 0) {
        return 0;
      }
      return _.reduce(products, function (result, value) {
        return computeService.add(result + value.num);
      }, 0);
    }

    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/trade_order/trade_order_items.html",
      scope: {
        items: "=",
        handler: "&",
        clear: "=",
        package: "=",
        base: "="
      },
      controller: ["$scope", function ($scope) {
        var vm = this;
        // 申明一个项目存储数组
        $scope.details = [];

        // 去监听清空操作
        var clear = $scope.$watch('clear', function (value) {
          if (value) {
            $scope.details = [];
            $scope.isPackage = _.isObject($scope.currentPackage);
            $scope.isService = false;
            $scope.handler({
              data: {
                details: [], statistics: {
                  serviceCount: 0,
                  ssalepriceAll: 0,
                  productCount: 0,
                  psalepriceAll: 0,
                  totalprice: 0
                }
              }
            });
          }
        });

        $scope.togglePackage = function () {
          $scope.packageShow = !$scope.packageShow;
        };

        /**/
        $scope.addPackage = function (data, items) {

        };



        /**
         * 给数组添加一个项目
         * @param item
         */
        function addDetails(item) {
          $scope.details = $scope.details.concat(item);
          computeTotalPrice($scope.details);
        }


        /**
         * 添加服务
         */
        $scope.addService = function (data) {
          if (data.status === "0") {
            foldedDefault();
            _.forEach(data.data, function (item) {
              item.$productCount = 0;
              item.itemtype = '0';
            });
            $scope.packageShow = false;
            $scope.isService = true;
            $scope.orderstype = $scope.base.$isuser ? "0" : "1";
            addDetails(data.data);
          }
        };

        /**
         * 更新商品服务数量
         * @param item
         * @param subitem
         */
        $scope.updateItemNum = function (item, subitem) {
          // 父级项处理
          if (_.isUndefined(subitem)) {
            if (computeAllprice(item)) {
              cbAlert.alert('商品费用超出100万上限');
              return false;
            }
            computeTotalPrice($scope.details);
            return false;
          }
          if (computeAllprice(subitem)) {
            cbAlert.alert('商品费用超出100万上限');
            return false;
          }
          item.$productCount = conputeProductCount(item.products);
          item.$productprice = computeProductTotalPrice(item.products);
          computeTotalPrice($scope.details);
        };
        /**
         * 更新商品服务价格
         * @param item
         * @param subitem
         */
        $scope.updateItemPrice = function (item, subitem) {
          // 父级项处理
          if (_.isUndefined(subitem)) {
            if (computeAllprice(item)) {
              cbAlert.alert('商品费用超出100万上限');
              return false;
            }
            computeTotalPrice($scope.details);
            return false;
          }
          if (computeAllprice(subitem)) {
            cbAlert.alert('商品费用超出100万上限');
            return false;
          }
          item.$productprice = computeProductTotalPrice(item.products);
          computeTotalPrice($scope.details);
        };


        function computeAllprice(item) {
          if (isExceedlimit($filter('moneySubtotalFilter')([item.num, item.price]))) {
            return true;
          }
          item.$allprice = $filter('moneySubtotalFilter')([item.num, item.price]);
        }


        /**
         * 添加只卖商品服务
         */
        $scope.addProduct = function (data) {
          $scope.isService = true;
          $scope.addServiceProduct(data);
          $scope.orderstype = $scope.base.$isuser ? "0" : "1";
        };

        /**
         * 卖商品直接添加索引值 默认-1, 添加以后就是数组索引
         * @type {number}
         */
        var addProductsIndex = -1;
        /**
         * 给对应的服务添加商品
         * @param data
         * @param item
         */
        $scope.addServiceProduct = function (data, item) {
          if (data.status === "0") {
            if (!data.data.length) {
              return;
            }
            /**
             * 直接添加商品是没有item这个对象，需要去手动设置一个空对象
             */
            if (_.isUndefined(item)) {
              _.forEach(data.data, function (item) {
                item.itemtype = '1';
                item.$productCount = 0;
                item.$productprice = item.$allprice;
                item.$totalPrice = computeService.add(item.$productprice, item.$allprice);
                $scope.details.push(item);
              });
            } else {
              if (!_.isArray(item.products)) {
                item.products = [];
              }
              item.products = item.products.concat(data.data);
              item.$productprice = computeService.add(item.$productprice, data.productprice);
              item.$totalPrice = computeService.add(item.$productprice, item.$allprice);
              item.$productCount = conputeProductCount(item.products);
              foldedDefault();
              item.$folded = true;
              /**
               * 如果有索引值的时候，就需要去处理
               */
              if (addProductsIndex !== -1) {
                item.itemtype = '1';
                /**
                 * 把创建的对象和创建的商品服务合并
                 */
                $scope.details[addProductsIndex] = _.assign({}, $scope.details[addProductsIndex], item);
                vm.details = $scope.details;
                /**
                 * 操作完成以后重置
                 * @type {number}
                 */
                addProductsIndex = -1;
              }
            }
            computeTotalPrice($scope.details);
          }
        };

        if ($scope.items.length) {
          if ($scope.base.orderstype === '2') {
            $scope.currentPackage = angular.fromJson($scope.base.extra);
            console.log($scope.base)
            $scope.extra = $scope.currentPackage;
            $scope.isSelectedPackage = true;
            $scope.isPackage = true;
            $scope.isService = false;
          } else {
            $scope.isService = true;
          }
          // 申明一个项目存储数组
          $scope.details = [];
          _.chain($scope.items)
            .cloneDeep()
            .tap(function (value) {
              var items = [];
              _.forEach(value, function (item) {
                if (item.itemtype === '0') {
                  items.push(item);
                }
                if (item.itemtype === '1') {
                  _.forEach(item.products, function (subitem) {
                    subitem.itemtype = '1';
                    items.push(subitem);
                  });
                }
              });
              _.forEach(items, function (item) {
                if (item.itemtype === '0') {
                  addDetails([item]);
                } else {
                  $scope.addServiceProduct({status: '0', data: [item]});
                }
              });
            }).value();
        }

        /**
         * 设置全部收起
         */
        function foldedDefault() {
          _.forEach($scope.details, function (item) {
            item.$folded = false;
          });
        }

        /**
         * 计算合计，统计商品项和合计，统计服务项和合计
         */
        function computeTotalPrice(details) {
          $scope.handler({
            data: {
              details: getDetails(details),
              statistics: tadeOrderItems.computeTally(details),
              orderstype: $scope.orderstype,
              extra: $scope.extra
            }
          });
        }


        /**
         * 将数据格式化成后台需要数据
         * @param details         前端显示的数据
         * @returns {TResult[]}   返回后台数据
         */
        function getDetails(details) {
          // 不是数组直接抛错
          if (!_.isArray(details)) {
            throw Error('参数不是一个数组')
          }
          // 空数组直接返回
          if (_.isEmpty(details)) {
            return [];
          }
          return _.map(details, function (item) {
            if (item.itemtype === '1') {
              var items = {
                itemname: "",
                price: 0,
                num: 0,
                servicer: item.servicer,
                servicername: item.servicername,
                remark: item.remark,
                itemsku: "",
                itemid: "",
                itemskuid: "",
                itemtype: item.itemtype,
                products: [_.omit(item, ['itemtype', 'servicer', 'servicername', 'remark'])]
              };
              item = items;
              items = null;
            }
            return item;
          });
        }

        /**
         * 给当前项设置常用并提交给后台
         * @param item
         * @param subitem
         */
        $scope.setCommonlyused = function (item, subitem) {
          var items = null;
          if (item.itemtype === '0') {
            items = {
              'guid': item.itemskuid,
              'serverid': item.itemid,
              'commonlyused': item.commonlyused
            };
            if (!_.isUndefined(subitem)) {
              items = {
                'guid': subitem.itemskuid,
                'serverid': subitem.itemid,
                'commonlyused': subitem.commonlyused
              };
              productGoods.updateProductSku(items).then(utils.requestHandler);
              return;
            }
            productServer.updateServerSku(items).then(utils.requestHandler);
          }
          if (item.itemtype === '1') {
            items = {
              'guid': item.itemskuid,
              'productid': item.itemid,
              'commonlyused': item.commonlyused
            };
            productGoods.updateProductSku(items).then(utils.requestHandler);
          }
        };

        /**
         * 更新备注
         * @param data
         * @param item
         */
        $scope.updateItemRemark = function (data, item) {
          item.remark = data;
          computeTotalPrice($scope.details);
        };

        /**
         * 根据guid删除某一项
         * @param item
         * @param subitem
         */
        $scope.removeItem = function (item, subitem) {
          if (_.isUndefined(subitem)) {
            _.remove($scope.details, function (key) {
              return key.itemskuid === item.itemskuid;
            });
          } else {
            _.remove(item.products, function (key) {
              return key.itemskuid === subitem.itemskuid;
            });
            item.$productCount = item.products.length;
            item.$productPrice = _.reduce(item.products, function (result, value) {
              return computeService.add(result, value.$allprice);
            }, 0);
          }
          if (!$scope.details.length) {
            $scope.isPackage = _.isObject($scope.currentPackage);
            $scope.isService = false;
          }
          computeTotalPrice($scope.details);
        };


        vm.computeTotalPrice = function () {
          computeTotalPrice($scope.details);
        };

        // 确保工具提示被销毁和删除。
        $scope.$on('$destroy', function () {
          clear();
        });
      }]
    }
  }

  /** @ngInject */
  function tradeOrderCustomer() {
    return {
      restrict: "A",
      replace: true,
      templateUrl: "app/pages/trade_order/trade_order_customer.html",
      scope: {
        customer: "="
      }
    }
  }

  /** @ngInject */
  function oraderReceivedDialog(cbDialog, tadeOrder, cbAlert, computeService) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        var checkstoreuseraccount = true;
        function handler(childScope) {
          childScope.item = angular.copy(scope.item);
          childScope.item.$totalprice = computeService.add(childScope.item.psaleprice, childScope.item.ssaleprice);
          if (childScope.item.orderstype === '2') {
            childScope.item.paytype = '6';
          } else {
            childScope.item.paytype = checkstoreuseraccount ? "0" : "1";
          }

          childScope.item.paid = function () {
            // 公式： 优惠金额 = 合计 X 会员折扣 - 输入优惠
            return computeService.subtract(this.totalprice, this.preferentialprice);
          };

          // 如果当前优惠和初始优惠不一样，就算手动优惠。
          childScope.item.checkDiscounttype = function () {
            if (scope.item.preferentialprice !== childScope.item.preferentialprice) {
              childScope.item.discounttype = '2';
            }
          };

          if (childScope.item.orderstype === '2') {
            childScope.item.extra = angular.fromJson(childScope.item.extra);
          }

          // 失去焦点如果优惠没有填默认是0
          childScope.item.setPreferentialprice = function () {
            if (childScope.item.preferentialprice === "") {
              childScope.item.preferentialprice = 0;
            }
          };

          childScope.interceptor = false;

          childScope.confirm = function () {
            childScope.interceptor = true;
          };

          childScope.paytype = [
            {
              "label": "现金",
              "isBalance": true,
              "value": "1",
              "current": !checkstoreuseraccount
            },
            {
              "label": "银行卡",
              "isBalance": true,
              "value": "5",
              "current": false
            }
          ];

          if (scope.item.orderstype === '0') {
            childScope.paytype.unshift({
              "label": "储值卡",
              "isBalance": checkstoreuseraccount,
              "value": "0",
              "current": checkstoreuseraccount
            })
          }

          childScope.setPaytype = function (item) {
            _.map(childScope.paytype, function (key) {
              key.current = false;
            });
            item.current = true;
            childScope.item.paytype = item.value;
          };

          childScope.interceptorConfirm = function () {
            var data = _.pick(childScope.item, ['guid', 'paytype', 'remarks', 'preferentialprice']);
            data.preferentialprice = computeService.pushMoney(data.preferentialprice);
            scope.itemHandler({data: {"status": "0", "data": data}});
            childScope.close();
          };
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();

          if (scope.item.orderstype === '1') {  // 客户
            checkstoreuseraccount = false;
            cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
              windowClass: "viewFramework-orader-received-dialog"
            });
          } else if (scope.item.orderstype === '0') { // 会员
            tadeOrder.checkstoreuseraccount(scope.item.guid).then(function (results) {
              if (results.data.status === 0) {
                checkstoreuseraccount = results.data.data;
                cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
                  windowClass: "viewFramework-orader-received-dialog"
                });
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else if (scope.item.orderstype === '2') { // 会员套餐
            cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
              windowClass: "viewFramework-orader-received-dialog"
            });
          }
        })
      }
    }
  }

  /** @ngInject */
  function oraderPackageDialog(cbDialog, marktingPackage, utils, computeService) {
    return {
      restrict: "A",
      scope: {
        items: "=",
        change: "=",
        handler: "&"
      },
      link: function (scope, iElement) {
        var packageData = null;
        function handler(childScope) {
          childScope.packageData = _.cloneDeep(scope.items);
          if (_.isEmpty(scope.change)) {
            _.forEach(packageData, function (item) {
              if (utils.isNumber(item.num)) {
                item.num = 0;
              }
              item.use = 1;
            });
          } else {
            _.forEach(packageData, function (item) {
              if (utils.isNumber(item.num)) {
                item.num = 0;
              }
              _.forEach(scope.change, function (nitem) {
                if (item.objectid === nitem.itemskuid) {
                  item.use = nitem.num * 1;
                  return false;
                }
              });
            });
          }
          childScope.packageData.packageItems = packageData;

          /**
           * 获取剩余数量
           * @type {T[]|string[]}
           */
          childScope.balance = _.filter(childScope.packageData.packageItems, function (item) {
            return item.num !== 0;
          });
          /**
           * 获取提交的数据
           * @returns {[]}
           */
          function getData() {
            return _.chain(childScope.packageData.packageItems)
              .filter(function (item) {
                return item.num > 0;
              })
              .map(function (item) {
                var items = angular.fromJson(item.item);
                var itemid = null;
                var productprice = 0, productCount = 0;
                if (!_.isUndefined(items.serverid)) {
                  itemid = items.serverid;
                }
                var originprice = computeService.pullMoney(item.originprice);
                var price = computeService.pullMoney(item.price);
                if (!_.isUndefined(items.productid)) {
                  itemid = items.productid;
                  productprice = computeService.multiply(price, item.use);
                  productCount = 1;
                }
                return {
                  userpackageitemid: item.id,
                  userpackageid: item.userpackageid,
                  itemname: item.name,
                  price: computeService.multiply(price, item.use),
                  num: item.use,
                  servicer: '',
                  servicername: '',
                  remark: '',
                  itemsku: item.item,
                  itemid: itemid,
                  itemskuid: items.guid,
                  itemtype: item.type,
                  originprice: computeService.multiply(originprice, item.use),
                  preferential: computeService.multiply(computeService.subtract(originprice, price), item.use),
                  $allprice: computeService.multiply(price, item.use),
                  $totalPrice: productprice,
                  $productprice: productprice,
                  $productCount: productCount,
                  commonlyused: items.commonlyused
                };
              })
              .value();
          }

          /**
           * 把数据提交给控制器
           */
          childScope.confirm = function () {
            scope.handler({data: {"status": "0", "data": getData()}});
            childScope.close();
          };
        }


        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          marktingPackage.getuserpackageitembyuserid({
            userpackageid: scope.items.id,
            userid: scope.items.userid
          }).then(utils.requestHandler).then(function (results) {
            packageData = results.data;
            cbDialog.showDialogByUrl("app/pages/trade_order/orader-package-dialog.html", handler, {
              windowClass: "viewFramework-order-package-dialog"
            });
          });
        });
      }
    }
  }


  /** @ngInject */
  function orderServiceDialog($filter, cbDialog, cbAlert, computeService, category, productServer, tadeOrder) {
    return {
      restrict: "A",
      scope: {
        items: "=",
        handler: "&"
      },
      link: function (scope, iElement) {
        var service = null;

        function handler(childScope) {
          /**
           * 数据初始化
           */
          initData();

          childScope.tabindex = 0;


          childScope.tooltip = {
            title: "从【车边库】选择的商品将自动添加到您的商品库"
          };

          childScope.toggleTab = function (index) {
            childScope.tabindex = index;
            _.forEach(childScope.category, function (item) {
              item.$folded = false;
            });
            childScope.servicename = [];
            childScope.servicespec = [];
          };

          /**
           * 点击获取常用商品
           * @param $event
           * @param item
           */
          childScope.productcommonlyusedHandler = function ($event, item) {
            if (item.$disabled) {
              return;
            }
            console.log(item)
            if (!item.$folded) {
              item.$folded = true;
              childScope.dataSources.push(item);
            } else {
              item.$folded = false;
              childScope.removeItem(null, item);
            }
          };

          tadeOrder.getOrderServer({pageSize: 100000, commonlyused: true, status: "1"}).then(function (results) {
            if (results.data.status === 0) {
              _.forEach(results.data.data, function (item) {
                item.itemsku = angular.toJson(item);
                item.$folded = isExist(item.guid);
                item.$disabled = isDisabled(item.guid);
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


          /**
           * 点击类目获服务名称
           * @param $event
           * @param item
           */
          childScope.categoryHandler = function ($event, item) {
            if (!item.$folded) {
              _.forEach(childScope.category, function (item) {
                item.$folded = false;
              });
              item.$folded = true;
              if (childScope.tabindex === 1) {
                getServicename(item.id);
              }
              if (childScope.tabindex === 2) {
                getStencilServer(item.id);
              }
              childScope.servicespec = [];
            }
          };

          /**
           * 点击服务名称获取服务规格
           * @param $event
           * @param item
           */
          childScope.servicenameHandler = function ($event, item) {
            if (!item.$folded) {
              _.forEach(childScope.servicename, function (item) {
                item.$folded = false;
              });
              item.$folded = true;
              getServicespec(item.guid);
            }
          };

          /**
           * 点击服务名称获取车边服务规格
           * @param $event
           * @param item
           */
          childScope.servicenameCliHandler = function ($event, item) {
            if (!item.$folded) {
              _.forEach(childScope.servicename, function (item) {
                item.$folded = false;
              });
              item.$folded = true;
              getServicespecCli(item.guid);
            }
          };

          /**
           * 点击选择服务规格到服务列表
           * @param $event
           * @param item
           */
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

          /**
           * 用户点击删除某个提交的数据
           * @param $event
           * @param item
           */
          childScope.removeItem = function ($event, item) {
            var items = {'guid': item.guid};
            var index = _.findIndex(childScope.servicespec, items);
            var index2 = _.findIndex(childScope.productcommonlyused, items);
            if (index > -1) {
              childScope.servicespec[index].$folded = false;
            }
            if(index2 > -1){
              childScope.productcommonlyused[index2].$folded = false;
            }
            _.remove(childScope.dataSources, items);
          };

          /**
           * 检查当前这些是否在提交列表中
           * @param id
           * @returns {boolean}
           */
          function isExist(id) {
            return !_.isUndefined(_.find(childScope.dataSources, {'guid': id}));
          }

          /**
           * 存在需要禁用选择
           */
          function isDisabled(id) {
            return scope.items.length && !_.isUndefined(_.find(scope.items, {'itemskuid': id}));
          }

          function getServicespecCli(id) {
            productServer.getStencilServerSkus({id: id}).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                var items = _.omit(results.data.data, ['serverSkus']);
                if (results.data.data.serverSkus) {
                  _.forEach(results.data.data.serverSkus, function (item) {
                    var itemsku = _.clone(items);
                    itemsku['serverSkus'] = [item];
                    item.defaultsku = true;
                    item.itemsku = angular.toJson(itemsku);
                    item.$folded = isExist(item.guid);
                    item.$disabled = isDisabled(item.guid);
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

          /**
           * 获取会员列表
           */
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
                    item.$disabled = isDisabled(item.guid);
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

          /**
           * 获取当前类目下创建的服务名称
           * @param id
           */
          function getStencilServer(id) {
            productServer.getStencilServer({
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

          /**
           * 获取当前类目下创建的服务名称
           * @param id
           */
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


          /**
           * 获取提交的数据
           * @returns {[]}
           */
          function getData() {
            return _.map(childScope.dataSources, function (item) {
              return _.pick(item, ['$allprice', '$totalPrice', '$productCount', '$productprice', 'itemname', 'price', 'num', 'servicer', 'servicername', 'remark', 'itemsku', 'itemid', 'itemskuid', 'itemtype', 'commonlyused', 'defaultsku']);
            });
          }

          /*{
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
          }*/


          /**
           * 把数据提交给控制器
           */
          childScope.confirm = function () {
            scope.handler({data: {"status": "0", "data": getData()}});
            childScope.close();
            service = null;
            initData();
          };

          /**
           * 初始化数据
           */
          function initData() {
            /**
             * 获取类目列表
             */
            childScope.category = _.cloneDeep(service);

            /**
             * 服务名称列表
             */
            childScope.servicename = null;

            /**
             * 服务规格列表
             * @type {Array}
             */
            childScope.servicespec = null;
            /**
             * 提交选择的服务列表
             * @type {Array}
             */
            childScope.dataSources = [];
          }
        }


        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          /**
           * 获取筛选类目
           */
          category.server().then(function (results) {
            service = results;
            cbDialog.showDialogByUrl("app/pages/trade_order/order-service-dialog.html", handler, {
              windowClass: "viewFramework-order-service-dialog"
            });
          });
        });
      }
    }
  }

  /** @ngInject */
  function orderProductDialog(cbDialog, category, cbAlert, computeService, productGoods, tadeOrder) {
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
          /**
           * 初始化数据
           */
          initData();
          childScope.tabindex = 0;

          childScope.toggleTab = function (index) {
            childScope.tabindex = index;
            _.forEach(childScope.parentclass, function (item) {
              item.$folded = false;
            });
            childScope.subclass = [];
            childScope.productname = [];
            childScope.productspec = [];
          };

          /**
           * 点击获取常用商品
           * @param $event
           * @param item
           */
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
              _.forEach(results.data.data, function (item) {
                item.itemsku = angular.toJson(item);
                item.$folded = isExist(item.guid);
                item.$disabled = isDisabled(item.guid);
                item.itemname = item.cnname + " " + item.productname + " " + item.manualskuvalues;
                item.itemid = item.productid;
                item.itemskuid = item.guid;
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

          /**
           * 点击一级类目获取二级类目
           * @param $event
           * @param item
           */
          childScope.parentclassHandler = function ($event, item) {
            if (!item.$folded) {
              _.forEach(childScope.parentclass, function (item) {
                item.$folded = false;
              });
              item.$folded = true;
              childScope.subclass = _.cloneDeep(item.items);
              childScope.productname = [];
            }
          };

          /**
           * 点击二级类目获取商品名称
           * @param $event
           * @param item
           */
          childScope.subclassHandler = function ($event, item) {
            if (!item.$folded) {
              _.forEach(childScope.subclass, function (item) {
                item.$folded = false;
              });
              item.$folded = true;
              if(childScope.tabindex === 1){
                getProductname(item.parentid, item.id);
              }
              if(childScope.tabindex === 2){
                getProductname2(item.parentid, item.id);
              }
              childScope.productspec = [];
            }
          };

          /**
           * 点击商品名称获取规格属性
           * @param $event
           * @param item
           */
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

          /**
           * 用户点击删除某个提交的数据
           * @param $event
           * @param item
           */
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

          /**
           * 获取所有的商品名称
           * @param pcateid1
           * @param pcateid2
           */
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

          /**
           * 获取所有的商品名称
           * @param pcateid1
           * @param pcateid2
           */
          function getProductname2(pcateid1, pcateid2) {
            productGoods.getStencilProduct({
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

          /**
           * 获取商品名称下面所有规格属性
           * @param id
           */
          function getProductspec(id) {
            productGoods.getProductSkus({id: id}).then(function (results) {
              if (results.data.status === 0) {
                if (results.data.data.items) {
                  var items = _.omit(results.data.data, ['items']);
                  _.forEach(results.data.data.items, function (item) {
                    var itemsku = _.clone(items);
                    itemsku['items'] = [item];
                    console.log(item)
                    item.defaultsku = childScope.tabindex === 2;
                    item.itemsku = angular.toJson(itemsku);
                    item.$folded = isExist(item.guid);
                    item.$disabled = isDisabled(item.guid);
                    item.itemname = results.data.data.brandname + " " + results.data.data.productname + " " + item.manualskuvalues;
                    item.itemid = results.data.data.guid;
                    item.itemskuid = item.guid;
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

          /**
           * 检查当前这些是否在提交列表中
           * @param id
           * @returns {boolean}
           */
          function isExist(id) {
            return !_.isUndefined(_.find(childScope.dataSources, {'guid': id}));
          }

          /**
           * 存在需要禁用选择
           */
          function isDisabled(id) {
            return scope.items && scope.items.length && !_.isUndefined(_.find(scope.items, {'itemskuid': id}));
          }

          /**
           * 获取提交数据
           * @param data
           */
          function getData(data) {
            var results = {
              productprice: 0,
              itemList: null
            };
            results.itemList = _.map(data, function (item) {
              return _.pick(item, ['$allprice', 'itemname', 'price', 'num', 'servicer', 'servicername', 'remark', 'itemsku', 'itemid', 'itemskuid', 'itemtype', 'commonlyused', 'defaultsku']);
            });
            results.productprice = _.reduce(results.itemList, function (result, value) {
              return computeService.add(result, value.$allprice);
            }, 0);
            return results;
          }

          /**
           * 确定
           */
          childScope.confirm = function () {
            var data = getData(childScope.dataSources);
            scope.handler({data: {"status": "0", "data": data.itemList, "productprice": data.productprice}});
            childScope.closed();
          };

          childScope.closed = function () {
            isOpen = false;
            childScope.close();
          };


          /**
           * 初始化数据
           */
          function initData() {
            /**
             * 获取一级类目列表
             */
            childScope.parentclass = _.cloneDeep(product);

            /**
             * 获取二级类目列表
             */
            childScope.subclass = null;

            /**
             * 服务名称列表
             */
            childScope.productname = null;

            /**
             * 服务规格列表
             * @type {Array}
             */
            childScope.productspec = null;

            /**
             * 提交选择的服务列表
             * @type {Array}
             */
            childScope.dataSources = [];
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          if (isOpen) {
            return false;
          }
          isOpen = true;
          scope.handler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          /**
           * 获取筛选类目
           */
          category.goods().then(function (results) {
            product = results;
            cbDialog.showDialogByUrl("app/pages/trade_order/order-product-dialog.html", handler, {
              windowClass: "viewFramework-order-product-dialog"
            });
          });
        });
      }
    }
  }

  /** @ngInject */
  function oraderOffersDialog($filter, cbDialog, userCustomer, cbAlert, computeService, STATUS_COLLECTION) {
    return {
      restrict: "A",
      scope: {
        userid: "=",
        offers: "=",
        orderstype: "=",
        useraccount: "=",
        offersHandler: "&"
      },
      link: function (scope, iElement) {
        var discount = undefined;

        function handler(childScope) {
          childScope.orderstype = scope.orderstype;
          if(scope.orderstype === '2'){
            childScope.item = _.pick(scope.offers, ['preferentialprice']);
            childScope.item.psalepriceAll = scope.offers.poriginpriceAll;
            childScope.item.ssalepriceAll = scope.offers.soriginpriceAll;
            childScope.item.totalprice = computeService.add(scope.offers.poriginpriceAll, scope.offers.soriginpriceAll);
            childScope.item.discounttype = "0";
            childScope.item.paid = function () {
              return scope.offers.totalprice;
            };
          }else{
            childScope.item = _.pick(scope.offers, ['psalepriceAll', 'ssalepriceAll', 'totalprice']);
            childScope.item.preferentialprice = undefined;
            childScope.item.discounttype = _.isUndefined(scope.userid) ? "0" : "1";
            childScope.item.discount = 100;
            childScope.item.paid = function () {
              // 传递是一个0-100数字，需要先除100；
              var discountRate = computeService.pullMoney(this.discount);
              var userDiscount = $filter('moneySubtotalFilter')([this.totalprice, discountRate]);
              // 公式： 优惠金额 = 合计 X 会员折扣 - 输入优惠
              return computeService.subtract(userDiscount, this.preferentialprice);
            };
          }


          childScope.item.list = [];

          childScope.item.preloaded = function (id) {
            if (id === '1' && _.isUndefined(discount)) {
              userCustomer.getDiscount({userid: scope.userid}).then(function (results) {
                if (results.data.status === 0) {
                  discount = results.data.data;
                } else {
                  cbAlert.error("错误提示", results.data.data);
                }
              });
            }
          };


          childScope.item.handler = function () {
            if (this.discounttype === '1') {
              childScope.item.discount = discount;
            } else {
              this.discount = 100;
            }
            if (this.discounttype !== '2') {
              this.preferentialprice = 0;
            }
            this.paid();
          };
          _.forEach(STATUS_COLLECTION.discounttype, function (key, value) {
            childScope.item.list.push({
              id: value,
              label: key
            });
          });
          if (_.isUndefined(scope.userid)) {
            _.remove(childScope.item.list, {'label': "会员折扣"});
          }


          /**
           * 拦截
           */

          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.offersHandler({
              data: {
                "status": "0",
                "data": _.pick(childScope.item, ['preferentialprice', 'discounttype', 'discount']) || 0,
                "next": true
              }
            });
            childScope.close();
            discount = undefined;
          };
          childScope.closed = function () {
            scope.offersHandler({data: {"status": "0", "price": 0, "next": false}});
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.offersHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-dialog.html", handler, {
            windowClass: "viewFramework-orader-offers-dialog"
          });
        });

      }
    }
  }

  /** @ngInject */
  function orderOffersReceivedDialog($filter, cbDialog, userCustomer, tadeOrder, cbAlert, computeService, STATUS_COLLECTION) {
    return {
      restrict: "A",
      scope: {
        userid: "=",
        offers: "=",
        orderstype: "=",
        handler: "&",
        package: "="
      },
      link: function (scope, iElement) {
        var discount = undefined;
        var checkstoreuseraccount = false;
        function handler(childScope) {
          childScope.isNext = false;
          childScope.orderstype = scope.orderstype;
          if(scope.orderstype === '2'){
            childScope.item = _.pick(scope.offers, ['preferentialprice']);
            childScope.item.psalepriceAll = scope.offers.poriginpriceAll;
            childScope.item.ssalepriceAll = scope.offers.soriginpriceAll;
            childScope.item.totalprice = computeService.add(scope.offers.poriginpriceAll, scope.offers.soriginpriceAll);
            childScope.item.discounttype = "0";
            childScope.item.paid = function () {
              return scope.offers.totalprice;
            };
          }else{
            childScope.item = _.pick(scope.offers, ['psalepriceAll', 'ssalepriceAll', 'totalprice']);
            childScope.item.preferentialprice = undefined;
            childScope.item.discounttype = _.isUndefined(scope.userid) ? "0" : "1";
            childScope.item.discount = 100;
            childScope.item.paid = function () {
              // 传递是一个0-100数字，需要先除100；
              var discountRate = computeService.pullMoney(this.discount);
              var userDiscount = $filter('moneySubtotalFilter')([this.totalprice, discountRate]);
              // 公式： 优惠金额 = 合计 X 会员折扣 - 输入优惠
              return computeService.subtract(userDiscount, this.preferentialprice);
            };
          }

          if (scope.orderstype === '2') {
            childScope.item.paytype = '6';
            childScope.item.packagename = angular.fromJson(scope.package).packagename;
          } else {
            childScope.item.paytype = checkstoreuseraccount ? "0" : "1";
          }

          // 如果当前优惠和初始优惠不一样，就算手动优惠。
          childScope.item.checkDiscounttype = function () {
            if (scope.item.preferentialprice !== childScope.item.preferentialprice) {
              childScope.item.discounttype = '2';
            }
          };

          // 失去焦点如果优惠没有填默认是0
          childScope.item.setPreferentialprice = function () {
            if (childScope.item.preferentialprice === "") {
              childScope.item.preferentialprice = 0;
            }
          };

          childScope.item.list = [];

          childScope.item.preloaded = function (id) {
            if (id === '1' && _.isUndefined(discount)) {
              userCustomer.getDiscount({userid: scope.userid}).then(function (results) {
                if (results.data.status === 0) {
                  discount = results.data.data;
                } else {
                  cbAlert.error("错误提示", results.data.data);
                }
              });
            }
          };
          childScope.paytype = [
            {
              "label": "现金",
              "isBalance": true,
              "value": "1",
              "current": !checkstoreuseraccount
            },
            {
              "label": "银行卡",
              "isBalance": true,
              "value": "5",
              "current": false
            }
          ];

          if (scope.orderstype === '0') {
            childScope.paytype.unshift({
              "label": "储值卡",
              "isBalance": checkstoreuseraccount,
              "value": "0",
              "current": checkstoreuseraccount
            })
          }

          childScope.setPaytype = function (item) {
            _.map(childScope.paytype, function (key) {
              key.current = false;
            });
            item.current = true;
            childScope.item.paytype = item.value;
          };
          childScope.item.handler = function () {
            if (this.discounttype === '1') {
              childScope.item.discount = discount;
            } else {
              this.discount = 100;
            }
            if (this.discounttype !== '2') {
              this.preferentialprice = 0;
            }
            this.paid();
          };
          _.forEach(STATUS_COLLECTION.discounttype, function (key, value) {
            childScope.item.list.push({
              id: value,
              label: key
            });
          });
          if (_.isUndefined(scope.userid)) {
            _.remove(childScope.item.list, {'label': "会员折扣"});
          }


          /**
           * 拦截
           */

          /**
           * 上一步开单
           */
          childScope.prev = function () {
            childScope.isNext = false;
          };

          /**
           * 下一步收款
           */
          childScope.next = function () {
            childScope.isNext = true;
          };
          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.handler({
              data: {
                "status": "0",
                "data": _.pick(childScope.item, ['preferentialprice', 'discounttype', 'discount', 'paytype', 'remarks']) || 0,
                "next": true
              }
            });
            childScope.close();
            discount = undefined;
          };
          childScope.closed = function () {
            scope.handler({data: {"status": "0", "price": 0, "next": false}});
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          if (scope.orderstype === '1') {  // 客户
            checkstoreuseraccount = false;
            cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
              windowClass: "viewFramework-orader-offers-received-dialog"
            });
          } else if (scope.orderstype === '0') { // 会员
            checkstoreuseraccount = scope.useraccount > 0;
            cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
              windowClass: "viewFramework-orader-offers-received-dialog"
            });
          } else if (scope.orderstype === '2') { // 会员套餐
            cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
              windowClass: "viewFramework-orader-offers-received-dialog"
            });
          }
        });
      }
    }
  }
})();
