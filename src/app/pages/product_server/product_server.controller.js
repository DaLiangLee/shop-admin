/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ProductServerListController', ProductServerListController)
        .controller('ProductServerChangeController', ProductServerChangeController);

    /** @ngInject */
    function ProductServerListController($state, $log, productServer, productServerConfig) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = $state.params;
      var total = 0;

      /**
       * 消息提醒
       */
      vm.message = {
        loadingState: false
      };

      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(productServerConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerConfig.DEFAULT_GRID.config),
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
        removeItem: function (data) {
          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            /**
             * 删除单页
             */
            var item = null;
            if(data.removal.length == 1){
              item = {
                productid: data.removal[0].productid,
                skuid: data.removal[0].skuid
              }
            }
            productGoods.remove(item).then(function (data) {
              var message = "";
              if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
                message = "删除成功";
              } else {
                message = data.data.data;
              }
              vm.message.loadingState = true;
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('removeItemError', data);
            });
          }
          // if(data.list.length <= 5 && total > 10){
          //     vm.gridModel.loadingState = true;
          //     $timeout(function (){
          //         getList();
          //     }, 3000);
          // }
          //vm.gridModel.itemList = data.list;

        },
        statusItem: function (data) {
          $log.debug('statusItem', data);
          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            var item = null;
            if(data.removal.length == 1){
              item = {
                skuid: data.removal[0].skuid
              }
            }
            productGoods[data.type](item).then(function (data) {
              vm.message.loadingState = true;
              var message = "";
              if (_.isEmpty(data.data.data)) {
                message = "修改成功";
              } else {
                message = data.data.data;
              }
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('removeItemError', data);
            });

          }
        },
        pricesItem: function (data) {
          console.log(data.data);

          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            var prices = {
              skuid: data.data.skuid,
              saleprice: data.data.saleprice
            };
            productGoods.price(prices).then(function (data) {
              var message = "";
              if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
                message = "调价成功";
              } else {
                message = data.data.data;
              }
              vm.message.loadingState = true;
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('pricesItemError', data);
            });
          }
        }
      };

      var config = angular.copy(productServerConfig.DEFAULT_SEARCH.config);
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
        productServer.list(currentParams).then(function (data) {
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
              item.skuvalues = window.eval(item.skuvalues);
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
    function ProductServerChangeController($state, $log, $timeout, productGoods) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      var skuData = [];
      var removeskuData = [];
      var skuQueue = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      vm.dataBase = {};
      if (vm.isChange) {
        productGoods.edit(currentParams).then(function (data) {
          var edit = data.data.data;
          //vm.selectModel.select = data.data.data.parentid;
          //vm.dataBase.cateid = data.data.data.cateid;
          //vm.dataBase.brandid = data.data.data.brandid;
          getAttrsku(data.data.data.cateid, function(data){
            vm.dataBase = setDataBase(edit);
            vm.dataBase.productcategory = getCate(edit.parentid, edit.cateid);
            console.log(data);

            vm.dataBase.brandname = getBrandname(data.brand, edit.brandid);
          });
          vm.isAttributesetLoad = true;
          vm.isLoadData = true;
        });
      } else {
        vm.isLoadData = true;
        vm.dataBase.status = 1;
        vm.dataBase.$unit = '请先选择商品类目';
        vm.dataBase.$size = [];
        vm.dataBase.mainphoto = [];
      }

      /**
       * 消息提醒
       */
      vm.message = {
        loadingState: false
      };

      /**
       * 表格配置
       */
      vm.gridModel = {
        columns: angular.copy(productServerConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerConfig.DEFAULT_GRID.config),
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
        removeItem: function (data) {
          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            /**
             * 删除单页
             */
            var item = null;
            if(data.removal.length == 1){
              item = {
                productid: data.removal[0].productid,
                skuid: data.removal[0].skuid
              }
            }
            productGoods.remove(item).then(function (data) {
              var message = "";
              if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
                message = "删除成功";
              } else {
                message = data.data.data;
              }
              vm.message.loadingState = true;
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('removeItemError', data);
            });
          }
          // if(data.list.length <= 5 && total > 10){
          //     vm.gridModel.loadingState = true;
          //     $timeout(function (){
          //         getList();
          //     }, 3000);
          // }
          //vm.gridModel.itemList = data.list;

        },
        statusItem: function (data) {
          $log.debug('statusItem', data);
          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            var item = null;
            if(data.removal.length == 1){
              item = {
                skuid: data.removal[0].skuid
              }
            }
            productGoods[data.type](item).then(function (data) {
              vm.message.loadingState = true;
              var message = "";
              if (_.isEmpty(data.data.data)) {
                message = "修改成功";
              } else {
                message = data.data.data;
              }
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('removeItemError', data);
            });

          }
        },
        pricesItem: function (data) {
          console.log(data.data);

          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            var prices = {
              skuid: data.data.skuid,
              saleprice: data.data.saleprice
            };
            productGoods.price(prices).then(function (data) {
              var message = "";
              if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
                message = "调价成功";
              } else {
                message = data.data.data;
              }
              vm.message.loadingState = true;
              vm.message.config = {
                type: data.data.status,
                message: message
              };
              getList();
            }, function (data) {
              $log.debug('pricesItemError', data);
            });
          }
        }
      };
    }
})();
