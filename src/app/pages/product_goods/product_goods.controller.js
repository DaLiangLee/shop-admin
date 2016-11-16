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
  function ProductGoodsListController($timeout, $state, $log, productGoods, productGoodsConfig, permissions, preferencenav) {
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
  function ProductGoodsChangeController($state, $log, $timeout, productGoods, preferencenav) {
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
    console.log(vm.isChange);
    productGoods.category().then(function (data) {
      vm.selectModel.store = data.data.data;
    });
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
      config: {
        searchPrefer: true,
        searchParams: "cnname",
        selectDirective: {
          name: "cnname",
          value: "id",
          iamges: "logo"
        }
      },
      select: undefined,
      store: [],
      handler: function (data) {
        vm.dataBase.brandid = data;
        console.log('brandModel', data);
      }
    };
    vm.selectModel2 = {
      config: {
        searchPrefer: true,
        searchParams: "catename",
        selectDirective: {
          name: "catename",
          value: "id"
        }
      },
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
        console.log(data);
        vm.brandModel.store = data.data.data.brand;
        vm.skuData = angular.copy(data.data.data.sku);
        vm.dataBase.attrvalues = data.data.data.attributeset[0].id;
        skuData = angular.copy(data.data.data.sku);
        if(!callback){
          skuQueue = [];
          vm.dataBase.brandid = undefined;
          vm.brandModel.select = undefined;
          vm.skuDataLength = skuData.length - 1;
          vm.dataBase.$size = [];
          vm.dataBase.$size.push(createSkuItem(vm.skuData));
          vm.isAttributesetLoad = true;
        }else{
          vm.skuDataLength = skuData.length;
        }
        callback && callback(data.data.data);
      });
    }

    vm.selectModel = {
      config: {
        searchPrefer: true,
        searchParams: "catename",
        selectDirective: {
          name: "catename",
          value: "id"
        }
      },
      select: undefined,
      store: [],
      handler: function (data) {
        console.log('selectModel', data);
        setTwoCategorie(data, undefined, '请先选择商品类目');
        vm.isAttributesetLoad = false;
        console.log(vm.selectModel2.store);
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
     * 创建一个sku项目
     * @param arr    sku数据列表
     * @param sku    sku属性id
     * @param skuid  sku值id
     * @returns {}   一个对象供view使用
     */
    function createSkuItem(arr, sku, skuid) {
      var result = {
        sku: {
          $config: {
            once: true,
            searchPrefer: true,
            hideSelect: true,
            searchParams: "skuname",
            selectDirective: {
              name: "skuname",
              value: "id"
            }
          },
          select: sku,
          $store: arr || [],
          $handler: function (data) {
            result.skuid.$store = getSkuidItems(arr, data);
            skuQueue.push({
              sku: data,
              skuid: undefined
            });
            _.remove(vm.skuData, function (item) {
              return item.id == data;
            });
          }
        },
        skuid: {
          $config: {
            searchPrefer: true,
            searchParams: "skuvalue",
            selectDirective: {
              name: "skuvalue",
              value: "id"
            }
          },
          select: skuid,
          $store: getSkuidItems(arr, sku),
          $handler: function (data) {
            result.skuid.select = data;
            console.log('selectModel', data);
            _.find(skuQueue, {sku: sku || result.sku.select}).skuid = data;
          }
        }
      };
      return result;
    }
    function getSkuidItems(arr, id){
      return !!getData(arr, id) ? getData(arr, id).items : [];
    }
    /**
     * 设置sku，编辑时候使用
     */
    function setSkuItem(list) {
      var results = [];
      angular.forEach(list, function (item) {
        var sku = _.remove(vm.skuData, {id: item.id});
        results.push(createSkuItem(sku, item.id, item.items[0].id));
        skuQueue.push({
          sku: item.id,
          skuid: item.items[0].id
        });
      });
      return results;
    }

    function getSkuItem(data) {
      if(!angular.isArray(data)){
        throw Error('需要接收一个array类型数据');
      }
      if(!data.length){
        return [];
      }
      var results = [];
      var temp = angular.copy(skuData);
      angular.forEach(data, function (item) {
        if(angular.isDefined(item.sku.select)){
          var items = _.remove(temp, function(n){
            return n.id == item.sku.select;
          })[0];
          _.remove(items.items, function(n){
            return n.id != item.skuid.select;
          });
          results.push(items);
        }
      });
      return results;
    }

    /**
     * 规格添加删除
     * @param index    当前列表索引
     * @param id       当前项的sku
     * @param status   当前是添加还是删除，true是添加，false是删除
     */
    vm.changeSize = function (index, id, status) {
      if (status) {
        // 添加
        if(angular.isObject(skuQueue[index]) && angular.isUndefined(skuQueue[index].skuid)){
          alert('请选择对应的规格值');
          return ;
        }
        vm.dataBase.$size.splice(index + 1, 0, createSkuItem(vm.skuData));
        vm.skuDataLength--;

      } else {
        // 删除
        // 至少要保留一项
        if (vm.dataBase.$size.length < 2) {
          return;
        }
        vm.dataBase.$size.splice(index, 1);
        vm.skuDataLength++;
        _.remove(skuQueue, {sku: id});
        if (vm.skuData.length < skuData.length) {
          angular.isDefined(id) && vm.skuData.push(getData(skuData, id));
        }
      }
    };

    /**
     * 格式化 vm.dataBase数据供提交使用
     * @param data
     * @returns {{}}
     */
    function getDataBase(data) {
      var result = angular.extend({
        skuvalues: getSkuItem(vm.dataBase.$size)
      }, data);
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
       * 防止后台数据出bug
       */
      result.skuvalues.push({});
      vm.isChange && delete result.parentid;
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
      result.$size = setSkuItem(window.eval(result.skuvalues));
      vm.skuDataLength = vm.skuDataLength - result.$size.length;
      result.$unit = result.unit;
      vm.selectModel2.select = result.cateid;
      vm.brandModel.select = result.brandid;
      setTwoCategorie(result.parentid, result.cateid, result.unit);
      delete result.skuvalues;
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
    vm.submit = function (data) {
      if(!skuQueue.length){
        alert('您要至少选择一项规格');
        return ;
      }
      if(!_.every(skuQueue, 'skuid')){
        alert('规格对应的值没有选择');
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

