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
  function ProductGoodsListController($state, $timeout, $log, productGoods, productGoodsConfig, cbAlert, category, computeService) {
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
        !item['$$active'] && item.guid && getProductSkus(item.guid);
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
            if (results.data.status === 0) {
              cbAlert.tips("删除成功");
              currentParams.page = 1;
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
        }
      },
      statusItem: function (data) {
        if (data.status == 0) {
          // var message = data.type === 'removeProduct' ? "商品下架修改成功" : "商品上架修改成功";
          var message = "操作成功";
          productGoods[data.type](data.transmit).then(function (results) {
            if (results.data.status === 0) {
              cbAlert.tips(message);
              currentParams.page = 1;
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
        }
      }
    };
    /**
     * 搜索操作
     */
    vm.searchModel = {
      'handler': function (data) {
        var search = angular.extend({}, currentParams, data);
        search.page = '1';
        // 如果路由一样需要刷新一下
        if (angular.equals(currentParams, search)) {
          $state.reload();
        } else {
          $state.go(currentStateName, search);
        }
      }
    };


    /**
     * 获取筛选类目
     */
    category.goods().then(function (results) {
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
          placeholder: "请输入商品编码、名称、品牌、零件码、条形码、属性",
          model: currentParams.keyword,
          name: "keyword",
          isShow: true
        },
        searchDirective: [
          {
            label: "商品类目",
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
    });

    /**
     * 表格配置
     */
    vm.gridModel2 = {
      editorhandler: function (data, item, type, productid) {
        /**
         * 如果没有修改就不要提交给后台了
         */
        if (type === "stock" && data == item.stock) {
          cbAlert.tips('修改成功');
          return;
        }
        /**
         * 如果没有修改就不要提交给后台了
         */
        if (type === "saleprice" && data == item.saleprice) {
          cbAlert.tips('修改成功');
          return;
        }
        /**
         * 如果超过100万限制则提示
         */
        if (type === "saleprice" && data >= 1000000) {
          cbAlert.warning('零售单价超出100万上限');
          return;
        }
        /**
         * 如果修改是空的，后台返回是空的，表示都是无限
         */
        if (type === "stock" && data === "" && _.isUndefined(item.stock)) {
          cbAlert.tips('修改成功');
          return;
        }
        /**
         * 如果后台返回不是空的，修改是空的，那么就要提示用户
         */
        if (type === "stock" && data === "" && !_.isUndefined(item.stock)) {
          cbAlert.alert('修改的库存不能比当前库存大');
          return;
        }
        /**
         * 修改值不能比后台传过来的值要大
         */
        if (type === "stock" && !_.isUndefined(item.stock) && data > item.stock) {
          cbAlert.alert('修改的库存不能比当前库存大');
          item['$$stock'] = item.stock;
          return;
        }
        if (type === "saleprice") {
          item.saleprice = computeService.multiply(data, 100);
        } else {
          item[type] = data;
        }
        var items = _.pick(item, ['guid', type]);
        items['productid'] = productid;
        productGoods.updateProductSku(items).then(function (results) {
          if (results.data.status === 0) {
            cbAlert.tips('修改成功');
            getList(currentParams);
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }
    };


    vm.statusItem = function (item, productid) {
      var tips = item.status === "0" ? '确定启用该商品属性？' : '确定禁用该商品属性？';
      var msg = item.status === "0" ? '启用后，该属性商品将正常销售。' : '禁用后，该属性商品将无法销售。';
      cbAlert.ajax(tips, function (isConfirm) {
        if (isConfirm) {
          item.status = item.status === "0" ? "1" : "0";
          var items = _.pick(item, ['guid', 'status']);
          items['productid'] = productid;
          productGoods.updateProductSku(items).then(function (results) {
            if (results.data.status === 0) {
              cbAlert.success('操作成功');
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
      }, msg, 'confirm');
    };

    function getProductSkus(id) {
      productGoods.getProductSkus({id: id}).then(function (results) {
        if (results.data.status === 0) {
          results.data.data.items && angular.forEach(results.data.data.items, function (item) {
            item['$$stockShow'] = (_.isEmpty(item.stock) && item.stock !== 0) ? "无限" : item.stock;
            item['$$stock'] = (_.isEmpty(item.stock) && item.stock !== 0) ? "" : item.stock;
            item.saleprice = computeService.pullMoney(item.saleprice);
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
      if (angular.isUndefined(params.remove)) {
        return;
      }
      productGoods.list(params).then(function (data) {
        if (data.data.status === 0) {
          if (!data.data.data.length && params.page * 1 !== 1) {
            $state.go(currentStateName, {page: 1});
          }
          total = data.data.totalCount;
          vm.gridModel.itemList = [];
          angular.forEach(data.data.data, function (item) {
            item['$$stockShow'] = _.isEmpty(item.stock) && isNaN(parseInt(item.stock, 10)) ? "无限" : item.stock;
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
  function ProductGoodsChangeController($q, $state, $filter, utils, category, productGoods, cbAlert, computeService) {
    var vm = this;
    var currentParams = $state.params;
    vm.attributeset = [];
    vm.isLoadData = false;
    vm.isAttributesetLoad = false;
    //  是否是编辑
    vm.isChange = !_.isEmpty(currentParams);
    /**
     * 基本信息数据
     * @type {{}}
     */
    vm.dataBase = {};

    /**
     * 需要返回操作
     * @type {boolean}
     */
    $state.current.backspace = true;

    /**
     * 商品是否不存在
     * @type {boolean}
     */
    vm.isProductExist = undefined;

    /**
     * 步骤状态
     * 0 初始化
     * 1 类目完成
     * 2 名称品牌完成
     * 3 属性完成
     * 4 其他完成
     * 5 全部完成
     * @type {number}
     */
    vm.stepState = 0;
    if (vm.isChange) {
      if (!/^\d{18}$/.test(currentParams.pskuid)) {
        cbAlert.determine("错误提示", '您传递的商品编辑id不对，请输入正确的id', function () {
          $state.current.interceptor = false;
          cbAlert.close();
          goto();
        }, 'error');
        return;
      }
      $q.all([category.goods(), productGoods.getProductSkus({id: currentParams.pskuid})]).then(function (results) {
        if (results[1].data.status === 0) {
          getAttrsku(results[1].data.data.pcateid2, function () {
            // 拦截跳转，防止用户在编辑过程中，误点击其他地方
            $state.current.interceptor = true;
            setDataBase(results[0], results[1].data.data);
          });
          return results;
        } else {
          cbAlert.error("错误提示", results.data.data);
        }
      });


      /*productGoods.getProductSkus({id: currentParams.pskuid}).then(function (results) {
        if (results.data.status === 0) {
          setDataBase(results.data.data);
        } else {
          cbAlert.error("错误提示", results.data.data);
        }
        /!*var edit = data.data.data;
        getAttrsku(data.data.data.pcateid2, function (data) {
          vm.dataBase = setDataBase(edit);
          vm.dataBase.productcategory = getCate(edit.parentid, edit.cateid);
          vm.dataBase.brandname = getBrandname(data.brand, edit.brandid);
          vm.dataBase.motobrandids = edit.motobrandids;
          vm.dataBase.skuvalues = $window.eval(edit.skuvalues);
        });
        vm.isAttributesetLoad = true;
        vm.isLoadData = true;*!/
      });*/
    } else {
      // 拦截跳转，防止用户在编辑过程中，误点击其他地方
      $state.current.interceptor = true;
      vm.isLoadData = true;
      vm.dataBase.$unit = '请先选择商品类目';
      vm.dataBase.mainphoto = "";
      vm.dataBase.items = [];
      vm.dataBase.deleteguid = [];
    }

    var categoryReset = null;

    /**
     * 类目选择数据和结果
     * @type {{handler: ProductGoodsChangeController.category.handler}}
     */
    vm.category = {
      handler: function (data) {
        if (data === "reset") {
          categoryReset = _.cloneDeep(vm.dataBase);
          vm.dataBase.brandid = '';
          vm.dataBase.brandname = '';
          vm.stepState = 1;
        } else if (data === "rollback") {
          vm.dataBase = _.cloneDeep(categoryReset);
          categoryReset = null;
          getAttrsku(vm.dataBase.cateid);
        } else {
          vm.dataBase.pcateid1 = data.id;
          vm.dataBase.pcateid2 = data.items[0].id;
          vm.dataBase.cateid = data.items[0].id;
          getAttrsku(data.items[0].id);
        }

      }
    };

    /**
     * 检查用户是否存在
     * @type {*}
     */
    vm.checkProductName = function () {
      checkProduct();
    };
    vm.brand = {
      handler: function (data) {
        vm.dataBase.brandid = data.brandid;
        vm.dataBase.brandname = data.brandname;
        checkProduct();
      }
    };

    /**
     * 存储商品检查是否存在的值
     * @type {null}
     */
    var productExistValus = null;

    /**
     * 检查商品是否存在，存在条件，pcateid2， productname, brandname一样
     */
    function checkProduct() {
      /**
       * 获取需要提交字段
       * @type {*}
       */
      var data = _.pick(vm.dataBase, ['pcateid2', 'productname', 'brandname']);
      /**
       * 判断商品名称和品牌名称是否有，如果没有就不去检查
       */
      if (_.isEmpty(data.productname) || _.isEmpty(data.brandname)) {
        return;
      }
      /**
       * 判断是否一样，如果一样，就不需要提交检查，减少api请求
       */
      if (_.eq(data, productExistValus)) {
        return;
      }
      productGoods.checkProduct(data).then(function (results) {
        if (results.data.status === 0) {
          vm.isProductExist = undefined;
          productExistValus = data;
          if (!vm.dataBase.items.length) {
            addItemInit();
          }
          vm.stepState = 3;
        } else {
          if (vm.isChange && currentParams.pskuid === results.data.guid) {
            vm.isProductExist = undefined;
            productExistValus = data;
            if (!vm.dataBase.items.length) {
              addItemInit();
            }
            vm.stepState = 3;
          } else {
            vm.isProductExist = {
              msg: results.data.data,
              guid: results.data.guid
            };
            productExistValus = null;
          }
        }
      });
    }

    /**
     * 如果商品一样，用户需要跳转到对应的编辑页面
     */
    vm.goProductEdit = function () {
      $state.current.interceptor = false;
      $state.go('product.goods.edit', {'pskuid': vm.isProductExist.guid});
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
        return !_.isNumber(item.saleprice) && _.isEmpty(item.saleprice);
      });
      var manualskuvalues = _.filter(vm.dataBase.items, function (item) {
        return _.isEmpty(item.manualskuvalues);
      });
      if (saleprice.length || manualskuvalues.length) {
        cbAlert.warning("警告提示", "您的名称或零售单价未填写");
        return;
      }
      _.forEach(vm.dataBase.items, function (item) {
        item.$folded = false;
        item.$stockshow = utils.isEmpty(item.$stock) ? "无限" : item.$stock;
      });
      addItemInit();
    };

    /**
     * 添加初始化
     */
    function addItemInit() {
      vm.dataBase.items.push({
        '$folded': true,
        'sortsku': vm.dataBase.items.length,
        'status': '1',
        'attrvalues': vm.dataBase.pcateid1
      });
    }

    /**
     * 根据索引删除某个属性
     * @param item 当前项
     * @param $index 当前索引
     */
    vm.removeItem = function (item, $index) {
      cbAlert.confirm("确定删除该属性？", function (isConfirm) {
        if (isConfirm) {
          var remove = vm.dataBase.items.splice($index, 1);
          vm.dataBase.deleteguid.push(remove[0].guid);
          _.forEach(vm.dataBase.items, function (item, index) {
            item.sortsku = index;
          });
        }
        cbAlert.close();
      }, "删除以后不能恢复，您确定要删除？", "confirm");
    };

    /**
     * 改变当前属性状态
     * @param item 当前项
     */
    vm.statusItem = function (item) {
      var messages = [
        {
          title: "确定启用该属性？",
          content: "启用后，该属性商品将正常销售。"
        },
        {
          title: "确定禁用该属性？",
          content: "禁用后，该属性商品将无法销售。"
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
    vm.toggleItem = function (item) {
      if (item.$folded) {
        var data = _.pick(item, ['saleprice', 'manualskuvalues']);
        if (_.isUndefined(data.manualskuvalues) || _.isUndefined(data.saleprice)) {
          cbAlert.warning("警告提示", "您的名称或零售单价未填写");
          return;
        }
        item.$stockshow = utils.isEmpty(item.$stock) ? "无限" : item.$stock;
      }
      item.$folded = !item.$folded;
    };

    /**
     * 更改库存
     * @param item
     */
    vm.changeStock = function (item) {
      // 已结添加过了
      if (item.guid) {
        if (item.$stock > item.stock) {
          cbAlert.warning("警告提示", "修改的库存不能比当前库存大");
          item.$stock = item.stock;
        }
      }
    };

    /**
     * 排序
     * @param item
     * @param index
     * @param dir
     */
    vm.sortItem = function (item, index, dir) {
      if(dir === -1 && index === 0 || dir === 1 && index === vm.dataBase.items.length - 1){
        return ;
      }
      moveItme(item, index + dir, index);
    };

    /**
     * 拖拽
     * @param data     返回目标索引和当前索引
     */
    vm.dragItem = function(data){
      var item = vm.dataBase.items[data.currentIndex];
      moveItme(item, data.targetIndex, data.currentIndex);
    };

    /**
     * 移动当前项到目标位置，目标项移动到当前位置
     * @param item          当前项
     * @param targetIndex   目标索引
     * @param currentIndex  当前位置
     */
    function moveItme(item, targetIndex, currentIndex){
      var replaceItem = vm.dataBase.items.splice(targetIndex, 1, item);
      vm.dataBase.items.splice(currentIndex, 1, replaceItem[0]);
      _.forEach(vm.dataBase.items, function (item, index) {
        item.sortsku = index;
      });
    }

    /**
     * 属性相关操作结束
     *********************************************************************************************************
     */


    /**
     * 属性添加
     * @type {{}}
     */
    vm.skuvalues = {
      store: [],
      handler: function (data) {
        if (data.status == 0 && data.data.length > 0) {
          vm.dataBase.items.push({
            skuvalues: data.data,
            attrvalues: vm.dataBase['$$attrvalues'],
            status: "1",
            '$$skuname': $filter('skuvaluesFilter')(data.data)
          });
        }
      }
    };


    /**
     * 获取品牌
     * @param id
     * @param callback
     */
    function getAttrsku(id, callback) {
      productGoods.attrsku({id: id}).then(function (results) {
        if (results.data.status === 0) {
          return results.data.data;
        } else {
          cbAlert.error("错误提示", results.data.data);
        }
      }).then(function (data) {
        vm.brand.store = data.brand;
        vm.stepState = 2;
        callback && callback(data.data);
      });
    }

    /**
     * 获取编辑数据，设置vm.dataBase数据
     * @param categoryGoods    类目
     * @param getProductSkus   后台返回数据
     */
    function setDataBase(categoryGoods, getProductSkus) {
      var category = getCategory(categoryGoods, getProductSkus);
      vm.dataBase = getProductSkus;
      vm.dataBase.catename2 = category.items[0].catename;
      _.forEach(vm.dataBase.items, function (item, index) {
        item.skuvalues = angular.fromJson(item.skuvalues);
        item.motobrandids = angular.fromJson(item.motobrandids);
        item.saleprice = computeService.pullMoney(item.saleprice);
        item.$folded = false;
        item.sortsku = index;
        item.$stock = item.stock;
        item.$stockshow = utils.isEmpty(item.$stock) ? "无限" : item.$stock;
      });
      if (!_.isUndefined(vm.dataBase.cnname)) {
        vm.dataBase.brandname = vm.dataBase.cnname;
      }
      vm.dataBase.deleteguid = [];
      vm.stepState = 6;
      vm.isLoadData = true;
    }

    /**
     * 根据后台返回的数据获取类目
     * @param categoryGoods
     * @param getProductSkus
     */
    function getCategory(categoryGoods, getProductSkus) {
      return _.chain(_.cloneDeep(categoryGoods))
        .find(function (item) {
          return item.id * 1 === getProductSkus.pcateid1 * 1;
        })
        .tap(function (items) {
          var item = _.find(items.items, function (item) {
            return item.id * 1 === getProductSkus.pcateid2 * 1;
          }) || [];
          items.items = [];
          items.items[0] = item;
          return items;
        })
        .value();
    }

    vm.uploadModel = {
      config: {
        uploadtype: "productMain",
        title: "商品图片上传"
      },
      handler: function (data) {
        if (data.status == 0 && data.data.length == 1) {
          vm.dataBase.mainphoto = data.data[0].url;
        }
      }
    };

    vm.unitHandler = function (data) {
      vm.dataBase.unit = data;
    };


    /**
     * 选择车辆
     * @param data
     * @param item
     */
    vm.vehicleSelect = function (data, item) {
      if (data.status == 0) {
        item.motobrandids = data.data;
      }
    };

    /**
     * 编辑车辆
     * @param data
     * @param item
     */
    vm.vehicleShow = function (data, item) {
      if (data.status == 0) {
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
      }
    };
    vm.removePhotos = function (index) {
      vm.dataBase.mainphoto.splice(index, 1);
    };


    /**
     * 格式化 vm.dataBase数据供提交使用
     * @param data
     * @returns {{}}
     */
    function getDataBase(data) {
      var result = angular.copy(data);
      _.remove(result.items, function (item) {
        return _.isUndefined(item.saleprice);
      });
      _.forEach(result.items, function (item) {
        item.productid = result.guid;
        item.skuvalues = angular.toJson(item.skuvalues);
        item['$stock'] = _.trim(item['$stock']);
        item.stock = !item['$stock'] && item['$stock'] !== 0 ? null : item['$stock'];
        item.saleprice = computeService.pushMoney(item.saleprice);
      });
      result.shelflife = isNaN(parseInt(result.shelflife, 10)) ? undefined : result.shelflife;
      result.remove = !_.filter(result.items, {'status': '1'}).length ? 1 : 0;
      result.deleteguid = _.compact(result.deleteguid).join(",");
      if (vm.isChange) {
        _.pick(result, ['parentid', 'productcategory']);
      }
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
      // 车辆属性名称(填写)
      var manualskuvalues = _.filter(vm.dataBase.items, function (item) {
        return _.isEmpty(item.manualskuvalues);
      });
      if (manualskuvalues.length) {
        cbAlert.alert("商品属性的名称没有填写");
        return true;
      }
      return result;
    }


    /**
     * 保存并返回
     */
    vm.submitBack = function () {
      saveServer(function () {
        cbAlert.close();
        goto();
      });
    };

    /**
     * 保存并复制新建
     */
    vm.submitNewCopy = function () {
      saveServer(function () {
        cbAlert.tips("保存成功，请继续添加");
        if (vm.isChange) {
          $state.go('product.goods.add');
        } else {
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
      var saleprice = _.filter(vm.dataBase.items, function (item) {
        return !_.isUndefined(item.saleprice);
      });
      if (!saleprice.length) {
        cbAlert.alert("请填写零售单价");
        return true;
      }
      // if (saleprice.length !== vm.dataBase.items.length) {
      //   cbAlert.confirm("商品属性的单价没有全部填写，是否继续？", function (isConfirm) {
      //     if (isConfirm) {
      //       productGoods.save(getDataBase(vm.dataBase)).then(function (results) {
      //         if (results.data.status === 0) {
      //           $state.current.interceptor = false;
      //           callback && callback();
      //         } else {
      //           cbAlert.error("错误提示", results.data.data);
      //         }
      //       });
      //     } else {
      //       cbAlert.close();
      //     }
      //   }, "如果没有填写价格的属性将被删除", "warning");
      // } else {
      productGoods.save(getDataBase(vm.dataBase)).then(function (results) {
        if (results.data.status === 0) {
          $state.current.interceptor = false;
          callback && callback();
        } else {
          cbAlert.error("错误提示", results.data.data);
        }
      });
      // }
    }

    function goto() {
      $state.go('product.goods.list', {'page': 1});
    }
  }
})();

