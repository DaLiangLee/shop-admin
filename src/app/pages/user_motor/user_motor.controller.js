/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('UserMotorListController', UserMotorListController);

  /** @ngInject */
  function UserMotorListController($state, cbAlert, userCustomer, userMotorConfig, userCustomerConfig, configuration) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});
    /**
     * 记录当前子项
     * @type {string}
     */
    var recordChild = "";
    /**
     * 表格配置
     *
     */
    vm.gridModel = {
      requestParams: {
        params: currentParams,
        request: "users,customer,export",
        permission: "chebian:store:user:customer:export"
      },
      columns: angular.copy(userMotorConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(userMotorConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      },
      selectHandler: function(item){
        // 拦截用户恶意点击
        recordChild != item.guid && getUser(item.guid);
      }
    };

    vm.gridModel2 = {
      columns: angular.copy(userCustomerConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: {
        'settingColumnsSupport': false,   // 设置表格列表项
        'checkboxSupport': true,  // 是否有复选框
        'sortSupport': true,
        'paginationSupport': false,  // 是否有分页
        'selectedProperty': "selected",  // 数据列表项复选框
        'selectedScopeProperty': "selectedItems",
        'useBindOnce': true  // 是否单向绑定
      },
      loadingState: true      // 加载数据
    };

    function getUser(guid){
      vm.gridModel2.loadingState = true;
      userCustomer.byMotor({motorid: guid}).then(function(results){
        var result = results.data;
        if (result.status == 0) {
          return result.data;
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      }).then(function(result){
        recordChild = guid;
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
      userCustomer.motorList(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          var items = [];
          _.forEach(result.data, function(item){
            items.push(item);
          });
          return {
            items: items,
            totalCount: result.totalCount
          }
        } else {
          cbAlert.error("错误提示", result.rtnInfo);
        }
      }).then(function(result){
        _.map(result.items, function (item) {
          item.baoyang = configuration.getAPIConfig() + '/users/motors/baoyang/' + item.guid;
        });
        vm.gridModel.paginationinfo = {
          page: params.page * 1,
          pageSize: params.pageSize,
          total: result.totalCount
        };
        if(result.items[0]){
          getUser(result.items[0].guid)
        }else{
          vm.gridModel2.itemList = [];
          vm.gridModel2.loadingState = false;
        }
        vm.gridModel.itemList = result.items;
        vm.gridModel.loadingState = false;
      });
    }

    getList(currentParams);


    var totalMileList = [
      {
        "label": "0-100km",
        id: 100,
        start: 0,
        end: 100
      },
      {
        "label": "0-300km",
        id: 300,
        start: 0,
        end: 300
      },
      {
        "label": "0-500km",
        id: 500,
        start: 0,
        end: 500
      }
    ];

    /**
     * 获取剩余保养里程的model
     * @param list
     * @param current
     * @returns {number}
     */
    function getTotalMile(list, current){
      var start = current.startTotalMile,
          end = current.endTotalMile,
          items;
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
        keyword: currentParams.keyword,
        placeholder: "请输入会员姓名、手机号、车牌号、品牌",
        searchDirective: [
          {
            label: "剩余保养里程",
            all: true,
            custom: true,
            region: true,
            type: "integer",
            name: "TotalMile",
            model: getTotalMile(totalMileList, currentParams),
            list: totalMileList,
            start: {
              name: "startTotalMile",
              model: currentParams.startTotalMile,
              config: {

              }
            },
            end: {
              name: "endTotalMile",
              model: currentParams.endTotalMile,
              config: {

              }
            }
          },
          {
            label: "当前里程",
            name: "CountdownMile",
            all: true,
            custom: true,
            type: "integer",
            start: {
              name: "startCountdownMile",
              model: currentParams.startCountdownMile,
              config: {

              }
            },
            end: {
              name: "endCountdownMile",
              model: currentParams.endCountdownMile,
              config: {

              }
            }
          },
          {
            label: "购车时间",
            name: "BuyDate",
            all: true,
            custom: true,
            type: "date",
            start: {
              name: "startBuyDate",
              model: currentParams.startBuyDate,
              config: {
                minDate: new Date("2010/01/01 00:00:00")
              }
            },
            end: {
              name: "endBuyDate",
              model: currentParams.endBuyDate,
              config: {
                minDate: new Date("2010/01/01 00:00:00")
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
          $state.go(currentStateName, currentParams);
        }else{
          var search = angular.extend({}, currentParams, data);
          $state.go(currentStateName, search);
        }
      }
    };
  }
})();


