/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('ProductGoodsListController', ProductGoodsListController)
    .controller('ProductGoodsChangeController', ProductGoodsChangeController);

  /** @ngInject */
  function ProductGoodsListController($state, $timeout, $log, productGoods, productGoodsConfig, cbAlert, categoryGoods, computeService) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});

    var total = 0;

    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: angular.copy(productGoodsConfig.DEFAULT_GRID.columns),
      itemList: [],
      requestParams: {
        params: currentParams,
        request: "product,goods,excelProduct",
        permission: "chebian:store:product:goods:export"
      },
      config: angular.copy(productGoodsConfig.DEFAULT_GRID.config),
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
        !item.$$active && item.guid && getProductSkus(item.guid);
      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      currentStatus: currentParams.remove,
      removeItem: function (data) {
        if (data.status == 0) {
          productGoods.deleteProduct(data.transmit).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips("删除成功");
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
            getList(currentParams);
          }, function (results) {
            $log.debug('removeItemError', results);
          });
        }
      },
      statusItem: function (data) {
        if (data.status == 0) {
          var message = data.type === 'removeProduct' ? "商品下架修改成功" : "商品上架修改成功";
          productGoods[data.type](data.transmit).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips(message);
            } else {
              cbAlert.error("错误提示", results.data.data);
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
      'handler': function (data) {
        // 如果路由一样需要刷新一下
        if(angular.equals(currentParams, data)){
          $state.reload();
        }else{
          $state.go(currentStateName, data);
        }
      }
    };


    /**
     * 获取筛选类目
     */
    categoryGoods.goods().then(function (results) {
      if (results.data.status == 0) {
        var items = [];
        _.forEach(results.data.data, function (item) {
          items.push({
            id: item.id,
            label: item.catename
          });
        });
        vm.searchModel.config = {
          other: currentParams,
          keyword: {
            placeholder: "请输入商品编码、名称、品牌、零件码、条形码、属性",
            model: currentParams.keyword,
            name: "keyword",
            isShow: true
          },
          searchDirective: [
            {
              label: "类目",
              all: true,
              list: items,
              type: "list",
              model: currentParams.pcateid1,
              name: "pcateid1"
            },
            {
              label: "销量",
              name: "salenums",
              all: true,
              custom: true,
              region: true,
              type: "integer",
              start: {
                name: "salenums0",
                model: currentParams.salenums0
              },
              end: {
                name: "salenums1",
                model: currentParams.salenums1
              }
            },
            {
              label: "库存",
              all: true,
              custom: true,
              region: true,
              type: "integer",
              name: "stock",
              start: {
                name: "stock0",
                model: currentParams.stock0
              },
              end: {
                name: "stock1",
                model: currentParams.stock1
              }
            },
            {
              label: "价格",
              all: true,
              custom: true,
              region: true,
              type: "integer",
              name: "saleprice",
              start: {
                name: "saleprice0",
                model: currentParams.saleprice0
              },
              end: {
                name: "saleprice1",
                model: currentParams.saleprice1
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
        }
      } else {
        cbAlert.error(results.data.data);
      }

    });

    /**
     * 表格配置
     */
    vm.gridModel2 = {
      editorhandler: function (data, item, type, productid) {
        console.log(item);

        if(type === "stock" && (item.stock == null || item.stock == undefined) && data > item.stock){
          cbAlert.alert('修改的库存不能比当前库存大');
          item.$$stock = item.stock;
          return ;
        }
        if(type === "saleprice"){
          item.saleprice = computeService.multiply(data, 100);
        }else{
          item[type] = data;
        }
        var items = _.pick(item, ['guid', type]);
        items['productid'] = productid;
        productGoods.updateProductSku(items).then(function (results) {
          if (results.data.status == '0') {
            cbAlert.tips('修改成功');
            getList(currentParams);
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }
    };


    vm.statusItem = function (item, productid) {
      var tips = item.status === "0" ? '是否确认启用该商品SKU？' : '是否确认禁用该商品SKU？';
      cbAlert.ajax(tips, function (isConfirm) {
        if (isConfirm) {
          item.status = item.status === "0" ? "1" : "0";
          var items = _.pick(item, ['guid', 'status']);
          items['productid'] = productid;
          productGoods.updateProductSku(items).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.success('修改成功');
              var statusTime = $timeout(function () {
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
    };

    function getProductSkus(id) {
      productGoods.getProductSkus({id: id}).then(function (results) {
        if (results.data.status == 0) {
          results.data.data.items && angular.forEach(results.data.data.items, function (item) {
            item.$$stockShow = (item.stock == null || item.stock == undefined) ? "无限" : item.stock;
            item.$$stock = (item.stock == null || item.stock == undefined) ? "" : item.stock;
            item.saleprice = computeService.divide(item.saleprice, 100);
            item.salenums = _.isUndefined(item.salenums) ? 0 : item.salenums;
            item.motobrandids = angular.fromJson(item.motobrandids);
          });
          vm.items = results.data.data;
        } else {
          cbAlert.error(results.data.data);
        }
      });
    }


    // 获取权限列表
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.remove) {
        return;
      }
      productGoods.list(params).then(function (data) {
        if (data.data.status == 0) {
          if (!data.data.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.data.totalCount;
          vm.gridModel.itemList = [];
          angular.forEach(data.data.data, function (item) {
            item.$$stockShow = (item.stock == null || item.stock == undefined) ? "无限" : item.stock;
            vm.gridModel.itemList.push(item);
          });
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: total
          };
          vm.gridModel.loadingState = false;
          !vm.gridModel.itemList.length && (vm.items = undefined);
          vm.gridModel.itemList[0] && getProductSkus(vm.gridModel.itemList[0].guid);
        }
      });
    }

    getList(currentParams);

  }

  /** @ngInject */
  function ProductGoodsChangeController($state, $window, $filter, categoryGoods, productGoods, cbAlert, computeService) {
    var vm = this;
    var currentParams = $state.params;
    vm.attributeset = [];
    vm.isLoadData = false;
    vm.isAttributesetLoad = false;
    //  是否是编辑
    vm.isChange = !_.isEmpty(currentParams);
    vm.dataBase = {};
    categoryGoods.goods().then(function (data) {
      vm.selectModel.store = data.data.data;
    });
    if (vm.isChange) {
      productGoods.edit(currentParams).then(function (data) {
        var edit = data.data.data;
        console.log(edit);
        getAttrsku(data.data.data.pcateid2, function (data) {
          vm.dataBase = setDataBase(edit);
          vm.dataBase.productcategory = getCate(edit.parentid, edit.cateid);
          vm.dataBase.brandname = getBrandname(data.brand, edit.brandid);
          vm.dataBase.motobrandids = edit.motobrandids;
          vm.dataBase.skuvalues = $window.eval(edit.skuvalues);
        });
        vm.isAttributesetLoad = true;
        vm.isLoadData = true;
      });
    } else {
      vm.isLoadData = true;
      vm.dataBase.status = 1;
      vm.dataBase.$unit = '请先选择商品类目';
      vm.dataBase.mainphoto = "";
      vm.dataBase.items = [];
    }

    function getCate(parentid, cateid) {
      var str = "", item2;
      var item1 = _.remove(vm.selectModel.store, function (item) {
        return item.id == parentid;
      });
      if (item1.length) {
        str = item1[0].catename;
        if (item1[0].items.length) {
          item2 = _.remove(item1[0].items, function (item) {
            return item.id == cateid;
          });
          if (item2.length) {
            str += " " + item2[0].catename;
          }
        }

      }
      return str;
    }

    /**
     * 属性添加
     * @type {{}}
     */
    vm.skuvalues = {
      store: [],
      handler: function (data) {
        console.log('属性添加', data);
        if (data.status == 0 && data.data.length > 0) {
          vm.dataBase.items.push({
            skuvalues: data.data,
            attrvalues: vm.dataBase.$$attrvalues,
            status: "1",
            $$skuname: $filter('skuvaluesFilter')(data.data)
          });
        }
      }
    };
    vm.dataBase.items.push();

    function getBrandname(data, id) {
      var item = _.remove(data, function (item) {
        return item.id == id;
      });
      return item.length ? item[0].shortname : "";
    }

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

    vm.brandModel = {
      select: undefined,
      store: [],
      handler: function (data) {
        vm.dataBase.brandid = data;
      }
    };

    vm.selectModel2 = {
      select: undefined,
      store: [],
      handler: function (data) {
        console.log('selectModel', data);
        if (!!getData(vm.selectModel2.store, data)) {
          vm.dataBase.$unit = getData(vm.selectModel2.store, data).unit;
        }
        vm.dataBase.cateid = data;
        getAttrsku(data);
        vm.dataBase.items = [];
      }
    };

    function getAttrsku(id, callback) {
      productGoods.attrsku({id: id}).then(function (data) {
        vm.brandModel.store = data.data.data.brand;
        vm.skuData = angular.copy(data.data.data.sku);
        vm.skuvalues.store = angular.copy(data.data.data.sku);
        if(data.data.data.attributeset[0]){
          vm.dataBase.$$attrvalues = data.data.data.attributeset[0].id;
        }
        if (!callback) {
          vm.dataBase.brandid = undefined;
          vm.brandModel.select = undefined;
          vm.isAttributesetLoad = true;
        }
        callback && callback(data.data.data);
      });
    }

    vm.selectModel = {
      select: undefined,
      store: [],
      handler: function (data) {
        setTwoCategorie(data, undefined, '请先选择商品类目');
        vm.isAttributesetLoad = false;
        vm.dataBase.items = [];
      }
    };


    function setTwoCategorie(id, cateid, unit) {
      if (!!getData(vm.selectModel.store, id)) {
        vm.selectModel2.store = getData(vm.selectModel.store, id).items;
      } else {
        vm.selectModel2.store = [];
      }
      vm.dataBase.cateid = cateid;
      vm.dataBase.$unit = unit;
    }

    /**
     * 获取编辑数据，生成vm.dataBase数据格式
     * @param data
     * @returns {{}}
     */
    function setDataBase(data) {
      var result = angular.extend({}, data);
      result.mainphoto = angular.isArray(result.mainphoto) ? result.mainphoto.join(",") : result.mainphoto;
      result.$unit = result.unit;
      vm.selectModel2.select = result.cateid;
      vm.brandModel.select = result.brandid;
      setTwoCategorie(result.parentid, result.cateid, result.unit);
      delete result.unit;
      return result;
    }

    vm.uploadModel = {
      config: {
        uploadtype: "productMain",
        title: "商品图片上传"
      },
      handler: function (data) {
        if(data.status == 0 && data.data.length == 1){
          vm.dataBase.mainphoto = data.data[0].url;
        }
      }
    };

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

    vm.uploadHandler = function (data, index) {
      if (data.status == 0) {
        if (angular.isDefined(index)) {
          vm.dataBase.mainphoto[index] = data.data[0].url;
        } else {
          angular.forEach(data.data, function (item) {
            vm.dataBase.mainphoto.push(item.url);
          });
        }
        console.log(vm.dataBase.mainphoto, index);
      }
    };
    vm.removePhotos = function (index) {
      vm.dataBase.mainphoto.splice(index, 1);
    };

    /**
     * 删除属性
     * @param item
     */
    vm.removeItem = function (item, index) {
      vm.dataBase.items.splice(index, 1);
    };

    vm.statusItem = function (item) {
      console.log(item);
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


    /**
     * 格式化 vm.dataBase数据供提交使用
     * @param data
     * @returns {{}}
     */
    function getDataBase(data) {
      var result = angular.copy(data);
      angular.forEach(result.items, function (item) {
        item.skuvalues = angular.toJson(item.skuvalues);
        item.$$stock = _.trim(item.$$stock);
        item.stock = !item.$$stock && item.$$stock != 0 ? null : item.$$stock;
        item.saleprice = computeService.multiply(item.saleprice || 0, 100);
        item.motobrandids = angular.toJson(item.motobrandids);
      });
      /**
       * 防止后台数据出bug end
       */
      if (vm.isChange) {
        _.pick(result, ['parentid', 'brandname', 'productcategory']);
      }
      _.pick(result, ['$unit', '$size']);
      console.log(result);

      return result;
    }

    /**
     * 拦截提交
     * 提交的需要参数全部符合才能为false
     */
    function interception() {
      var result = false;
      if (!vm.dataBase.items.length) {
        cbAlert.alert("需要填写至少选择一个属性");
        return true;
      }
      return result;
    }


    /**
     * 保存并返回
     */
    vm.submitBack = function () {
      saveServer(function(){
        cbAlert.close();
        goto();
      });
    };

    /**
     * 保存并复制新建
     */
    vm.submitNewCopy = function () {
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
      var saleprice = _.filter(vm.dataBase.items, function (item) {
        return !_.isUndefined(item.saleprice);
      });
      if (!saleprice.length) {
        cbAlert.alert("商品属性的属性单价没有填写");
        return true;
      }
      if (saleprice.length !== vm.dataBase.items.length) {
        cbAlert.confirm("商品属性的单价没有全部填写，是否继续？", function (isConfirm) {
          if(isConfirm){
            productGoods.save(getDataBase(vm.dataBase)).then(function (results) {
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
        productGoods.save(getDataBase(vm.dataBase)).then(function (results) {
          if (results.data.status == 0) {
            callback && callback();
          }else{
            cbAlert.error("错误提示", results.data.data);
          }
        });
      }
    }



    function goto() {
      $state.go('product.goods.list', {'page': 1});
    }
  }
})();

