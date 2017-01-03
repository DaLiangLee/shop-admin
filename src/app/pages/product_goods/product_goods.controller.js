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
  function ProductGoodsListController($state, $timeout, $log, productGoods, productGoodsConfig, cbAlert, categoryGoods) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 5});
    console.log($state.params);
    /**
     * 记录当前子项
     * @type {string}
     */
    var recordChild = "";

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
        var order = angular.extend({}, currentParams, {orders: JSON.stringify(orders)});
        vm.gridModel.requestParams.params = order;
        getList(order);
      },
      selectHandler: function (item) {
        // 拦截用户恶意点击
        recordChild != item.guid && getProductSkus(item.guid);
      }
    };
    categoryGoods.goods().then(function (data) {
      console.log(data.data.data);
    });
    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      currentStatus: currentParams.remove,
      removeItem: function (data) {
        console.log(data);
        if (data.status == 0) {
          productGoods.deleteProduct(data.transmit).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips("删除成功");
            } else {
              cbAlert.error("错误提示", results.data.rtnInfo);
            }
            getList(currentParams);
          }, function (results) {
            $log.debug('removeItemError', results);
          });
        }
      },
      statusItem: function (data) {
        console.log(data);
        if (data.status == 0) {
          var message = data.type === 'removeProduct' ? "商品下架修改成功" : "商品上架修改成功";
          productGoods[data.type](data.transmit).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.tips(message);
            } else {
              cbAlert.error("错误提示", results.data.rtnInfo);
            }
            getList(currentParams);
          }, function (results) {
            $log.debug('statusItemError', results);
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
        placeholder: "请输入商品编码、名称、品牌、零件码、条形码、属性",
        searchDirective: [
          {
            label: "类目",
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
            name: "pcateid1"
          },
          {
            label: "销量",
            name: "salenums",
            all: true,
            custom: true,
            type: "int",
            start: {
              name: "salenums0"
            },
            end: {
              name: "salenums1"
            }
          },
          {
            label: "库存",
            all: true,
            custom: true,
            type: "int",
            name: "stock",
            start: {
              name: "stock0",
              placeholder: ""
            },
            end: {
              name: "stock1",
              placeholder: ""
            }
          },
          {
            label: "价格",
            all: true,
            custom: true,
            type: "money",
            name: "saleprice",
            start: {
              name: "saleprice0",
              placeholder: ""
            },
            end: {
              name: "saleprice1",
              placeholder: ""
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
              placeholder: ""
            },
            end: {
              name: "shelflife1",
              placeholder: ""
            }
          }
        ]
      },
      'handler': function (data) {
        $log.debug(data);
        var search = angular.extend({}, currentParams, data);
        vm.gridModel.requestParams.params = search;
        getList(search);
      }
    };

    /**
     * 表格配置
     */
    vm.gridModel2 = {
      editorhandler: function (data, item, type) {
        console.log(data, item);
        item[type] = data;
        productGoods.updateProductSku(angular.copy(item)).then(function (results) {
          console.log(results);
          if (results.data.status == '0') {
            cbAlert.tips('修改成功');
            getList();
          } else {
            cbAlert.error(results.data.rtnInfo);
          }
        });
      }
    };


    vm.statusItem = function (item) {
      console.log(JSON.stringify(item));
      var tips = item.status === "0" ? '是否确认启用该商品SKU？' : '是否确认禁用该商品SKU？';
      cbAlert.ajax(tips, function (isConfirm) {
        if (isConfirm) {
          item.status = item.status === "0" ? "1" : "0";
          productGoods.updateProductSku(item).then(function (results) {
            if (results.data.status == '0') {
              cbAlert.success('修改成功');
              var statusTime = $timeout(function(){
                cbAlert.close();
                $timeout.cancel(statusTime);
                statusTime = null;
              }, 1200, false);
              getList();
            } else {
              cbAlert.error(results.data.rtnInfo);
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
          recordChild = id;
          vm.items = results.data.data;
        } else {
          cbAlert.error(results.data.rtnInfo);
        }
      });
    }


    // 获取权限列表
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
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
      }, function (data) {
        $log.debug('getListError', data);
      });
    }

    getList(currentParams);

  }

  /** @ngInject */
  function ProductGoodsChangeController($state, $window, $log, categoryGoods, productGoods, preferencenav, cbAlert) {
    var vm = this;
    var currentParams = $state.params;
    vm.attributeset = [];
    vm.isLoadData = false;
    vm.isAttributesetLoad = false;
    //  是否是编辑
    vm.isChange = !_.isEmpty(currentParams);
    $log.debug('isChange', vm.isChange);
    vm.dataBase = {};
    console.log(vm.isChange);
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
      vm.dataBase.mainphoto = [];
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
        if (data.status == 0) {
          vm.dataBase.items.push({
            skuvalues: data.data,
            attrvalues: vm.dataBase.$$attrvalues,
            status: "1",
            $$skuname: getSkuname(data.data)
          });
        }
      }
    };

    function getSkuname(name) {
      var result = "";
      var num = 10;
      if (!name) {
        return name;
      }
      if (angular.isString(name)) {
        name = JSON.parse(name);
      }
      var result = "";
      if (angular.isArray(name)) {
        angular.forEach(name, function (item) {
          result += item.skuname + "/"
        });
      }
      result = result.substring(0, result.length - 1);
      if (result.length > num) {
        result = result.substring(0, num);
        if (result.lastIndexOf("/") === num - 1) {
          result = result.substring(0, result.length - 1);
        }
        result += " 等";
      }
      console.log(result, result.length);

    }


    getSkuname([{
      "guid": 0,
      "id": 12,
      "items": [{"guid": 0, "id": 57, "skuid": 12, "skuvalue": "15寸", "sort": 1}],
      "skuname": "轮胎尺寸",
      "skutype": "text",
      "sort": 0
    }, {
      "guid": 0,
      "id": 14,
      "items": [{"guid": 0, "id": 68, "skuid": 14, "skuvalue": "155", "sort": 1}],
      "skuname": "胎面宽度",
      "skutype": "text",
      "sort": 0
    }, {
      "guid": 0,
      "id": 13,
      "items": [{"guid": 0, "id": 63, "skuid": 13, "skuvalue": "防爆轮胎", "sort": 1}],
      "skuname": "轮胎类型",
      "skutype": "text",
      "sort": 0
    }])

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
        console.log('brandModel', data);
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
        console.log(getData(vm.selectModel2.store, data));
        vm.dataBase.cateid = data;
        getAttrsku(data);
      }
    };

    function getAttrsku(id, callback) {
      productGoods.attrsku({id: id}).then(function (data) {
        console.log(data);
        vm.brandModel.store = data.data.data.brand;
        vm.skuData = angular.copy(data.data.data.sku);
        vm.skuvalues.store = angular.copy(data.data.data.sku);
        vm.dataBase.$$attrvalues = data.data.data.attributeset[0].id;
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
        console.log('selectModel', data);
        setTwoCategorie(data, undefined, '请先选择商品类目');
        vm.isAttributesetLoad = false;
        console.log(vm.selectModel2.store);
      }
    };

    vm.sizeModel = {
      store: [],
      data: [],
      every: undefined,
      handler: function (data) {
        console.log('sizeModel', data);
        vm.sizeModel.every = data.every;
        vm.sizeModel.data = data.data;
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
     * 格式化 vm.dataBase数据供提交使用
     * @param data
     * @returns {{}}
     */
    function getDataBase(data) {
      var result = angular.extend({}, data);
      angular.forEach(result.items, function (item) {
        item.skuvalues = JSON.stringify(item.skuvalues);
        item.stock || (item.stock = -9999);
      });
      /**
       * 防止后台数据出bug end
       */
      if (vm.isChange) {
        delete result.parentid;
        delete result.brandname;
        delete result.productcategory;
      }
      delete result.$unit;
      delete result.$size;
      console.log(JSON.stringify(result));

      return result;
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
     * 表单提交
     */
    vm.submit = function () {
      /*if (!vm.sizeModel.data.length) {
       cbAlert.alert('您要至少选择一项规格');
       return;
       }
       if (!vm.sizeModel.every) {
       cbAlert.alert('规格对应的值没有选择');
       return;
       }
       if (!vm.dataBase.mainphoto.length) {
       cbAlert.alert('您需要上传一张商品图片');
       return;
       }
       if (!vm.dataBase.motobrandids.length) {
       cbAlert.alert('您还没有选择适用车型');
       return;
       }*/
      productGoods.save(getDataBase(vm.dataBase)).then(function (data) {
        console.log('save', data);
        if (data.data.status == 0) {
          goto();
        }
      });
    };
    function goto() {
      preferencenav.removePreference($state.current);
      $state.go('product.goods.list', {'page': 1});
    }
  }
})();

