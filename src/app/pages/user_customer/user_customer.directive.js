/**
 * Created by Administrator on 2016/10/15.
 */

(function () {
  'use strict';

  angular
    .module('shopApp')
    .directive('userAddVehicleDialog', userAddVehicleDialog)
    .directive('addPackageDialog', addPackageDialog)
    .directive('chargeBalanceDialog', chargeBalanceDialog)
    .directive('changePwdDialog', changePwdDialog)
    .directive('addNewCustomer', addNewCustomer)
    .directive('editTelphoneDialog', editTelphoneDialog)
    .directive('addMotorDialog', addMotorDialog)
    .directive('importMoreCustomer', importMoreCustomer)
    .directive('giftCouponDialog',giftCouponDialog);

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
              return !childScope.selectRequired.selectModel || (!childScope.baseData.$permanent && ( childScope.baseData.expireDay * 1 === 0))
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
            console.log(flag);
            if (!flag) {
              if (num > 0) {
                childScope.expireDate = utils.getFutureTime(num * 1 - 1);
              } else {
                childScope.expireDate = "";
              }
            } else {
              console.log(childScope.baseData.expireDay);
              childScope.baseData.expireDay = num;
              childScope.expireDate = "";
            }
          };

          // 设置实收金额
          childScope.setPreferentialprice = function () {
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
            scope.itemHandler({
              data: {
                "status": "0",
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
            },
            {
              "label": "其他",
              "isBalance": true,
              "value": "7",
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
            scope.itemHandler({
              data: {
                "status": "0",
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

  /** @ngInject */
  function changePwdDialog(cbDialog, cbAlert, userCustomer, $interval) {
    return {
      restrict: 'A',
      scope: {
        item: '='
      },
      link: function (scope, iElement) {

        function handler(childScope) {

          childScope.form = {};
          childScope.isError = false; // 原密码不正确
          childScope.isErrorCode = false; // 验证码不正确
          childScope.isSmsError = false; // 发送验证码失败
          childScope.config = {};
          childScope.config = {
            step: 1, // 流程控制
            isLoading: false, // 是否在加载
            isCountDown: true,  // 是否在倒计时，用于获取验证码
            content: '获取验证码'
          };

          var timer = null; // 用于倒计时

          // 倒计时
          function countDown(count) {
            timer = $interval(function () {
              if (count < 1) {
                childScope.config.isCountDown = false;
                $interval.cancel(timer);
                childScope.config.content = '获取验证码';
              } else {
                count--;
                childScope.config.isCountDown = true;
                childScope.config.content = '重新获取（' + count + 's）'
              }
            }, 1000);
          }

          // 进入下一步
          childScope.next = function () {
            if (!childScope.config.isLoading) {
              childScope.config.step += 1;
            }
          };

          // 回到第一步
          childScope.backToFirstStep = function () {
            childScope.config.isLoading = false;
            if (timer) {
              $interval.cancel(timer);
            }
            if (childScope.config.isErrorCode) { // 将验证码错误重置
              childScope.config.isErrorCode = false;
            }
            if (childScope.isSmsError) { // 将发送短信错误重置
              childScope.isSmsError = false;
            }
            childScope.config.step = 1;
          };

           // 下一步并发送手机短信
           childScope.sendSMSMessage = function() {
             childScope.next();
             childScope.sendVerifyCode();
           };

          // 发送验证码
          childScope.sendVerifyCode = function () {
            childScope.config.isLoading = true;
            if (childScope.isError) { // 将  原密码错误 重置
                childScope.isError = false;
            }
              childScope.config.isCountDown = true;
            // 向后台请求验证码
            var mobileParams = {"mobile": scope.item.mobile, "userId": scope.item.guid};
            userCustomer.getCode(mobileParams).then(function (results) {
              childScope.config.isLoading = false;
              if (results.data.status === 0) {
                childScope.isError = false;
                childScope.isSmsError = false;
                countDown(60);
              } else {
                childScope.isSmsError = true;
                childScope.smsError = results.data.data;
                childScope.config.isCountDown = false;
              }
            })
          };

          // 正常提交给后台
          childScope.submitBtn = function () {
            childScope.config.isLoading = true;
            childScope.form = {
              userId: scope.item.guid,
              originPwd: childScope.config.originPwd,
              newPwd: childScope.config.newPwd
            };
            userCustomer.paypwd(childScope.form).then(function (results) {
              childScope.config.isLoading = false;
              if (results.data.status == 0) {
                childScope.form = {};
                childScope.config.originPwd = '';
                childScope.config.newPwd = '';
                childScope.$change1 = false;
                childScope.$change2 = false;
                childScope.$change3 = false;
                cbAlert.tips("密码修改成功");
                childScope.close(false);
              } else {
                childScope.isError = true;
                childScope.config.originPwd = '';
                childScope.config.newPwd = '';
                childScope.config.$$confirm_password = '';
                childScope.errorInfo = results.data.data;
              }
            })
          };

          // 带验证码提交给后台
          childScope.submitCode = function () {
            childScope.config.isLoading = true;
            childScope.form = {
              userId: scope.item.guid,
              verifyCode: childScope.config.verifyCode,  // 验证码
              newPwd: childScope.config.forgetNewPwd
            };

            userCustomer.paypwd(childScope.form).then(function (results) {
              childScope.config.isLoading = false;
              if (results.data.status == 0) {
                childScope.form = {};
                childScope.config.forgetNewPwd = '';
                childScope.$change1 = false;
                childScope.$change2 = false;
                childScope.$change3 = false;
                cbAlert.tips("密码修改成功");
                childScope.close(false);
              } else {
                childScope.isErrorCode = true;
                childScope.config.verifyCode = '';
                // childScope.config.forgetNewPwd = '';
                // childScope.config.$confirm_password = '';
                if (timer) {
                  $interval.cancel(timer);
                  childScope.config.isCountDown = false;
                  childScope.config.content = '获取验证码';
                }
                childScope.errorInfo = results.data.data;

              }

            })

          }

        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          t.preventDefault();
          t.stopPropagation();

          cbDialog.showDialogByUrl("app/pages/user_customer/change-pwd-dialog.html", handler, {
            windowClass: "viewFramework-change-pwd-dialog"
          });

        })

      }
    }
  }


  /*
   * 2017/07/20  版本优化   by  yigeng
   * 1.新增会员/编辑会员
   * 2.修改手机号
   * 3.新增车辆/编辑车辆
   * */


  /*@ngInject*/
  /*
   * 新增会员/编辑会员
   * */
  function addNewCustomer(cbDialog, userCustomer, $interval, $q, saveCustomerData,simpleDialogService) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        var isEdit = scope.item.mobile ? true : false;
        console.log(isEdit);
        function handler(childScope) {
          /*
           * 根据传入的item数据是否有mobile字段判断弹窗页面是否显示编辑页面
           * 有mobile则直接进入编辑会员页面
           * 没有则进入手机验证页面
           * */
          childScope.status = scope.item.mobile ? 1 : 0;
          childScope.dataBase = _.assign({}, scope.item);
          childScope.storegrade = [];
          childScope.propsParams = {
            userId: scope.item.guid || '',
            mobile: scope.item.mobile || ''
          };
          childScope.propsHandler = function (data) {
            if (data.status === "0") {
              childScope.dataBase.mobile = data.data;
            }

          };
          childScope.propsParamsHandler = scope.itemHandler;
          if (scope.item.mobile) {
            //如果直接进入编辑页面则需要通过手机号请求会员数据
            var params = {mobile: scope.item.mobile};
            $q.all([userCustomer.grades(), userCustomer.getUser(params)]).then(function (results) {
              // console.log(results);
              childScope.status = 1;
              var grades = results[0].data || [],
                getUser = results[1].data || {};
              // getMotors = results[ 2 ].data || [];

              if (getUser.status === 0 && grades.status === 0) {

                if (!getUser.data) {
                  childScope.dataBase.username = params.mobile;
                  childScope.dataBase.mobile = params.mobile;

                } else {
                  childScope.dataBase = getUser.data;
                  childScope.storegrade = grades.data;
                }
                // childScope.isLoadData = true;
              } else {
                if (grades.status !== 0) {
                  // cbAlert.error("错误提示", grades.data);
                  simpleDialogService.error(grades.data,'错误提示');
                }
                if (getUser.status !== 0) {
                  // cbAlert.error("错误提示", getUser.data);
                  simpleDialogService.error(getUser.data,'错误提示');
                }
              }

              // if (getMotors.status === 0) {
              //   vm.dataLists = angular.copy(getMotors.data);
              //   setDataListsStatus();
              //   vm.dataLists[ 0 ] && (vm.dataLists[ 0 ].$current = true);
              //   showMotor(vm.dataLists[ 0 ]);
              // } else {
              //   cbAlert.error("错误提示", results.data.data);
              // }

            });
          }
          childScope.form = {};
          childScope.countdown = "获取验证码";
          childScope.isCountdown = true;
          childScope.isLoadData = false;
          childScope.showWarningTips = false;
          childScope.warningTips = "";
          /**
           * 点击获取验证码
           */
          childScope.setCountdown = function () {
            /*if (!childScope.isCountdown) {
             return;
             }*/
            childScope.isCountdown = false;
            userCustomer.verifyCode({mobile: childScope.dataBase.mobile}).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                getCount(60);
              } else {
                // cbAlert.error("错误提示", result.data);
                simpleDialogService.error(result.data,'错误提示');
                childScope.isCountdown = true;
              }
            });
          };

          /**
           * 获取验证码倒计时
           * @type {null}
           */
          var timer = null;

          function getCount(count) {
            timer = $interval(function () {
              if (count < 1) {
                childScope.countdown = "获取验证码";
                $interval.cancel(timer);
                childScope.isCountdown = true;
              } else {
                count--;
                childScope.countdown = '重新获取（' + count + 's）';
              }
            }, 1000);
          }

          /**
           * 设置当前user是否存在  如果是1存在 0不存在
           * @type {number}
           */
          childScope.myUsers = -1;
          childScope.existMobile = function (valid) {
            if (valid) {
              userCustomer.exist({mobile: childScope.dataBase.mobile}).then(function (results) {
                var result = results.data;
                if (result.status === 0) {
                  childScope.myUsers = result.data ? 1 : 0;
                } else {
                  // cbAlert.error("错误提示", result.data);
                  simpleDialogService.error(result.data,'错误提示');
                }
              });
            } else {
              childScope.myUsers = -1;
            }
          };


          /**
           *  下一步 功能函数
           *  如果已经是会员、则进入编辑页面
           *  如果不是会员、则进入新增页面
           */
          childScope.submitBtn = function () {

            /**
             * 设置默认-1和验证1都会直接去下一步
             */

            if (childScope.myUsers) {
              var requestParams = {mobile: childScope.dataBase.mobile};
              $q.all([userCustomer.grades(), userCustomer.getUser(requestParams)]).then(function (results) {
                // console.log(results);
                childScope.status = 1;
                var grades = results[0].data || [],
                  getUser = results[1].data || {};
                // getMotors = results[ 2 ].data || [];

                if (getUser.status === 0 && grades.status === 0) {

                  if (!getUser.data) {
                    // childScope.dataBase.username = requestParams.mobile;
                    childScope.dataBase.mobile = requestParams.mobile;

                  } else {
                    childScope.dataBase = getUser.data;
                    childScope.storegrade = grades.data;
                    childScope.propsParams = {
                      mobile: getUser.data.mobile,
                      userId: getUser.data.guid
                    }
                  }
                  // childScope.isLoadData = true;
                } else {
                  if (grades.status !== 0) {
                    /*childScope.showWarningTips = true;
                     childScope.warningTips = "错误提示:" + grades.data;*/
                    // cbAlert.error("错误提示", grades.data);
                    simpleDialogService.error(grades.data,'错误提示');
                  }
                  if (getUser.status !== 0) {
                    /*childScope.showWarningTips = true;
                     childScope.warningTips = "错误提示:" + getUser.data;*/
                    // cbAlert.error("错误提示", getUser.data);
                    simpleDialogService.error(getUser.data,'错误提示');
                  }
                }

                // if (getMotors.status === 0) {
                //   vm.dataLists = angular.copy(getMotors.data);
                //   setDataListsStatus();
                //   vm.dataLists[ 0 ] && (vm.dataLists[ 0 ].$current = true);
                //   showMotor(vm.dataLists[ 0 ]);
                // } else {
                //   cbAlert.error("错误提示", results.data.data);
                // }

              });


              return false;
            }
            /**
             * 如果0就直接提交手机号和验证码给后台
             */
            // 如果不是店铺会员或者平台会员 则 验证手机号和验证码
            userCustomer.verifyCodeCheck(childScope.dataBase).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                childScope.showWarningTips = false;
                childScope.warningTips = "";
                /**
                 * 1，如果返回数据为空，表示可以正常通过，可以进行下一步 根据手机号请求数据
                 * 2，如果不为空表示有错误提示阻止下一步操作
                 */
                if (result.data === "") {
                  //显示新增会员页面
                  childScope.status = 2;
                  childScope.showWarningTips = false;
                  childScope.warningTips = "";
                } else {
                  childScope.isCountdown = true;
                  childScope.countdown = "获取验证码";
                  $interval.cancel(timer);
                  childScope.showWarningTips = true;
                  childScope.warningTips = "错误提示:" + result.data;
                  // cbAlert.warning("错误提示", result.data);
                }
              } else {
                childScope.isCountdown = true;
                childScope.countdown = "获取验证码";
                $interval.cancel(timer);
                childScope.showWarningTips = true;
                childScope.warningTips = "错误提示:" + result.data;
                // cbAlert.error("错误提示", result.data);
              }
            });
          };


          /*
           * 会员编辑 保存
           * */

          childScope.saveData = function () {
            childScope.isLoadData = true;


            /*
             * 针对新增操作、如果数据中没有username字段、则将mobile赋给username
             * */
            if (!childScope.dataBase.username) {
              childScope.dataBase.username = childScope.dataBase.mobile;
            }
            userCustomer.add(childScope.dataBase).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                /*
                 * 保存成功
                 * 1、关闭当前弹窗
                 * 2、弹出是否继续添加车辆弹窗
                 * 3、执行指令回调函数
                 * */

                childScope.isLoadData = false;
                childScope.close(false);

                cbDialog.showDialogByUrl("app/pages/user_customer/add-motor-confirm.html", handler, {
                  windowClass: "viewFramework-add-motor-confirm"
                });
                saveCustomerData.setCustomer({userid: result.data, mobile: childScope.dataBase.mobile});
                scope.itemHandler({data: {"status": "0", "data": "执行回调"}});
              } else {
                /*
                 * 保存失败则弹出错误提示
                 * */
                childScope.isLoadData = false;
                // childScope.showWarningTips = true;
                // childScope.warningTips = "错误提示:" + result.data;
                // cbAlert.error("错误提示", result.data);
                simpleDialogService.error(result.data,'错误提示');
              }
            })
          }
        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          console.log(scope.item.mobile);
          scope.itemHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/user_customer/add-new-customer-dialog.html", handler, {
            windowClass: "viewFramework-add-new-customer-dialog"
          });

        })
      }
    }
  }

  /** @ngInject */
  /*
   * 修改手机号
   * */
  function editTelphoneDialog(cbDialog, userCustomer, $interval,simpleDialogService) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function (scope, iElement) {
        function handler(childScope) {
          childScope.dataBase = {};
          childScope.countdown = "获取验证码";
          childScope.showTips = false;
          childScope.isCountdown = true;
          childScope.showWarningTips = false;
          /**
           * 获取验证码倒计时
           * @type {null}
           */
          var timer = null;

          function getCount(count) {
            timer = $interval(function () {
              if (count < 1) {
                childScope.countdown = "获取验证码";
                $interval.cancel(timer);
                childScope.isCountdown = true;
              } else {
                count--;
                childScope.countdown = '重新获取（' + count + 's）';
              }
            }, 1000);
          }

          childScope.setCountdown = function () {
            if (!childScope.isCountdown) {
              return;
            }
            childScope.isCountdown = false;
            console.log(childScope.dataBase);
            var payLoad = {
              mobile: childScope.dataBase.mobile,
              userId: scope.item.userId
            };
            console.log(payLoad);
            userCustomer.editPhoneVerifyCode(payLoad).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
                console.log('success');
                childScope.showTips = true;
                getCount(60);
              } else {
                // cbAlert.error("错误提示", result.data);
                console.log('failed');
                simpleDialogService.error(result.data,'错误提示');
                childScope.isCountdown = true;
              }
            });
          };

          childScope.submitBtn = function () {
            console.log(childScope.dataBase);
            var params = {
              verifyCode: childScope.dataBase.code,
              mobile: childScope.dataBase.mobile,
              userId: scope.item.userId
            };
            userCustomer.editPhoneVerifyCodeCheck(params).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                childScope.showWarningTips = false;
                childScope.warningTips = "";
                /**
                 * 1，如果返回数据为空，表示修改成功
                 * 2，如果不为空表示有错误提示阻止下一步操作
                 */
                if (result.data === "") {
                  childScope.showWarningTips = false;
                  childScope.warningTips = "";
                  scope.itemHandler({data: {"status": "0", "data": childScope.dataBase.mobile}});
                  scope.item.mobile = childScope.dataBase.mobile;
                  childScope.close();
                } else {
                  // cbAlert.warning("错误提示", result.data);
                  childScope.isCountdown = true;
                  // childScope.countdown = "获取验证码";
                  childScope.countdown = "获取验证码";
                  $interval.cancel(timer);
                  childScope.showWarningTips = true;
                  childScope.warningTips = result.data;
                }
              } else {
                // cbAlert.error("错误提示", result.data);
                childScope.isCountdown = true;
                childScope.countdown = "获取验证码";
                $interval.cancel(timer);
                /*childScope.showWarningTips = true;
                childScope.warningTips = result.data;*/
                simpleDialogService.error(result.data,'错误提示');
              }
            });
          }
        }

        iElement.click(function (t) {
          scope.itemHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/user_customer/edit-telphone-dialog.html", handler, {
            windowClass: "viewFramework-edit-telphone-dialog"
          });

        })
      }
    }


  }


  /** @ngInject */
  /*
   * 新增车辆/编辑车辆
   * */

  function addMotorDialog(cbDialog, cbAlert, vehicleSelection, userCustomer, saveCustomerData,simpleDialogService) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        // motorList:"=",
        itemHandler: "&"
      },
      link: function (scope, iElement, attrs) {
        var dataLists = [];

        function handler(childScope) {
          // childScope.item = _.assign({},scope.item);
          /*新增车辆数据*/
          childScope.item = {};
          /*编辑车辆数据*/
          // childScope.editItem = _.assign({},scope.item);
          childScope.editItem = _.cloneDeep(scope.item);
          childScope.dataLists = dataLists;
          childScope.insuranceModel = {};
          childScope.isEdit = attrs.addMotorDialog === "edit";
          childScope.isClose = false;
          /*
           * 获取保险公司列表
           * */
          vehicleSelection.insurances().then(function (results) {
            var result = results.data;
            if (result.status === 0) {
              childScope.insuranceModel.store = angular.copy(result.data);
            } else {
              // cbAlert.error("错误提示", result.data);
              simpleDialogService.error(result.data,'错误提示');
            }
          });


          /*
           * 购车日期配置
           * */
          childScope.date1 = {
            options: {
              startingDay: 1,
              placeholder: "请选择",
              minDate: new Date("2000/01/01 00:00:00"),
              maxDate: new Date()
            },
            opened: false,
            open: function () {
              childScope.date2.opened = false;
              childScope.date3.opened = false;
            }
          };

          /*
           * 上次年检日期配置
           * */
          childScope.date2 = {
            options: {
              startingDay: 1,
              placeholder: "请选择",
              minDate: new Date("2010/01/01 00:00:00"),
              maxDate: new Date()
            },
            opened: false,
            open: function () {
              childScope.date1.opened = false;
              childScope.date3.opened = false;
            }
          };

          /*
           * 保险购买日期配置
           * */
          childScope.date3 = {
            options: {
              startingDay: 1,
              placeholder: "请选择",
              minDate: new Date("2010/01/01 00:00:00"),
              maxDate: new Date()
            },
            opened: false,
            open: function () {
              childScope.date1.opened = false;
              childScope.date2.opened = false;
            }
          };


          /*childScope.addMotor = function () {
           showMotor({});
           };*/


          /*function showMotor(item) {
           childScope.item = item;
           }*/

          /*childScope.currentSelect = function ($event, item) {
           // 如果
           if (item.$current) {
           return;
           }
           setDataListsStatus();
           item.$current = true;
           childScope.item = undefined;
           showMotor(item);
           };*/


          /*function setDataListsStatus() {
           _.map(childScope.dataLists, function (key, index) {
           key.$current = false;
           key.$index = index;
           key.$logo = configuration.getStatic() + key.logo;
           });
           }*/

          function setCurrentItem(data) {
            childScope.item = _.assign({}, childScope.item, data);
            /*var index = _.findIndex(childScope.dataLists, function (item) {
             return item[ '$index' ] === childScope.item[ '$index' ];
             });
             childScope.dataLists[ index ] = childScope.item;*/
          }

          var index = childScope.dataLists.length;
          childScope.vehicleHandler = function (data) {
            console.log(data);
            if (data.type === 'add') {
              _.forEach(childScope.dataLists, function (key) {
                key.$current = false;
              });
              var items = _.assign({}, data.data, {
                /*$current: true,
                 $logo: configuration.getStatic() + data.data.logo,
                 $index: childScope.dataLists.length*/
              });
              // childScope.dataLists.push(items);
              childScope.dataLists[index] = items;
              // showMotor(items);
              childScope.item = _.assign({}, childScope.item, items);
              // childScope.item.model = items.model;
            } else if (data.type === "edit") {
              // setCurrentItem(_.assign({}, data.data, { $current: true, $logo: configuration.getStatic() + data.data.logo }));
              /*var now = _.assign({}, data.data, {
               $current: true,
               $logo: configuration.getStatic() + data.data.logo,
               $index: childScope.dataLists.length
               });*/
              // editMotor(now);
              // console.log(childScope.item);

              /*
               * 选择数据后将传入的数据做拼装
               * */
              //修改后的数据
              var editData = _.assign({}, data.data);
              childScope.editItem = _.assign({}, childScope.editItem, editData);
              // childScope.dataLists[ nowIndex ] = childScope.item;
            }
          };

          childScope.updateLicence = function (data) {
            setCurrentItem(_.assign({}, data.data, {licence: data}));
          };
          childScope.editLicence = function (data) {
            childScope.editItem.licence = data;
            setCurrentItem(_.assign({}, data.data, {licence: data}));
          };

          /*
           * 新增车辆
           * */
          childScope.saveData = function () {
            var len = childScope.dataLists.length;
            childScope.dataLists[len - 1] = _.assign({}, childScope.dataLists[len - 1], childScope.item);
            var motors = childScope.dataLists;
            _.forEach(motors, function (item) {
              item.userId = scope.item.guid || saveCustomerData.getCustomer().userid;
            });
            // motors = _.assign(motors[motors.length-1],childScope.item);
            console.log(motors);
            userCustomer.addMotors(motors).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                childScope.close();
                cbAlert.tips("添加成功");
                scope.itemHandler({data: {"status": "0", "data": scope.item.mobile}});

              } else {
                // cbAlert.error("错误提示", result.data);
                simpleDialogService.error(result.data,'错误提示');
              }
            });
          };

          /*
           * 编辑车辆
           * */
          childScope.editData = function () {
            var motors = [childScope.editItem];
            _.forEach(motors, function (item) {
              item.userId = scope.item.guid || saveCustomerData.getCustomer().userid;
              item.logo = item.logo.replace("http://shop.cb.cn", "");
            });
            console.log(motors);
            userCustomer.addMotors(motors).then(function (results) {
              var result = results.data;
              if (result.status === 0) {
                cbAlert.tips("编辑成功");
                scope.itemHandler({data: {"status": "0", "data": scope.item.mobile, changeData: childScope.editItem}});
                childScope.close();
              } else {
                // cbAlert.error("错误提示", result.data);
                simpleDialogService.error(result.data,'错误提示');
              }
            });
          };


          /*
           * 取消弹窗确认
           * */
          childScope.cancel = function () {
            // childScope.isClose = true;
            childScope.close();
          };

          childScope.sureClose = function () {
            childScope.close();
          };
          childScope.cancelClose = function () {
            childScope.isClose = false;
          }

        }

        iElement.click(function (t) {
          // scope.itemHandler({data: {"status": "-1", "data": "打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          // console.log(scope.item);
          /*userCustomer.getMotors({mobile:scope.item.mobile || saveCustomerData.getCustomer().mobile}).then(function(result){
           var getMotors = result.data;
           if (getMotors.status === 0) {
           dataList = angular.copy(getMotors.data);
           setDataListsStatus();
           vm.dataLists[ 0 ] && (vm.dataLists[ 0 ].$current = true);
           showMotor(vm.dataLists[ 0 ]);
           console.log(dataList);
           } else {
           cbAlert.error("错误提示", result.data.data);
           }
           });*/


          /*userCustomer.add(scope.item).then(function (results) {
           var result = results.data;
           if (result.status === 0) {
           userId = result.data;
           } else {
           cbAlert.error("错误提示", result.data);
           }
           });*/
          if (attrs.addMotorDialog === "add") {
            userCustomer.getMotors({mobile: scope.item.mobile || saveCustomerData.getCustomer().mobile}).then(function (result) {
              var getMotors = result.data;
              if (getMotors.status === 0) {
                dataLists = angular.copy(getMotors.data);
                scope.itemHandler({
                  data: {
                    status: "-1",
                    data: "窗口打开成功"
                  }
                });
                cbDialog.showDialogByUrl("app/pages/user_customer/add-motor-dialog.html", handler, {
                  windowClass: "viewFramework-add-motor-dialog"
                });
              } else {
                // cbAlert.error("错误提示", result.data.data);
                simpleDialogService.error(result.data.data,'错误提示');
              }
            });
          } else {
            scope.itemHandler({
              data: {
                status: "-1",
                data: "窗口打开成功"
              }
            });
            cbDialog.showDialogByUrl("app/pages/user_customer/add-motor-dialog.html", handler, {
              windowClass: "viewFramework-add-motor-dialog"
            });
          }


        })
      }
    }
  }


  /*
   * 2017/08/03 版本优化  by yigeng
   * 1. 批量导入会员弹窗指令
   * */

  /*@ngInject*/
  /*
   * 批量导入会员弹窗指令
   * */

  function getRequest(api, webSiteApi, configuration){
    var WEB_SITE_API = webSiteApi.WEB_SITE_API;
    api = api.split(',');
    if(api.length !== 3){
      throw Error("传递配置参数不是3个");
    }
    var params = WEB_SITE_API[api[0]][api[1]][api[2]];
    if(_.isEmpty(params)){
      throw Error("api.js配置和传入参数不对应");
    }
    return configuration.getAPIConfig() + params.url;
  }

  function importMoreCustomer(cbDialog, configuration,webSiteApi,$timeout, $log, webSiteVerification) {
    var DEFAULT_DATA = {
      uid: 0,
      fileNumLimit: 1,
      fileSizeLimit: 3 + "mb"
    };
    return {
      restrict: "A",
      scope: {
        params: "=",
        uploadExcel: "&"
      },
      // require: '?^importData',
      link: function(scope, iElement, iAttrs, ctrl) {

        var importData = scope.params;
        var importUrl = getRequest(importData.import, webSiteApi, configuration); // http://localhost:3000/shopservice/admin/file/add_user

        /**
         * config 配置默认参数
         * @type {any}
         */
        var config = angular.extend({}, DEFAULT_DATA, scope.config || {});
        config.fileNumLimit = iAttrs.valueMax * 1 || 1;
        var fileType = webSiteVerification.UPLOAD[iAttrs.simpleFile || 'excel'];
        var uploadType = iAttrs.uploadType || "";
        // console.log('uploadType', fileType);
        var getUploadParam = {};
        var upload;

        function handler(childScope) {
          var results = [];
          var start, add;
          var isClear = true;
          var isError = false;
          childScope.loadingState = false;
          childScope.canUpLoad = false;
          childScope.title = iAttrs.title;
          childScope.getUploadParam = getUploadParam;
          childScope.items = [];
          childScope.postInit = false;
          childScope.download = function () {
            // var downloadUrl = scope.params.download; // 下载模版地址
            // console.log('download site', downloadUrl)
            // return getRequest(downloadUrl, webSiteApi, configuration); // '/admin/static/user.xls'
            return configuration.getAPIConfig(true) + '/static/user.xls';
          };
          $log.debug(upload);
          $timeout(function () {
            start = angular.element('#startUpload');
            add = angular.element('#addFiles');
            upload = new plupload.Uploader({
              runtimes: 'html5,flash,silverlight,html4',
              browse_button: 'startUpload',
              multiple_queues: true,
              multi_selection:false,
              chunk_size: '1mb',
              filters: {
                max_file_size: config.fileSizeLimit,
                // Specify what files to browse for
                mime_types: [
                  fileType
                ]
              },
              views: {
                list: true,
                thumbs: true, // Show thumbs
                active: 'thumbs'
              },
              file_data_name: 'file',
              // container: document.getElementById('j-upload-container'),
              flash_swf_url: configuration.getStatic() + '/assets/upload/Moxie.swf',
              silverlight_xap_url: configuration.getStatic() + '/assets/upload/Moxie.xap',
              url: importUrl // 上传地址
            });
            upload.init();
            upload.bind('PostInit', function (up) {
              $log.debug('PostInit');
              add.on('click', function () {
                if (!angular.element(this).hasClass('upload-disabled')) {
                  angular.element(this).parents('.btns').remove();
                  up.setOption({
                    'multipart_params': {
                      "file": "file"
                    }
                  });
                  childScope.loadingState = true;
                  up.start();
                }
              });
              childScope.postInit = true;
              scope.$apply();
            });
            upload.bind('BeforeUpload', function (up, file) {
              $log.debug('init');
            });
            upload.bind('FilesAdded', function (up, files) {
              childScope.danger = "";
              childScope.items = [];
              console.log(files[0].name.substring(files[0].name.length-4));
              var str =  files[0].name.substring(files[0].name.length-4);
              if (str !== ".xls"){
                childScope.danger = "文件格式不正确";
                childScope.canUpLoad = false;
              }else {
                childScope.canUpLoad = true;
              }
              // console.log('FilesAdded', up, files);
              if (upload.total.queued > config.fileNumLimit) {
                upload.splice(0,upload.total.queued-1);
                // console.log(config.fileNumLimit, upload.total.queued);
                // var div = add.siblings('div');
                /*add.addClass('upload-disabled').prop('disabled', true).css({
                  'position': 'absolute',
                  'left': div.css('left'),
                  'top': div.css('top'),
                  'z-index': 10
                });*/
              }
              // start.removeClass('upload-disabled').prop('disabled', false).click();
              angular.forEach(files, function (file) {
                childScope.items.push({
                  id: file.id,
                  name: file.name,
                  progress: 0,
                  size: plupload.formatSize(file.size)
                });
              });
              config.uid++;
              scope.$apply();
            });

            upload.bind('UploadProgress', function (up, file) {
              $log.debug('UploadProgress', file.percent);
              var index = _.findIndex(childScope.items, {id: file.id});
              childScope.items[index].progress = file.percent;
              childScope.loadingState = true;
              scope.$apply();
            });
            upload.bind('FileUploaded', function (up, file, info) { // info是后台返回的数据
              $log.debug('FileUploaded', info.status, file);
              console.log('info',info);
              if (info.status == 200) {
                results = angular.fromJson(info.response);
              }

            });
            upload.bind('UploadComplete', function (up, file, info) {
              $log.debug('UploadComplete', info);
              if (isClear && !isError) {
                console.log(results);
                // childScope.close();
                childScope.loadingState = false;
                $timeout(function () {
                  scope.uploadExcel({data: {"status":"0", "data": results}}); // 完成后调用这个函数
                  childScope.close();
                }, 200);
              }
              start.addClass('upload-disabled');
              scope.$apply();
            });
            upload.bind('Error', function (up, err) {
              console.log('Error', err);
              console.log('Error', err.message);
              console.log(err.status);
              if (err.code == -600) {
                childScope.danger = "文件超过" + config.fileSizeLimit + "，请重新选择上传";
              }
              if (err.status == 403) {
                childScope.danger = "上传过期，请重新选择文件上传";
                $timeout(function () {
                  childScope.close();
                }, 3000);
              }
              if (err.code == -601) {
                childScope.danger = "上传文件类型错误,请重新选择文件上传";
              }
              if (err.code == -200) {
                childScope.danger = "网络错误";
              }
              scope.$apply();
            });
          }, 1);

          childScope.remove = function (item) {
            upload.removeFile(item.id);
            _.remove(childScope.items, {id: item.id});
          };

        }

        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          console.log(123);
          if(!uploadType){
            throw Error('上传的API类型不存在');
          }
          // ctrl.hideItems();
          cbDialog.showDialogByUrl("app/pages/user_customer/upFileDialog.html", handler, {
            windowClass: "viewFramework-up-file-dialog"
          });
          t.preventDefault();
          t.stopPropagation();
        });
      }
    };
  }


  function giftCouponDialog(cbDialog,cbAlert,tadeOrder){
    return {
      restrict:"A",
      scope:{
        item:'=',
        itemHandler:'&'
      },
      link:function(scope,iElement){
        var availiableCoupon = [];

        function handler(childScope) {
          var geekscoupons = [
            {
              id: "-1",
              name: "请选择"
            }
          ];
          // geekscoupons.push.apply(geekscoupons, results[1].data.data);
          console.log(availiableCoupon);
          geekscoupons.push.apply(geekscoupons,availiableCoupon);
          childScope.CouponLists = availiableCoupon;
          console.log(geekscoupons);
          // childScope.
          childScope.couponsModel = {
            store: geekscoupons,
            handler: function (data) {

            }
          };
          childScope.savaData = function(){

            childScope.jKCouponId = childScope.jKCouponId || "-1";
            console.log(childScope.jKCouponId);
            // var status = childScope.jKCouponId == "-1"?"-1":"0";
            if(childScope.jKCouponId == "-1"){
              childScope.close();
              return false;
            }
            var params = {
              jKCouponId:childScope.jKCouponId ,
              userinfo:angular.toJson(scope.item)
            };
            tadeOrder.takeJKCouponById(params).then(function(result){
              var data = result.data;
              if (data.status === 0){
                cbAlert.tips('赠送优惠券成功');
                childScope.close();
                scope.itemHandler({
                  data:{
                    status:"0",
                    data:"执行回调"
                  }
                });
              }else {
                cbAlert.error(data.data);
              }
            });

            /*var params = {

            }
            tadeOrder.takeJKCouponById()*/
          }
        }

        iElement.click(function(e){
          e.preventDefault();
          e.stopPropagation();

          console.log(tadeOrder);
          console.log(scope.item.guid);
          /*scope.itemHandler({
            data: {
              status: "-1",
              data: "窗口打开成功"
            }
          });*/

          tadeOrder.getAvaCouponByUserID({userid:scope.item.guid}).then(function(result){
            // console.log(result);
            var data = result.data;
            if(data.status === 0) {
              availiableCoupon = data.data;
              if(availiableCoupon.length){
                cbDialog.showDialogByUrl("app/pages/user_customer/gift-coupon-dialog.html", handler, {
                  windowClass: "viewFramework-gift-coupon-dialog"
                });
              }else {
                // cbAlert.tips("没有可送的券");
                cbAlert.warning("没有可送的券")
              }

            }else {
              cbAlert.error("错误提示", result.data.data);
            }
          });
        });

        scope.$on('$destroy',function () {
          console.log('$destroy');
        })

      }
    }
  }
})();

