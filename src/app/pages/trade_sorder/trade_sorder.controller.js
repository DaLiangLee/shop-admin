/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
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
          cbAlert.ajax('您是否确认服务完成？', function(isConfirm){
            if(isConfirm){
              console.log('您是否确认客户提车？', data);
              tradeSorder.finish({
                orderid: data.orderid
              }).then(function(results){
                if(results.data.status == '0'){
                  cbAlert.tips('确认服务完成成功');
                  getList();
                }
              });
            }else{
              cbAlert.close();
            }
          }, "如果确认服务完成该订单已完成",'warning');
        },
        confirmTakecar: function(data){ // 确认接车
          if(data.status == "0"){
            tradeSorder.confirmMotor({
              orderid: data.data.orderid,
              motorid: data.data.motorid,
              totalmile: data.data.totalmile
            }).then(function(results){
              if(results.data.status == '0'){
                cbAlert.tips('确认接车成功', 2000);
                getList();
              }
            });
          }
        },
        takecar: function(data){   // 客户提车
          cbAlert.ajax('您是否确认客户提车？', function(isConfirm){
            if(isConfirm){
              console.log('您是否确认客户提车？', data);
              tradeSorder.pickupMotor({
                orderid: data.orderid
              }).then(function(results){
                if(results.data.status == '0'){
                  cbAlert.tips('确认客户提车成功');
                  getList();
                }
              });
            }else{
              cbAlert.close();
            }
          }, "如果确认客户提车该订单已完成",'warning');
        },
        refund: function(data){   // 订单退款
          cbAlert.ajax('您是否确认订单退款？', function(isConfirm){
            if(isConfirm){
              console.log('您是否确认订单退款？', data);
              tradeSorder.refund({
                orderid: data.orderid
              }).then(function(results){
                if(results.data.status == '0'){
                  cbAlert.tips('订单退款成功');
                  getList();
                }
              });
            }else{
              cbAlert.close();
            }
          }, "如果确认订单退款，钱将打给用户",'warning');
        },
        reminder: function(item){   // 提醒客户
          console.log('提醒客户', item);
          item.disabled = true;
          tradeSorder.remind({
            storeid: item.storeid,
            orderid: item.orderid,
            realname: item.realname,
            mobile: item.mobile
          }).then(function(data){
            var results = data.data;
            if(results.status == '0'){
              cbAlert.tips('提醒客户成功', 2000);
            }else{
              cbAlert.tips(results.rtnInfo, 3000, 'error');
            }
            item.disabled = false;
          });
        },
        cancelorder: function(data){   // 取消订单
          cbAlert.ajax('您是否确认取消订单？', function(isConfirm){
            if(isConfirm){
              console.log('取消订单？', data);
              tradeSorder.cancel({
                orderid: data.orderid
              }).then(function(results){
                if(results.data.status == '0'){
                  cbAlert.tips('确认取消订单成功');
                  getList();
                }
              });
            }else{
              cbAlert.close();
            }
          }, "如果确认取消订单该订单将终止",'warning');
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
    function TradeSorderChangeController(tradeSorder, tradeSorderChangeConfig, cbAlert) {
      var vm = this;
      vm.dataBase = {
        storeid: "1",
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
        if(data.status == '0'){
          vm.dataBase.userid = data.data.userid;
          vm.dataBase.realname = data.data.realname;
          vm.dataBase.mobile = data.data.username;
          vm.$$userclass = data.data.userclass;
        }
      };

      /**
       * 选择车辆信息
       * @param data
       */
      vm.selectMotorHandler = function (data) {
        console.log('selectMotorHandler', data);
        if(data.status == '1'){
          cbAlert.alert(data.data);
        }
        if(data.status == '0'){
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
        userid: vm.dataBase.userid,
        addItems: function (data) {   // 新增项目
          if(data.status == '1'){
            cbAlert.alert(data.data);
          }
          console.log('addItems', data);
          if(data.status == "0"){
            vm.gridModel.itemList.push(data.data);
            vm.gridModel.loadingState = false;
            computSealeCost();
          }
        },
        removeItem: function(data){  // 删除项目
          console.log('removeItem', data);
          if(data.status == "0") {
            _.remove(vm.gridModel.itemList, {"offerid": data.transmit});
            computSealeCost();
          }
        }
      };

      function computSealeCost(){   // 计算工时费和商品费用
        var sale = 0,cost = 0;
        angular.forEach(vm.gridModel.itemList, function (item) {
          sale += item.saleprice * 100;
          cost += item.productcost * 100;
        });
        vm.dataBase.totalcost = cost/100;
        vm.dataBase.totalsale = sale/100;
        vm.dataBase.childs = vm.gridModel.itemList;
      }

      /**
       * 提交数据
       */
      vm.submit = function () {
        console.log(vm.dataBase);

      }



    }


    /** @ngInject */
    function TradePorderDetailController() {

    }

})();
