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

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      removeItem: function (data) {
        $log.debug('removeItem', data);
        if (data.status == -1) {
          vm.message.loadingState = false;
        } else {
          systemRole.remove({id: data.transmit}).then(function (data) {
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
            /**
             * 如果是个对象就去设置权限，防止出错
             */
            if (_.isObject(data.data.data)) {
              permissions.setPermissions(data.data.data);
              if (!permissions.findPermissions(currentState.permission)) {
                vm.message.loadingState = false;
                preferencenav.removePreference(currentState);
                $state.go('desktop.home');
              }
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
      roleItem: function (data) {
        $log.debug('roleItem', data.data);
        if (data.status == -1) {
          vm.message.loadingState = false;
        } else {
          vm.message.loadingState = true;
          var message = "";
          if (data.type == "add") {
            if (_.isEmpty(data.data.data)) {
              message = "添加成功";
            } else {
              message = data.data.data;
            }
            vm.message.config = {
              type: data.data.status,
              message: message
            };
          }
          if (data.type == "edit") {
            if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
              message = "修改成功";
            } else {
              message = data.data.data;
            }
            vm.message.config = {
              type: data.data.status,
              message: message
            };
            /**
             * 如果是个对象就去设置权限，防止出错
             */
            if (_.isObject(data.data.data)) {
              permissions.setPermissions(data.data.data);
              if (!permissions.findPermissions(currentState.permission)) {
                vm.message.loadingState = false;
                preferencenav.removePreference(currentState);
                $state.go('desktop.home');
              }
            }
          }
          getList();
        }
      }
    };

    /**
     * 搜索操作
     *
     */
    vm.gridSearch = {
      'config': {
        searchID: 'staffManages',
        searchParams: $state.params,
        searchDirective: [
          {
            'label': "员工姓名",
            'type': 'text',
            'searchText': "name",
            'placeholder': '员工姓名'
          },
          {
            'label': "账号",
            'type': 'text',
            'searchText': "account",
            'placeholder': '账号名称'
          },
          {
            'label': "角色名称",
            'type': 'select',
            'searchText': "role",
            'placeholder': '角色名称',
            'list': [
              {
                'id': 0,
                'name': '总经理'
              },
              {
                'id': 1,
                'name': '财务'
              },
              {
                'id': 2,
                'name': '运营'
              },
              {
                'id': 3,
                'name': '管理员'
              }
            ]
          }
        ]
      },
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
      systemRole.get(currentParams).then(function (data) {
        if (data.data.status == 0) {
          if (!data.data.data.length && currentParams.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.data.count;
          vm.gridModel.itemList = data.data.data;
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

    //getList();


  }

  /** @ngInject */
  function ProductGoodsChangeController($state, $log, $timeout, productGoods, preferencenav) {
    var vm = this;
    var currentParams = $state.params;
    vm.attributeset = [];
    var skuData = [];
    var removeskuData = [];
    var skuQueue = [];
    vm.isAttributesetLoad = false;
    //  是否是编辑
    vm.isChange = angular.isUndefined(currentParams);
    $log.debug('isChange', vm.isChange);
    vm.dataBase = {};
    if (vm.isChange) {
      //productGoods
    } else {
      vm.dataBase.status = 1;
      vm.dataBase.$unit = '请先选择商品类目';
      vm.dataBase.$size = [];
      vm.dataBase.mainphoto = [];
    }
    productGoods.category().then(function (data) {
      console.log(data);
      vm.selectModel.store = data.data.data;
    });
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
    vm.dataBase.$size = [];
    vm.selectModel2 = {
      config: {
        searchPrefer: true,
        searchParams: "catename",
        selectDirective: {
          name: "catename",
          value: "id"
        }
      },
      catid: undefined,
      store: [],
      handler: function (data) {
        console.log('selectModel', data);
        vm.dataBase.$unit = getData(vm.selectModel2.store, data) && getData(vm.selectModel2.store, data).unit;
        console.log(vm.dataBase.unit);
        vm.dataBase.cateid = data;
        productGoods.attrsku({id: data}).then(function (data) {
          console.log(data);
          vm.brandModel.store = data.data.data.brand;
          vm.skuData = angular.copy(data.data.data.sku);
          vm.dataBase.attrvalues = data.data.data.attributeset[0].id;
          skuData = angular.copy(data.data.data.sku);
          vm.skuDataLength = skuData.length - 1;
          vm.dataBase.$size = [];
          vm.dataBase.$size.push(createSkuItem(vm.skuData));
          vm.isAttributesetLoad = true;
        });
      }
    };

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
        if (!!getData(vm.selectModel.store, data)) {
          vm.selectModel2.store = getData(vm.selectModel.store, data).items;
        } else {
          vm.selectModel2.store = [];
        }
        console.log(vm.selectModel2.store);
      }
    };


    /**
     * 创建一个sku项目
     * @param arr
     * @returns {{sku: {$config: {searchPrefer: boolean, searchParams: string, selectDirective: {name: string, value: string}}, select: undefined, $store: *, $handler: $handler}, skuid: {$config: {searchPrefer: boolean, searchParams: string, selectDirective: {name: string, value: string}}, select: undefined, $store: Array, $handler: $handler}}}
     */
    function createSkuItem(arr, sku, skuid) {
      var shengxia = arr || [];
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
          $store: shengxia,
          $handler: function (data) {
            if (!!getData(arr, data)) {
              result.skuid.$store = getData(arr, data).items;
            } else {
              result.skuid.$store = [];
            }
            _.remove(vm.skuData, function (item) {
              return item.id == data;
            });
            console.log(this);

            // skuQueue.push(data);
            // console.log('skuQueue', skuQueue);
            // console.log('size', vm.dataBase.size);
            shengxia = [];
            angular.forEach(vm.dataBase.$size, function (item) {
              angular.forEach(skuData, function (item2) {
                console.log(item2.id, item.sku.select, data);
                if (!item.sku.select && item2.id != data) {
                  shengxia.push(item2);
                }
                if (item.sku.select && item2.id != data) {
                  shengxia.push(item2);
                }

              });
            });
            // vm.skuData = angular.copy(shengxia);
            console.log('shengxia', shengxia);
            // console.log('removeskuData', vm.skuData);
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
          $store: [],
          $handler: function (data) {
            result.skuid.select = data;
            console.log('selectModel', data);
          }
        }
      };
      return result;
    }

    /**
     * 设置sku，编辑时候使用
     */
    function setSkuItem() {
      createSkuItem(attributeset, 1, 2);
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
        var items = _.remove(temp, function(n){
          return n.id == item.sku.select;
        })[0];
        _.remove(items.items, function(n){
          return n.id != item.skuid.select;
        });
        results.push(items);
      });
      return results;
    }

    /**
     * 规格添加删除
     * @param item
     * @param index
     * @param status
     */
    vm.changeSize = function (index, id, status) {
      if (status) {
        // 添加
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
      result.$unit = undefined;
      result.$size = undefined;
      return result;
    }

    /**
     * 获取编辑数据，生成vm.dataBase数据格式
     * @param data
     * @returns {{}}
     */
    function setDataBase(data) {
      var result = {};
      return result;
    }


    /**
     * 表单提交
     */
    vm.submit = function () {
      productGoods.save(getDataBase(vm.dataBase)).then(function (data) {
        console.log('save', data);
      });
    };
    function goto() {
      preferencenav.removePreference($state.current);
      $state.go('product.goods.list', {'page': 1});
    }
  }
})();

