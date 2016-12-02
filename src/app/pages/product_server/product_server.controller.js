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
    function ProductServerListController($state, $log, $$utils, productServer, productServerConfig, cbAlert) {
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
                serverid: data.removal[0].serverid
              }
            }
            productServer.remove(item).then(function (data) {
              if(data.data.status === '0'){
                cbAlert.tips("删除成功");
              }else{
                cbAlert.error(data.data.rtnInfo);
              }
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
                serverid: data.removal[0].serverid
              }
            }
            productServer[data.type](item).then(function (data) {
              if(data.data.status === '0'){
                cbAlert.tips("服务状态修改成功");
              }else{
                cbAlert.error(data.data.rtnInfo);
              }
              getList();
            }, function (data) {
              $log.debug('statusItemError', data);
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
      /**
       * 基本信息数据
       * @type {{}}
       * 保存数据有规格， 服务状态，商品简介
       */
      var diffData = null;

      /**
       * 验证基本信息是否修改
       * 1，如果修改 需要提交数据给后台
       * 2，如果没有修改，什么都不需要做
       * @param newData
       * @param oldData
       */
      function compareDiff(newData, oldData){
        if(oldData.sku.length != newData.sku.length || oldData.serverstatus != newData.serverstatus || oldData.abstracts != newData.abstracts){
          productServer().then(function(results){

          });
        }
      }

      /**
       * 基本信息数据
       * @type {{}}
       */
      vm.dataBase = {};

      /**
       * 报价表格配置
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
        serverid: "",
        removeItem: function (data) {
          if (data.status == '0') {
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
          }
        },
        addItem: function (data) {
          if(data.status == '1'){
            cbAlert.alert(data.data);
          }
          if (data.status == '0') {
            console.log(data.data);
            productServer.saveOfferprice(data.data).then(function (results) {
              console.log('saveOfferprice', results);
              if(results.data.status == 0) {
                if(data.type === 'add'){
                  /**
                   * 返回新增服务数据添加到
                   */
                  vm.gridModel.itemList.unshift(results.data.data);
                }else if(data.type === 'edit'){
                  /**
                   * 修改某一项
                   */
                  _.remove(vm.gridModel.itemList, function(key){
                    return key.guid == results.data.data.guid;
                  });
                  vm.gridModel.itemList.unshift(results.data.data);
                }
              }
            });
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
                offerpriceid: data.removal[0].offerpriceid
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
      /**
       * 是否是添加服务
       * 来分步保存数据
       * @type {boolean}
       */
      vm.isAddData = !vm.isChange;
      if (vm.isChange) {
        productServer.edit(currentParams).then(function (data) {
          var edit = data.data.data;
          console.log(edit);
          getAttrsku(edit.server.cateid, function(data){
            vm.dataBase = setDataBase(edit);
            vm.isAttributesetLoad = true;
            vm.isLoadData = true;
            console.log(data);
          });
        });
      } else {
        vm.isLoadData = true;
        vm.dataBase.serverstatus = 1;
        vm.dataBase.mainphoto = [];
      }
      /**
       * 保存基本信息到服务器
       */
      vm.save = function(){
        if(!vm.sizeModel.data.length){
          cbAlert.alert('您要至少选择一项规格');
          return ;
        }
        if(!vm.sizeModel.every){
          cbAlert.alert('规格对应的值没有选择');
          return ;
        }
        productServer.saveServer(getDataBase(vm.dataBase)).then(function (data) {
          console.log('saveServer', data);
          if(data.data.status == 0) {
            /**
             * 返回新增服务id，供添加报价使用
             */
            vm.gridModel.config.propsParams.serverid = data.data.data;
            vm.isAddData = false;
          }
        });
      };



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
       * 获取编辑数据，生成vm.dataBase数据格式
       * @param data
       * @returns {{}}
       */
      function setDataBase(data) {
        var result = angular.extend({}, data);
        var results = {};
        results = result.server;
        results.serverstatus = result.server.status;
        results.sku = result.skuList;
        vm.gridModel.itemList = result.offerList;
        vm.gridModel.loadingState = false;
        //setTwoCategorie(result.parentid, result.cateid, result.unit);
        return results;
      }

      /**
       * 表单提交
       */
      vm.submit = function () {
        console.log(vm.dataBase);


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

    }
})();
