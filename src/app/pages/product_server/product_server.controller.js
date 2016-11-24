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
    function ProductServerListController($state, $log, $$utils, productServer, productServerConfig) {
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
            productServer.remove(item).then(function (data) {
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
            productServer[data.type](item).then(function (data) {
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
               * 处理motorbrandids和logos
               */
              if(angular.isDefined(item.logos)){
                item.logos = item.logos.split('#');
              }
              if(angular.isDefined(item.motorbrandids)){

                item.motorbrandids = $$utils.getMotorbrandids(item.motorbrandids);
              }
              /**
               * 这段代码处理skuvalues值的问题，请勿修改 start
               */
              item.skuvalues = window.eval(item.skuvalues);
              /**
               * 这段代码处理skuvalues值的问题，请勿修改 end
               */
              vm.gridModel.itemList.push(item);
            });
            console.log(vm.gridModel.itemList);

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
    function getMotorbrandids(data){
      if(data.indexOf('#') == -1){
        return [];
      }
      var results = [];
      var list = data.split('#');
      angular.forEach(list, function (item) {
        var items = window.eval(item);
        angular.forEach(items, function (key) {
          results.push(key);
        });
      });
      return results;
    }
    /** @ngInject */
    function ProductServerChangeController($state, $log, $timeout, productServer, productServerChangeConfig,preferencenav, cbAlert) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      productServer.category().then(function (data) {
        vm.selectModel.store = data.data.data;
      });
      vm.dataBase = {};
      if (vm.isChange) {
        productServer.edit(currentParams).then(function (data) {
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
        vm.dataBase.serverstatus = 1;
        vm.dataBase.mainphoto = [];
      }
      vm.selectModel = {
        store: [],
        handler: function (data) {
          console.log('selectModel', data);
          setTwoCategorie(data);
          vm.isAttributesetLoad = false;
        }
      };
      vm.selectModel2 = {
        store: [],
        handler: function (data) {
          console.log('selectModel2', data);
          console.log(getData(vm.selectModel2.store, data));
          //vm.dataBase.cateid = data;
          getAttrsku(data);
        }
      };
      vm.sizeModel = {
        store: [],
        data: [],
        every: undefined,
        handler: function (data) {
          console.log('sizeModel', data);
          this.every = data.every;
          this.data = data.data;
        }
      };
      /**
       * 在数组里面根据value参数获取数组中对应的数据
       * @param arr      数据
       * @param id       查询id
       * @param value    比较的字段 默认id
       */
      var getData = function (arr, id, value) {
        value = value || 'id';
        return _.find(arr, function (item) {
          return item[value] == id;
        });
      };
      function setTwoCategorie(id){
        if (!!getData(vm.selectModel.store, id)) {
          vm.selectModel2.store = getData(vm.selectModel.store, id).items;
        } else {
          vm.selectModel2.store = [];
        }
        console.log(vm.selectModel2.store);

      }
      function getAttrsku(id, callback){
        console.log(id);
        productServer.attrsku({id: id}).then(function (data) {
          vm.sizeModel.store = angular.copy(data.data.data.sku);
          vm.dataBase.attrvalues = data.data.data.attributeset[0].id;
          if(!callback){
            vm.isAttributesetLoad = true;
          }
          callback && callback(data.data.data);
        });
      }


      /**
       * 格式化 vm.dataBase数据供提交使用
       * @param data
       * @returns {{}}
       */
      function getDataBase(data) {
        var result = angular.extend({}, data);
        result.abstracts = encodeURI(result.abstracts);
        angular.forEach(result.sku, function (item) {
          item.skuname = encodeURI(item.skuname);
          item.items[0].skuvalue = encodeURI(item.items[0].skuvalue);
        });
        /**
         * 防止后台数据出bug
         */
        result.sku.push({});
        result.offerprice.push({});
        /**
         * 防止后台数据出bug
         */
        if(vm.isChange){
          delete result.parentid;
          delete result.brandname;
          delete result.productcategory;
        }
        return result;
      }

      /**
       * 表单提交
       */
      vm.submit = function () {
        console.log(vm.dataBase);

        if(!vm.sizeModel.data.length){
          cbAlert.alert('您要至少选择一项规格');
          return ;
        }
        if(!vm.sizeModel.every){
          cbAlert.alert('规格对应的值没有选择');
          return ;
        }
        if(!vm.gridModel.itemList.length){
          cbAlert.alert('您还没有选择报价规格');
          return ;
        }
        vm.dataBase.offerprice = angular.copy(vm.gridModel.itemList);
        productServer.save(getDataBase(vm.dataBase)).then(function (data) {
          console.log('save', data);
          if(data.data.status == 0){
            goto();
          }
        });
      };
      function goto() {
        preferencenav.removePreference($state.current);
        $state.go('product.server.list', {'page': 1});
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
        columns: angular.copy(productServerChangeConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerChangeConfig.DEFAULT_GRID.config),
        loadingState: vm.isChange,      // 加载数据
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
        addItem: function (data) {
          if (data.status == -1) {
            vm.message.loadingState = false;
          } else {
            console.log(data.data);
            vm.gridModel.itemList.push(data.data);
            console.log(vm.gridModel.itemList);
            vm.gridModel.loadingState = false;
          }
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
