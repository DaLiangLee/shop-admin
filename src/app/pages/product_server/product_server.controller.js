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
    function ProductServerListController($state, $timeout,  productServer, productServerConfig, cbAlert, computeService) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});
      var total = 0;
      /**
       * 记录当前子项
       * @type {string}
       */
      var recordChild = "";
      /**
       * 表格配置
       */
      vm.gridModel = {
        requestParams: {
          params: currentParams,
          request: "product,server,excelServer",
          permission: "chebian:store:product:server:export"
        },
        columns: angular.copy(productServerConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          var page = angular.extend({}, currentParams, {page: data});
          $state.go(currentStateName, page);
        },
        sortChanged: function (data) {
          var orders = [];
          angular.forEach(data.data, function (item, key) {
            orders.push({
              "field": key,
              "direction": item
            });
          });
          var order = angular.extend({}, currentParams, {orders: JSON.stringify(orders)});
          vm.gridModel.requestParams.params = order;
          getList(order);
        },
        selectHandler: function (item) {
          // 拦截用户恶意点击
          recordChild != item.guid && getServerSkus(item.guid);
        }
      };

      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        currentStatus: currentParams.status,
        removeItem: function (data) {
          if (data.status == 0) {
            productServer.removeServerAll(data.transmit).then(function (results) {
              if(results.data.status === '0'){
                cbAlert.tips("删除成功");
              }else{
                cbAlert.error(results.data.data);
              }
              getList(currentParams);
            });
          }
        },
        statusItem: function (data) {
          if (data.status == 0) {
            var message = data.type === 'removeServers' ? "服务下架修改成功" : "服务上架修改成功";
            productServer[data.type](data.transmit).then(function (results) {
              if(results.data.status === '0'){
                cbAlert.tips(message);
              }else{
                cbAlert.error(results.data.data);
              }
              getList(currentParams);
            });
          }
        }
      };

      /**
       * 搜索操作
       *
       */
      vm.searchModel = {
        'config': {
          placeholder: "请输入服务编码、服务名称、服务属性",
          keyword: currentParams.keyword,
          searchDirective: [
            {
              label: "服务类目",
              all: true,
              list: [
                {
                  id: 0,
                  label: "汽车内饰"
                },
                {
                  id: 1,
                  label: "电子导航"
                },
                {
                  id: 2,
                  label: "轮胎"
                },
                {
                  id: 3,
                  label: "保养配件"
                },
                {
                  id: 4,
                  label: "工具"
                }
              ],
              type: "list",
              model: currentParams.scateid1,
              name: "scateid1"
            },
            {
              label: "销量",
              name: "sumserverorder",
              all: true,
              custom: true,
              type: "int",
              start: {
                name: "sumserverorder0",
                model: currentParams.sumserverorder0
              },
              end: {
                name: "sumserverorder1",
                model: currentParams.sumserverorder1
              }
            },
            {
              label: "工时费",
              all: true,
              custom: true,
              type: "int",
              name: "serverprice",
              start: {
                name: "serverprice0",
                model: currentParams.serverprice0
              },
              end: {
                name: "serverprice1",
                model: currentParams.serverprice1
              }
            },
            {
              label: "保质期",
              all: true,
              custom: true,
              type: "int",
              name: "shelflife",
              start: {
                name: "shelflife0",
                model: currentParams.shelflife0
              },
              end: {
                name: "shelflife1",
                model: currentParams.shelflife1
              }
            }
          ]
        },
        'handler': function (data) {
          var search = angular.extend({}, currentParams, data);
          $state.go(currentStateName, search);
        }
      };

      function getServerSkus(id) {
        productServer.getServerSkus({id: id}).then(function (results) {
          if (results.data.status == 0) {
            recordChild = id;
            results.data.data.serverSkus && angular.forEach(results.data.data.serverSkus, function (item) {
              if((!item.serverprice && item.serverprice != 0) || (!item.servertime && item.servertime != 0)){
                item.$$servertimeprice = "";
              }else{
                item.$$servertimeprice = computeService.multiply(item.serverprice, item.servertime);
              }
             if(item.skuvalues){
                item.skuvalues = JSON.parse(item.skuvalues);
                item.$$skuvalues = _.trunc(item.skuvalues.skuname + item.skuvalues.items[0].skuvalue, {
                  'length': 10,
                  'omission': ' 等'
                })
              }
              if(item.manualskuvalues){
                item.$$skuvalues = _.trunc(item.manualskuvalues, {
                  'length': 10,
                  'omission': ' 等'
                })
              }
            });
            vm.items = results.data.data;
            console.log(vm.items);
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }

      /**
       * 表格配置
       */
      vm.gridModel2 = {
        editorhandler: function (data, item, type) {
          console.log(data, item);
          item[type] = data;
          productServer.updateServerSku(angular.copy(item)).then(function (results) {
            console.log(results);
            if (results.data.status == '0') {
              cbAlert.tips('修改成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        },
        statusItem: function (item) {
          console.log(JSON.stringify(item));
          var tips = item.status === "0" ? '是否确认启用该服务SKU？' : '是否确认禁用该服务SKU？';
          cbAlert.ajax(tips, function (isConfirm) {
            if (isConfirm) {
              item.status = item.status === "0" ? "1" : "0";
              productServer.updateServerSku(item).then(function (results) {
                if (results.data.status == '0') {
                  cbAlert.success('修改成功');
                  var statusTime = $timeout(function(){
                    cbAlert.close();
                    $timeout.cancel(statusTime);
                    statusTime = null;
                  }, 1200, false);
                  getList(currentParams);
                } else {
                  cbAlert.error(results.data.data);
                }
              });
            } else {
              cbAlert.close();
            }
          }, "", 'warning');
        }
      };

      // 获取服务列表
      function getList(params) {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!params.status) {
          return;
        }
        productServer.list(params).then(function (data) {
          if (data.data.status == 0) {
            if (!data.data.data.length && params.page != 1) {
              $state.go(params, {page: 1});
            }
            total = data.data.totalCount;
            vm.gridModel.itemList = [];
            angular.forEach(data.data.data, function (item) {
              vm.gridModel.itemList.push(item);
            });
            console.log(vm.gridModel.itemList);

            vm.gridModel.paginationinfo = {
              page: params.page * 1,
              pageSize: params.pageSize,
              total: total
            };
            vm.gridModel.loadingState = false;
            !vm.gridModel.itemList.length && (vm.items = undefined);
            vm.gridModel.itemList[0] && getServerSkus(vm.gridModel.itemList[0].guid);
          }
        });
      }
      getList(currentParams);
    }

    /** @ngInject */
    function ProductServerChangeController($state, $filter, $window, categoryServer, productServer, productServerAddGoods, productServerChangeConfig, cbAlert, computeService) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      /**
       * 提交的serverskus中的一个属性attrvalues
       * 选择类目和名称获取
       * @type {{}}
       */
      var attrvalues = {};
      /**
       * 清除报价添加
       */
      productServerAddGoods.remove();
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      categoryServer.storeserver().then(function (data) {
        angular.forEach(data.data.data, function(item){
          vm.selectModel.store.push(item);
        });
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
      vm.dataBase = {

      };

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
        vm.dataBase.mainphoto = "http://audit-oss-chebian.oss-cn-shenzhen.aliyuncs.com/1484035662318_CASE2";
        vm.dataBase.serverskus = [];
      }

      /**
       * 设置属性
       * @param item
       */
      function setSkuvalues(sku){
        console.log(sku);
        var skuvaluesList = [];
        angular.forEach(sku, function (skuname) {
          angular.forEach(skuname.items, function (skuvalue) {
            var item = angular.copy(skuname);
            item.items = [skuvalue];
            skuvaluesList.push(item);
          });
        });
        angular.forEach(skuvaluesList, function (item) {
          vm.dataBase.serverskus.push({
            $$add: false,
            skuvalues: item,
            servertime: 1,
            $$skuname: _.trunc(item.skuname + item.items[0].skuvalue, {
              'length': 10,
              'omission': ' 等'
            }),
            status: "1"
          });
        });
      }

      /**
       * 新增属性
       * @param item
       */
      vm.addSkuvalues = function(){
        vm.dataBase.serverskus.push({
          $$add: true,
          servertime: 1,
          status: "1"
        });
      };

      /**
       * 设置车辆属性状态
       * @param item
       */
      vm.statusItem = function (item) {
        var title = item.status === "1" ? "是否禁用该属性" : "是否开启该属性";
        var message = item.status === "1" ? "禁用该属性不能再页面显示" : "开启该属性后在页面显示";
        cbAlert.confirm(title, function(isConfirm){
          if(isConfirm){
            item.status = item.status === "1" ? "0" : "1";
            cbAlert.tips("操作成功");
          }else{
            cbAlert.close();
          }
        }, message, "warning");
      };




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





      vm.uploadModel = {
        config: {
          uploadtype: "serverMain",
          title: "服务图片上传"
        },
        handler: function(data){
          if(data.status == 0 && data.data.length == 1){
            vm.dataBase.mainphoto = data.data[0].url;
          }
        }
      };


      /**
       * 工时费计算   工时*单价
       * @param time   工时
       * @param price  单价
       * @returns {*}  工时费
       */
      vm.servertimeprice = function(item){
        console.log(item);

        var time = item.servertime,
            price = item.serverprice;
        console.log((!time && time != 0) || (!price && price != 0) || isNaN(parseFloat(time)) || isNaN(parseFloat(price)));

        if((!time && time != 0) || (!price && price != 0) || isNaN(parseFloat(time)) || isNaN(parseFloat(price))){
          return "";
        }
        console.log(time, price);

        time = isNaN(parseFloat(time)) ? 0 : time;
        price = isNaN(parseFloat(price)) ? 0 : price;
        item.$$servertimeprice = computeService.multiply(time, price);
      };


      /**
       * 服务类目选择配置
       * @type {{store: Array, handler: Function}}
       */
      vm.selectModel = {
        store: [],
        handler: function (data) {
          setTwoCategorie(data);
          vm.isAttributesetLoad = false;
          attrvalues = getData(vm.selectModel.store, data);
          vm.dataBase.serverskus = [];
        }
      };
      /**
       * 获取服务名称的数据
       * @param id
       */
      function setTwoCategorie(id){
        if (!!getData(vm.selectModel.store, id)) {
          vm.selectModel2.store = getData(vm.selectModel.store, id).items;
        } else {
          vm.selectModel2.store = [];
        }
      }

      /**
       * 服务名称选择配置
       * @type {{store: Array, handler: Function}}
       */
      vm.selectModel2 = {
        store: [],
        handler: function (data) {
          vm.dataBase.servername = getData(vm.selectModel2.store, data).catename;
          getAttrsku(data);
          _.remove(attrvalues.items, function(item){
            return item.id != data;
          });
          console.log(attrvalues);
          vm.dataBase.serverskus = [];
        }
      };

      /**
       * 在数组里面根据value参数获取数组中对应的数据
       * @param arr      数据
       * @param id       查询id
       * @param value    比较的字段 默认id
       */
      var getData = function (arr, id, value) {
        arr = angular.copy(arr);
        value = value || 'id';
        return _.find(arr, function (item) {
          return item[value] == id;
        });
      };


      function getAttrsku(id, callback){
        console.log(id);
        productServer.attrsku({id: id}).then(function (results) {
          if (results.data.status == 0) {
            results.data.data.sku.length && setSkuvalues(results.data.data.sku);
            if(!callback){
              vm.isAttributesetLoad = true;
            }
            callback && callback(data.data.data);
          }else{
            cbAlert.error("错误提示", results.data.data);
          }

        });
      }


      /**
       * 格式化 vm.dataBase数据供提交使用
       * @param data
       * @returns {{}}
       */
      function getDataBase(data) {
        var result = angular.copy(data);
        /**
         * 把没有填价格的清除属性清除掉
         */
        _.remove(result.serverskus, function (item) {
          return angular.isUndefined(item.serverprice);
        });
        angular.forEach(result.serverskus, function (item) {
          item.attrvalues = JSON.stringify(attrvalues);
        });
        console.log(result);
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
       * 拦截提交
       * 提交的需要参数全部符合才能为false
       */
      function interception() {
        var result = false;
        if (!vm.dataBase.serverskus.length) {
          cbAlert.alert("需要填写至少填写一个车辆属性");
          return true;
        }
        var servertime = _.filter(vm.dataBase.serverskus, function (item) {
          return !item.servertime && item.servertime !== 0;
        });

        var manualskuvalues = _.filter(vm.dataBase.serverskus, function (item) {
          return !item.$$skuname && !item.manualskuvalues && item.manualskuvalues !== 0;
        });
        if (servertime.length) {
          cbAlert.alert("车辆属性的工时没有填写");
          return true;
        }
        if (manualskuvalues.length) {
          cbAlert.alert("车辆属性的属性名没有填写");
          return true;
        }
        return result;
      }
      /**
       * 保存并返回
       */
      vm.submitBack = function(){
        saveServer(function(){
          cbAlert.close();
          goto();
        });
      };

      /**
       * 保存并复制新建
       */
      vm.submitNewCopy = function(){
        saveServer(function(){
          cbAlert.tips("保存成功，请继续添加");
        });
      };

      /**
       * 保存服务处理函数  回调做不同的操作
       * @param callback
       */
      function saveServer(callback) {
        if (interception()) {
          return;
        }
        var serverprice = _.filter(vm.dataBase.serverskus, function (item) {
          return !item.serverprice && item.serverprice !== 0;
        });
        if(serverprice.length && vm.dataBase.serverskus.length === 1){
          cbAlert.alert("车辆属性的单价没有填写");
          return ;
        }
        if (serverprice.length && vm.dataBase.serverskus.length > 1) {
          cbAlert.confirm("车辆属性的单价没有全部填写，是否继续？", function (isConfirm) {
            if(isConfirm){
              productServer.saveServer(getDataBase(vm.dataBase)).then(function (results) {
                if (results.data.status == 0) {
                  callback && callback();
                }else{
                  cbAlert.error("错误提示", results.data.data);
                }
              });
            }else{
              cbAlert.close();
            }
          }, "如果没有填写价格的属性将被删除", "warning");
        }else{
          productServer.saveServer(getDataBase(vm.dataBase)).then(function (results) {
            if (results.data.status == 0) {
              callback && callback();
            }else{
              cbAlert.error("错误提示", results.data.data);
            }
          });
        }
      }

      /**
       * 跳转页面
       */
      function goto() {
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
      if(currentParams.edit === "0") {
        productServer.allpskulist().then(function (data) {
          dataLists = data.data.data;
          getList(1);
          vm.gridModel.loadingState = false;
        });
      }
      /**
       * 编辑效果
       */
      if(currentParams.edit === "1"){
        productServer.pskulist({offerid: currentParams.offerid}).then(function(data){
          vm.items = angular.copy(data.data.data.pskulist);
          angular.forEach(vm.items, function (item) {
            vm.compute(item);
          });
          dataLists = filterData(data.data.data.allpskulist, data.data.data.pskulist, "pskuid");
          getList(1);
          vm.gridModel.loadingState = false;
        })
      }

      /**
       * 格式化显示数据
       * 依赖_.remove方法
       * @param all     全部数据
       * @param list    已经选中的数据
       * @return {[]}   返回数组 格式化数据
       */
      function filterData(all, list, id){
        /**
         * 强制让all和list变成数组形式，如果不是数组直接返回空数组
         */
        if(!angular.isArray(all) || !angular.isArray(list)){
          return [];
        }
        /**
         * 如果all和list长度一样，表示list已经把all全部选择，返回空数组
         */
        if(all.length === list.length){
          return [];
        }
        /**
         * 如果没有填id，就动态赋值一个id
         * @type {*}
         */
        id = id || "id";
        /**
         * 拷贝数组，防止对原数组进行操作
         */
        all = all.concat([]);
        /**
         * 循环list，用list的item去删除all里面对应的item
         */
        angular.forEach(list, function (key) {
          _.remove(all, function(value){
            return value[id] === key[id];
          });
        });
        return all;
      }

      /**
       * 获取所有列表，本地分页，和过滤
       */
      function getList(page, search){
        if(angular.isUndefined(search)){
          vm.gridModel.itemList = _.chunk(dataLists, 10)[page - 1] || [];
          console.log(vm.gridModel.itemList);
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
