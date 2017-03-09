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
    function ProductServerListController($state, $timeout,  productServer, productServerConfig, cbAlert, computeService) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});
      var total = 0;
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
          var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
          vm.gridModel.requestParams.params = order;
          getList(order);
        },
        selectHandler: function (item) {
          // 拦截用户恶意点击
          !item.$active && item.guid && getServerSkus(item.guid);
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
          other: currentParams,
          keyword: {
            placeholder: "请输入服务编码、服务名称、服务属性",
            model: currentParams.keyword,
            name: "keyword",
            isShow: true
          },
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
              region: true,
              type: "integer",
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
              region: true,
              type: "integer",
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
              region: true,
              type: "integer",
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
          // 如果路由一样需要刷新一下
          if(angular.equals(currentParams, data)){
            $state.reload();
          }else{
            $state.go(currentStateName, data);
          }
        }
      };

      function getServerSkus(id) {
        productServer.getServerSkus({id: id}).then(function (results) {
          if (results.data.status == 0) {
            results.data.data.serverSkus && angular.forEach(results.data.data.serverSkus, function (item) {
              item.serverprice = item.serverprice/100;
              if((!item.serverprice && item.serverprice != 0) || (!item.servertime && item.servertime != 0)){
                item.$servertimeprice = "";
              }else{
                item.$servertimeprice = computeService.multiply(item.serverprice, item.servertime);
              }
             if(item.skuvalues){
                item.skuvalues = angular.fromJson(item.skuvalues);
                item.$skuvalues = _.trunc(item.skuvalues.skuname + item.skuvalues.items[0].skuvalue, {
                  'length': 10,
                  'omission': ' 等'
                })
              }
              if(item.manualskuvalues){
                item.$skuvalues = _.trunc(item.manualskuvalues, {
                  'length': 10,
                  'omission': ' 等'
                })
              }
            });
            vm.items = results.data.data;
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }

      /**
       * 表格配置
       */
      vm.gridModel2 = {
        editorhandler: function (data, item, type, serverid) {
          if(type === "servertime" && data == item.servertime){
            return ;
          }
          item[type] = data;
          var items = _.pick(item, ['guid', 'servertime']);
          items['serverid'] = serverid;
          productServer.updateServerSku(items).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips('修改成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        },
        statusItem: function (item, serverid) {
          var tips = item.status === "0" ? '是否确认启用该服务SKU？' : '是否确认禁用该服务SKU？';
          cbAlert.ajax(tips, function (isConfirm) {
            if (isConfirm) {
              item.status = item.status === "0" ? "1" : "0";
              var items = _.pick(item, ['guid', 'status']);
              items['serverid'] = serverid;
              productServer.updateServerSku(items).then(function (results) {
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
        loadingState: vm.isChange     // 加载数据
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
              if(results.data.status == 0) {
                getOfferpriceList();
                //vm.gridModel.itemList.push(getOfferprice(results.data.data));
              }
            });
          }
        },
        statusItem: function (data) {
          if (data.status == '0') {
            var item = null;
            if(data.removal.length == 1){
              item = {
                offerid: data.removal[0].offerid
              }
            }
            productServer[data.type](item).then(function (data) {
              getOfferpriceList();
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
        vm.dataBase.mainphoto = "";
        vm.dataBase.serverskus = [];
      }

      /**
       * 设置属性
       * @param item
       */
      function setSkuvalues(sku){
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
       * 服务名称是否不存在
       * @type {boolean}
       */
      vm.isScateid2 = false;
      /**
       * 服务名称选择配置
       * @type {{store: Array, handler: Function}}
       */
      vm.selectModel2 = {
        store: [],
        handler: function (data) {
          productServer.checkServer({scateid1: vm.dataBase.scateid1, scateid2: data}).then(function(results){
            if (results.data.status == 0) {
              vm.dataBase.servername = getData(vm.selectModel2.store, data).catename;
              getAttrsku(data);
              _.remove(attrvalues.items, function(item){
                return item.id != data;
              });
              console.log(attrvalues);
              vm.isScateid2 = true;
              vm.dataBase.serverskus = [];
            }else{
              vm.isScateid2 = false;
              cbAlert.error("错误提示", results.data.data);
            }
          });
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
       * 选择车辆
       * @param data
       * @param item
       */
      vm.vehicleSelect = function(data, item){
        console.log(data, item);
        if(data.status == 0){
          item.motobrandids = data.data;
        }
      };

      /**
       * 编辑车辆
       * @param data
       * @param item
       */
      vm.vehicleShow = function(data, item){
        console.log(data, item);
        if(data.status == 0){
          item.motobrandids = data.data;
        }
      };

      /**
       * 删除车辆属性
       * @param item
       */
      vm.removeItem = function (item, index) {
        vm.dataBase.serverskus.splice(index, 1);
      };

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
          item.serverprice = computeService.multiply(item.serverprice || 0, 100);　　　　
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
        // 车辆属性
        if (!vm.dataBase.serverskus.length) {
          cbAlert.alert("需要填写至少填写一个车辆属性");
          return true;
        }
        // 车辆属性工时费
        var servertime = _.filter(vm.dataBase.serverskus, function (item) {
          return !item.servertime && item.servertime !== 0;
        });
        // 车辆属性名称(填写)
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
        // 车辆属性单价
        var serverprice = _.filter(vm.dataBase.serverskus, function (item) {
          return !_.isUndefined(item.serverprice);
        });
        if (!serverprice.length) {
          cbAlert.alert("车辆属性的属性单价没有填写");
          return true;
        }
        if (serverprice.length !== vm.dataBase.serverskus.length) {
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

})();
