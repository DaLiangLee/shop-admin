/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('TradeOrderListController', TradeOrderListController)
        .controller('TradeOrderChangeController', TradeOrderChangeController);

    /** @ngInject */
    function TradeOrderListController($state, $log, cbAlert, tadeOrder, tadeOrderConfig, computeService) {
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
          request: "trade,porder,excelProduct",
          permission: "chebian:store:trade:porder:export"
        },
        itemList: [],
        config: angular.copy(tadeOrderConfig.DEFAULT_GRID.config),
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
                }else{
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
          if(data.status == 0){
            tadeOrder.update(data.data).then(function (results) {
              if (results.data.status == '0') {
                cbAlert.tips('订单收款成功');
                getList(currentParams);
              }else{
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
                }else{
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
                }else{
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
       * 获取评价时间的model
       * @param list
       * @param current
       * @returns {number}
       */
      function getCreatetime(list, current){
        var start = current.createtime0,
          end = current.createtime1,
          items;
        if(angular.isUndefined(end)){
          end = start;
        }
        if(angular.isUndefined(start) || angular.isUndefined(end)){
          return -1;
        }
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
              model: getCreatetime(createtime, currentParams),
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
          if(_.isEmpty(data)){
            _.map(currentParams, function (item, key) {
              if(key !== 'page'){
                currentParams[key] = undefined;
              }
            });
            console.log(currentParams);
            $state.go(currentStateName, currentParams);
          }else{
            var items = _.find(createtime, function(item){
              return item.id == data.createtime0;
            });
            if(angular.isDefined(items)){
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
            total = data.data.count;
            vm.gridModel.itemList = data.data.data;
            setStatistics(_.pick(data.data, ['psalepriceAll', 'productcount', 'servercount', 'ssalepriceAll']));
             _.map(vm.gridModel.itemList, function (item) {
               item.totalprice = computeService.divide(computeService.add(item.ssaleprice || 0, item.psaleprice || 0), 100);
               item.ssaleprice = computeService.divide(item.ssaleprice || 0, 100);
               item.psaleprice = computeService.divide(item.psaleprice || 0, 100);
               item.preferentialprice = computeService.divide(item.preferentialprice || 0, 100);
               item.actualprice = computeService.divide(item.actualprice || 0, 100);
            });
            /*angular.forEach(data.data.data, function (item) {
              /!**
               * 这段代码处理skuvalues值的问题，请勿修改 start
               *!/
              item.skuvalues = $window.eval(item.skuvalues);
              /!**
               * 这段代码处理skuvalues值的问题，请勿修改 end
               *!/
              vm.gridModel.itemList.push(item);
            });*/
            vm.gridModel.paginationinfo = {
              page: params.page * 1,
              pageSize: params.pageSize,
              total: data.data.totalCount
            };
            vm.gridModel.loadingState = false;
          }
        }, function (data) {
          $log.debug('getListError', data);
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
    }

    /** @ngInject */
    function TradeOrderChangeController($scope, computeService, tadeOrder, userCustomer, cbAlert, configuration) {
      var vm = this;
      /**
       * 服务项目列表id 供删除操作使用
       * @type {number}
       */
      var detailsid = 0;

      vm.isLoadData = true;
      vm.dataBase = {};

      function completedMaxDate(date){
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
        open: function(){

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
            "fieldDirective": '<div ng-if="!item.products.length" style="position: relative; width:200px;"><p class="text-border"></p><button style="position: absolute; right:0; top: 0;" order-product-dialog handler="propsParams.productHandler(data, item)" class="btn btn-primary">添加</button></div><div ng-if="item.products.length">2</div>'
          },
          {
            "id": 3,
            "name": "工时费",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" ng-bind="item.$$num"></span>'
          },
          {
            "id": 4,
            "name": "商品/材料费",
            "cssProperty": "state-column",
            "fieldDirective": '<span class="state-unread" ng-bind="item.$$price"></span>'
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
        removeItem: function (data) {     // 批量删除
          console.log(data);
          if(data.status == 0){
            _.remove(vm.dataBase.details, function (item) {
              console.log(data.transmit, item.$$detailsid);
              return _.findIndex(data.transmit, function(key){
                  return key == item.$$detailsid;
                }) > -1;
            });
            setStatistics();
          }
        },
        serviceHandler: function (data, item) {
          console.log(data, item);
          if(data.status == 0){
            if(angular.isUndefined(item.products)){
              item = angular.extend({products: []}, item, data.data);
            }else{
              item = angular.extend({}, item, data.data);
            }
            var index = _.findIndex(vm.dataBase.details, {$$detailsid: item.$$detailsid});
            vm.dataBase.details[index] = item;
            console.log(item);
            setStatistics();
            setServiceinfo();
          }
        }
      };

      vm.userHandler = function(data){
        console.log(data);
        if(data.status == 0){
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


      function setUserMotors(data){
        data.$$baoyang = configuration.getAPIConfig() +　'/users/motors/baoyang/' + data.guid;
        vm.dataBase.carinfo = data;
        vm.dataBase.carno = data.licence;
        vm.dataBase.carmodel = data.model;
      }

      function getUserMotors(mobile){
        userCustomer.getMotors({mobile: mobile}).then(function(results){
          console.log('getUserMotors', results);
          var result = results.data;
          if(result.status == 0){
            vm.selectModel.store = result.data;
            setUserMotors(vm.selectModel.store[0] || {});
          }else{
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
      function setStatistics(){
        var result = {
          serviceCount: 0,
          ssalepriceAll: 0,
          productCount: 0,
          psalepriceAll: 0,
          totalprice: 0
        };
        _.forEach(vm.dataBase.details, function(item){
          if(angular.isDefined(item.server)){
            result.serviceCount++;
          }
          if(angular.isDefined(item.products)){
            result.productCount += item.products.length;
          }
          if(angular.isDefined(item.num)){
            result.ssalepriceAll = computeService.add(result.ssalepriceAll, item.num || 0);
          }
          if(angular.isDefined(item.price)){
            result.psalepriceAll = computeService.add(result.psalepriceAll, item.num || 0);
          }
        });
        result.totalprice = computeService.add(result.psalepriceAll || 0, result.ssalepriceAll || 0);
        vm.statistics = result;
      }

      /**
       *
       */
      function setServiceinfo() {
        var results = [];
        _.forEach(vm.dataBase.details, function(item){
          results.push(item.$$itemname);
        });
        vm.dataBase.serviceinfo = results.join('、');
        vm.dataBase.details.length > 1 && (vm.dataBase.serviceinfo = '（多项）' + vm.dataBase.serviceinfo)
      }

      function setProductinfo() {
        var results = [];
        vm.dataBase.productinfo = results.join('、');
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


      function getDataBase(data){
        var result = angular.extend({}, data);
        result.carinfo = JSON.stringify(result.carinfo);
        result.userinfo = JSON.stringify(result.userinfo);
        result.waitinstore = result.waitinstore ? 1 : 0;
        return result;
      }

      /**
       * 提交数据到后台
       */
      vm.submitBtn = function(){
        console.log(vm.dataBase);
        tadeOrder.saveOrder(getDataBase(vm.dataBase)).then(function(results){
          var result = results.data;
          if(result.status == 0){
            vm.selectModel.store = result.data;
            setUserMotors(vm.selectModel.store[0] || {});
          }else{
            cbAlert.error("错误提示", result.data);
          }
        });
      }

    }
})();
