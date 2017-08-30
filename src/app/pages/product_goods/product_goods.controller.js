/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ProductGoodsListController', ProductGoodsListController)
        .controller('ProductGoodsViewController', ProductGoodsViewController)
        .controller('ProductGoodsChangeController', ProductGoodsChangeController);

    /** @ngInject */
    function ProductGoodsListController($state, productGoods, cbAlert, category, storageListAndView) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = angular.extend({}, $state.params, { pageSize: 15 });

        var total = 0;
        var storage = null;

        /**
         * 表格配置
         */
        vm.gridModel = {
            /*  config: angular.copy(productGoodsConfig.DEFAULT_GRID.config),
              requestParams: {
                params: currentParams,
                request: "product,goods,excelProduct",
                permission: "shopapp:store:product:goods:export"
              },
              columns: angular.copy(productGoodsConfig.DEFAULT_GRID.columns),*/
            requestParams: {
                params: currentParams
            },
            itemList: [],
            loadingState: true, // 加载数据
            pageChanged: function(data) { // 监听分页
                var page = angular.extend({}, currentParams, { page: data });
                $state.go(currentStateName, page);
            },
            paginationInfo: { // 分页配置信息
                maxSize: 5,
                showPageGoto: true
            },
            sortReverse: {},
            sortChanged: function(data) {
                var orders = [];
                angular.forEach(data.data, function(item, key) {
                    orders.push({
                        "field": key,
                        "direction": item
                    });
                });
                var order = angular.extend({}, currentParams, { orders: angular.toJson(orders) });
                vm.gridModel.requestParams.params = order;
                getList(order);
            },
            serverSortHandler: function(name, data) {

                    var result = {};
                    result[name] = data[name] ? "ASC" : "DESC";
                    this.sortChanged({
                        name: name,
                        data: result
                    });
                    data[name] = !data[name];
                }
                /*selectHandler: function (item) {
                  // 拦截用户恶意点击
                  !item['$$active'] && item.guid && getProductSkus(item.guid);
                }*/
        };

        /**
         * 导出 配置
         */
        vm.propsParams = {
            requestParams: {
                params: currentParams,
                request: "product,goods,excelProduct"
            }
        };

        /**
         * 切换模式 视图 列表
         * @param mode
         */
        vm.switchMode = function(mode, guid) {
            if (!mode || !vm.gridModel.itemList.length) {
                return false;
            }
            storageListAndView.set(storage);
            if (guid) {
                currentParams.productid = guid;
            } else {
                currentParams.productid = vm.gridModel.itemList[0].guid;
            }
            $state.go('product.goods.' + mode, currentParams);
        };

        /*vm.gridModel.config.propsParams = {
          requestParams: {
            params: currentParams,
            request: "trade,order,excelorders"
          },
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
        };*/

        /**
         * 搜索操作
         */
        vm.searchModel = {
            'handler': function(data) {
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
        category.goods().then(function(results) {
            var items = [];
            _.forEach(results, function(item) {
                items.push({
                    id: item.id,
                    label: item.catename
                });
            });
            var productsStatus = [{
                    "label": "在售",
                    id: 0
                },
                {
                    "label": "停售",
                    id: 1
                }
            ];
            vm.searchModel.config = {
                other: currentParams,
                productsStatus: productsStatus,
                keyword: {
                    placeholder: "请输入商品编码、名称、品牌、零件码、条形码、属性",
                    model: currentParams.keyword,
                    name: "keyword",
                    isShow: true
                },
                searchDirective: [{
                        label: "状态",
                        all: true,
                        type: "list",
                        name: "remove",
                        list: productsStatus,
                        model: currentParams.remove
                    },
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
         * 上架 下架 商品
         * @param item
         */
        vm.switchRemove = function(item) {
            var type = item.remove === '0' ? "removeProduct" : "resetRemoveProduct";
            var message = "操作成功";
            var tips = [{
                    title: "确定下架该商品？",
                    content: ""
                        // content: "下架后，该商品将无法销售。"
                },
                {
                    title: "确定上架该商品？",
                    content: ""
                        // content: "上架后，该商品将正常销售。"
                }
            ];
            var status = tips[item.remove];
            cbAlert.confirm(status.title, function(isConfirm) {
                if (isConfirm) {
                    productGoods[type]([item.guid]).then(function(results) {
                        if (results.data.status === 0) {
                            cbAlert.tips(message);
                            currentParams.page = 1;
                            getList(currentParams);
                        } else {
                            cbAlert.error("错误提示", results.data.data);
                        }
                    });
                } else {
                    cbAlert.close();
                }
            }, status.content, "confirm")

            /*productGoods[type]([item.guid]).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips(message);
                currentParams.page = 1;
                getList(currentParams);
              } else {
                cbAlert.error("错误提示", results.data.data);
              }
            });*/
        };



        // 获取权限列表
        function getList(params) {
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            /*if (angular.isUndefined(params.remove)) {
              return;
            }*/
            console.log('aaa', params);
            vm.currentPage = params.page; // 保存商品所在的页码
            productGoods.list(params).then(function(data) {
                if (data.data.status === 0) {
                    if (!data.data.data.length && params.page * 1 !== 1) {
                        $state.go(currentStateName, { page: vm.currentPage });
                    }
                    total = data.data.totalCount;
                    vm.gridModel.itemList = [];
                    angular.forEach(data.data.data, function(item) {
                        // console.log('111', item);
                        item['$$stockShow'] = _.isEmpty(item.stock) && isNaN(parseInt(item.stock, 10)) ? "无限" : item.stock;
                        item.$createtime = item.createtime.slice(0, 10);
                        item.$statusText = item.remove === '0' ? '在售' : '停售';
                        item.$switchText = item.remove === '0' ? '下架' : '上架';
                        vm.gridModel.itemList.push(item);
                    });

                    vm.gridModel.paginationinfo = {
                        page: params.page * 1,
                        pageSize: params.pageSize,
                        total: total
                    };
                    vm.gridModel.loadingState = false;
                    !vm.gridModel.itemList.length && (vm.items = undefined);
                    // vm.gridModel.itemList[0] && getProductSkus(vm.gridModel.itemList[0].guid);
                }
            });
        }

        getList(currentParams);

    }

    /** @ngInject */
    function ProductGoodsViewController($state, $timeout, productGoods, $scope, $document, cbAlert, category, computeService, storageListAndView, utils) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = angular.extend({}, $state.params, { pageSize: 15 });
        var total = 0;
        var storage = null;

        var AVATAR_OSS_REGULAR = /^http:\/\/|https:\/\//;

        /*
    /!**
     * 需要保存列表和视图切换
     * @type {boolean}
     *!/
    $state.current.listAndView = "order";

*/
        vm.isShowMore = function() {
            var defaultParams = ['productid', 'page', 'pageSize'];
            var params = [];
            _.forEach(currentParams, function(value, key) {
                !_.isUndefined(value) && params.push(key);
            });
            return _.isEqual(defaultParams.sort(), params.sort())
        };

        /**
         * 获取筛选类目
         */
        category.goods().then(function(results) {
            var items = [];
            _.forEach(results, function(item) {
                items.push({
                    id: item.id,
                    label: item.catename
                });
            });
            var productsStatus = [{
                    "label": "在售",
                    id: 0
                },
                {
                    "label": "停售",
                    id: 1
                }
            ];
            vm.searchModel.config = {
                other: currentParams,
                productsStatus: productsStatus,
                keyword: {
                    placeholder: "请输入商品编码、名称、品牌、零件码、条形码、属性",
                    model: currentParams.keyword,
                    name: "keyword",
                    isShow: true,
                    isShowmore: vm.isShowMore()
                },
                searchDirective: [{
                        label: "状态",
                        all: true,
                        type: "list",
                        name: "remove",
                        list: productsStatus,
                        model: currentParams.remove
                    },
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
         * 搜索操作
         */
        vm.searchModel = {
            'handler': function(data) {
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
         * 切换模式
         * @param mode
         */
        vm.switchMode = function(mode) {
            if (!mode) {
                return false;
            }
            storageListAndView.set(storage);
            $state.go('product.goods.' + mode, currentParams);
        };

        /**
         * 商品上下架
         * @param item
         */
        vm.switchRemove = function(item) {
            var removeStatus = item.remove;
            var type = item.remove === '0' ? "resetRemoveProduct" : "removeProduct";
            var message = "操作成功";
            var tips = [{
                    title: "确定上架该商品？",
                    content: ""
                        // content: "上架后，该商品将正常销售。"
                },
                {
                    title: "确定下架该商品？",
                    content: ""
                        // content: "下架后，该商品将无法销售。"
                }
            ];
            var status = tips[item.remove];
            cbAlert.confirm(status.title, function(isConfirm) {
                if (isConfirm) {
                    productGoods[type]([item.guid]).then(function(results) {
                        if (results.data.status === 0) {
                            cbAlert.tips(message);
                            getProductSkus(item.guid);
                        } else {
                            cbAlert.error("错误提示", results.data.data);
                        }
                    });
                } else {
                    item.remove = item.remove === '0' ? '1' : '0';
                    cbAlert.close();
                    return false;
                }
            }, status.content, "confirm");

            /*productGoods[type]([item.guid]).then(function (results) {
              if (results.data.status === 0) {
                cbAlert.tips(message);
                // currentParams.page = 1;
                // getList(currentParams);
                getProductSkus(item.guid);
              } else {
                cbAlert.error("错误提示", results.data.data);
              }
            });*/
        };

        /**
         * sku的启用停用
         * @param item
         * @param productid
         */
        vm.statusItem = function(item, productid) {
            var tips = item.status === "0" ? '确定启用该商品规格？' : '确定禁用该商品规格？';
            var msg = item.status === "0" ? '启用后，该属性商品将正常销售。' : '禁用后，该属性商品将无法销售。';
            cbAlert.ajax(tips, function(isConfirm) {
                if (isConfirm) {
                    item.status = item.status === "0" ? "1" : "0";
                    var items = _.pick(item, ['guid', 'status']);
                    items['productid'] = productid;
                    productGoods.updateProductSku(items).then(function(results) {
                        if (results.data.status === 0) {
                            cbAlert.tips('操作成功');
                            /*  var statusTime = $timeout(function () {
                                cbAlert.close();
                                $timeout.cancel(statusTime);
                                statusTime = null;
                              }, 1200, false);*/
                            if (items.status === '1') { // 如果这个为1，则商品为上架状态
                                vm.productDetails.remove = '0';
                            } else {
                                var productItem = _.find(vm.productDetails.items, function(item) {
                                    return item.status === '1'
                                });
                                if (!productItem) { // 如果没有找到启用的sku 则商品为下架状态
                                    vm.productDetails.remove = '1';
                                }
                            }
                        } else {
                            cbAlert.error(results.data.data);
                        }
                    });
                } else {
                    cbAlert.close();
                }
            }, msg, 'confirm');
        };


        /**
         * 表格配置
         */
        vm.gridModel = {
            itemList: [],
            loadingState: true, // 加载数据
            pageChanged: function(data) { // 监听分页
                var page = angular.extend({}, currentParams, { page: data });
                storageListAndView.remove();
                $state.go(currentStateName, page);
            },
            selectHandler: function($event, item) { //  点击列表显示详情
                // 拦截用户恶意点击
                if (item['$$active']) {
                    return false;
                }
                _.forEach(vm.gridModel.itemList, function(term) {
                    term['$$active'] = false;
                });
                item['$$active'] = true;
                console.log('iii', item);
                if (item.guid) {
                    currentParams.productid = item.guid;
                    vm.skusalenum = item.skusalenum;
                    vm.stock = item.stock;
                    console.log('select', currentParams);
                    storageListAndView.set(storage);
                    getProductSkus(currentParams.productid);
                }
            }
        };


        /**
         * 表格配置
         */
        vm.gridModel2 = {
            editorhandler: function(data, item, type, productid) {
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
                if (type === "saleprice") {
                    item.saleprice = computeService.multiply(data, 100);
                } else {
                    item[type] = data;
                }

                var items = _.pick(item, ['guid', type]);
                items['productid'] = productid;
                currentParams.productid = productid;
                if (items.stock == '') {
                    cbAlert.warning("警告提示", "库存不能修改为为空");
                    return false;
                }
                productGoods.updateProductSku(items).then(function(results) {
                    if (results.data.status === 0) {
                        cbAlert.tips('修改成功');
                        getProductSkus(productid)
                    } else {
                        cbAlert.error(results.data.data);
                    }
                });
            }
        };

        // 视图页面 选车
        vm.vehicleShow = function(data, item, productid) {
            if (data.status == 0) {
                if (item.motobrandids == angular.toJson(data.data)) {
                    return;
                }
                item.motobrandids = data.data;
                var params = {
                    guid: item.guid,
                    motobrandids: angular.toJson(data.data),
                    productid: productid
                };
                productGoods.updateProductSku(params).then(function(results) {
                    if (results.data.status === 0) {
                        cbAlert.tips('修改成功');
                        getProductSkus(productid);
                    } else {
                        cbAlert.error(results.data.data);
                    }
                });
            }
        };

        /*
         * 控制编辑适用车型下拉框的显示与隐藏
         * */
        vm.showSelectDrop = false;
        vm.showdrop = function(item, event) {
            vm.showSelectDrop = true;
            event.stopPropagation();
            _.forEach(vm.productDetails.items, function(v) {
                v.$current = false;
            });
            item.$current = true;
        };
        // 处理点击非当前位置，都会收起
        $document.on('click', function() {
            $scope.$apply(function() {
                vm.showSelectDrop = false;
            });
        });

        /**
         * 获取单位skus
         */
        function getProductSkus(id) {
            productGoods.getProductSkus({ id: id }).then(function(results) {
                if (results.data.status === 0) {
                    vm.stock = 0; // 请求sku时， 先将库存设置为0 方便后面的计算
                    results.data.data.items && angular.forEach(results.data.data.items, function(item) {


                        if (!_.isUndefined(item.stock)) { // 计算库存
                            vm.stock += item.stock * 1;
                        }

                        item['$$stockShow'] = (_.isEmpty(item.stock) && item.stock !== 0) ? "无限" : item.stock;
                        item['$$stock'] = (_.isEmpty(item.stock) && item.stock !== 0) ? "" : item.stock;
                        item.saleprice = item.saleprice ? computeService.pullMoney(item.saleprice) : 0; // 如果售价为0，这里处理一下
                        item.salenums = _.isUndefined(item.salenums) ? 0 : item.salenums;
                        item.motobrandids = angular.fromJson(item.motobrandids);
                    });
                    vm.productDetails = results.data.data;
                    _.forEach(vm.productDetails.items, function(v) {
                        v.motorsList = angular.fromJson(v['motobrandids']);
                        v.$current = false;
                        _.forEach(v.motorsList, function(v) {
                            // v.brand.logo = "http://shop.cb.cn" + v.brand.logo;
                            if (!AVATAR_OSS_REGULAR.test(v.brand.logo)) {
                                // item.avatar = "";
                                v.brand.logo = utils.getImageSrc(v.brand.logo, "logo");
                            }
                        })
                    });

                } else {
                    cbAlert.error(results.data.data);
                }
            });
        }

        // 获取权限列表
        function getList(params) {

            productGoods.list(params).then(function(data) {
                /**
                 * 路由分页跳转重定向有几次跳转，先把空的选项过滤
                 */
                if (!params.page) {
                    return;
                }

                if (data.data.status === 0) {
                    if (!data.data.data.length && params.page * 1 !== 1) {
                        $state.go(currentStateName, { page: 1 });
                    }
                    total = data.data.totalCount;
                    vm.gridModel.itemList = [];
                    angular.forEach(data.data.data, function(item) {
                        /*  console.log('111', item);
                          item['$$stockShow'] = _.isEmpty(item.stock) && isNaN(parseInt(item.stock, 10)) ? "无限" : item.stock;
                          item.$createtime = item.createtime.slice(0, 10);
                          item.$statusText = item.remove == 0 ? '在售' : '停售';
                          item.$switchText = item.remove == 0 ? '下架' : '上架';*/
                        vm.gridModel.itemList.push(item);
                    });

                    vm.gridModel.paginationinfo = {
                        page: params.page * 1,
                        pageSize: params.pageSize,
                        total: total
                    };
                    vm.gridModel.loadingState = false;
                    !vm.gridModel.itemList.length && (vm.items = undefined);

                    if (vm.gridModel.itemList) {
                        var item = _.find(vm.gridModel.itemList, function(item) {
                            return item.guid === params.productid;
                        });
                        console.log('item LIST', item);
                        if (!_.isUndefined(item)) {
                            vm.skusalenum = item['skusalenum']; // 商品的销量

                            // vm.stock = item['stock']; // 商品的库存
                            item['$$active'] = true;
                            getProductSkus(params.productid);
                        } else {
                            console.log('999', vm.gridModel.itemList);
                            vm.skusalenum = vm.gridModel.itemList[0]['skusalenum']; // 商品的销量
                            // vm.stock = vm.gridModel.itemList[0]['stock']; // 商品的库存
                            vm.gridModel.itemList[0]['$$active'] = true;
                            getProductSkus(vm.gridModel.itemList[0].guid);
                        }
                    }
                }
            });
        }

        getList(currentParams);


    }































    /** @ngInject */
    function ProductGoodsChangeController($q, $state, $filter, utils, category, productGoods, cbAlert, computeService, $document, $scope) {
        var vm = this;
        var currentParams = $state.params;
        vm.attributeset = [];
        vm.isLoadData = false;
        vm.isAttributesetLoad = false;
        vm.isEditProduct = false; // 是否是在编辑商品页面 用于隐藏商品类目中 '编辑' 2个字
        vm.isReselectCate = false; // 是否是重选类目 用于是否清空商品品牌
        vm.isUnitInputFocused = false; // 是否点击了单位的输入框
        vm.isOpenCateList = false; // 是否打开商品类目的列表
        vm.isAddButtonClicked = false; // 是否点击了 '添加规格' 按钮
        //  是否是编辑
        vm.isChange = !_.isEmpty(currentParams);

        var AVATAR_OSS_REGULAR = /^http:\/\/|https:\/\//; // 车图标匹配正则
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
                cbAlert.determine("错误提示", '您传递的商品编辑id不对，请输入正确的id', function() {
                    $state.current.interceptor = false;
                    cbAlert.close();
                    goto();
                }, 'error');
                return;
            }
            $q.all([category.goods(), productGoods.getProductSkus({ id: currentParams.pskuid })]).then(function(results) {
                if (results[1].data.status === 0) {
                    getAttrsku(results[1].data.data.pcateid2, function() {
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

        // var categoryReset = null;

        /**
         * 类目选择数据和结果
         * @type {{handler: ProductGoodsChangeController.category.handler}}
         */
        vm.category = {
            handler: function(data) {

                console.log('222', data);
                var pcate = data[0];
                vm.stepState = data[1];
                vm.dataBase.pcateid1 = pcate.parentid;
                vm.dataBase.pcateid2 = pcate.items[0].id;
                vm.dataBase.cateid = pcate.items[0].id;
                vm.dataBase.catename = pcate.parentCatename;
                vm.dataBase.catename2 = pcate.catename;
                getAttrsku(pcate.items[0].id);

                if (data.length === 3) { // 表示重选
                    vm.isReselectCate = true;
                    vm.dataBase.brandid = '';
                    vm.dataBase.brandname = '';
                    console.log('000', vm.dataBase);
                    vm.stepState = 2;
                }

                /*if (data === "reset") {
                  categoryReset = _.cloneDeep(vm.dataBase);
                  vm.dataBase.brandid = '';
                  vm.dataBase.brandname = '';
                  vm.stepState = 1;
                } else if (data === "rollback") {
                  vm.dataBase = _.cloneDeep(categoryReset);
                  categoryReset = null;
                  getAttrsku(vm.dataBase.cateid);
                } else {
                  console.log('222', data);
                  var pcate = data[0];
                  vm.stepState = data[1];
                  vm.dataBase.pcateid1 = pcate.parentid;
                  vm.dataBase.pcateid2 = pcate.items[0].id;
                  vm.dataBase.cateid = pcate.items[0].id;
                  vm.dataBase.catename = pcate.parentCatename;
                  vm.dataBase.catename2 = pcate.catename;
                  getAttrsku(pcate.items[0].id);
                  /!*vm.dataBase.pcateid1 = data.parentid;
                  vm.dataBase.pcateid2 = data.items[0].id;
                  vm.dataBase.cateid = data.items[0].id;
                  vm.dataBase.catename = data.parentCatename;
                  vm.dataBase.catename2 = data.catename;
                  getAttrsku(data.items[0].id);*!/
                }*/

            }
        };

        /**
         * 选择商品单位
         * @param $event
         */
        vm.focusUnitInput = function($event) {
            $event.stopPropagation();
            vm.isUnitInputFocused = true;
        };
        $document.on('click', function() {
            vm.isUnitInputFocused = false;
        });
        vm.unitHandler = function(data) {
            vm.dataBase.unit = data;
        };

        /**
         * 检查用户是否存在
         * @type {*}
         */
        vm.checkProductName = function() {
            checkProduct();
        };
        vm.brand = {
            handler: function(data) {
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
            if (vm.stepState === 0 || _.isEmpty(data.productname) || _.isEmpty(data.brandname)) {
                return;
            }
            /**
             * 判断是否一样，如果一样，就不需要提交检查，减少api请求
             */
            if (_.eq(data, productExistValus)) {
                return;
            }
            productGoods.checkProduct(data).then(function(results) {
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
        vm.goProductEdit = function() {
            $state.current.interceptor = false;
            $state.go('product.goods.edit', { 'pskuid': vm.isProductExist.guid });
        };

        /**
         * 选择商品类目相关
         */
        vm.openCateList = function($event) {
            $event.stopPropagation();
            vm.isOpenCateList = true;
        };
        vm.reselect = function($event) {
            $event.stopPropagation();
            vm.isOpenCateList = true;
        };
        $document.on('click', function() {
            vm.isOpenCateList = false;
        });

        /**
         * 属性相关操作开始
         *********************************************************************************************************
         */

        /**
         * 计算合法skus (规格和零售单价填写了)
         */
        function getValidSkus(items) {
            return _.filter(items, function(item) {
                return !_.isUndefined(item.manualskuvalues) && !_.isEmpty(_.trim(item.manualskuvalues)) && !_.isUndefined(item.saleprice) && !_.isEmpty(_.trim(item.saleprice))
            });
        }

        /**
         * 添加属性
         */
        vm.addItem = function() {

            if (!vm.stepState === 0 || _.isUndefined(vm.dataBase.pcateid1) || !vm.dataBase.brandname) {
                cbAlert.warning("警告提示", "请先选择商品类目和商品品牌");
                return;
            }

            var saleprice = _.filter(vm.dataBase.items, function(item) {
                return !_.isNumber(item.saleprice) && _.isEmpty(item.saleprice);
            });
            var manualskuvalues = _.filter(vm.dataBase.items, function(item) {
                return _.isEmpty(item.manualskuvalues);
            });
            if (saleprice.length || manualskuvalues.length) {
                // cbAlert.warning("警告提示", "您的规格型号或零售单价未填写");
                vm.isAddButtonClicked = true;
                return;
            }
            // _.forEach(vm.dataBase.items, function (item) {
            //   item.$folded = false;
            //   item.$stockshow = utils.isEmpty(item.$stock) ? "无限" : item.$stock;
            // });
            addItemInit();
        };

        /**
         * 添加初始化
         */
        function addItemInit() {
            vm.isAddButtonClicked = false; // 每次初始化的时候将 点击按钮 设置为false
            vm.dataBase.items.push({
                // '$folded': true,
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
        vm.removeItem = function(item, $index) {
            cbAlert.confirm("确定删除该规格？", function(isConfirm) {
                if (isConfirm) {
                    var remove = vm.dataBase.items.splice($index, 1);
                    vm.dataBase.deleteguid.push(remove[0].guid);
                    _.forEach(vm.dataBase.items, function(item, index) {
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
        vm.statusItem = function(item) {
            var messages = [{
                    title: "确定启用该规格？",
                    content: "启用后，该规格商品将正常销售。"
                },
                {
                    title: "确定禁用该规格？",
                    content: "禁用后，该规格商品将无法销售。"
                }
            ];
            var status = messages[item.status];
            cbAlert.confirm(status.title, function(isConfirm) {
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
        vm.toggleItem = function(item) {
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
        vm.changeStock = function(item) {
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
        vm.sortItem = function(item, index, dir) {
            if (dir === -1 && index === 0 || dir === 1 && index === vm.dataBase.items.length - 1) {
                return;
            }
            moveItme(item, index + dir, index);
        };

        /**
         * 拖拽
         * @param data     返回目标索引和当前索引
         */
        vm.dragItem = function(data) {
            var item = vm.dataBase.items[data.currentIndex];
            moveItme(item, data.targetIndex, data.currentIndex);
        };

        /**
         * 移动当前项到目标位置，目标项移动到当前位置
         * @param item          当前项
         * @param targetIndex   目标索引
         * @param currentIndex  当前位置
         */
        function moveItme(item, targetIndex, currentIndex) {
            var replaceItem = vm.dataBase.items.splice(targetIndex, 1, item);
            vm.dataBase.items.splice(currentIndex, 1, replaceItem[0]);
            _.forEach(vm.dataBase.items, function(item, index) {
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
            handler: function(data) {
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
         * 检查商品规格零售单价的范围
         * @param item
         */
        vm.checkPrice = function(item) {
            if (item.saleprice * 1 > 999999) {
                cbAlert.warning('零售单价为0-999999范围', '');
                item.saleprice = undefined;
            }
        };


        /**
         * 获取品牌
         * @param id
         * @param callback
         */
        function getAttrsku(id, callback) {
            productGoods.attrsku({ id: id }).then(function(results) {
                if (results.data.status === 0) {
                    return results.data.data;
                } else {
                    cbAlert.error("错误提示", results.data.data);
                }
            }).then(function(data) {
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
            console.log('qqq', vm.dataBase);
            vm.isEditProduct = true;
            vm.dataBase.category = category;
            vm.dataBase.catename2 = category.items[0].catename;
            _.forEach(vm.dataBase.items, function(item, index) {
                item.skuvalues = angular.fromJson(item.skuvalues);
                item.motobrandids = angular.fromJson(item.motobrandids);
                item.saleprice = computeService.pullMoney(item.saleprice);
                item.$folded = false;
                item.sortsku = index;
                item.$stock = item.stock;
                item.$stockshow = utils.isEmpty(item.$stock) ? "无限" : item.$stock;
                item.saleprice = Number(item.saleprice).toFixed(2);

                item.motorsList = angular.fromJson(item['motobrandids']);
                _.forEach(item.motorsList, function(v) {
                    // console.log('vvv', v.brand.logo);
                    // v.brand.logo = "http://shop.cb.cn" + v.brand.logo;
                    v.brand.logo = utils.getImageSrc(v.brand.logo, "logo");
                });
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
                .find(function(item) {
                    return item.id * 1 === getProductSkus.pcateid1 * 1;
                })
                .tap(function(items) {
                    var item = _.find(items.items, function(item) {
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
            handler: function(data) {
                if (data.status == 0 && data.data.length == 1) {
                    vm.dataBase.mainphoto = data.data[0].url;
                }
            }
        };


        /**
         * 新增页面 选车相关
         */
        vm.showSelectDrop = false;
        vm.showdrop = function(item, event) {
            // console.log(item);
            vm.showSelectDrop = true;
            event.stopPropagation();
            _.forEach(vm.dataBase.items, function(v) {
                // console.log(v);
                v.$current = false;
            });
            item.$current = true;
        };
        // 处理点击非当前位置，都会收起
        $document.on('click', function() {
            $scope.$apply(function() {
                vm.showSelectDrop = false;
            });
        });

        /**
         * 选择车辆
         * @param data
         * @param item
         */
        vm.vehicleSelect = function(data, item) {
            if (data.status == 0) {
                item.motobrandids = data.data;
            }
        };

        /**
         * 编辑车辆
         * @param data
         * @param item
         */
        vm.vehicleShow = function(data, item) {
            if (data.status == 0) {
                if (item.motobrandids == angular.toJson(data.data)) {
                    return;
                }
                item.motobrandids = data.data;
                item.motorsList = angular.fromJson(item.motobrandids);
                _.forEach(item.motorsList, function(v) {
                    if (!AVATAR_OSS_REGULAR.test(v.brand.logo)) {
                        v.brand.logo = utils.getImageSrc(v.brand.logo, "logo");
                    }
                });
            }
        };



        vm.uploadHandler = function(data, index) {
            if (data.status == 0) {
                if (angular.isDefined(index)) {
                    vm.dataBase.mainphoto[index] = data.data[0].url;
                } else {
                    angular.forEach(data.data, function(item) {
                        vm.dataBase.mainphoto.push(item.url);
                    });
                }
            }
        };
        vm.removePhotos = function(data) {
            if (data.status == 0) {
                vm.dataBase.mainphoto = '';
            }
        };


        /**
         * 格式化 vm.dataBase数据供提交使用
         * @param data
         * @returns {{}}
         */
        function getDataBase(data) {
            var result = angular.copy(data);
            _.remove(result.items, function(item) {
                return _.isUndefined(item.saleprice);
            });
            _.forEach(result.items, function(item) {
                item.productid = result.guid;
                item.skuvalues = angular.toJson(item.skuvalues);
                item['$stock'] = _.trim(item['$stock']);
                item.stock = !item['$stock'] && item['$stock'] !== 0 ? null : item['$stock'];
                item.saleprice = computeService.pushMoney(item.saleprice);
            });
            result.shelflife = isNaN(parseInt(result.shelflife, 10)) ? undefined : result.shelflife;
            result.remove = !_.filter(result.items, { 'status': '1' }).length ? 1 : 0;
            result.deleteguid = _.compact(result.deleteguid).join(",");
            /*if (vm.isChange) {
              _.pick(result, ['parentid', 'productcategory']);
            }*/
            _.pick(result, ['parentid', 'productcategory']);
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

            var skus = getValidSkus(vm.dataBase.items);

            if (skus.length === 0) {
                cbAlert.warning("您的商品规格型号或零售单价未填写");
                // cbAlert.alert("商品规格或零售单价没有填写");
                return true;
            }
            /* // 车辆属性名称(填写)
             var manualskuvalues = _.filter(vm.dataBase.items, function (item) {
               return _.isEmpty(item.manualskuvalues);
             });
             if (manualskuvalues.length) {
               cbAlert.alert("商品属性的名称没有填写");
               return true;
             }*/
            return result;
        }


        /**
         * 保存并返回
         */
        vm.submitBack = function() {
            saveServer(function() {
                cbAlert.close();
                goto();
            });
        };

        /**
         * 保存并复制新建
         */
        vm.submitNewCopy = function() {
            saveServer(function() {
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
            var saleprice = _.filter(vm.dataBase.items, function(item) {
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
            vm.dataBase = _.omit(vm.dataBase, ['category']);
            vm.dataBase.items = getValidSkus(vm.dataBase.items);
            console.log('999', vm.dataBase);
            productGoods.save(getDataBase(vm.dataBase)).then(function(results) {
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
            $state.go('product.goods.list', { 'page': 1 });
        }
    }
})();