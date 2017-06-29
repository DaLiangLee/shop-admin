/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('TradeOrderListController', TradeOrderListController)
    .controller('TradeOrderAddController', TradeOrderAddController)
    .controller('TradeOrderChangeController', TradeOrderChangeController);

  /** @ngInject */
  function TradeOrderListController($scope, $state, $document, cbAlert, tadeOrder, tadeOrderConfig, utils, computeService, configuration, webSiteApi, tadeOrderItems) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 15});
    var total = 0;
    /**
     * 组件数据交互
     *
     */
    var propsParams = {
      currentStatus: currentParams.status,
      statistics: {},
      closed: function (item) {   // 关闭
        cbAlert.ajax('确定关闭订单？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "4",
              guid: item.guid
            }).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('操作成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "订单关闭后将无法恢复。", 'confirm');
      },
      received: function (data) {  // 收款
        if (data.status == 0) {
          tadeOrder.update(data.data).then(function (results) {
            if (results.data.status === 0) {
              cbAlert.tips('订单收款成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        }
      },
      printOrder: function(item) {
        var WEB_SITE_API = webSiteApi.WEB_SITE_API;
        var baseUrl = configuration.getAPIConfig();
        var path = WEB_SITE_API["trade"]["order"]["printOrder"];
        return baseUrl + path.url + '?id=' + item.guid;
      },
      completed: function (item) { // 完工
        cbAlert.ajax('确定完工？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "2",
              guid: item.guid
            }).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips('操作成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "确定完工后将等待客户提车。", 'confirm');
      },
      checkout: function (item) {  // 离店
        cbAlert.ajax('确认该车已离店？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "3",
              guid: item.guid
            }).then(utils.requestHandler)
              .then(function () {
                cbAlert.tips('确认离店成功');
                getList(currentParams);
              });
          } else {
            cbAlert.close();
          }
        }, "确认该车离店，该订单将完成，是否确定离店？", 'warning');
      },
      nextshow: function (item, $event) {
        close();
        item.$show = !item.$show;
        // // item.$active =item.$show;
        item.$on = item.$show;
        $event.stopPropagation();

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
    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: _.clone(tadeOrderConfig().DEFAULT_GRID.columns),
      requestParams: {
        params: currentParams,
        request: "trade,order,excelorders",
        permission: "chebian:store:trade:porder:export"
      },
      itemList: [],
      config: _.merge(tadeOrderConfig().DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
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
        var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
        getList(order);
      },
      selectHandler: function (item) {
        // 拦截用户恶意点击
        !item['$$active'] && item.guid && getOrdersDetails(item.guid);
      }
    };

    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      // 拷贝默认值，不然会被直接引用
      'config': _.clone(tadeOrderConfig().DEFAULT_SEARCH).config(currentParams),
      'handler': function (data) {
        var items = _.find(tadeOrderConfig().DEFAULT_SEARCH.createtime, function (item) {
          return item.id === data['createtime0'] * 1;
        });
        if (angular.isDefined(items)) {
          data.createtime1 = undefined;
        }
        var search = angular.extend({}, currentParams, data);
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, search)) {
          $state.reload();
        } else {
          $state.go(currentStateName, search);
        }
      }
    };

    // 获取订单列表
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return;
      }
      tadeOrder.list(params).then(utils.requestHandler).then(function (results) {
        // 防止用户手动输入没有数据
        if (!results.data.length && params.page !== "1") {
          $state.go(currentStateName, {page: "1"});
        }
        total = results.totalCount;
        // 如果没有数据就阻止执行，提高性能，防止下面报错
        if (total === 0) {
          vm.gridModel.loadingState = false;
          vm.gridModel.itemList = [];
          vm.ordersDetails = undefined;
          return false;
        }
        /**
         * 设置统计数据
         */
        setStatistics(_.pick(results, ['psalepriceAll', 'productcount', 'servercount', 'ssalepriceAll', 'preferentialprice']));
        /**
         * 组装数据
         * @type {*}
         */
        vm.gridModel.itemList = _.map(results.data, function (item) {
          item.totalprice = computeService.pullMoney(computeService.add(item.ssaleprice, item.psaleprice));
          item.totalprice = computeService.pullMoney(computeService.add(item.ssaleprice, item.psaleprice));
          item.ssaleprice = computeService.pullMoney(item.ssaleprice);
          item.psaleprice = computeService.pullMoney(item.psaleprice);
          item.preferentialprice = computeService.pullMoney(item.preferentialprice);
          item.actualprice = computeService.pullMoney(item.actualprice);
          item.arrearsprice = computeService.pullMoney(item.arrearsprice);
          /**
           * 存的是字符串json，取时候需要转换一下
           */
          item.userinfo = angular.fromJson(item.userinfo);
          item.carinfo = angular.fromJson(item.carinfo);
          if (item.carinfo) {
            item.carinfo.problem = item.problem;
            item.carinfo.logo = utils.getImageSrc(item.carinfo.logo, "logo");
          }
          if (item.userinfo) {
            item.userinfo.avatar = utils.getImageSrc(item.userinfo.avatar, "user");
          } else {
            item.user_avatar = utils.getImageSrc(undefined, "user");
          }
          return item;
        });
        vm.gridModel.itemList[0] && getOrdersDetails(vm.gridModel.itemList[0].guid);
        vm.gridModel.paginationinfo = {
          page: params.page * 1,
          pageSize: params.pageSize,
          total: total
        };
        vm.gridModel.loadingState = false;
      });
    }

    getList(currentParams);
    /**
     * 设置数据汇总
     * @param data
     */
    function setStatistics(data) {
      data.totalprice = computeService.pullMoney(computeService.subtract(computeService.add(data.psalepriceAll, data.ssalepriceAll), data.preferentialprice), 100);
      data.psalepriceAll = computeService.pullMoney(data.psalepriceAll);
      data.ssalepriceAll = computeService.pullMoney(data.ssalepriceAll);
      data.preferentialprice = computeService.pullMoney(data.preferentialprice);
      vm.gridModel.config.propsParams.statistics = data;
    }

    /**
     * 获取id获取订单详情
     * @param id
     */
    function getOrdersDetails(id) {
      tadeOrder.getOrdersDetails({id: id}).then(function (results) {
        var result = results.data;
        if (result.status === 0) {
          var temp = result.data;
          temp.userinfo = angular.fromJson(temp.userinfo);
          temp.carinfo = angular.fromJson(temp.carinfo);
          temp.ssaleprice = computeService.pullMoney(temp.ssaleprice);
          temp.psaleprice = computeService.pullMoney(temp.psaleprice);
          if(_.isString(temp.ordersjson)){
            temp.ordersjson = angular.fromJson(temp.ordersjson);
          }else{
            temp.ordersjson = {};
            temp.ordersjson.details = _.cloneDeep(temp.details);
          }
          tadeOrderItems.setDetails(temp.ordersjson.details, true);
          temp.totalprice = computeService.add(temp.ssaleprice, temp.psaleprice);
          vm.ordersDetailsTab = 0;
          vm.ordersDetails = temp;
          temp = null;
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }
  }

  /** @ngInject */
  function TradeOrderAddController($state, cbAlert, tadeOrder, tadeOrderAddData) {
    var vm = this;
    // 拦截跳转，防止用户在编辑过程中，误点击其他地方
    $state.current.interceptor = true;
    $state.current.interceptorMsg = '开单未保存，确定离开？';
    vm.initials = _.map(_.times(26, {}), function (item) {
      return {text: String.fromCharCode(97 + item).toUpperCase()};
    });

    vm.area = _.map('京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新'.split(""), function (item) {
      return {area: item};
    });

    var area = '鄂', text = 'A';

    tadeOrder.carnocode().then(function (results) {
      var result = results.data;
      if (result.status === 0) {
        if(result.data.length === 2){
          area = result.data[0];
          text = result.data[1];
        }
        setDate();
      } else {
        cbAlert.error("错误提示", result.data);
      }
    });



    function setDate(){
      _.map(vm.area, function (item) {
        item.active = item.area === area;
      });
      _.map(vm.initials, function (item) {
        item.active = item.text === text;
      });
      vm.license.first = area+text;
    }

    vm.select = function ($event, item) {
      if (item.text) {
        _.forEach(vm.initials, function (key) {
          key.active = key.text === item.text;
        });
        text = item.text
      }
      if (item.area) {
        _.forEach(vm.area, function (key) {
          key.active = key.area === item.area
        });
        area = item.area;
      }
      vm.license.first = area + text;
      reset();
    };

    /**
     * 重置所以数据
     */
    function reset() {
      vm.license.last = undefined;
      vm.license.results = [];
      vm.license.customer = undefined;
      vm.isDisabled = true;
      tadeOrderAddData.updata(undefined);
    }


    vm.license = {
      search: function () {
        var _this = vm.license;
        if (_this.last.length > 0 && _this.last.length < 6) {
          tadeOrderAddData.query(_this.merge()).then(function (results) {
            if (_this.last.length === 5) {
              _this.options({}, {'text': _this.merge()});
            }
            _this.results = _.map(results, function (item) {
              return {text: item};
            });
          });
        }
      },
      merge: function () {
        var _this = vm.license;
        return _this.first + " " + _this.last.toUpperCase();
      },
      set: function () {

      },
      options: function ($event, item) {
        var _this = vm.license;
        tadeOrderAddData.get(item.text).then(function (results) {
          _this.customer = results;
        });
        vm.license.results = [];
        vm.isDisabled = false;
      },
      radio: 0
    };

    reset();

    /*说明：userType：n(找不到)，u(会员)，c(客户)。
     当 userType=n时customer没有数据
     当userType=u时customers为*/

    vm.gotoPage = function () {
      $state.current.interceptor = false;
      var customer = _.cloneDeep(vm.license.customer);
      if(vm.license.customer.customers.length){
        customer.customers = [vm.license.customer.customers[vm.license.radio]];
      }
      tadeOrderAddData.updata(customer);
      goto(customer);
    };
    /**
     * 提交成功到跳转到订单页面
     */
    function goto(customer) {
      var motorid;
      if(customer.customers[0] && customer.customers[0].motor){
        motorid = customer.customers[0].motor.guid;
      }
      $state.go('trade.order.added', {
        motorid: motorid,
        mobile: customer.mobile,
        license: customer.licence
      });
    }
  }
  /** @ngInject */
  function TradeOrderChangeController($filter, $state, computeService, tadeOrder, cbAlert, memberEmployee, tadeOrderAddData, userCustomer, marktingPackage, utils, tadeOrderItems, productGoods, productServer, configuration) {
    var vm = this;
    // 拦截跳转，防止用户在编辑过程中，误点击其他地方
    $state.current.interceptor = true;
    $state.current.interceptorMsg = '开单未保存，确定离开？';


    var currentParams = $state.params;
    //  是否是编辑
    vm.isChange = !_.isEmpty(currentParams.orderid);

    // 保存订单类型
    var orderstype;
    /**
     * 获取施工人员
     */
    memberEmployee.list({
      page: 1,
      pageSize: 100000,
      inService: 1,
      excludeOwner: 1 // 是否显示店主, 可以为任意值
    }).then(utils.requestHandler)
      .then(function (results) {
        vm.servicerModel.store = results.data;
      });



    if (vm.isChange) {
      if (!/^\d{18}$/.test(currentParams.orderid)) {
        cbAlert.determine("错误提示", '您传递的订单编辑id不对，请输入正确的id', function () {
          $state.current.interceptor = false;
          cbAlert.close();
          goto();
        }, 'error');
        return;
      }
      tadeOrder.getOrdersDetails({id: currentParams.orderid})
        .then(utils.requestHandler)
        .then(function (results) {
          vm.isLoadData = true;
          setData(results.data);
          if(vm.dataBase.$isuser){
            marktingPackage.getuserpackagebyuserid({userid: vm.dataBase.userid})
              .then(utils.requestHandler)
              .then(function (results) {
                vm.package = results.data;
              });
          }
        });
    } else {
      vm.dataBase = {};
      // 申明一个服务存储数组
      vm.dataBase.details = [];
      tadeOrderAddData.get($state.params.license, $state.params.motorid).then(function (results) {
        vm.customer = results;
        vm.dataBase.carno = results.licence;
        vm.dataBase.orderstype = results.userType === 'u' ? "0" : "1";
        orderstype = vm.dataBase.orderstype;
        if (results.userType === 'c') {
          vm.dataBase.customerid = results.customers[0].guid;
          vm.dataBase.usermobile = results.customers[0].mobile;
          vm.dataBase.$isuser = false;
        }
        if (results.userType === 'u') {
          vm.dataBase.userinfo = results.customers[0].user;
          vm.dataBase.carinfo = results.customers[0].motor;
          vm.dataBase.userid = results.customers[0].user['guid'];
          vm.dataBase.usermobile = results.customers[0].user['mobile'];
          vm.dataBase.username = results.customers[0].user['realname'];
          results.customers[0].motor.baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + vm.dataBase.carinfo.guid;
          vm.dataBase.carmodel = results.customers[0].motor.model;
          marktingPackage.getuserpackagebyuserid({userid: vm.dataBase.userid})
            .then(utils.requestHandler)
            .then(function (results) {
              vm.package = results.data;
            });
          vm.dataBase.$isuser = true;
        }
      });
      vm.isLoadData = true;
    }

    function setData(result){
      vm.dataBase = _.assign({}, result);
      // 获取当前订单类型，判断是套餐单还是普通单
      vm.dataBase.$isPackage = vm.dataBase.orderstype === '2';
      if(_.isString(result.ordersjson)){
        result.details = angular.fromJson(result.ordersjson).details;
      }
      tadeOrderItems.setDetails(result.details, false);
      vm.dataBase.carinfo = angular.fromJson(result.carinfo);
      vm.dataBase.userinfo = angular.fromJson(result.userinfo);
      orderstype = result.orderstype;
      if(vm.dataBase.carinfo && vm.dataBase.carinfo.guid){
        vm.dataBase.carinfo.baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + vm.dataBase.carinfo.guid;
        vm.customer = {
          customers: [{motor:vm.dataBase.carinfo, user: vm.dataBase.userinfo}],
          userType: 'u',
          licence: vm.dataBase.carno,
          mobile: vm.dataBase.userinfo.mobile,
          realname: vm.dataBase.userinfo.realname,
          user_avatar: vm.dataBase.userinfo.avatar,
          motor_logo: vm.dataBase.carinfo.logo
        };
        vm.dataBase.$isuser = true;
      }else{
        vm.customer = {
          userType: 'u',
          licence: vm.dataBase.carno,
          mobile: vm.dataBase.usermobile,
          realname: _.isUndefined(vm.dataBase.username) ? '临客' : vm.dataBase.username,
          user_avatar: ""
        };
        vm.dataBase.$isuser = false;
      }
      if (vm.dataBase.$isPackage) {
        vm.currentPackage = angular.fromJson(result.extra);
        vm.isSelectedPackage = true;
        vm.isPackage = true;
        vm.isService = false;
      } else {
        vm.isService = true;
      }
      vm.dataBase.details = [];
      _.chain(result.details)
        .cloneDeep()
        .tap(function (value) {
          var items = [];
          _.forEach(value, function (item) {
            if (item.itemtype === '0') {
              item.defaultsku = false;
              items.push(item);
            }
            if (item.itemtype === '1') {
              _.forEach(item.products, function (subitem) {
                subitem.itemtype = '1';
                subitem.defaultsku = false;
                subitem.remark = item.remark;
                subitem.servicer = item.servicer;
                subitem.servicername = item.servicername;
                items.push(subitem);
              });
            }
          });
          _.forEach(items, function (item) {
            if (item.itemtype === '0') {
              addDetails([item]);
            } else {
              vm.addServiceProduct({status: '0', data: [item]});
            }
          });
        }).value();
    }

    function completedMaxDate(date) {
      if (!_.isDate(date)) {
        throw Error('参数不是一个时间对象');
      }
      var DAY_TIME = 24 * 60 * 60 * 1000; // 一天的毫秒数
      return function (time) {
        return new Date(date.getTime() + DAY_TIME * time);
      }
    }

    // 预计完工时间
    vm.completedDate = {
      opened: false,
      config: {
        startingDay: 1,
        placeholder: "请选择预计完工时间",
        isHour: true,
        isMinute: true,
        formatTimeTitle: "HH:mm",
        format: "yyyy-MM-dd HH:mm",
        minDate: new Date(),
        maxDate: completedMaxDate(new Date())(30)
      },
      open: function () {

      },
      model: "",
      handler: function () {

      }
    };

    /**
     * 清除按钮
     */
    vm.clearDetails = function(){
      cbAlert.confirm(" ", function (isConfirm) {
        if (isConfirm) {
          vm.currentPackage = null;
          vm.isSelectedPackage = false;
          vm.dataBase.details = [];
          vm.isPackage = false;
          vm.isService = false;
        }
        cbAlert.close();
      }, "请注意，此操作将放弃已选择的商品或服务", "warning");
    };


    /**
     * 服务列表相关处理
     ***************************************************************************
     */

    // 添加施工人员
    vm.servicerModel = {
      handler: function (data, item) {
        item.servicername = _.find(vm.servicerModel.store, {'guid': data}).realname;
      }
    };

    /**
     * 添加套餐卡项目
     * @param data
     * @param item
     */
    vm.addPackage = function (data, item) {
      if (data.status === '-1') {
        vm.packageShow = false;
      }
      if (data.status === '0') {
        vm.dataBase.details = [];
        vm.dataBase.orderstype = '2';
        vm.dataBase.extra = angular.toJson(item);
        vm.isPackage = true;
        vm.currentPackage = item;
        vm.isSelectedPackage = true;
        _.forEach(data.data, function (item) {
          if (item.itemtype === '0') {
            addDetails([item]);
          } else {
            vm.addServiceProduct({status: '0', data: [item]});
          }
        });
      }
    };

    /**
     * 清除套餐卡项目
     */
    vm.clearedPackage = function () {
      cbAlert.confirm(" ", function (isConfirm) {
        if (isConfirm) {
          vm.currentPackage = null;
          vm.isSelectedPackage = false;
          vm.dataBase.details = [];
          vm.isPackage = false;
        }
        cbAlert.close();
      }, "请注意，此操作将放弃已选择的套餐卡商品和服务", "warning");
    };

    /**
     * 添加只卖商品服务
     */
    vm.addProduct = function (data) {
      vm.isService = true;
      vm.addServiceProduct(data);
      vm.dataBase.orderstype = orderstype;
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
    vm.addServiceProduct = function (data, item) {
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
            vm.dataBase.details.push(item);
          });
        } else {
          if (!_.isArray(item.products)) {
            item.products = [];
          }
          item.products = item.products.concat(data.data);
          item.$productprice = computeService.add(item.$productprice, data.productprice);
          item.$totalPrice = computeService.add(item.$productprice, item.$allprice);
          item.$productCount = conputeProductCount(item.products);
          item.$folded = true;
          /**
           * 如果有索引值的时候，就需要去处理
           */
          if (addProductsIndex !== -1) {
            item.itemtype = '1';
            /**
             * 把创建的对象和创建的商品服务合并
             */
            vm.dataBase.details[addProductsIndex] = _.assign({}, vm.dataBase.details[addProductsIndex], item);
            vm.details = vm.dataBase.details;
            /**
             * 操作完成以后重置
             * @type {number}
             */
            addProductsIndex = -1;
          }
        }
        computeTotalPrice();
      }
    };

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
        return computeService.add(result + parseInt(value.num, 10));
      }, 0);
    }

    /**
     * 更新商品服务数量
     * @param item
     * @param subitem
     */
    vm.updateItemPriceNum = function (item, subitem) {
      // 父级项处理
      if (_.isUndefined(subitem)) {
        if (computeAllprice(item)) {
          cbAlert.alert('商品费用超出100万上限');
          return false;
        }
        if(item.itemtype === '1'){
          item.$productprice = item.$allprice;
        }
        computeTotalPrice();
        return false;
      }
      if (computeAllprice(subitem)) {
        cbAlert.alert('商品费用超出100万上限');
        return false;
      }
      if(item.products){
        item.$productCount = conputeProductCount(item.products);
        item.$productprice = computeProductTotalPrice(item.products);
      }
      computeTotalPrice();
    };
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

    function computeAllprice(item) {
      if (isExceedlimit($filter('moneySubtotalFilter')([item.num, item.price]))) {
        return true;
      }
      item.$allprice = $filter('moneySubtotalFilter')([item.num, item.price]);
    }

    /**
     * 超过1百万上限
     * @param num
     * @returns {boolean}
     */
    function isExceedlimit(num) {
      return num > 1000000;
    }

    /**
     * 添加服务
     */
   vm.addService = function (data) {
     if (data.status === '-1') {
       vm.packageShow = false;
     }
      if (data.status === "0") {
        _.forEach(data.data, function (item) {
          item.$productCount = 0;
          item.itemtype = '0';
        });
        vm.packageShow = false;
        vm.isService = true;
        vm.dataBase.orderstype = orderstype;
        addDetails(data.data);
      }
    };

    /**
     * 计算合计，统计商品项和合计，统计服务项和合计
     */
    function computeTotalPrice() {
      vm.statistics = tadeOrderItems.computeTally(vm.dataBase.details);
    }

    /**
     * 给数组添加一个项目
     * @param array
     */
    function addDetails(array) {
      vm.dataBase.details = vm.dataBase.details.concat(array);
      computeTotalPrice();
    }

    /**
     * 给当前项设置常用并提交给后台
     * @param item
     * @param subitem
     */
    vm.setCommonlyused = function (item, subitem) {
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
    vm.updateItemRemark = function (data, item) {
      item.remark = data;
    };

    /**
     * 根据guid删除某一项
     * @param item
     * @param subitem
     */
    vm.removeItem = function (item, subitem) {
      if (_.isUndefined(subitem)) {
        _.remove(vm.dataBase.details, function (key) {
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
      if (!vm.dataBase.details.length) {
        vm.isService = false;
      }
      computeTotalPrice();
    };

    /**
     * 切换开单显示选项
     */
    vm.isToggle = false;
    vm.toggleInfo = function () {
      vm.isToggle = !vm.isToggle;
    };

    vm.balanceItem = function (data) {
      if(data.status === "0"){
        var balance = _.reduce([data.data.rechargeamount, data.data.giveamount, computeService.pullMoney(vm.customer.customers[0].user.balance)], function (prev, curr) {
          return computeService.add(prev, curr);
        }, 0);
        data.data.rechargeamount = computeService.pushMoney(data.data.rechargeamount);
        data.data.giveamount = computeService.pushMoney(data.data.giveamount);
        userCustomer.chargeBalance(data.data)
          .then(utils.requestHandler)
          .then(function () {
            cbAlert.tips('充值成功');
            vm.customer.customers[0].user.balance = computeService.pushMoney(balance);
          });
      }
    };

    /**
     * 拦截提交
     * 提交的需要参数全部符合才能为false
     */
    function interception() {
      var result = false;
      if (!vm.dataBase.details.length) {
        cbAlert.alert("请选择服务单或商品单");
        return true;
      }

      // 卖商品 如果itemid就是卖商品服务，products如果没有选或者长度是0都不能提交
      var isEmptyProduct = _.filter(vm.dataBase.details, function (item) {
        return !item.itemid && (_.isUndefined(item.products) || item.products.length === 0);
      });


      if (isEmptyProduct.length) {
        cbAlert.alert("卖商品服务至少要添加一个商品");
        return true;
      }

      if (vm.statistics.totalprice >= 10000000) {
        cbAlert.error("订单总额超出上限");
        return true;
      }
      return result;
    }

    /**
     * 检查是否可以设置优惠金额
     */
    vm.getOffers = function () {
      if (interception()) {
        return;
      }
      vm.submitDisabled = true;
    };


    /**
     * 提交数据到后台
     */
    vm.submitBtn = function (data) {
      if (data.status === '0') {
        if (!data.next) {
          vm.submitDisabled = false;
          return;
        }
        var dataBase = _.assign({}, vm.dataBase, data.data);
        console.log('submitBtn',tadeOrderItems.getDataBase(dataBase))

        tadeOrder.saveOrder(tadeOrderItems.getDataBase(dataBase))
          .then(utils.requestHandler)
          .then(function () {
            tadeOrderAddData.updata(undefined);
            $state.current.interceptor = false;
            goto();
          });
      }
    };

    /**
     * 开单并收款
     * @param data
     */
    vm.saveOrderAndPay = function (data) {
      if (!data.next) {
        vm.submitDisabled = false;
        return;
      }
      var dataBase = _.assign({}, vm.dataBase, data.data);
      console.log('saveOrderAndPay',dataBase)

      tadeOrder.saveOrderAndPay(tadeOrderItems.getDataBase(dataBase))
        .then(utils.requestHandler)
        .then(function () {
          tadeOrderAddData.updata(undefined);
          $state.current.interceptor = false;
          goto();
        });
    };

    /**
     * 提交成功到跳转到订单页面
     */
    function goto() {
      $state.go('trade.order.list', {'page': 1});
    }

  }
})();


