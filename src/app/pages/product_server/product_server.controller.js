/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ProductServerListController', ProductServerListController)
        .controller('ProductServerAddGoodsController', ProductServerAddGoodsController)
        .controller('ProductServerChangeController', ProductServerChangeController);

    /** @ngInject */
    function ProductServerListController($state, $log, utils, productServer, productServerConfig, cbAlert) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = $state.params;
      var total = 0;

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
          if (data.status == 0) {
            /**
             * 删除单页
             */
            var item = null;
            if(data.removal.length == 1){
              item = {
                serverid: data.removal[0].serverid
              }
            }
            productServer.removeServer(item).then(function (data) {
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
          if (data.status == 0) {
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

                item.motorbrandids = utils.getMotorbrandids(item.motorbrandids);
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
    function ProductServerChangeController($state, $log, $window, categoryServer, productServer, productServerAddGoods, productServerChangeConfig,preferencenav, cbAlert) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      /**
       * 清除报价添加
       */
      productServerAddGoods.remove();
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      categoryServer.server().then(function (data) {
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
        if(oldData.serverstatus != newData.serverstatus || oldData.abstracts != newData.abstracts){
          productServer.saveServer(getDataBase(newData)).then(function(results){});
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
          //var page = angular.extend({}, currentParams, {page: data});
          //$state.go(currentStateName, page);
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
                offerid: data.removal[0].offerid
              }
            }
            if(vm.gridModel.itemList.length === 1){
              cbAlert.tips('至少要有一条报价规格');
              return ;
            }
            productServer.removeOfferprice(item).then(function (results) {
              console.log('saveOfferprice', results);
              if(results.data.status == 0) {
                cbAlert.tips('删除成功');
                /**
                 * 修改某一项
                 */
                getOfferpriceList();
              }
            });
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
                getOfferpriceList();
                //vm.gridModel.itemList.push(getOfferprice(results.data.data));
              }
            });
          }
        },
        statusItem: function (data) {
          $log.debug('statusItem', data);
          if (data.status == '0') {
            var item = null;
            if(data.removal.length == 1){
              item = {
                offerid: data.removal[0].offerid
              }
            }
            productServer[data.type](item).then(function (data) {
              getOfferpriceList();
            }, function (data) {
              $log.debug('statusItem', data);
            });

          }
        },
        goAddGoods: function (item) {
          var data = {
            'serverid': item.serverid,
            'offerid': item.offerid,
            'edit': angular.isUndefined(item.pskuids) ? "0" : "1"
          };
          compareDiff(vm.dataBase, diffData);
          productServerAddGoods.set(data);
          $state.go('product.server.addGoods' ,data);
        }
      };
      /**
       * 是否是添加服务
       * 来分步保存数据
       * @type {boolean}
       */
      vm.isAddData = !vm.isChange;
      if (vm.isChange) {
        productServer.edit(currentParams).then(function (results) {
          var edit = results.data.data;
          diffData = angular.extend({}, edit.server);
          vm.dataBase = setDataBase(edit);
          vm.isLoadData = true;
          vm.gridModel.config.propsParams.serverid = edit.server.serverid;
          /*getAttrsku(edit.server.scateid2, function(data){

           console.log(diffData , vm.dataBase);
           vm.isAttributesetLoad = true;

           console.log(data);
           });*/
        });
      } else {
        vm.isLoadData = true;
        vm.dataBase.serverstatus = 1;
        vm.dataBase.mainphoto = [];
      }


      function getOfferpriceList(){
        productServer.edit({serverid: vm.gridModel.config.propsParams.serverid}).then(function (results) {
          var data = [];
          angular.forEach(results.data.data.offerList, function (item) {
            data.push(getOfferprice(item));
          });
          vm.gridModel.itemList = data;
          diffData = angular.extend({}, results.data.data.server);
        });
      }

      /**
       * 格式化报价数据，
       * 因为撤了品牌是一个字符串数组，需要先解码在转换成数组
       * @param data
       * @returns {{}}
       */
      function getOfferprice(data){
        var result = {};
        angular.forEach(data, function (item, key) {
          if(key === 'motorbrandids' && angular.isString(item)){
            result[key] = $window.eval(decodeURI(item));
          }else{
            result[key] = item;
          }
        });
        return result;
      }


      /**
       * 保存基本信息到服务器
       */
      vm.save = function(){
        /*if(!vm.sizeModel.data.length){
          cbAlert.alert('您要至少选择一项规格');
          return ;
        }
        if(!vm.sizeModel.every){
          cbAlert.alert('规格对应的值没有选择');
          return ;
        }*/
        productServer.saveServer(getDataBase(vm.dataBase)).then(function (data) {
          console.log('saveServer', data);
          if(data.data.status == 0) {
            /**
             * 返回新增服务id，供添加报价使用
             */
            vm.gridModel.config.propsParams.serverid = data.data.data;
            vm.isAddData = false;
          }else{
            cbAlert.error(data.data.rtnInfo);
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
       /* angular.forEach(result.sku, function (item) {
          item.skuname = encodeURI(item.skuname);
          item.items[0].skuvalue = encodeURI(item.items[0].skuvalue);
        });*/
        /**
         * 防止后台数据出bug
         */
        /*result.sku.push({});*/
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
          //getAttrsku(data);
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
        var result = angular.extend({}, data), results = {};
        results = result.server;
        results.serverstatus = result.server.status;
        results.sku = result.skuList;
        angular.forEach(result.offerList, function (item) {
          vm.gridModel.itemList.push(getOfferprice(item));
        });
        vm.gridModel.loadingState = false;
        //setTwoCategorie(result.parentid, result.cateid, result.unit);
        return results;
      }

      /**
       * 表单提交
       */
      vm.submit = function () {
        if(!vm.gridModel.itemList.length){
          cbAlert.tips('至少要有一条报价规格');
          return ;
        }
        compareDiff(vm.dataBase, diffData);
        goto();
      };
      function goto() {
        preferencenav.removePreference($state.current);
        $state.go('product.server.list', {'page': 1});
      }

    }

    /** @ngInject */
    function ProductServerAddGoodsController($state, $filter, $log, utils, productServer, categoryGoods, productServerAddGoods, productServerChangeConfig,preferencenav, cbAlert) {
      var vm = this;
      var currentParams = $state.params;
      //verificationURL();
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      vm.items = [];
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      console.log('productServerAddGoods', productServerAddGoods.get());
      var dataLists = [];
      var searchData = undefined;
      var currentPage = 1;
      /**
       * 效验URL是不是对的，
       * 如果是错的，就直接返回到列表
       */
      function verificationURL(){
        var regular = /^\d{18}$/;
        /**
         * 如果刷新页面，只能靠当前url来检查了，
         */
        if(_.isEmpty(productServerAddGoods.get())){
          if(!(currentParams.serverid && regular.test(currentParams.serverid))){
            goto();
          }
          if(!(currentParams.offerid && regular.test(currentParams.offerid))){
            goto();
          }
          if(!(currentParams.edit && (currentParams.edit == 0 || currentParams.edit == 1))){
            goto();
          }
        }else{
          if(!angular.equals(currentParams, productServerAddGoods.get())){
            goto();
          }
        }
      }

      categoryGoods.goods().then(function (data) {
        vm.selectModel.search1.store = data.data.data;
      });

      /**
      * 搜索配置
      */
      vm.selectModel = {
        search1: {
          handler: function (data) {
            if(angular.isObject(utils.getData(this.store, data))){
              vm.selectModel.search2.store = utils.getData(this.store, data).items;
            }else{
              vm.selectModel.search2.store = [];
            }
          }
        },
        search2: {},
        searchText: "",
        searchHandler: function () {
          searchData = {
            "pcateid1": this.search1.select,
            "pcateid2": this.search2.select,
            "productname": this.searchText
          };
          getList(currentPage, searchData);
        },
        resetHandler: function(){
          searchData = undefined;
          this.search1.select = undefined;
          this.search2.select = undefined;
          this.searchText = undefined;
          this.search2.store = [];
          getList(currentPage, searchData);
        }
      };

      /**
      * 表格配置
      */
      vm.gridModel = {
        columns: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.columns),
        itemList: [],
        config: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.config),
        loadingState: true,      // 加载数据
        pageChanged: function (page) {    // 监听分页
          currentPage = page;
          getList(currentPage, searchData);
        }
      };

      /**
      * 组件数据交互
      */
      vm.gridModel.config.propsParams = {
        addItem: function (data) {
          if(!data){
            return ;
          }
          if(!!_.find(vm.items, {pskuid: data.pskuid})){
            return ;
          }
          var item = _.remove(dataLists, {pskuid: data.pskuid});
          if(item.length){
            item[0].numbers = 1;
            item[0].subtotal = item[0].saleprice;
            console.log(item);
            vm.items.push(item[0]);
            getTotalprice();
            getList(currentPage, searchData);
          }
        }
      };

      /**
       * 第一次添加
       */
      productServer.allpskulist().then(function(data){
        dataLists = data.data.data;
        getList(1);
        vm.gridModel.loadingState = false;
      });
      /**
       * 编辑效果
       */
      if(currentParams.edit === "1"){
        productServer.pskulist({offerid: currentParams.offerid}).then(function(data){
          vm.items = angular.copy(data.data.data);
          angular.forEach(vm.items, function (item) {
            vm.compute(item);
          })
        })
      }

      /**
       * 获取所有列表，本地分页，和过滤
       */
      function getList(page, search){
        if(angular.isUndefined(search)){
          vm.gridModel.itemList = _.chunk(dataLists, 10)[page - 1] || [];
          vm.gridModel.paginationinfo = {
            page: page,
            pageSize: 10,
            total: dataLists.length
          };
        }else{
          //console.log(search, $filter('filter')(dataLists, search), dataLists);
          var results = $filter('filter')(dataLists, search);
          vm.gridModel.itemList = _.chunk(results, 10)[page - 1] || [];
          vm.gridModel.paginationinfo = {
            page: page,
            pageSize: 10,
            total: results.length
          };
        }
      }


      vm.remove = function (data) {
        dataLists.push(_.remove(vm.items, {pskuid: data.pskuid})[0]);
        getList(currentPage, searchData);
        getTotalprice();
      };
      /**
      * 失去焦点，计算小计
      * @param index
      * @param item
      */
      vm.compute = function (item) {
        item.subtotal = item.saleprice * 100 * item.numbers / 100;
        getTotalprice();
      };

      /**
      * 计算商品总计
      */
      function getTotalprice(){
        var price = 0;
        angular.forEach(vm.items, function (item) {
          price += item.subtotal;
        });
        vm.totalprice = price;
      }
      /**
      * 初始化获取商品总计
      */
      getTotalprice();

      /**
       * 格式化数据
       */
      function getDataBase(){
        var result = {
          serverid: currentParams.serverid,
          offerid: currentParams.offerid,
          productcost: vm.totalprice,
          psku: [],
          clear: 0
        };
        angular.forEach(vm.items, function(item){
          result.psku.push({
            pskuid: item.pskuid,
            numbers: item.numbers
          });
        });
        result.clear = vm.items.length === 0 ? 1 : 0;
        result.psku.push({});
        return result;
      }
      /**
       * 表单提交
       */
      vm.goBack = function (save) {
        if(save){
          productServer.saveProduct(getDataBase()).then(function (data) {
            console.log('save', data);
            if(data.data.status == 0){
              preferencenav.removePreference($state.current);
              $state.go('product.server.edit', {'serverid': currentParams.serverid});
            }
          });
        }else{
          preferencenav.removePreference($state.current);
          $state.go('product.server.edit', {'serverid': currentParams.serverid});
        }
      };

      function goto() {
        preferencenav.removePreference($state.current);
        $state.go('product.server.list', {'page': 1});
      }

    }
})();
