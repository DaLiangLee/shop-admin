/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('TradeOrderListController', TradeOrderListController)
    .controller('TradeOrderChangeController', TradeOrderChangeController);

  /** @ngInject */
  function TradeOrderListController($state, cbAlert, tadeOrder, tadeOrderConfig, computeService) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});
    var total = 0;
    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: angular.copy(tadeOrderConfig.DEFAULT_GRID.columns),
      requestParams: {
        params: currentParams,
        request: "trade,order,excelorders",
        permission: "chebian:store:trade:porder:export"
      },
      itemList: [],
      config: angular.copy(tadeOrderConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      selectHandler: function (item) {
        getOrdersDetails(item.guid);
      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      currentStatus: currentParams.status,
      statistics: {},
      closed: function (item) {   // 关闭
        console.log(item);
        cbAlert.ajax('您是否确认关闭该订单？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "4",
              guid: item.guid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('关闭订单成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "关闭该订单将无法恢复，确定关闭？", 'warning');
      },
      received: function (data) {  // 收款
        console.log(data);
        if (data.status == 0) {
          tadeOrder.update(data.data).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips('订单收款成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        }
      },
      completed: function (item) { // 完工
        cbAlert.ajax('您是否确认关闭该完工？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "2",
              guid: item.guid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('关闭订单成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "确认该车完工，将等待客户提车，是否确定完工？", 'warning');
      },
      checkout: function (item) {  // 离店
        cbAlert.ajax('确认该车已离店？', function (isConfirm) {
          if (isConfirm) {
            tadeOrder.update({
              status: "3",
              guid: item.guid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('确认离店成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "确认该车离店，该订单将完成，是否确定离店？", 'warning');
      }
    };

    var createtime = [
      {
        "label": "今日",
        id: 0,
        start: 0,
        end: 0
      },
      {
        "label": "本周",
        id: 1,
        start: 1,
        end: 1
      },
      {
        "label": "本月",
        id: 2,
        start: 2,
        end: 2
      },
      {
        "label": "本年度",
        id: 3,
        start: 3,
        end: 3
      }
    ];

    /**
     * 根据start和end获取列表的model
     * @param list        列表
     * @param start       起始
     * @param end         结束
     * @returns {number}  如果找不到返回-1,找到返回正确的索引
     */
    function getListIndex(list, start, end) {
      if (angular.isUndefined(start) && angular.isUndefined(end)) {
        return -1;
      }
      var items;
      end = end || start;
      items = _.filter(list, function (item) {
        return item.start == start && item.end == end;
      });
      return items.length === 1 ? items[0].id : -2;
    }

    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      'config': {
        keyword: {
          placeholder: "请输入订单编号、会员信息、车辆信息等",
          model: currentParams.keyword,
          name: "keyword",
          isShow: true
        },
        searchDirective: [
          {
            label: "订单状态",
            all: true,
            type: "list",
            name: "status",
            model: currentParams.status,
            list: [
              {
                id: 1,
                label: "服务中"
              },
              {
                id: 2,
                label: "完工待离店"
              },
              {
                id: 3,
                label: "完成"
              },
              {
                id: 4,
                label: "已取消"
              }
            ]
          },
          {
            label: "付款状态",
            all: true,
            type: "list",
            name: "paystatus",
            model: currentParams.paystatus,
            list: [
              {
                id: 0,
                label: "已收款"
              },
              {
                id: 1,
                label: "待收款"
              }
            ]
          },
          {
            label: "时间",
            all: true,
            custom: true,
            region: true,
            type: "date",
            name: "createtime",
            model: getListIndex(createtime, currentParams.createtime0, currentParams.createtime1),
            list: createtime,
            start: {
              name: "createtime0",
              model: currentParams.createtime0,
              config: {
                minDate: new Date("2017/01/01 00:00:00")
              }
            },
            end: {
              name: "createtime1",
              model: currentParams.createtime1,
              config: {
                minDate: new Date("2017/01/05 00:00:00")
              }
            }
          }
        ]
      },
      'handler': function (data) {
        if (_.isEmpty(data)) {
          _.map(currentParams, function (item, key) {
            if (key !== 'page') {
              currentParams[key] = undefined;
            }
          });
          console.log(currentParams);
          $state.go(currentStateName, currentParams);
        } else {
          var items = _.find(createtime, function (item) {
            return item.id == data.createtime0;
          });
          if (angular.isDefined(items)) {
            data.createtime1 = undefined;
          }
          var search = angular.extend({}, currentParams, data);
          console.log(search);
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
      tadeOrder.list(params).then(function (data) {
        if (data.data.status == 0) {
          if (!data.data.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.data.totalCount;
          // 如果没有数据就阻止执行，提高性能，防止下面报错
          if (total === 0) {
            vm.gridModel.loadingState = false;
            vm.gridModel.itemList = [];
            vm.ordersDetails = undefined;
            return;
          }

          vm.gridModel.itemList = data.data.data;
          setStatistics(_.pick(data.data, ['psalepriceAll', 'productcount', 'servercount', 'ssalepriceAll']));
          _.map(vm.gridModel.itemList, function (item) {
            item.totalprice = computeService.divide(computeService.add(item.ssaleprice || 0, item.psaleprice || 0), 100);
            item.ssaleprice = computeService.divide(item.ssaleprice || 0, 100);
            item.psaleprice = computeService.divide(item.psaleprice || 0, 100);
            item.preferentialprice = computeService.divide(item.preferentialprice || 0, 100);
            item.actualprice = computeService.divide(item.actualprice || 0, 100);
            item.arrearsprice = computeService.divide(item.arrearsprice || 0, 100);
          });
          vm.gridModel.itemList[0] && getOrdersDetails(vm.gridModel.itemList[0].guid);
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: data.data.totalCount
          };
          vm.gridModel.loadingState = false;
        }
      });
    }

    getList(currentParams);
    /**
     * 设置数据汇总
     * @param data
     */
    function setStatistics(data) {
      data.totalprice = computeService.divide(computeService.add(data.psalepriceAll, data.ssalepriceAll), 100);
      data.psalepriceAll = computeService.divide(data.psalepriceAll, 100);
      data.ssalepriceAll = computeService.divide(data.ssalepriceAll, 100);
      vm.gridModel.config.propsParams.statistics = data;
    }

    /**
     * 获取id获取订单详情
     * @param id
     */
    function getOrdersDetails(id) {
      tadeOrder.getOrdersDetails({id: id}).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          var temp = result.data;
          temp.userinfo = JSON.parse(temp.userinfo);
          temp.carinfo = JSON.parse(temp.carinfo);
          temp.ssaleprice = computeService.divide(temp.ssaleprice || 0, 100);
          temp.psaleprice = computeService.divide(temp.psaleprice || 0, 100);
          temp.payprice = computeService.divide(temp.payprice || 0, 100);
          _.forEach(temp.details, function(item1){
            item1.itemsku = JSON.parse(item1.itemsku);
            var serverSkus = item1.itemsku.serverSkus[0];
            if(angular.isDefined(serverSkus.manualskuvalues)){
              item1.$$itemname = item1.itemsku.servername + " 服务属性 " + serverSkus.manualskuvalues;
            }
            if(angular.isDefined(serverSkus.skuvalues)){
              serverSkus.skuvalues = JSON.parse(serverSkus.skuvalues);
              item1.$$itemname = item1.servername + " 服务属性 " + serverSkus.skuvalues.skuname + serverSkus.skuvalues.items[0].skuvalue;
            }
            console.log(item1.itemsku, serverSkus);
            item1.price = computeService.divide(item1.price || 0, 100);
            item1.allprice = computeService.divide(item1.allprice || 0, 100);
            var productsPrice = 0;
            item1.products && _.forEach(item1.products, function(item2){
              item2.itemsku = JSON.parse(item2.itemsku);
              item2.price = computeService.divide(item2.price || 0, 100);
              item2.allprice = computeService.divide(item2.allprice || 0, 100);
              productsPrice = computeService.add(productsPrice || 0, item2.allprice || 0);
            });
            item1.$$totalPrice = computeService.add(item1.allprice || 0, productsPrice || 0);
          });
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
  function TradeOrderChangeController($state, memberEmployee, computeService, tadeOrder, userCustomer, cbAlert, configuration) {
    var vm = this;
    /**
     * 服务项目列表id 供删除操作使用
     * @type {number}
     */
    var detailsid = 0;

    vm.isLoadData = true;
    vm.dataBase = {};

    function completedMaxDate(date) {
      // 一天的毫秒数
      var DAY_TIME = 24 * 60 * 60 * 1000;
      return new Date(date.getTime() + DAY_TIME * 30)
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
        maxDate: completedMaxDate(new Date())
      },
      open: function () {

      },
      model: "",
      handler: function (data) {
        console.log('completedDate', data);
      }
    };

    /**
     * 服务和商品配置
     */
    vm.gridModel = {
      columns: [
        {
          "id": 0,
          "name": "序号",
          "none": true
        },
        {
          "id": 1,
          "name": "服务/项目",
          "cssProperty": "state-column",
          "fieldDirective": '<div ng-if="!item.itemname" style="position: relative; width:200px;"><p class="text-border"></p><button style="position: absolute; right:0; top: 0;" order-service-dialog handler="propsParams.serviceHandler(data, item)" class="btn btn-primary">添加</button></div><div ng-if="item.itemname"><span bo-text="item.itemname"></span></div>'
        },
        {
          "id": 2,
          "name": "商品/材料",
          "cssProperty": "state-column",
          "fieldDirective": '<div ng-if="!item.products.length" style="position: relative; width:200px;"><p class="text-border"></p><button style="position: absolute; right:0; top: 0;" order-product-dialog handler="propsParams.productHandler(data, item)" class="btn btn-primary">添加</button></div><div ng-if="item.products.length"><ul class="list-unstyled"><li ng-repeat="key in item.products"><span>{{key.pcatename1}}</span> <span>{{key.productname}}</span> <span>{{key.cnname}}</span></li></ul></div>'
        },
        {
          "id": 3,
          "name": "工时费",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" ng-if="item.$$allprice != undefined">￥<span ng-bind="item.price"></span> X <span ng-bind="item.num"></span> = <span ng-bind="item.$$allprice"></span></span>'
        },
        {
          "id": 4,
          "name": "商品/材料费",
          "cssProperty": "state-column",
          "fieldDirective": '<ul ng-if="item.products.length"><li ng-repeat="key in item.products"><span class="state-unread">￥<span ng-bind="key.price"></span> X <span ng-bind="key.num"></span> = <span ng-bind="key.$$allprice"></span></span></li></ul>'
        },
        {
          "id": 5,
          "name": "合计",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" ng-bind="item.$$totalprice"></span>'
        },
        {
          "id": 6,
          "name": "施工人员",
          "cssProperty": "state-column",
          "fieldDirective": '<div simple-select="guid,realname" store="propsParams.employee.store" select="item.servicer" select-handler="propsParams.employee.handler(data, item)"></div>'
        },
        {
          "id": 7,
          "cssProperty": "state-column",
          "fieldDirective": '<input type="text" class="form-control" name="remark" ng-model="item.remark" placeholder="请输入备注" cb-placeholder>',
          "name": '备注',
          "width": 200
        }
      ],
      loadingState: false,
      config: {
        'settingColumnsSupport': false,   // 设置表格列表项
        'checkboxSupport': true,  // 是否有复选框
        'selectedProperty': "selected",  // 数据列表项复选框
        'selectedScopeProperty': "selectedItems",
        'useBindOnce': true,  // 是否单向绑定
        'addColumnsBarDirective': [
          '<button class="btn btn-danger" simple-grid-remove-item="$$detailsid" item="store" remove-item="propsParams.removeItem(data)">批量删除</button> '
        ]
      }
    };





    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      employee: {
        handler: function(data, item){
          item.servicername = _.find(this.store, {"guid": data}).realname;
        }
      },
      removeItem: function (data) {     // 批量删除
        console.log(data);
        if (data.status == 0) {
          _.remove(vm.dataBase.details, function (item) {
            return _.findIndex(data.transmit, function (key) {
                return key == item.$$detailsid;
              }) > -1;
          });
          setStatistics();
        }
      },
      serviceHandler: function (data, item) {
        console.log(data, item);

        if (data.status == 0) {
          if (angular.isUndefined(item.products)) {
            item = angular.extend({products: []}, item, data.data);
          } else {
            item = angular.extend({}, item, data.data);
          }
          item.$$totalprice = computeService.add(data.productprice || 0, item.$$allprice || 0);
          var index = _.findIndex(vm.dataBase.details, {$$detailsid: item.$$detailsid});
          vm.dataBase.details[index] = item;
          console.log(item);
          setStatistics();
          setServiceinfo();
        }
      },
      productHandler: function (data, item) {
        if (data.status == 0) {
          item.products = data.data;
          item.$$productprice = data.productprice;
          item.$$totalprice = computeService.add(data.productprice, item.$$allprice || 0);
          console.log(data);
          setStatistics();
          setProductinfo();
        }
      }
    };

    memberEmployee.list().then(function(results){
      if(results.data.status == 0){
        vm.gridModel.config.propsParams.employee.store = results.data.data;
      }else{
        cbAlert.error("错误提示", results.data.data);
      }
    });

    vm.userHandler = function (data) {
      console.log(data);
      if (data.status == 0) {
        vm.dataBase.userinfo = data.data;
        vm.dataBase.userid = data.data.guid;
        vm.dataBase.usermobile = data.data.mobile;
        vm.dataBase.username = data.data.realname;
        getUserMotors(data.data.mobile);
      }
    };

    vm.selectModel = {
      handler: function (data) {
        setUserMotors(_.find(this.store, {"guid": data}) || {});
      }
    };

    /**
     * 设置提交数据和组装显示车辆数据
     * @param data
     */
    function setUserMotors(data) {
      data.$$baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + data.guid;
      vm.dataBase.carinfo = data;
      vm.dataBase.carno = data.licence;
      vm.dataBase.carmodel = data.model;
    }

    /**
     * 根据会员手机获取该会员的车辆列表
     * @param mobile
     */
    function getUserMotors(mobile) {
      userCustomer.getMotors({mobile: mobile}).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          vm.selectModel.store = result.data;
          setUserMotors(vm.selectModel.store[0] || {});
        } else {
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    // 数据汇总
    vm.statistics = {
      serviceCount: 0,
      ssalepriceAll: 0,
      productCount: 0,
      psalepriceAll: 0,
      totalprice: 0
    };

    /**
     * 设置数据汇总
     * @param data
     */
    function setStatistics() {
      var result = {
        serviceCount: 0,
        ssalepriceAll: 0,
        productCount: 0,
        psalepriceAll: 0,
        totalprice: 0
      };
      _.forEach(vm.dataBase.details, function (item) {
        if (angular.isDefined(item.itemname)) {
          result.serviceCount++;
        }
        if (angular.isDefined(item.products)) {
          result.productCount += item.products.length;
        }
        result.ssalepriceAll = computeService.add(result.ssalepriceAll, item.$$allprice || 0);
        result.psalepriceAll = computeService.add(result.psalepriceAll, item.$$productprice || 0);
      });
      console.log(result.psalepriceAll);

      result.totalprice = computeService.add(result.psalepriceAll || 0, result.ssalepriceAll || 0);
      vm.statistics = result;
    }

    /**
     *
     */
    function setServiceinfo() {
      var results = [];
      _.forEach(vm.dataBase.details, function (item) {
        results.push(item.itemname);
      });
      vm.dataBase.serviceinfo = results.join('、');
      vm.dataBase.details.length > 1 && (vm.dataBase.serviceinfo = '（多项）' + vm.dataBase.serviceinfo);
    }

    function setProductinfo() {
      var results = [];
      var products = [];
      _.forEach(vm.dataBase.details, function (item) {
        products = products.concat(item.products);
      });
      console.log(products);
      _.forEach(products, function (item) {
        results.push(item.itemname);
      });
      vm.dataBase.productinfo = results.join('、');
      products.length > 1 && (vm.dataBase.productinfo = '（多项）' + vm.dataBase.productinfo);
    }

    vm.dataBase.details = [];
    /**
     * 添加一项服务和商品配置
     */
    vm.addProducts = function () {
      vm.dataBase.details.push({
        $$detailsid: detailsid++,
        remark: ""
      });
      console.log(vm.dataBase.details);
    };
    /**
     * 一上来需要添加一个；
     */
    vm.addProducts();


    function getDataBase(data) {
      var result = angular.extend({}, data);
      result.carinfo = _.omit(result.carinfo, ["$$hashKey", "$$baoyang"]);
      result.carinfo.licence = _.isUndefined(result.carinfo.licence) ? "" : result.carinfo.licence;
      result.carinfo = JSON.stringify(result.carinfo);
      result.userinfo = JSON.stringify(result.userinfo);
      result.waitinstore = result.waitinstore ? 1 : 0;
      _.remove(result.details, function(item){
        return _.isUndefined(item.itemid) || _.isUndefined(item.itemskuid);
      });
      result.coveross = vm.dataBase.details[0].mainphoto;
      return result;
    }


    /**
     * 拦截提交
     * 提交的需要参数全部符合才能为false
     */
    function interception() {
      var result = false;
      if (!vm.dataBase.carinfo) {
        cbAlert.alert("至少需要选一个服务用户");
        return true;
      }
      if (!vm.dataBase.userinfo) {
        cbAlert.alert("至少需要选一个服务车辆信息");
        return true;
      }
      if (!vm.dataBase.details.length) {
        cbAlert.alert("至少需要添加一个服务/项目");
        return true;
      }
      var isNotDetails = _.filter(vm.dataBase.details, function (item) {
        return _.isUndefined(item.itemid) || _.isUndefined(item.itemskuid);
      });
      if (isNotDetails.length) {
        cbAlert.alert("至少需要选一个服务/项目");
        return true;
      }
      return result;
    }

    /**
     * 检查是否可以设置优惠金额
     */
    vm.getOffers = function () {
      if(interception()){
        return ;
      }
      vm.submitDisabled = true;
    };


    /**
     * 提交数据到后台
     */
    vm.submitBtn = function (data) {
      console.log('submitBtn', data);
      if(data.status == 0){

        if(!data.next){
          vm.submitDisabled = false;
          return ;
        }
        vm.dataBase.preferentialprice = data.price*100;

        tadeOrder.saveOrder(getDataBase(vm.dataBase)).then(function (results) {
          var result = results.data;
          if (result.status == 0) {
            goto();
          } else {
            cbAlert.error("错误提示", result.data);
          }
        });
      }
    };

    /**
     * 提交成功到跳转到订单页面
     */
    function goto() {
      $state.go('trade.order.list', {'page': 1});
    }

  }
})();
