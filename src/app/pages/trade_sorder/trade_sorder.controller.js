/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('TradeSorderListController', TradeSorderListController)
    .controller('TradeSorderChangeController', TradeSorderChangeController)
    .controller('TradePorderDetailController', TradePorderDetailController);

  /** @ngInject */
  function TradeSorderListController($state, $log, $window, tradeSorder, tradeSorderConfig, cbAlert) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = $state.params;
    var total = 0;
    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: angular.copy(tradeSorderConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(tradeSorderConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      complete: function (data) {   // 服务完成
        cbAlert.ajax('您是否确认服务完成？', function (isConfirm) {
          if (isConfirm) {
            console.log('您是否确认客户提车？', data);
            tradeSorder.finish({
              orderid: data.orderid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('确认服务完成成功');
                getList();
              }else{
                cbAlert.error(results.data.rtnInfo);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "如果确认服务完成该订单已完成", 'warning');
      },
      confirmTakecar: function (data) { // 确认接车
        if (data.status == "0") {
          tradeSorder.confirmMotor({
            orderid: data.data.orderid,
            motorid: data.data.motorid,
            totalmile: data.data.totalmile
          }).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips('确认接车成功', 2000);
              getList();
            }else{
              cbAlert.error(results.data.rtnInfo);
            }
          });
        }
      },
      takecar: function (data) {   // 客户提车
        if(data.paystatus == 0){
          cbAlert.alert('客户尚未付款');
          return ;
        }
        cbAlert.ajax('您是否确认客户提车？', function (isConfirm) {
          if (isConfirm) {
            console.log('您是否确认客户提车？', data);
            tradeSorder.pickupMotor({
              orderid: data.orderid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('确认客户提车成功');
                getList();
              }else{
                cbAlert.error(results.data.rtnInfo);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "如果确认客户提车该订单已完成", 'warning');
      },
      refund: function (data) {   // 订单退款
        cbAlert.ajax('您是否确认订单退款？', function (isConfirm) {
          if (isConfirm) {
            console.log('您是否确认订单退款？', data);
            tradeSorder.refund({
              orderid: data.orderid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('订单退款成功');
                getList();
              }else{
                cbAlert.error(results.data.rtnInfo);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "如果确认订单退款，钱将打给用户", 'warning');
      },
      reminder: function (item) {   // 提醒客户
        console.log('提醒客户', item);
        item.disabled = true;
        tradeSorder.remind({
          storeid: item.storeid,
          orderid: item.orderid,
          realname: item.realname,
          mobile: item.mobile
        }).then(function (results) {
          if (results.data.status == '0') {
            cbAlert.tips('提醒客户成功', 2000);
          } else {
            cbAlert.error(results.data.rtnInfo);
          }
          item.disabled = false;
        });
      },
      cancelorder: function (data) {   // 取消订单
        cbAlert.ajax('您是否确认取消订单？', function (isConfirm) {
          if (isConfirm) {
            console.log('取消订单？', data);
            tradeSorder.cancel({
              orderid: data.orderid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('确认取消订单成功');
                getList();
              }
            });
          } else {
            cbAlert.close();
          }
        }, "如果确认取消订单该订单将终止", 'warning');
      }
    };


    var config = angular.copy(tradeSorderConfig.DEFAULT_SEARCH.config);
    config.searchParams = $state.params;
    /**
     * 搜索操作
     *
     */
    vm.gridSearch = {
      'config': config,
      'handler': function (data) {
        $log.debug(data)
      }
    };

    // 获取权限列表
    function getList() {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!currentParams.page) {
        return;
      }
      tradeSorder.list(currentParams).then(function (data) {
        if (data.data.status == 0) {
          if (!data.data.data.length && currentParams.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.data.count;
          vm.gridModel.itemList = [];
          angular.forEach(data.data.data, function (item) {
            /**
             * 这段代码处理skuvalues值的问题，请勿修改 start
             */
            item.skuvalues = $window.eval(item.skuvalues);
            /**
             * 这段代码处理skuvalues值的问题，请勿修改 end
             */
            vm.gridModel.itemList.push(item);
          });
          vm.gridModel.paginationinfo = {
            page: currentParams.page * 1,
            pageSize: 10,
            total: total
          };
          vm.gridModel.loadingState = false;
        }
      }, function (data) {
        $log.debug('getListError', data);
      });
    }
    getList();
  }

  /** @ngInject */
  function TradeSorderChangeController($state, preferencenav, tradeSorder, tradeSorderChangeConfig,configuration, cbAlert) {
    var vm = this;
    vm.dataBase = {
      storeid: configuration.getConfig().storeid,
      ordertype: "0",
      totalcost: 0,
      totalsale: 0,
      motormodel: "请先选择车辆",
      realname: "请先选择客户",
      mobile: "请先选择客户"
    };
    /*vm.dataBase = {
     userid: "",  // 用户id
     motorid: "",  //
     ordertype: "" //
     vin: ""   // vin码
     enginenumber: ""  //发动机编号
     totalmile: ""    // 总里程数
     totalsale: ""    // 工时总计（￥）
     totalcost: ""   // 商品总计（￥）
     meettime: ""
     details: []
     }*/

    /**
     * 选择用户
     * @param data
     */
    vm.selectUserHandler = function (data) {
      if (data.status == '0') {
        vm.dataBase.userid = data.data.userid;
        vm.dataBase.realname = data.data.realname;
        vm.dataBase.mobile = data.data.username;
        vm.$$userclass = data.data.userclass;
        vm.gridModel.config.propsParams.userid = data.data.userid;
      }
    };

    /**
     * 选择车辆信息
     * @param data
     */
    vm.selectMotorHandler = function (data) {
      console.log('selectMotorHandler', data);
      if (data.status == '1') {
        cbAlert.alert(data.data);
      }
      if (data.status == '0') {
        vm.dataBase.enginenumber = data.data.enginenumber;
        vm.dataBase.motorid = data.data.motorid;
        vm.dataBase.motormodel = data.data.model;
        vm.dataBase.licence = data.data.licence;
        vm.dataBase.vin = data.data.vin;
        vm.dataBase.totalmile = data.data.totalmile;
        vm.isMotormodel = true;
      }
    };

    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: angular.copy(tradeSorderChangeConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(tradeSorderChangeConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页

      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      userid: "",       // 防止没有会员用户新增了子订单
      addItems: function (data) {   // 新增项目
        if (data.status == '1') {
          cbAlert.alert(data.data);
        }
        console.log('addItems', data);
        if (data.status == "0") {
          console.log();
          var items = _.find(vm.gridModel.itemList, function (item) {
            return item.offerid == data.data.offerid;
          });
          if (angular.isUndefined(items)){
            vm.gridModel.itemList.push(formatChilds([data.data])[0]);
            vm.gridModel.loadingState = false;
            computSealeCost();
          }else{
            cbAlert.alert("您已经添加过了");
          }
        }
      },
      removeItem: function (data) {  // 删除项目
        console.log('removeItem', data);
        if (data.status == "0") {
          _.remove(vm.gridModel.itemList, {"offerid": data.transmit});
          computSealeCost();
        }
      }
    };

    function computSealeCost() {   // 计算工时费和商品费用
      var sale = 0, cost = 0;
      angular.forEach(vm.gridModel.itemList, function (item) {

        sale += item.ssaleprice * 100;
        cost += item.psaleprice * 100;
        console.log(item);
      });
      vm.dataBase.totalcost = cost / 100;
      vm.dataBase.totalsale = sale / 100;
      vm.dataBase.childs = formatChilds(vm.gridModel.itemList);
    }

    function formatChilds(data) {
      var results = [];
      angular.forEach(data, function (item) {
        var items = {
          offerid: item.offerid,
          sskuvalues: "",
          scatename1: item.scatename1,
          scatename2: item.scatename2,
          pskuids: item.pskuids,
          salenums: item.salenums,
          status: 0,
          paystatus: 0
        };
        if (angular.isDefined(item.ssaleprice)) {
          items.ssaleprice = item.ssaleprice;
        }else{
          items.ssaleprice = item.saleprice;
        }
        if (angular.isDefined(item.psaleprice)) {
          items.psaleprice = item.psaleprice;
        }else{
          items.psaleprice = item.productcost;
        }
        if (angular.isDefined(item.packegid)) {
          items.packegid = item.packegid;
        }
        if (angular.isDefined(item.serverid)) {
          items.serverid = item.serverid;
        }
        results.push(items);
      });
      return results;
    }

    function getDataBase(data) {
      var result = angular.extend({}, data);
      result.realname = encodeURI(result.realname);
      result.motormodel = encodeURI(result.motormodel);
      result.licence = encodeURI(result.licence);
      result.enginenumber = encodeURI(result.enginenumber);
      if(result.ordertype == '0'){
        result.content = encodeURI("服务项目"+ result.childs[0].scatename1);
      }
      console.log(result.childs);

      angular.forEach(result.childs, function (item) {
        item.scatename1 = encodeURI(item.scatename1);
        item.scatename2 = encodeURI(item.scatename2);
      });
      result.childs.push({});
      return result;
    }

    /**
     * 提交数据
     */
    vm.submit = function () {
      if (!vm.dataBase.userid) {
        cbAlert.alert('请先选择客户');
        return ;
      }
      if (vm.dataBase.motormodel === "请先选择车辆") {
        cbAlert.alert("请先选择车辆");
        return ;
      }
      if (!vm.gridModel.itemList.length) {
        cbAlert.alert("至少要有一个子订单");
        return ;
      }
      tradeSorder.save(getDataBase(vm.dataBase)).then(function(results){
        if(results.data.status == '0'){
          preferencenav.removePreference($state.current);
          $state.go('trade.sorder.list', {'page': 1});
        }else{
          cbAlert.error(results.data.rtnInfo);
        }
      });
    }
  }


  /** @ngInject */
  function TradePorderDetailController($state, preferencenav, tradeSorder, tradeSorderChangeConfig,configuration, cbAlert) {
    var vm = this;
    var currentParams = $state.params;
    vm.dataBase = {};
    vm.gridModel = {
      columns: [
        {
          "id": 0,
          "name": "序号",
          "none": true
        },
        {
          "id": 1,
          "name": "子订单号",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-text="item.detailid"></span>'
        },
        {
          "id": 2,
          "name": "服务项目",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-text="item.scatename1"></span>'
        },
        {
          "id": 3,
          "name": "项目类型",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-text="item.scatename2"></span>'
        },
        {
          "id": 4,
          "name": "工时费(元)",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.saleprice | moneyFilter"></span>'
        },
        {
          "id": 5,
          "name": "商品费用(元)",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.productcost | moneyFilter"></span>'
        },
        {
          "id": 6,
          "name": "单项小计(元)",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.productcost | moneypushFilter : item.saleprice"></span>'
        },
        {
          "id": 7,
          "name": "子订单状态",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.status | formatStatusFilter : \'server_order_child\'"></span>'
        },
        {
          "id": 8,
          "cssProperty": "state-column",
          "fieldDirective": '<button class="btn btn-primary" cb-access-control="trade" data-parentid="50100" data-sectionid="50102" bo-if="item.status == 0 || item.status == 1" ng-click="propsParams.complete(item)" ng-disabled="item.disabled">服务完成</button>',
          "name": '操作',
          "width": 50
        }
      ],
      loadingState: true,
      config: {
        'settingColumnsSupport': false,   // 设置表格列表项
        'checkboxSupport': true,  // 是否有复选框
        'sortSupport': true,
        'paginationSupport': true,  // 是否有分页
        'selectedProperty': "selected",  // 数据列表项复选框
        'selectedScopeProperty': "selectedItems",
        'useBindOnce': true,  // 是否单向绑定
        "paginationInfo": {   // 分页配置信息
          maxSize: 5,
          showPageGoto: true
        }
      },
      pageChanged: function(page){
        uploadPage(vm.dataBase, page);
      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      complete: function (data) {   // 服务完成
        cbAlert.ajax('您是否确认服务完成？', function (isConfirm) {
          if (isConfirm) {
            console.log('您是否确认客户提车？', data);
            tradeSorder.childFinish({
              orderid: vm.dataBase.order.orderid,
              detailid: data.detailid
            }).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('确认服务完成成功');
                getDetail(1);
              }else{
                cbAlert.error(results.data.rtnInfo);
              }
            });
          } else {
            cbAlert.close();
          }
        }, "如果确认服务完成该订单已完成", 'warning');
      }
    };

    function getDetail(page) {
      tradeSorder.detail(currentParams).then(function(results){
        if(results.data.status == '0'){
          vm.dataBase = angular.copy(results.data.data);
          uploadPage(vm.dataBase, page);
        }else{
          cbAlert.error(results.data.rtnInfo);
        }
      });
    }
    getDetail(1);
    function uploadPage(data, page) {
      vm.gridModel.itemList = _.chunk(data.childs, 10)[page - 1] || [];
      vm.gridModel.loadingState = false;
      vm.gridModel.paginationinfo = {
        page: page,
        pageSize: 10,
        total: data.childs.length
      };
    }
  }
})();
