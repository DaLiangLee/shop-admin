/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
      .module('shopApp')
      .controller('UserCustomerListController', UserCustomerListController)
      .controller('UserCustomerChangeController', UserCustomerChangeController)
      .controller('UserCustomerAddController', UserCustomerAddController);

  /** @ngInject */
  function UserCustomerListController($scope, $state, $document, cbAlert, userCustomer, userCustomerConfig, userMotorConfig, computeService, configuration, cbDialog, marktingPackage,utils) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, { pageSize: 5 });
    var uploadResult = {};
    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
      itemList: [],
      requestParams: {
        params: currentParams,
        request: "users,customer,export",
        permission: "chebian:store:user:customer:export"
      },
      importParams: {
        download: "users,customer,download",
        import: "users,customer,import",
        permission: "chebian:store:user:customer:import",
        uploadExcel: function (result) {
          var data = result.data.data;
          if (result.status == 0) {
            uploadResult = {
              totalCount: data.count,
              successCount: data.success,
              errorCount: data.error,
              hasError: !!data.error,
              downloadPath: data.path ? data.path : ''
            };
            uploadResult.downloadUrl = configuration.getAPIConfig() +'/file/get_result?path=' + uploadResult.downloadPath;

            cbDialog.showDialogByUrl("app/pages/user_customer/user-upload-result-dialog.html", handler, {
              windowClass: "viewFramework-upload-result-dialog"
            });

            if (uploadResult.successCount > 0) {
              $state.reload();
            }
          }
        }
      },
      config: angular.copy(userCustomerConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, { page: data });
        $state.go(currentStateName, page);
      },
      sortChanged: function (data) {
        var orders = [];
        angular.forEach(data.data, function (item, key) {
          orders.push({
            "field": key,
            "direction": item
          });
        });
        var order = angular.extend({}, currentParams, { orders: angular.toJson(orders) });
        vm.gridModel.requestParams.params = order;
        getList(order);
      },
      selectHandler: function (item) {
        // 拦截用户恶意点击
        !item.$active && item.mobile && getMotor(item.mobile);
      }
    };

    function handler(childScope) {
      childScope.config = uploadResult;
    }

    vm.gridModel.config.propsParams = {
      balanceItem: function (data) {
        if (data.status === '0') {
          data.data.rechargeamount = computeService.pushMoney(data.data.rechargeamount);
          data.data.giveamount = computeService.pushMoney(data.data.giveamount);
          userCustomer.chargeBalance(data.data).then(function (results) {
            var result = results.data;
            if (result.status === 0) {
              cbAlert.tips('充值成功');
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", result.data);
            }
          });
        }
      },
      packageItem: function (data) {
        if (data.status === '0') {

          data.data.preferentialprice = computeService.pushMoney(data.data.preferentialprice);

          if(_.isEmpty(data.data.expireDay)){
            data.data.expireDay = null;
          }
          marktingPackage.saleapackage(data.data).then(function (results) {
            var result = results.data;
            if (result.status === 0) {
              cbAlert.tips('办理成功');
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", result.data);
            }
          });
        }
      },
      nextshow: function (item, $event) {
        close();
        item.$show = !item.$show;
        // // item.$active =item.$show;
        item.$on = item.$show;
        $event.stopPropagation();

      },
      templateData:[],
      hasCheck:false,
      getPackageInfo: function(item) { // 悬浮信息框
        this.templateData = [];
        if (angular.isUndefined(item) || item.packagenum === "0") {
          return;
        }
        var _this = this;
        marktingPackage.getalluserpackagebyuserid({userid: item.guid}).then(utils.requestHandler).then(function (results) {
          _.forEach(results.data, function (item) {
            item.expireDay = utils.getComputeDay(new Date(), item.expire);
          });
          _this.templateData = results.data;
          _this.hasCheck = true;
        });
      }
    };

    function close() {
      _.map(vm.gridModel.itemList, function (item) {
        item.$show = false;
        item.$on = false;
      });
    }

    $document.click(function () {
      $scope.$apply(function () {
        close();
      });
    });

    vm.gridModel2 = {
      columns: angular.copy(userMotorConfig().DEFAULT_GRID.columns),
      itemList: [],
      config: {
        'settingColumnsSupport': false,   // 设置表格列表项
        'sortSupport': true,
        'paginationSupport': false,  // 是否有分页
        'useBindOnce': true  // 是否单向绑定
      },
      loadingState: true      // 加载数据
    };
    function getMotor(mobile) {
      vm.gridModel2.loadingState = true;
      userCustomer.getMotors({ mobile: mobile }).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          return result.data;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      }).then(function (result) {
        vm.gridModel2.itemList = [];
        angular.forEach(result, function (item) {
          item.logo = configuration.getStatic() + item.logo;
          item.baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + item.guid;
          vm.gridModel2.itemList.push(item);
        });
        vm.gridModel2.itemList = result;
        vm.gridModel2.loadingState = false;
      });
    }

    /**
     * 获取员工列表
     */
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }
      userCustomer.userList(params).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          if (!result.data.length && params.page * 1 !== 1) {
            $state.go(currentStateName, { page: 1 });
          }

          vm.gridModel.itemList = result.data;
          // console.log(vm.gridModel.itemList);
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.totalCount
          };

          !result.totalCount && (vm.gridModel2.itemList = [], vm.gridModel2.loadingState = false);
          vm.gridModel.itemList[ 0 ] && getMotor(vm.gridModel.itemList[ 0 ].mobile);
          vm.gridModel.loadingState = false;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);


    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      'handler': function (data) {
        var search = angular.extend({}, currentParams, data);
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, search)) {
          $state.reload();
        } else {
          $state.go(currentStateName, search);
        }
      }
    };
    userCustomer.grades().then(function (results) {
      var result = results.data;
      if (result.status === 0) {
        vm.searchModel.config = {
          other: currentParams,
          keyword: {
            placeholder: "请输入会员姓名、手机号、车牌号、车辆品牌",
            model: currentParams.keyword,
            name: "keyword",
            isShow: true
          },
          searchDirective: [
            {
              label: "会员等级",
              all: true,
              type: "list",
              name: "grade",
              model: currentParams.grade,
              list: getRoleList(result.data)
            },
            {
              label: "创建时间",
              name: "Date",
              all: true,
              custom: true,
              type: "date",
              model: _.isUndefined(currentParams.startDate) ? '-1' : '-2',
              start: {
                name: "startDate",
                model: currentParams.startDate,
                config: {
                  minDate: new Date("2010/01/01 00:00:00")
                }
              },
              end: {
                name: "endDate",
                model: currentParams.endDate,
                config: {
                  minDate: new Date("1950/01/01 00:00:00")
                }
              }
            }
          ]
        }
      } else {
        cbAlert.error("错误提示", result.data);
      }
    });
    /**
     * 格式化权限数据
     * @param arr
     * @returns {Array}
     */
    function getRoleList(arr) {
      var results = [];
      angular.forEach(arr, function (item) {
        results.push({
          id: item.guid,
          label: item.gradename
        })
      });
      return results;
    }


  }


  /** @ngInject */
  function UserCustomerAddController($state, $interval, cbAlert, userCustomer) {
    var vm = this;
    //获取验证码
    vm.countdown = "获取验证码";
    vm.isCountdown = true;
    /**
     * 点击获取验证码
     */
    vm.setCountdown = function () {
      if (!vm.isCountdown) {
        return;
      }
      vm.isCountdown = false;
      userCustomer.verifyCode(vm.form.mobile).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          getCount(60);
        } else {
          cbAlert.error("错误提示", result.data);
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
          vm.countdown = "获取验证码";
          $interval.cancel(timer);
          vm.isCountdown = true;
        } else {
          count--;
          vm.countdown = count + "秒后再次获取";
        }
      }, 1000);
    }

    /**
     * 设置当前user是否存在  如果是1存在 0不存在
     * @type {number}
     */
    vm.myUsers = -1;
    vm.existMobile = function (valid) {
      if (valid) {
        userCustomer.exist({ mobile: vm.form.mobile }).then(function (results) {
          var result = results.data;
          if (result.status === 0) {
            vm.myUsers = result.data ? 1 : 0;
          } else {
            cbAlert.error("错误提示", result.data);
          }
        });
      } else {
        vm.myUsers = -1;
      }
    };
    /**
     * 提交数据给后台
     */
    vm.submitBtn = function () {
      /**
       * 设置默认-1和验证1都会直接去下一步
       */
      if (vm.myUsers) {
        $state.go('user.customer.add2', { mobile: vm.form.mobile });
        return;
      }
      /**
       * 如果0就直接提交手机号和验证码给后台
       */
      userCustomer.verifyCodeCheck(vm.form).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          /**
           * 1，如果返回数据为空，表示可以正常通过，可以进行下一步
           * 2，如果不为空表示有错误提示阻止下一步操作
           */
          if (result.data === "") {
            $state.go('user.customer.add2', { mobile: vm.form.mobile });
          } else {
            cbAlert.warning("错误提示", result.data);
          }
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }
  }


  /** @ngInject */
  function UserCustomerChangeController($state, $q, cbAlert, userCustomer, vehicleSelection, configuration) {
    var vm = this;
    var currentParams = $state.params;
    vm.isLoadData = false;
    vm.dataBase = {};
    vm.dataLists = [];

    vm.insuranceModel = {};

    $q.all([ userCustomer.grades(), userCustomer.getUser(currentParams), userCustomer.getMotors(currentParams) ]).then(function (results) {
      var grades = results[ 0 ].data || [],
          getUser = results[ 1 ].data || {},
          getMotors = results[ 2 ].data || [];

      if (getUser.status === 0 && grades.status === 0) {
        if (!getUser.data) {
          vm.dataBase.username = currentParams.mobile;
          vm.dataBase.mobile = currentParams.mobile;

        } else {
          vm.dataBase = getUser.data;
          vm.storegrade = grades.data;
        }
        vm.isLoadData = true;
      } else {
        if (grades.status !== 0) {
          cbAlert.error("错误提示", grades.data);
        }
        if (getUser.status !== 0) {
          cbAlert.error("错误提示", getUser.data);
        }
      }

      if (getMotors.status === 0) {
        vm.dataLists = angular.copy(getMotors.data);
        setDataListsStatus();
        vm.dataLists[ 0 ] && (vm.dataLists[ 0 ].$current = true);
        showMotor(vm.dataLists[ 0 ]);
      } else {
        cbAlert.error("错误提示", results.data.data);
      }

    });

    vehicleSelection.insurances().then(function (results) {
      var result = results.data;
      if (result.status === 0) {
        vm.insuranceModel.store = angular.copy(result.data);
      } else {
        cbAlert.error("错误提示", result.data);
      }
    });

    vm.currentSelect = function ($event, item) {
      // 如果
      if (item.$current) {
        return;
      }
      setDataListsStatus();
      item.$current = true;
      vm.item = undefined;
      showMotor(item);
    };

    /**
     * 设置dataLists选中状态
     */
    function setDataListsStatus() {
      _.map(vm.dataLists, function (key, index) {
        key.$current = false;
        key.$index = index;
        key.$logo = configuration.getStatic() + key.logo;
      });
    }


    vm.addMotor = function () {
      showMotor({});
    };

    function showMotor(item) {
      vm.item = item;
    }

    /**
     * 购车日期配置
     * @type {{}}
     */
    vm.date1 = {
      options: {
        startingDay: 1,
        placeholder: "请选择购车日期",
        minDate: new Date("2000/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function () {
        vm.date2.opened = false;
        vm.date3.opened = false;
      }
    };
    /**
     * 上次年检日期配置
     * @type {{}}
     */
    vm.date2 = {
      options: {
        startingDay: 1,
        placeholder: "请选择上次年检日期",
        minDate: new Date("2010/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function () {
        vm.date1.opened = false;
        vm.date3.opened = false;
      }
    };
    /**
     * 保险购买日期配置
     * @type {{}}
     */
    vm.date3 = {
      options: {
        startingDay: 1,
        placeholder: "请选择保险购买日期",
        minDate: new Date("2010/01/01 00:00:00"),
        maxDate: new Date()
      },
      opened: false,
      open: function () {
        vm.date1.opened = false;
        vm.date2.opened = false;
      }
    };

    /**
     * 添加编辑车型
     * @param data
     */
    vm.vehicleHandler = function (data) {
      if (data.type === 'add') {
        _.forEach(vm.dataLists, function (key) {
          key.$current = false;
        });
        var items = _.assign({}, data.data, {
          $current: true,
          $logo: configuration.getStatic() + data.data.logo,
          $index: vm.dataLists.length
        });
        vm.dataLists.push(items);
        showMotor(items);
      } else if (data.type === "edit") {
        setCurrentItem(_.assign({}, data.data, { $current: true, $logo: configuration.getStatic() + data.data.logo }));
      }
    };

    /**
     * 更新车牌
     * @param data
     */
    vm.updateLicence = function (data) {
      setCurrentItem(_.assign({}, data.data, { licence: data }));
    };

    /**
     * 设置当前显示的数据
     * @param data
     */
    function setCurrentItem(data) {
      vm.item = _.assign({}, vm.item, data);
      var index = _.findIndex(vm.dataLists, function (item) {
        return item[ '$index' ] === vm.item[ '$index' ];
      });
      vm.dataLists[ index ] = vm.item;
    }

    vm.submitBtn = function () {
      userCustomer.add(vm.dataBase).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          /* var motors = _.filter(vm.dataLists, function (item) {
           return angular.isUndefined(item.guid);
           });*/
          var motors = vm.dataLists;
          _.forEach(motors, function (item) {
            item.userId = result.data;
          });
          return motors;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      }).then(function (results) {
        if (!results.length) {
          $state.go('user.customer.list', { 'page': 1 });
        }
        userCustomer.addMotors(results).then(function (results) {
          var result = results.data;
          if (result.status === 0) {
            $state.go('user.customer.list', { 'page': 1 })
          } else {
            cbAlert.error("错误提示", result.data);
          }
        });
      });
    }
  }
})();
