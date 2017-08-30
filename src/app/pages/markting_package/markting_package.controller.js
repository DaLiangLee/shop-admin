/**
 * Created by Administrator on 2017/06/07.
 */
(function () {
  'use strict';

  angular
      .module('shopApp')
      .controller('MarktingPackageController', MarktingPackageController);

  /** @ngInject */
  function MarktingPackageController($state, marktingPackage, marktingPackageConfig, computeService, cbAlert, utils) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, { pageSize: 15 }); // { page: "1", pageSize: 5 }
    var total = 0;

    /**
     * 一开始重定向到 '/list/1?status=1'
     */
    /*if (angular.isUndefined(currentParams.status)) {
      currentParams.status = '1';
    }*/
    $state.go(currentStateName, currentParams);

    /**
     * 组件交互
     * @type {{currentStatus: *, statusItem: statusItem}}
     */
    var propsParams = {
      currentStatus: currentParams.status, // 路由status
      statusItem: function(item) {  // cb-switch
        var tips = item.status === '0'? '确定开启套餐卡？' : '确定关闭套餐卡？';
        cbAlert.ajax(tips, function (isConform) {
          if (isConform) {
            item.status = item.status === '0' ? '1' : '0';
            if (item['$$num'] === '无限') {
              item.num = null;
            }
            item.price = computeService.pushMoney(item.price);
            item.originprice = computeService.pushMoney(item.originprice);
            _.omit(item, 'restnum');
            var items = _.extend({}, item, {status: item.status});
            marktingPackage.save_package(items).then(function(results) {
              if (results.data.status === 0) {
                cbAlert.tips('修改成功');
                getList(currentParams);
              } else {
                cbAlert.error(results.data.data);
              }
            });
          } else {
            cbAlert.close();
          }
        }, '', 'confirm');
      },
      getPackageInfo: function(item) { // 悬浮信息框
        if (angular.isUndefined(item)) {
          return;
        }
        propsParams.templateData = [];
        angular.forEach(item.packageItems, function(packageItem) {
          propsParams.templateData.push({
            type: packageItem.type === '0' ? '服务' : '商品',
            name: packageItem.name,
            num: packageItem.num,
            originprice: computeService.pullMoney(packageItem.originprice).toFixed(2),
            price: computeService.pullMoney(packageItem.price).toFixed(2)
          })
        });
      }
    };

    vm.gridModel = {
      columns: _.clone(marktingPackageConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.extend({}, marktingPackageConfig.DEFAULT_GRID.config, {propsParams: propsParams}),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };

    // 搜索
    var DEFAULT_SEARCH = _.cloneDeep(marktingPackageConfig.DEFAULT_SEARCH);
    var searchModel = _.chain(_.clone(currentParams)).tap(function (value) {
      _.forEach(_.pick(value, ['originprice0', 'originprice1','price0','price1']), function (item, key) {
        !_.isUndefined(item) && (value[key] = computeService.pullMoney(item));
      });
    }).value();

    vm.searchModel = {
      config: DEFAULT_SEARCH.config(searchModel),
      'handler': function (data) {
        var items = _.find(DEFAULT_SEARCH.originprice, function (item) {
          return item.id === data.originprice0 * 1;
        });
        if (angular.isDefined(items)) {
          data.originprice1 = undefined;
        }
        var search = _.chain(data).tap(function (value) {
          _.forEach(_.pick(value, ['originprice0', 'originprice1','price0','price1']), function (item, key) {
            !_.isUndefined(item) && (value[key] = computeService.pushMoney(item));
          });
        }).value();

        _.chain(currentParams).tap(function (value) {
          _.forEach(_.pick(value, ['originprice0', 'originprice1', 'price0','price1']), function (item, key) {
            !_.isUndefined(item) && (value[key] *= 1);

          });
        }).value();
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, search)) {
          $state.reload();
        } else {
          search.page = '1';
          $state.go(currentStateName, search);
        }
      }
    };


    /**
     * 获取列表数据
     * @param params
     */
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (angular.isUndefined(params.page)) {
        return;
      }

      marktingPackage.search(params).then(function (data) {
        if (data.data.status === 0) {
          // vm.gridModel.config.$on = data.data.on;
          // vm.gridModel.config.$off = data.data.off;
          if (!data.data.data.length && params.page*1 !== 1) {
            currentParams.page = 1;
            $state.go(currentStateName, currentParams);
          }
          total = data.data.totalCount;
          // 如果没有数据就阻止执行，提高性能，防止下面报错
          if (total === 0) {
            vm.gridModel.loadingState = false;
            vm.gridModel.itemList = [];
            vm.ordersDetails = undefined;
            return false;
          }
          vm.gridModel.itemList = [];
          angular.forEach(data.data.data, function (item) {
            item.price = computeService.pullMoney(item.price);
            item.originprice = computeService.pullMoney(item.originprice);
            item['$$num'] = utils.isEmpty(item.num) ? '无限' : item.num;
            item.restnum = item['$$num'] === '无限' ? '无限' : item['$$num'] - item.soldnum;
            item.status = item.status;
            vm.gridModel.itemList.push(item);
          });

          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: total
          };
          vm.gridModel.loadingState = false;
          !vm.gridModel.itemList.length && (vm.items = undefined);
        }
      });
    }

    getList(currentParams);

  }


})();




