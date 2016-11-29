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
  function ProductGoodsListController($window, $state, $log, $$utils, productGoods, productGoodsConfig) {
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
      columns: angular.copy(productGoodsConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(productGoodsConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };
    /*productGoods.category().then(function (data) {
      console.log(data.data.data);
    });*/
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
              pskuid: data.removal[0].pskuid
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
              pskuid: data.removal[0].pskuid
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
            pskuid: data.data.skuid,
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

    var config = angular.copy(productGoodsConfig.DEFAULT_SEARCH.config);
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
      productGoods.list(currentParams).then(function (data) {
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
            item.skuvalues = $window.eval(item.skuvalues);
            item.motobrandids = $$utils.getMotorbrandids(item.motobrandids);
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
  function ProductGoodsChangeController($state, $window, $log, $$utils, productGoods, preferencenav, cbAlert) {
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
    productGoods.category().then(function (data) {
      vm.selectModel.store = data.data.data;
    });
    if (vm.isChange) {
      productGoods.edit(currentParams).then(function (data) {
        var edit = data.data.data;
        console.log(edit);
        
        getAttrsku(data.data.data.cateid, function(data){
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
      vm.dataBase.skuvalues = [];
      vm.dataBase.motobrandids = [];
      vm.dataBase.mainphoto = [];
    }

    function getCate(parentid, cateid){
      var str = "",item2;
      var item1 = _.remove(vm.selectModel.store, function(item){
        return item.id == parentid;
      });
      if(item1.length){
        str = item1[0].catename;
        if(item1[0].items.length){
          item2 = _.remove(item1[0].items, function(item){
            return item.id == cateid;
          });
          if(item2.length){
            str += " "+item2[0].catename;
          }
        }

      }
      return str;
    }
    function getBrandname(data, id){
      var item = _.remove(data, function(item){
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
        if(!!getData(vm.selectModel2.store, data)){
          vm.dataBase.$unit = getData(vm.selectModel2.store, data).unit;
        }
        console.log(getData(vm.selectModel2.store, data));
        vm.dataBase.cateid = data;
        getAttrsku(data);
      }
    };

    function getAttrsku(id, callback){
      productGoods.attrsku({id: id}).then(function (data) {
        vm.brandModel.store = data.data.data.brand;
        vm.skuData = angular.copy(data.data.data.sku);
        vm.sizeModel.store = angular.copy(data.data.data.sku);
        vm.dataBase.attrvalues = data.data.data.attributeset[0].id;
        if(!callback){
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
    function setTwoCategorie(id, cateid, unit){
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
      result.productname = encodeURI(result.productname);
      result.abstracts = encodeURI(result.abstracts);
      angular.forEach(result.skuvalues, function (item) {
        item.skuname = encodeURI(item.skuname);
        item.items[0].skuvalue = encodeURI(item.items[0].skuvalue);
      });
      /**
       * 暂时屏蔽 官方指导价（￥）
       * 防止后台出bug
       */
      result.officialprice = 0;
      /**
       * 防止后台数据出bug start
       */
      result.motobrandids.push({});
      result.skuvalues.push({});
      /**
       * 防止后台数据出bug end
       */
      if(vm.isChange){
        delete result.parentid;
        delete result.brandname;
        delete result.productcategory;
      }
      delete result.$unit;
      delete result.$size;
      return result;
    }

    /**
     * 获取编辑数据，生成vm.dataBase数据格式
     * @param data
     * @returns {{}}
     */
    function setDataBase(data) {
      var result = angular.extend({}, data);
      result.mainphoto = [result.mainphoto];
      result.$unit = result.unit;
      vm.selectModel2.select = result.cateid;
      vm.brandModel.select = result.brandid;
      setTwoCategorie(result.parentid, result.cateid, result.unit);
      delete result.unit;
      return result;
    }
    vm.uploadHandler = function (data, index) {
      if(data.status == 0){
        if(angular.isDefined(index)){
          vm.dataBase.mainphoto[index] = data.data[0].url;
        }else{
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
      if(!vm.sizeModel.data.length){
        cbAlert.alert('您要至少选择一项规格');
        return ;
      }
      if(!vm.sizeModel.every){
        cbAlert.alert('规格对应的值没有选择');
        return ;
      }
      if(!vm.dataBase.motobrandids.length){
        cbAlert.alert('您还没有选择适用车型');
        return ;
      }
      productGoods.save(getDataBase(vm.dataBase)).then(function (data) {
        console.log('save', data);
        if(data.data.status == 0){
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

