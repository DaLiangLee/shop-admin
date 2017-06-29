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
    function ProductServerListController($filter, $state, productServer, productServerConfig, cbAlert, computeService, category) {
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
          if (data.status === 0) {
            productServer.removeServerAll(data.transmit).then(function (results) {
              if(results.data.status === 0){
                cbAlert.tips("删除成功");
                getList(currentParams);
              }else{
                cbAlert.error(results.data.data);
              }
            });
          }
        },
        statusItem: function (data) {
          if (data.status === 0) {
            var message = data.type === 'removeServers' ? "服务下架修改成功" : "服务上架修改成功";
            productServer[data.type](data.transmit).then(function (results) {
              if(results.data.status === 0){
                cbAlert.tips(message);
                getList(currentParams);
              }else{
                cbAlert.error(results.data.data);
              }
            });
          }
        }
      };

      /**
       * 搜索操作
       *
       */
      vm.searchModel = {
        'handler': function (data) {
          var search = angular.extend({}, currentParams, data);
          search.page = '1';
          // 如果路由一样需要刷新一下
          if(angular.equals(currentParams, search)){
            $state.reload();
          }else{
            $state.go(currentStateName, search);
          }
        }
      };


      /**
       * 获取筛选类目
       */
      category.server().then(function (results) {
        var items = [];
        _.forEach(results, function (item) {
          items.push({
            id: item.id,
            label: item.catename
          });
        });
        vm.searchModel.config = {
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
              list: items,
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
              label: "保修期",
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
        }
      });


      function getServerSkus(id) {
        productServer.getServerSkus({id: id}).then(function (results) {
          if (results.data.status === 0) {
            results.data.data.serverSkus && angular.forEach(results.data.data.serverSkus, function (item) {
              item.$servertimeprice = $filter('moneySubtotalFilter')([computeService.pullMoney(item.serverprice), item.servertime]);
             if(item.skuvalues){
                item.skuvalues = angular.fromJson(item.skuvalues);
                item.$skuvalues = _.trunc(item.skuvalues.skuname + item.skuvalues.items[0].skuvalue, {
                  'length': 10,
                  'omission': ' 等'
                });
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
          if(computeService.multiply(item.serverprice, data) / 100 >= 1000000){
              cbAlert.warning("工时费超出100万上限");
            return ;
          }
          item[type] = data;
          var items = _.pick(item, ['guid', 'servertime']);
          items['serverid'] = serverid;
          productServer.updateServerSku(items).then(function (results) {
            if (results.data.status === 0) {
              cbAlert.tips('修改成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        },
        statusItem: function (item, serverid) {
          var tips = item.status === "0" ? '确定启用该服务属性？' : '确定禁用该服务属性？';
          var msg = item.status === "0" ? '启用后，该属性服务将正常销售。' : '禁用后，该属性服务将无法销售。';
          cbAlert.ajax(tips, function (isConfirm) {
            if (isConfirm) {
              item.status = item.status === "0" ? "1" : "0";
              var items = _.pick(item, ['guid', 'status']);
              items['serverid'] = serverid;
              productServer.updateServerSku(items).then(function (results) {
                if (results.data.status === 0) {
                  cbAlert.tips('修改成功');
                  getList(currentParams);
                } else {
                  cbAlert.error(results.data.data);
                }
              });
            }
            cbAlert.close();
          }, msg, 'confirm');
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
          if (data.data.status === 0) {
            if (!data.data.data.length && params.page*1 !== 1) {
              currentParams.page = 1;
              $state.go(currentStateName, currentParams);
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
    function ProductServerChangeController($filter, $state, category, productServer, cbAlert, computeService, utils) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;

      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);

      /**
       * 需要返回操作
       * @type {boolean}
       */
      $state.current.backspace = true;

      /**
       * 步骤状态
       * 0 初始化
       * 1 类目完成
       * 2 名称完成
       * 3 属性完成
       * 4 其他完成
       * 5 全部完成
       * @type {number}
       */
      vm.stepState = 0;

      /**
       * 服务名称是否不存在
       * @type {boolean}
       */
      vm.isServername = undefined;
      /**
       * 基本信息数据
       * @type {{}}
       */
      vm.dataBase = {};

      /**
       * 检查是否是编辑
       */
      if (vm.isChange) {
        if(!/^\d{18}$/.test(currentParams.serverid)){
          cbAlert.determine("错误提示", '您传递的服务编辑id不对，请输入正确的id', function(){
            $state.current.interceptor = false;
            cbAlert.close();
            goto();
          }, 'error');
          return ;
        }
        /**
         * 获取当前店铺所选的服务
         */
        category.server().then(function (results) {
          vm.category.store = results;
        });
        /**
         * 根据id获取当前服务详情
         */
        productServer.getServerSkus({id: currentParams.serverid}).then(function (results) {
          if (results.data.status === 0) {
            setDataBase(results.data.data);
          } else {
            cbAlert.error("错误提示", results.data.data);
          }
        });
      } else {
        vm.isLoadData = true;
        vm.dataBase.mainphoto = "";
        vm.dataBase.serverSkus = [];
        vm.dataBase.deleteguid = [];
        /**
         * 获取当前店铺所选的服务
         */
        category.server().then(function (results) {
          vm.category.store = results;
        });
      }

      vm.isServerSku = false;

      /**
       * 提交的serverskus中的一个属性attrvalues
       * 选择类目和名称获取
       * @type {{}}
       */
      var attrvalues = {};
      /**
       * 保存数据
       * @type {null}
       */
      var categoryReset = null;
      /**
       * 服务类目
       * @type {{}}
       */
      vm.category = {
        name: "",
        falg: false,
        toggle: function (falg) {
          var _this = vm.category;
          if(!falg){
            vm.dataBase = _.cloneDeep(categoryReset);
            categoryReset = null;
            _this.falg = !falg;
            vm.stepState = 1;
          }else{
            if(vm.stepState > 1){
              cbAlert.confirm("确定编辑类目类型？", function (isConfirm) {
                if (isConfirm) {
                  vm.stepState = 0;
                  _this.falg = !falg;
                  categoryReset = _.cloneDeep(vm.dataBase);
                }
                cbAlert.close();
              }, "修改后的名称将被清空。", "confirm");
            }else{
              _this.falg = !falg;
              vm.stepState = 0;
            }
          }
        },
        handler: function (id) {
          var _this = vm.category;
          var items = _.find(_this.store, function (item) {
            return id === item.id;
          });
          _this.name = items.catename;
          vm.dataBase.servername = "";
          vm.dataBase.scateid2 = "";
          vm.serverName.store = items.items || [];
          vm.stepState = 1;
          _this.falg = true;
          vm.dataBase.scateid1 = id;
        }
      };

      /**
       * 服务名称
       * @type {{}}
       */
      vm.serverName = {
        handler: function (data) {
          productServer.checkServer({scateid1: vm.dataBase.scateid1, servername: data.servername}).then(function(results){
            if (results.data.status === 0) {
              vm.isServername = undefined;
              vm.dataBase.scateid2 = data.scateid2;
              vm.dataBase.servername = data.servername;
              if(!vm.dataBase.serverSkus.length){
                vm.addItem();
              }
              vm.stepState = 2;
              vm.isServerSku = true;
            }else{
              if (vm.isChange && currentParams.serverid === results.data.guid) {
                vm.isServername = undefined;
                vm.dataBase.scateid2 = data.scateid2;
                vm.dataBase.servername = data.servername;
                if(!vm.dataBase.serverSkus.length){
                  vm.addItem();
                }
                vm.stepState = 2;
                vm.isServerSku = true;
              }else{
                vm.isServername = {
                  msg: results.data.data,
                  guid: results.data.guid
                }
              }
            }
          });
        }
      };

      vm.goServerEdit = function () {
        $state.current.interceptor = false;
        $state.go('product.server.edit', {'serverid': vm.isServername.guid});
      };


      /**
       * 属性相关操作开始
       *********************************************************************************************************
       */

      /**
       * 添加属性
       */
      vm.addItem = function () {
        var saleprice = _.filter(vm.dataBase.items, function (item) {
          return utils.isEmpty(item.saleprice);
        });
        var manualskuvalues = _.filter(vm.dataBase.items, function (item) {
          return utils.isEmpty(item.manualskuvalues);
        });


        if(saleprice.length || manualskuvalues.length){
          cbAlert.warning("警告提示", "您的名称，工时，单价未填写");
          return ;
        }

        _.forEach(vm.dataBase.serverSkus, function (item, index) {
          item.$folded = false;
          item.sortsku = index;
        });
        vm.dataBase.serverSkus.push({
          '$folded': true,
          'status': '1',
          'sortsku': vm.dataBase.serverSkus.length,
          'manualskuvalues': "",
          'attrvalues':vm.dataBase.scateid1,
          'servertime': '1.0'
        });
      };

      /**
       * 根据索引删除某个属性
       * @param item 当前项
       * @param $index 当前索引
       */
      vm.removeItem = function (item, $index) {
        cbAlert.confirm("确定删除？", function (isConfirm) {
          if (isConfirm) {
            var remove = vm.dataBase.serverSkus.splice($index, 1);
            if(vm.dataBase.deleteguid){
              vm.dataBase.deleteguid = vm.dataBase.deleteguid + "," + remove[0].guid;
            }else{
              vm.dataBase.deleteguid = remove[0].guid;
            }
            _.forEach(vm.dataBase.serverSkus, function (item, index) {
              item.sortsku = index;
            });
          }
          cbAlert.close();
        }, "删除以后不能恢复。", "confirm");
      };

      /**
       * 改变当前属性状态
       * @param item 当前项
       */
      vm.statusItem = function (item) {
        var messages = [
          {
            title: "确定启用该属性？",
            content: "启用后，该属性服务将正常销售。"
          },
          {
            title: "确定禁用该属性？",
            content: "禁用后，该属性服务将无法销售。"
          }
        ];
        var status = messages[item.status];
        cbAlert.confirm(status.title, function (isConfirm) {
          if (isConfirm) {
            item.status = item.status === "1" ? "0" : "1";
            cbAlert.tips("操作成功");
          } else {
            cbAlert.close();
          }
        }, status.content, "confirm");
      };

      /**
       * 切换显示当前项收起展开
       * @param item 当前项
       */
      vm.togglItem = function (item) {
        if(vm.exceedlimit){
          return ;
        }
        var data = _.pick(item, ['manualskuvalues', 'serverprice']);
        if(utils.isEmpty(data.manualskuvalues) || utils.isEmpty(data.serverprice)){
          cbAlert.warning("警告提示", "您的名称或单价未填写");
          return ;
        }
        item.$stockshow = (_.isUndefined(item.$stock) &&  _.isNull(item.$stock)) ? "无限" : item.$stock;
        item.$folded = !item.$folded;
      };

      /**
       * 排序
       * @param item
       * @param index
       * @param dir
       */
      vm.sortItem = function (item, index, dir) {
        if(dir === -1 && index === 0 || dir === 1 && index === vm.dataBase.serverSkus.length - 1){
          return ;
        }
        moveItme(item, index + dir, index);
      };

      /**
       * 拖拽
       * @param data     返回目标索引和当前索引
       */
      vm.dragItem = function(data){
        var item = vm.dataBase.serverSkus[data.currentIndex];
        moveItme(item, data.targetIndex, data.currentIndex);
      };

      /**
       * 移动当前项到目标位置，目标项移动到当前位置
       * @param item          当前项
       * @param targetIndex   目标索引
       * @param currentIndex  当前位置
       */
      function moveItme(item, targetIndex, currentIndex){
        var replaceItem = vm.dataBase.serverSkus.splice(targetIndex, 1, item);
        vm.dataBase.serverSkus.splice(currentIndex, 1, replaceItem[0]);
        _.forEach(vm.dataBase.serverSkus, function (item, index) {
          item.sortsku = index;
        });
      }

      /**
       * 属性相关操作结束
       *********************************************************************************************************
       */






      /**
       * 基本信息数据
       * @type {{}}
       * 保存数据有规格， 服务状态，商品简介
       */
      //var diffData = null;

      /**
       * 验证基本信息是否修改
       * 1，如果修改 需要提交数据给后台
       * 2，如果没有修改，什么都不需要做
       * @param newData
       * @param oldData
       */
      /*function compareDiff(newData, oldData){
        if(oldData.serverstatus != newData.serverstatus || oldData.abstracts != newData.abstracts){
          productServer.saveServer(getDataBase(newData)).then(function(results){});
        }
      }*/


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
       */
      vm.servertimeprice = function(item){
        var time = item.servertime,
            price = item.serverprice;
        if((!time && time !== 0) || (!price && price !== 0) || isNaN(parseFloat(time)) || isNaN(parseFloat(price))){
          return "";
        }
        time = isNaN(parseFloat(time)) ? 0 : time;
        price = isNaN(parseFloat(price)) ? 0 : price;
        item.$servertimeprice = $filter('moneySubtotalFilter')([time, price]);
        vm.exceedlimit = item.$servertimeprice > 1000000;
      };

      /**
       * 服务名称选择配置
       * @type {{store: Array, handler: Function}}
       */
      vm.selectModel2 = {
        store: [],
        handler: function () {

        }
      };

      /**
       * 选择车辆
       * @param data
       * @param item
       */
      vm.vehicleSelect = function(data, item){
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
        if(data.status == 0){
          item.motobrandids = data.data;
        }
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
        _.remove(result.serverSkus, function (item) {
          return angular.isUndefined(item.serverprice);
        });
        angular.forEach(result.serverSkus, function (item) {
          item.serverid = data.guid;
          item.attrvalues = angular.toJson(attrvalues);
          item.serverprice = computeService.pushMoney(item.serverprice);
        });
        result.shelflife = isNaN(parseInt(result.shelflife, 10)) ? undefined : result.shelflife;
        result.status = !_.filter(result.serverSkus, {'status': '1'}).length ? 0 : 1;
        result.deleteguid = _.compact(result.deleteguid).join(",");
        return result;
      }
      /**
       * 获取编辑数据，生成vm.dataBase数据格式
       * @param data
       */
      function setDataBase(data) {
        vm.dataBase = data;
        _.forEach(vm.dataBase.serverSkus, function (item, index) {
          item.serverprice = computeService.pullMoney(item.serverprice);
          item.$folded = false;
          item.sortsku = index;
          vm.servertimeprice(item);
        });

        var items = _.find(vm.category.store, function (item) {
          return item.id === data.scateid1;
        });
        vm.serverName.store = items.items || [];
        vm.dataBase.deleteguid = [];
        vm.stepState = 5;
        vm.isLoadData = true;
      }

      /**
       * 拦截提交
       * 提交的需要参数全部符合才能为false
       */
      function interception() {
        var result = false;
        // 车辆属性
        if (!vm.dataBase.serverSkus.length) {
          cbAlert.alert("需要填写至少填写一个车辆属性");
          return true;
        }
        // 车辆属性工时费
        var servertime = _.filter(vm.dataBase.serverSkus, function (item) {
          return utils.isEmpty(item.servertime);
        });
        // 车辆属性名称(填写)
        var manualskuvalues = _.filter(vm.dataBase.serverSkus, function (item) {
          return !item['$skuname'] && utils.isEmpty(item.manualskuvalues);
        });

        if (servertime.length) {
          cbAlert.alert("服务规格的工时没有填写");
          return true;
        }
        if (manualskuvalues.length) {
          cbAlert.alert("服务规格的属性名没有填写");
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
          if(vm.isChange){
            $state.go('product.server.add');
          }else{
            $state.reload();
          }
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
        var serverprice = _.filter(vm.dataBase.serverSkus, function (item) {
          return utils.isEmpty(item.serverprice);
        });
        if (serverprice.length) {
          cbAlert.alert("请填写工时单价");
          return true;
        }
        productServer.saveServer(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status === 0) {
            callback && callback();
          }else{
            cbAlert.error("错误提示", results.data.data);
          }
        });
      }

      /**
       * 跳转页面
       */
      function goto() {
        $state.go('product.server.list', {'page': 1});
      }

    }

})();
