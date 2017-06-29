/**
 * Created by Administrator on 2016/10/15.
 */

(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('userAddVehicleDialog', userAddVehicleDialog)
    .directive('addPackageDialog', addPackageDialog)
    .directive('chargeBalanceDialog', chargeBalanceDialog);

  /** @ngInject */
  function userAddVehicleDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement, iAttrs) {
        var type = iAttrs.userAddVehicleDialog;

        function handler(childScope) {
          childScope.select = angular.copy(scope.item);
          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.itemHandler({data: {"status": "0", "type": type, "data": childScope.select}});
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
          cbDialog.showDialogByUrl("app/pages/user_customer/user-add-vehicle-dialog.html", handler, {
            windowClass: "viewFramework-user-add-vehicle-dialog"
          });
        })
      }
    }
  }


  /** @ngInject */
  function addPackageDialog(cbDialog, utils, marktingPackage, computeService) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        var packageList = [];

        function handler(childScope) {
          childScope.item = _.cloneDeep(scope.item);
          childScope.interception = false;
          childScope.baseData = {
            $chargeprice: childScope.item.price // 收取金额默认为套餐的价格
          };
          childScope.message = {};
          childScope.selectRequired = {
            selectModel: false,
            isPechargeamount: function () {
              return  !childScope.selectRequired.selectModel || (!childScope.baseData.$permanent && (_.isEmpty(childScope.baseData.expireDay) || childScope.baseData.expireDay*1 === 0))
            }
          };

          childScope.selectModel = {
            store: packageList,
            handler: function (data) {
              var items = _.find(packageList, {'id': data});
              if (!_.isUndefined(items)) {
                childScope.baseData.packageid = data;
                childScope.item.originprice = items.originprice;
                childScope.item.price = items.price;
                childScope.selectRequired.selectModel = true;
                childScope.baseData.paytype = '1'; // 支付类型， 默认为 '现金'
                childScope.baseData.$chargeprice = computeService.pullMoney(childScope.item.price); // 实际收款
                childScope.baseData.$maxPrice = computeService.pullMoney(childScope.item.price); // 优惠的最大额度
                childScope.$offer = 1; // 选择优惠方式 默认为无
              }
            }
          };

          childScope.setExpireDate = function (num, flag) {
            if(!flag){
              if(num > 0){
                childScope.expireDate = utils.getFutureTime(num * 1 - 1);
              }else{
                childScope.expireDate = "";
              }
            }else{
              childScope.baseData.expireDay = num;
              childScope.expireDate = "";
            }
          };

          // 设置实收金额
          childScope.setPreferentialprice = function() {
            if (computeService.pullMoney(childScope.item.price) >= childScope.baseData.preferentialprice) {
              childScope.baseData.$chargeprice = computeService.pullMoney(childScope.item.price) - childScope.baseData.preferentialprice;
            } else {
              childScope.baseData.$chargeprice = 0;
            }
          };

          childScope.checkRechargeamount = function (flag) {
            childScope.message.rechargeamountflag = flag;
            childScope.message.rechargeamount = flag ? "输入超出范围" : "";
            childScope.isPrevent();
          };
          childScope.checkGiveamount = function (flag) {
            childScope.message.giveamountflag = flag;
            childScope.message.giveamount = flag ? "输入超出范围" : "";
            childScope.isPrevent();
          };
          /**
           * 拦截确认
           */
          childScope.interceptionConfirm = function () {
            childScope.interception = true;
          };


          childScope.paytype = [
            {
              "label": "现金",
              "isBalance": true,
              "value": "1",
              "current": true
            },
            {
              "label": "银行卡",
              "isBalance": true,
              "value": "5",
              "current": false
            },
            {
              "label": "支付宝",
              "isBalance": true,
              "value": "2",
              "current": false
            },
            {
              "label": "微信支付",
              "isBalance": true,
              "value": "3",
              "current": false
            },
            {
              "label": "其他",
              "isBalance": true,
              "value": "7",
              "current": false
            }
          ];

          // 选择优惠的方式
         /* childScope.selectOffer = function(val) {
            if (val === 2) {
              childScope.baseData.preferentialprice = '';
            }
            if (val === 1) {
              _.omit(childScope.baseData, 'preferentialprice');
            }
          };*/

          childScope.setPaytype = function (item) {
            _.map(childScope.paytype, function (key) {
              key.current = false;
            });
            item.current = true;
            childScope.baseData.paytype = item.value;
          };
          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.itemHandler({data: {"status": "0",
              "data": _.merge(childScope.baseData, {
                userid: _.pick(childScope.item, ['guid']).guid
              })
            }
            });
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
          marktingPackage.availabalepackage().then(utils.requestHandler).then(function (results) {
            packageList = results.data;
            cbDialog.showDialogByUrl("app/pages/user_customer/add-package-dialog.html", handler, {
              windowClass: "viewFramework-add-package-dialog"
            });
          });

        })
      }
    }
  }

  /** @ngInject */
  function chargeBalanceDialog(cbDialog) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        var checkstoreuseraccount = true;

        function handler(childScope) {
          childScope.item = scope.item;
          childScope.interception = false;
          childScope.baseData = {
            rechargeamount: null // 防止直接填0时不触发ngChange
          };
          childScope.message = {};
          childScope.isPrevent = function () {
            if (_.isEmpty(childScope.baseData.giveamount)) {
              return false;
            }
            return childScope.baseData.giveamount * 100 >= childScope.baseData.rechargeamount * 100;
          };

          childScope.checkRechargeamount = function (flag) {
            childScope.message.rechargeamountflag = flag;
            childScope.message.rechargeamount = flag ? "输入超出范围" : "";
            childScope.isPrevent();
          };
          childScope.checkGiveamount = function (flag) {
            childScope.message.giveamountflag = flag;
            childScope.message.giveamount = flag ? "输入超出范围" : "";
            childScope.isPrevent();
          };

          /**
           * 拦截确认
           */
          childScope.interceptionConfirm = function () {
            if (childScope.isPrevent()) {
              return;
            }
            if (_.isEmpty(childScope.baseData.giveamount)) {
              childScope.baseData.giveamount = 0;
            }
            childScope.interception = true;
          };

          childScope.item.paytype = checkstoreuseraccount ? "1" : "";

          childScope.paytype = [
            {
              "label": "现金",
              "isBalance": true,
              "value": "1",
              "current": checkstoreuseraccount
            },
            {
              "label": "银行卡",
              "isBalance": true,
              "value": "5",
              "current": false
            }
          ];

          childScope.setPaytype = function (item) {
            _.map(childScope.paytype, function (key) {
              key.current = false;
            });
            item.current = true;
            childScope.item.paytype = item.value;
          };
          /**
           * 确定
           */
          childScope.confirm = function () {
            scope.itemHandler({data: {"status": "0",
              "data": _.merge(childScope.baseData, {
                userid: _.pick(childScope.item, ['guid']).guid,
                paytype: _.pick(childScope.item, ['paytype']).paytype
              })
            }
            });
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
          cbDialog.showDialogByUrl("app/pages/user_customer/charge-balance-dialog.html", handler, {
            windowClass: "viewFramework-charge-balance-dialog"
          });
        })
      }
    }
  }
})();

