/**
 * Created by Administrator on 2017/06/08.
 */
(function () {
  'use strict';

  angular
      .module('shopApp')
      .directive('addNewPackageDialog', addNewPackageDialog);

  /** @ngInject */
  function addNewPackageDialog($q, cbDialog, $filter, marktingPackage, cbAlert, tadeOrder, utils, computeService, $state) {
    return {
      restrict: "A",
      scope: {
        item: '=',
        itemHandler: '&'
      },
      link: function (scope, iElement) {
        /**
         * 获取模糊查询结果
         * @param type
         * @param data
         */
        function getResults(type, data){
          var deferred = $q.defer();
          tadeOrder[type](data).then(function(results) {
            if (results.data.status === 0) {
              deferred.resolve(results.data.data);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
          return deferred.promise;
        }

        /**
         * 后端接口API地址的一部分
         * 可根据 'code' 'manualskuvalues' 'servername' 'skuvalues' 'cnname' 等进行搜索
         * @type {{0: string, 1: string}}
         */
        var getOrder = {
          "0": 'getOrderServer',
          "1": 'getOrderProduct'
        };

        function handler(childScope) {
          /**
           * 先判断是否存在数据，如果不存在的话则表示 新增套餐卡
           * 如果存在则表示 修改套餐卡 信息
           */
          if (angular.isUndefined(scope.item)) {
            childScope.dataBase = {
              'name': '',
              'bak': '',
              'price': 0,
              'originprice': 0,
              'status': '1',
              'packageItems': [{}]
            };
          } else {
            childScope.dataBase = _.cloneDeep(scope.item);
            childScope.minNum = scope.item.num; // 用于部分修改时，只能改大不能改小
            angular.forEach(childScope.dataBase.packageItems, function(packageItem) {
              packageItem.originprice = computeService.pullMoney(packageItem.originprice);
              packageItem.price = computeService.pullMoney(packageItem.price);
              packageItem.price = (packageItem.price * 1).toFixed(2);
              packageItem.originprice = (packageItem.originprice * 1).toFixed(2);
              computeSinglePrice(packageItem);
              packageItem.$isValueEmpty = packageItem.name === '';
            });
            computeTotalPrice();
            childScope.isEditable = function() {
              childScope.config.isSelectItem = true;
              return childScope.dataBase.soldnum > 0 // true: 卖出就表示只能部分修改; false: 则表示全部可以修改
            };
          }

          /**
           * 用于给childScope添加其它的属性
           * @type {{}}
           */
          childScope.config = {
            isSelectItem: false // 是否点击搜索下拉框， 避免不选择就可以提交
          };

          /**
           * 清空选择框，一次只允许清空一行
           */
          childScope.clearContent = function (item, index) {
            if (!_.isUndefined(item.name)) {
              _.remove(childScope.dataBase.packageItems, function(packageItem) {
                return packageItem.objectid === item.objectid;
              });
              childScope.dataBase.packageItems.splice(index, 0, {
                type: item.type
              });
              /*item.name = '';
              item.originprice = '';
              item.price = '';
              item.num = '';*/
              item.$isValueEmpty = false; // 清空时，item.name已选择 设置为false
              childScope.config.isSelectItem = false;
              computeSinglePrice(item);
              computeTotalPrice();
            }
          };

          childScope.getFocus = function(item) {
            _.forEach(childScope.dataBase.packageItems, function(packageItem) {
              packageItem.$isSelected = true;
            });
            item.$isSelected = false;
            childScope.config.isSelectItem = false; // focus则表明还没有选择搜索框中的item
          };

          /**
           * 添加一个新的package item
           */
          childScope.addPackageItem = function() {

            // 如果最后一个服务或商品没有填完整则不允许添加新的服务或商品
            var fullProp = ['type', 'name', 'originprice', 'price', 'num'];
            var length = childScope.dataBase.packageItems.length;
            if (childScope.dataBase.packageItems[length - 1]) {
              for (var i = 0; i < fullProp.length; i ++) {
                var prop = childScope.dataBase.packageItems[length - 1][fullProp[i]];
                if (prop === '' || _.isUndefined(prop)) {
                  return false;
                }
              }
            }

            // 用于防止出现多个下拉框的情况
            _.forEach(childScope.dataBase.packageItems, function(packageItem) {
              packageItem.$isSelected = true;
            });

            childScope.dataBase.$emptyPackage = false; // 添加商品时，则说明有packageItem, 和removePackageItem相对应
            childScope.dataBase.packageItems.push({})
          };

          /**
           * 根据索引删除某个package item
           * @param item 当前项
           * @param index 当前索引
           */
          childScope.removePackageItem = function(item, index) {
            // _.remove(childScope.dataBase.packageItems, {'guid': item.guid});
            childScope.config.isSelectItem = true; // 清楚的时候将已选中设置为true,防止不能提交
            childScope.config.searchList = undefined; // 清除下拉框
            childScope.dataBase.packageItems.splice(index, 1);
            if (angular.isDefined(childScope.dataBase.packageItems)) {
              computeSinglePrice(item);
              computeTotalPrice();
            }
            if (childScope.dataBase.packageItems.length === 0) {
              childScope.dataBase.$emptyPackage = true; // packageItems为空时，禁止提交
            }
          };


          /**
           * 计算单个原价或者套餐价
           */
          function computeSinglePrice(item) {
            item.$originprice = computeService.multiply(item.originprice, item.num);
            item.$price = computeService.multiply(item.price, item.num);
          }

          /**
           * 计算合计，统计商品项和合计，统计服务项和合计
           */
          function computeTotalPrice() {
            childScope.dataBase.originprice = _.reduce(childScope.dataBase.packageItems, function (result, value) {
              return computeService.add(result, value.$originprice);
            }, 0);
            childScope.dataBase.price = _.reduce(childScope.dataBase.packageItems, function (result, value) {
              return computeService.add(result, value.$price);
            }, 0);
          }

          /**
           * 单个packageItem price，输入金额时计算价格
           */
          childScope.inputPrice = function(item) {
           computeSinglePrice(item);
           computeTotalPrice();
          };

          /**
           * 将输入的金额保留2位小数
           * @param item
           */
          childScope.formatMoney = function(item) {
             if (!_.isUndefined(item.price)) {
                item.price = (item.price * 1).toFixed(2);
             }
             if (!_.isUndefined(item.originprice)) {
                item.originprice = (item.originprice * 1).toFixed(2);
             }
          };

          /**
           * 重新选择类型时，将其它输入框清空
           * @param item
           */
          childScope.reselectType = function(item) {
            if (!_.isUndefined(item.type)) {
              item.name = '';
              item.originprice = '';
              item.price = '';
              item.num = '';
              childScope.config.searchList = undefined; // 清除下拉框
              item.$isSelected = false;
              item.$isValueEmpty = false;
              computeSinglePrice(item);
              computeTotalPrice();
            }
          };

          /**
           * 查询搜索
           * @param value
           */
          childScope.searchHandler = _.throttle(function(item, index) {
            getResults(getOrder[item.type], {pageSize: 10000, keyword: item.name})
                .then(function(results) {
                  /**
                   * 移除已经存在的packageItem
                   */
                  _.remove(results, function(result) {
                    return _.find(childScope.dataBase.packageItems, function(packageItem) {
                      return result.guid === packageItem.guid || result.guid === packageItem.objectid;
                    })
                  });

                  childScope.config.searchList = _.map(results, function (item) {
                    if (angular.isDefined(item.serverid)) {
                      item.name = item.servername + ' ' + item.manualskuvalues;
                      item.originprice = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
                      item.originprice = item.originprice.toFixed(2);
                    } else {
                      item.name = item.productname + ' ' + item.cnname + ' ' + item.manualskuvalues;
                      item.originprice = computeService.pullMoney(item.salepriceText);
                      item.originprice = item.originprice.toFixed(2);
                    }
                    return item;
                  });
                  // console.log('list',childScope.config.searchList);
                });
          }, 200);


          /**
           * 提交金额时 乘以100变为'分'返回给后台
           * @param money
           */
          function formatPushMoney(money) {
            return computeService.pushMoney(money);
          }
          /**
           * 提交给后台
           */
          childScope.savePackage = function() {
            if (childScope.dataBase.num === '') {
              childScope.dataBase.num = null;
            }
            childScope.dataBase.originprice = formatPushMoney(childScope.dataBase.originprice);
            childScope.dataBase.price = formatPushMoney(childScope.dataBase.price);
            _.map(childScope.dataBase.packageItems, function(item) {
              item.originprice = formatPushMoney(item.originprice);
              item.price = formatPushMoney(item.price);
            });

            // scope.itemHandler({data: {"status": "-1", "data": childScope.dataBase}});

            marktingPackage.save_package(childScope.dataBase)
                .then(utils.requestHandler)
                .then(function() {
                  cbAlert.tips('保存套餐成功');
                  childScope.close();
                  $state.reload();
                });
          };

          function setPackageItems(item, result) {
            item.item = angular.toJson(result);
            item.objectid = result.guid;
            _.merge(item, result);
            computeSinglePrice(item);
            computeTotalPrice();
          }


          /**
           * 选择下拉选项
           * @param event
           * @param subitem 选择的商品或服务的信息
           * @param item
           */
          childScope.chooseItem = function(event, subitem, item) {
            _.forEach(childScope.dataBase.packageItems, function(packageItem) {
              packageItem.$isSelected = true;
            });

            setPackageItems(item, subitem);
            childScope.config.searchList = undefined; // 清除下拉框
            childScope.config.isSelectItem = true;
            item.$isValueEmpty = true; // 是否已经选择name
            computeSinglePrice(item);
            computeTotalPrice();
          };

        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/markting_package/add_new_package_dialog.html", handler, {
            windowClass: "viewFramework-add-new-package-dialog"
          });
        });
      }
    }
  }

})();
