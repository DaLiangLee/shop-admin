/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
    'use strict';

    angular
        .module('shopApp')
        .factory('tadeOrder', tadeOrder)
        .service('storageListAndView', storageListAndView)
        .factory('tadeOrderAddData', tadeOrderAddData)
        .service('tadeOrderShare', tadeOrderShare)
        .service('storeItems', storeItems)
        .service('tadeOrderItems', tadeOrderItems)
        .constant('tadeOrderConfig', tadeOrderConfig);

    /** @ngInject */
    function storeItems() {
        var store = [];
        /**
         * 初始化 数组清空
         */
        this.init = function () {
            store = [];
        };

        /**
         * 给数据添加一个数据
         */
        this.add = function (value) {
            store.push(value);
            return this;
        };

        /**
         * 合并数据
         */
        this.merge = function (value) {
            store = store.concat(value);
            return this;
        };

        /**
         * 删除某一个项
         * @param key
         * @param value
         */
        this.remove = function (key, value) {
            var compare = null;
            if (_.isObject(value) && !_.isUndefined(value[key])) {
                compare = value[key];
            } else if (_.isString(value) || _.isNumber(value)) {
                compare = value;
            } else {
                return undefined;
            }
            _.remove(store, function (item) {
                return item[key] === compare;
            });
            return this;
        };

        /**
         * 删除全部
         */
        this.removeAll = function () {
            this.init();
            return this;
        };

        /**
         * 获取一个数据
         * @param key
         * @param value
         */
        this.get = function (key, value) {
            var compare = null;
            if (_.isObject(value) && !_.isUndefined(value[key])) {
                compare = value[key];
            } else if (_.isString(value) || _.isNumber(value)) {
                compare = value;
            } else {
                return undefined;
            }
            return _.find(store, function (item) {
                return item[key] === compare;
            });
        };

        /**
         * 更新某个数据
         * @param key
         * @param value
         */
        this.put = function (key, value) {
            var compare = null;
            if (_.isObject(value) && !_.isUndefined(value[key])) {
                compare = value[key];
            } else {
                throw Error('value 不是一个｛｝对象，或者value里面没有对应的key');
            }
            var index = _.findIndex(store, function (item) {
                return item[key] === compare;
            });
            store[index] = value;
            return this;
        };

        /**
         * 获取全部数据
         */
        this.getAll = function () {
            return store;
        };
    }

    /** @ngInject */
    function storageListAndView() {
        var store = null;
        /**
         * 添加列表数据
         */
        this.set = function (value) {
            store = value;
        };

        /**
         * 删除全部列表
         */
        this.remove = function () {
            store = null;
        };

        /**
         * 获取列表数据
         */
        this.get = function () {
            return store;
        };
    }

    /** @ngInject */
    function tadeOrderShare($q, $state, $filter, simpleDialogService, computeService, tadeOrder, utils, webSiteApi, configuration) {
        /**
         * 关闭订单
         * @param item
         * @returns {promise}
         */
        this.closeOrder = function (item) {
            var deferred = $q.defer();
            if (item.status === "2" || item.paystatus === "0" || item.status === "4") {
                deferred.reject({});
                return deferred.promise;
            }
            simpleDialogService.confirm('确定关闭订单？<br>订单关闭后将无法恢复。').then(function (isConfirm) {
                if(isConfirm){
                    tadeOrder.update({
                        status: "4",
                        guid: item.guid
                    }).then(utils.requestHandler).then(function (results) {
                        simpleDialogService.success('操作成功');
                        deferred.resolve(results);
                    }, function (results) {
                        deferred.reject(results.data);
                    });
                }
            });
            return deferred.promise;
        };
        /**
         * 订单收款
         * @param data
         * @returns {promise}
         */
        this.orderReceive = function (data) {
            var deferred = $q.defer();
            if (data.status === '0') {
                tadeOrder.takeJKCouponById(data.data).then(utils.requestHandler).then(function (results) {
                    simpleDialogService.success('操作成功');
                    deferred.resolve(results);
                }, function (results) {
                    deferred.reject(results.data);
                });
            }
            if (data.status === '1') {   // 收款成功但是没有点领劵确定
                deferred.resolve(data);
            }
            return deferred.promise;
        };
        /**
         * 订单完成
         * @param item
         * @returns {promise}
         */
        this.orderComplete = function (item) {
            var deferred = $q.defer();
            if (item.status === "2" || item.status === "4") {
                deferred.reject({});
                return deferred.promise;
            }
            simpleDialogService.confirm('是否确定完工').then(function (isConfirm) {
                if(isConfirm){
                    tadeOrder.update({
                        status: "2",
                        guid: item.guid
                    }).then(utils.requestHandler).then(function (results) {
                        simpleDialogService.success('操作成功');
                        deferred.resolve(results);
                    }, function (results) {
                        deferred.reject(results.data);
                    });
                }
            });
            return deferred.promise;
        };
        /**
         * 订单打印
         * @param item
         * @returns {promise}
         */
        this.printOrder = function (item) {
            var WEB_SITE_API = webSiteApi.WEB_SITE_API;
            var baseUrl = configuration.getAPIConfig();
            var path = WEB_SITE_API["trade"]["order"]["printOrder"];
            return baseUrl + path.url + '?id=' + item.guid;
        };
        /**
         * 编辑订单
         * @param item
         */
        this.editOrder = function (item) {
            if (item.status === "2" || item.paystatus === "0" || item.status === "4") {
                return false;
            }
            $state.go('trade.order.edit', {"orderid": item.guid});
        };

        /**
         * 修复套餐卡优惠显示问题
         * @param item
         */
        function fixesPackagePreferentialmsg(item) {
            if (_.isUndefined(item.preferentialmsg['1'])) {
                return false;
            }
            item.preferentialmsg = {
                98: item.preferentialmsg['1']
            }
        }

        /**
         * 格式化订列表数据
         * @param item
         */
        this.formatListData = function (item) {
            // 总费用
            item.totalprice = computeService.add(item.ssaleprice, item.psaleprice);

            if(item.preferentialprice*1 === 0 && !_.isUndefined(item.preferentialmsg)){
                item.preferentialmsg = undefined;
            }

            if (!_.isUndefined(item.preferentialmsg)) {
                item.preferentialmsg = angular.fromJson(item.preferentialmsg);
                item.orderstype === "2" && fixesPackagePreferentialmsg(item);
            }
            /**
             * 存的是字符串json，取时候需要转换一下 因为app坑，需要去掉null
             */
            // 车主信息
            item.userinfo = utils.filterNull(angular.fromJson(item.userinfo));
            if (_.isEmpty(item.userinfo) && !item.username) {
                item.username = "临客";
            }else{
                if(!item.username){
                    item.username = item.userinfo.realname;
                }
            }

            // 车辆信息
            item.carinfo = utils.filterNull(angular.fromJson(item.carinfo));
            if (item.carinfo) {
                item.carinfo.problem = item.problem;
                item.carinfo.logo = utils.getImageSrc(item.carinfo.logo, "logo");
            }

            item.carinfo.baoyang = $filter('maintainManualFilter')(item.carinfo.guid);
            return item;
        };

        /**
         * 获取列表
         * @param params
         * @param currentStateName
         */
        this.getList = function (params, currentStateName) {
            var deferred = $q.defer();
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            if (!params.page) {
                return;
            }
            tadeOrder.list(params).then(utils.requestHandler).then(function (results) {
                // 防止用户手动输入没有数据
                if (!results.data.length && params.page !== "1") {
                    $state.go(currentStateName, {page: "1"});
                }
                deferred.resolve(results);
            }, function (results) {
                deferred.reject(results.data);
            });
            return deferred.promise;
        };

        /**
         * 设置数据汇总
         * @param data
         */
        function getStatistics(data) {
            data.totalprice = computeService.pullMoney(computeService.add(data.psalepriceAll, data.ssalepriceAll));
            data.actualpriceAll = computeService.pullMoney(computeService.subtract(computeService.add(data.psalepriceAll, data.ssalepriceAll), data.preferentialprice));
            data.psalepriceAll = computeService.pullMoney(data.psalepriceAll);
            data.ssalepriceAll = computeService.pullMoney(data.ssalepriceAll);
            data.preferentialprice = computeService.pullMoney(data.preferentialprice);
            return data;
        }


        /**
         * 订单列表处理回调函数
         * @param results
         * @param params
         */
        this.handleListResult = function (results, params) {
            // 如果没有数据就阻止执行，提高性能，防止下面报错
            if (results.totalCount === 0) {
                return {
                    itemList: [],
                    loadingState: false,
                    paginationinfo: {},
                    statistics: {}
                };
            }
            return {
                itemList: _.map(results.data, this.formatListData),
                loadingState: false,
                paginationinfo: {
                    page: params.page * 1,
                    pageSize: params.pageSize,
                    total: results.totalCount
                },
                statistics: getStatistics(_.pick(results, ['psalepriceAll', 'productcount', 'servercount', 'ssalepriceAll', 'preferentialprice']))
            }
        }
    }

    /** @ngInject */
    function tadeOrderItems($filter, storeItems, computeService, utils) {
        var store = [];
        /**
         * 统计数据
         * @type {{}}
         */
        var tally = {
            serviceCount: 0,
            ssalepriceAll: 0,
            productCount: 0,
            psalepriceAll: 0,
            totalprice: 0
        };

        /**
         * 根据guid删除某一项
         * @param item
         * @param subitem
         */
        this.removeItem = function (item, subitem) {
            if (_.isUndefined(subitem)) {
                storeItems.remove('itemid', item);
            } else {
                _.remove(item.products, function (key) {
                    return key.itemid === subitem.itemid;
                });
            }
            this.computeTally(store);
        };

        /**
         * 获取计算后统计信息
         * @param details
         * @returns {{}}
         */
        this.computeTally = function (details) {
            // 服务计数
            tally.serviceCount = _.chain(details)
                .filter('itemtype', '0')
                .reduce(function (result, value) {
                    return computeService.add(result, value.num);
                }, 0)
                .value();
            // 原价服务总和
            tally.soriginpriceAll = _.chain(details)
                .filter(function (char) {
                    return !_.isUndefined(char.originprice) && char.itemtype === '0';
                })
                .reduce(function (result, value) {
                    return computeService.add(result, $filter('moneySubtotalFilter')([value.originprice, value.num]));
                }, 0)
                .value();
            // 原价商品总和
            tally.poriginpriceAll = _.chain(details)
                .filter(function (char) {
                    return !_.isUndefined(char.originprice) && char.itemtype === '1';
                })
                .reduce(function (result, value) {
                    return computeService.add(result, $filter('moneySubtotalFilter')([value.originprice, value.num]));
                }, 0)
                .value();
            // 现价服务总和
            tally.ssalepriceAll = _.chain(details)
                .filter('itemtype', '0')
                .reduce(function (result, value) {
                    return computeService.add(result, value.$allprice);
                }, 0)
                .value();
            // 优惠总和
            tally.preferentialprice = _.chain(details)
                .filter(function (char) {
                    return !_.isUndefined(char.preferential);
                })
                .reduce(function (result, value) {
                    return computeService.add(result, value.preferential);
                }, 0)
                .value();
            // 商品计数
            tally.productCount = _.chain(details)
                .filter('itemtype', '1')
                .reduce(function (result, value) {
                    return computeService.add(result, value.num);
                }, _.reduce(details, function (result, value) {
                    return computeService.add(result, value.$productCount);
                }, 0))
                .value();
            // 现价商品总和
            tally.psalepriceAll = _.reduce(details, function (result, value) {
                return computeService.add(result, value.$productPrice);
            }, 0);
            // 总价
            tally.totalprice = computeService.add(tally.psalepriceAll, tally.ssalepriceAll);
            return tally;
        };

        /**
         * 获取统计结果
         */
        this.getTally = function () {
            return tally;
        };

        /**
         * 将数据格式化成后台需要数据
         * @param details         前端显示的数据
         * @returns {[]}   返回后台数据
         */
        this.getDetails = function (details) {
            // 不是数组直接抛错
            if (!_.isArray(details)) {
                throw Error('参数不是一个数组')
            }
            // 空数组直接返回
            if (_.isEmpty(details)) {
                return [];
            }
            return _.map(details, function (item) {
                if (item.itemtype === '1') {
                    var items = {
                        itemname: "",
                        price: 0,
                        num: 0,
                        servicer: item.servicer,
                        servicername: item.servicername,
                        remark: item.remark,
                        itemsku: "",
                        itemid: "",
                        itemskuid: "",
                        itemtype: item.itemtype,
                        products: [_.omit(item, ['itemtype', 'servicer', 'servicername', 'remark'])]
                    };
                    item = items;
                    items = null;
                }
                return item;
            });
        };

        /**
         * 拼装服务信息
         * @param details
         * @returns {*}
         */
        this.setServiceinfo = function (details) {
            var results = [], serviceinfo;
            _.forEach(details, function (item) {
                item && item.itemid && results.push(item.itemname);
            });
            if (!results.length) {
                return "";
            }
            serviceinfo = results.join('、');
            details.length > 1 && (serviceinfo = '（多项）' + serviceinfo);
            return serviceinfo;
        };

        /**
         * 拼装商品信息
         * @param details
         * @returns {*}
         */
        this.setProductinfo = function (details) {
            var results = [], products = [], productinfo;
            _.forEach(details, function (item) {
                products = products.concat(item.products);
            });
            _.forEach(products, function (item) {
                item && results.push(item.itemname);
            });
            if (!results.length) {
                return "";
            }
            productinfo = results.join('、');
            results.length > 1 && (productinfo = '（多项）' + productinfo);
            return productinfo;
        };

        /**
         * 处理获取的数据details，格式化数据
         * @param details      格式化前订单项
         */
        this.setDetails = function (details) {
            // 不是数组直接抛错
            if (!_.isArray(details)) {
                throw Error('参数不是一个数组')
            }
            // 空数组直接返回
            if (!details.length) {
                return;
            }
            // 处理数据
            _.chain(details)
                .forEach(function (result) {
                    result.$productPrice = 0;
                    if (_.isUndefined(result.products)) {
                        result.$productCount = 0;
                    } else {
                        result.$productCount = result.products.length;
                    }

                    if (!utils.isNumber(result.preferential)) {
                        result.preferential = computeService.pullMoney(result.preferential);
                    }

                    if (!utils.isNumber(result.originprice)) {
                        result.originprice = computeService.pullMoney(result.originprice);
                    }

                    if (!utils.isNumber(result.price)) {
                        result.price = computeService.pullMoney(result.price);
                        result.price = Number(result.price).toFixed(2);
                    }

                    if (_.isEmpty(result.remark)) {
                        result.remark = "";
                    }

                    result.$allprice = $filter('moneySubtotalFilter')([result.price, result.num]);

                    if (_.isEmpty(result.itemid) && _.isEmpty(result.itemskuid)) {
                        result.itemtype = '1';
                    }

                    if (result.itemtype === "1") {
                        result.itemtype = '1';
                        result.price = 0;
                        result.num = 0;
                        result.itemname = "商品销售";
                    }

                    result.products && _.forEach(result.products, function (item) {
                        if (!utils.isNumber(item.preferential)) {
                            item.preferential = computeService.pullMoney(item.preferential);
                        }
                        if (!utils.isNumber(item.originprice)) {
                            item.originprice = computeService.pullMoney(item.originprice);
                        }
                        if (!utils.isNumber(item.price)) {
                            item.price = computeService.pullMoney(item.price);
                            item.price = Number(item.price).toFixed(2);
                        }
                        item.$unit = getProductsUnit(item.itemsku);
                        item.$allprice = $filter('moneySubtotalFilter')([item.price, item.num]);
                        result.$productPrice = computeService.add(result.$productPrice, item.$allprice);
                    });

                    result.$totalPrice = computeService.add(result.$productPrice, result.$allprice);
                })
                .value();
        };

        function getProductsItemname(item) {
            var items = angular.fromJson(item);
            return items.productname + " " + items.brandname + " " + items.items[0].manualskuvalues;
        }

        function getServerItemname(item) {
            var items = angular.fromJson(item);
            return items.servername + " " + items.serverSkus[0].manualskuvalues;
        }

        function getPackageItemname(item) {
            var items = angular.fromJson(item);
            var userPackageItems = items.userPackageItems.pop();
            return userPackageItems.name;
        }

        function getPackageItemprice(item) {
            var items = angular.fromJson(item);
            var userPackageItems = items.userPackageItems.pop();
            return userPackageItems.price;
        }

        function getProductsUnit(item) {
            var items = angular.fromJson(item);
            return items.unit ? items.unit : "件";
        }


        /**
         * 处理详情获取的数据details，格式化数据
         * @param details      格式化前订单项
         * @param orderstype      订单类型 0 会员单 1 临客单 2 套餐单
         */
        this.setDetails2 = function (details, orderstype) {
            // 不是数组直接抛错
            if (!_.isArray(details)) {
                throw Error('参数不是一个数组')
            }
            // 空数组直接返回
            if (!details.length) {
                return;
            }
            // 处理数据
            return _.chain(details)
                .map(function (item) {
                    var result = item;
                    if (orderstype === "2") {
                        if (item.products && item.products.length) {
                            result = item.products[0];
                            result.itemtype = "1";
                            result.remark = item.remark;
                        }
                        result.originprice = result.price;
                        result.price = getPackageItemprice(result.itemsku);
                        result.preferential = (result.originprice * result.num - result.price * result.num);
                    } else {
                        if (!/^\d{18}$/.test(result.itemid) && !/^\d{18}$/.test(result.itemskuid)) {
                            if (item.products && item.products.length) {
                                result = item.products[0];
                                result.itemtype = "1";
                                result.remark = item.remark;
                            }
                        }
                    }
                    return result;
                })
                .forEach(function (result) {
                    result.$productPrice = 0;
                    if (_.isUndefined(result.products)) {
                        result.$productCount = 0;
                    } else {
                        result.$productCount = result.products.length;
                    }

                    if (!utils.isNumber(result.preferential)) {
                        result.preferential = computeService.pullMoney(result.preferential);
                    }

                    if (!utils.isNumber(result.originprice)) {
                        result.originprice = computeService.pullMoney(result.originprice);
                    }

                    if (!utils.isNumber(result.price)) {
                        result.price = computeService.pullMoney(result.price);
                    } else {
                        result.price = 0;
                    }

                    if (utils.isNumber(result.num)) {
                        result.num = 0;
                    }
                    result.$allprice = $filter('moneySubtotalFilter')([result.price, result.num]);
                    if (/^\d{18}$/.test(result.itemid) && /^\d{18}$/.test(result.itemskuid)) {
                        result.unit = result.itemtype === "1" && getProductsUnit(result.itemsku);
                        if (orderstype === "2") {
                            result.itemname = getPackageItemname(result.itemsku);
                        } else {
                            result.itemname = result.itemtype === "0" ? getServerItemname(result.itemsku) : getProductsItemname(result.itemsku);
                        }
                    }

                    result.products && _.forEach(result.products, function (item) {
                        if (orderstype === "0" || orderstype === "1") {
                            item.itemname = getProductsItemname(item.itemsku);
                        } else {
                            item.itemname = getPackageItemname(item.itemsku);
                        }
                        if (!utils.isNumber(item.preferential)) {
                            item.preferential = computeService.pullMoney(item.preferential);
                        }
                        if (!utils.isNumber(item.originprice)) {
                            item.originprice = computeService.pullMoney(item.originprice);
                        }
                        if (!utils.isNumber(item.price)) {
                            item.price = computeService.pullMoney(item.price);
                        }
                        item.unit = getProductsUnit(item.itemsku);
                        item.$allprice = $filter('moneySubtotalFilter')([item.price, item.num]);
                        result.$productPrice = computeService.add(result.$productPrice, item.$allprice);
                    });

                    result.$totalPrice = computeService.add(result.$productPrice, result.$allprice);
                })
                .value();
        };
        /**
         * 获可提交单数据
         * @param data
         * @returns {Object}
         */
        this.getDataBase = function (data) {
            var _this = this;
            return _.chain(data)
                .cloneDeep()
                .tap(function (result) {
                    // 处理会员车辆信息
                    if (!_.isUndefined(result.carinfo)) {
                        result.carinfo = _.omit(result.carinfo, ['$$hashKey', 'baoyang']);
                        result.carinfo.totalmile = result.totalmile;
                    }
                    result.carinfo = angular.toJson(result.carinfo);
                })
                .tap(function (result) {
                    // 处理会员信息
                    if (!_.isUndefined(result.userinfo)) {
                        result.userinfo = _.omit(result.userinfo, ['$$hashKey']);
                        result.userinfo.totalmile = result.totalmile;
                    }
                    result.userinfo = angular.toJson(result.userinfo);
                })
                .tap(function (result) {
                    // 是否店内等候
                    result.waitinstore = result.waitinstore ? 1 : 0;
                })
                .tap(function (result) {
                    // 处理优惠金额
                    result.preferentialprice = computeService.pushMoney(result.preferentialprice);
                    if (!_.isUndefined(result.preferentialpricenew)) {
                        result.preferentialpricenew = computeService.pushMoney(result.preferentialpricenew);
                    }
                })
                .tap(function (result) {
                    // 处理服务信息和商品信息
                    result.serviceinfo = _this.setServiceinfo(result.details);
                    result.productinfo = _this.setProductinfo(result.details);
                })
                .tap(function (result) {
                    // 处理订单封面
                    try {
                        result.coveross = result.details[0].mainphoto;
                    } catch (e) {
                        result.coveross = result.details[0].products[0].mainphoto
                    }
                })
                .tap(function (result) {
                    // 删除 ordersjson
                    if (result.ordersjson) {
                        result.ordersjson = undefined;
                    }
                })
                .tap(function (result) {
                    result.details = _this.getDetails(result.details);
                    // 处理金额
                    _.forEach(result.details, function (item) {
                        item.price = computeService.pushMoney(item.price);
                        if (item.originprice) {
                            item.originprice = computeService.pushMoney(item.originprice);
                        }
                        if (item.preferential) {
                            item.preferential = computeService.pushMoney(item.preferential);
                        }
                        _.forEach(item.products, function (subitem) {
                            subitem.price = computeService.pushMoney(subitem.price);
                            if (subitem.originprice) {
                                subitem.originprice = computeService.pushMoney(subitem.originprice);
                            }
                            if (subitem.preferential) {
                                subitem.preferential = computeService.pushMoney(subitem.preferential);
                            }
                        });
                    });
                })
                .value();
        }

    }

    /** @ngInject */
    function tadeOrder(requestService) {
        return requestService.request('trade', 'order');
    }

    /** @ngInject */
    function tadeOrderAddData($q, requestService, userCustomer) {
        var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
        var userInfo;
        return {
            query: function (license) {
                return requestService.request('motors', 'customer').suggestCarNo({carNo: license}).then(function (results) {
                    return results.data.status === 0 ? results.data.data : [];
                });
            },
            get: function (license, motorid) {
                if (_.isUndefined(userInfo)) {
                    return userCustomer.customer({carNo: license, motorId: motorid}).then(function (results) {
                        var result = {};
                        if (results.data.status === 0) {
                            result.licence = license;
                            result.userType = results.data.data.userType;
                            result.customers = results.data.data.customers;
                            if (result.userType === 'u') {
                                result.mobile = result.customers[0].user.mobile;
                                result.realname = result.customers[0].user.realname;
                                result.user_avatar = result.customers[0].user.avatar;
                                result.motor_logo = result.customers[0].motor.logo;
                            }
                            if (result.userType === 'c') {
                                result.realname = "临客";
                                result.mobile = result.customers[0].mobile;
                            }
                            if (result.userType === 'n') {
                                result.realname = "新临客";
                            }
                        } else {
                            result = null;
                        }
                        return result;
                    });
                }
                deferred.resolve(userInfo);
                return deferred.promise;   // 返回承诺
            },
            updata: function (info) {
                userInfo = info;
            }
        }
    }

    // userType：n(找不到)，u(会员)，c(客户)。

    /** @ngInject */
    function tadeOrderConfig() {
        return {
            DEFAULT_GRID: {
                "columns": [
                    {
                        "id": 0,
                        "name": "序号",
                        "none": true,
                        "width": 20
                    },
                    {
                        "id": 1,
                        "name": "&nbsp;",
                        "cssProperty": "state-column",
                        "fieldDirective": '<div class="editOrder" ><span class="edit-More text-default" ng-click="propsParams.nextshow(item,$event) ">•••</span><p class="edits" ng-show="item.$show"><a href="javascript:;" class="state-unread text-link edit-item" ng-if="item.paystatus == 1 && item.status != 4" orader-received-dialog item="item" item-handler="propsParams.received(data)">收款</a> ' +
                        '<a href="javascript:;" class="state-unread text-link  edit-item" ng-if="item.status == 1" ng-click="propsParams.completed(item)">完工</a>  ' +
                        '<a href="{{propsParams.printOrder(item)}}" class="state-unread text-link  edit-item" target="_blank">打印</a>  ' +
                        '<a ng-if="item.paystatus == 1 && item.status == 1" ui-sref="trade.order.edit({orderid: item.guid})" class="state-unread text-link edit-item">编辑</a>  ' +
                        '<a href="javascript:;" class="state-unread text-red edit-item" ng-if="item.status == 1 && item.paystatus == 1" ng-click="propsParams.closed(item)">关闭订单</a>',
                        "width": 30
                    },
                    {
                        "id": 2,
                        "name": "会员",
                        "cssProperty": "state-column",
                        "fieldDirective": '<div bo-if="item.orderstype == 0 || item.orderstype == 2" class="orderUser" cb-popover="" popover-placement="bottom" popover-template-id="orderUserTemplate.html" popover-animation="false"  popover-template-data="item.userinfo"><img bo-src-i="{{item.userinfo.avatar}}" alt=""><a class="state-unread" bo-bind="item.userinfo.realname"  href="javascript:;" ></a></div><div bo-if="item.orderstype == 1" class="orderUser"><span class="default-user-image" style="width: 24px; height: 24px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span><span class="state-unread"  href="javascript:;" >临客</span></div>',
                        "width": 120
                    },
                    {
                        "id": 2,
                        "name": "车辆",
                        "cssProperty": "state-column",
                        "fieldDirective": '<a bo-if="item.orderstype == 0 || item.orderstype == 2" class="carUser" cb-popover="" popover-placement="bottom" popover-template-id="orderCarTemplate.html" popover-animation="false"  popover-template-data="item.carinfo" class="state-unread" bo-bind="item.carno"  href="javascript:;"></a><span class="" bo-if="item.orderstype == 1" bo-bind="item.carno"></span>',
                        "width": 90
                    },
                    {
                        "id": 4,
                        "name": "订单状态",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" ng-class="{\'text-success\': item.status == 2, \'text-red\': item.status == 1}" ng-bind="item.status | formatStatusFilter : \'server_order_status\'"></span>',
                        "width": 84
                    },
                    {
                        "id": 5,
                        "name": "付款状态",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread"><span bo-if="item.status != 4" ng-class="{\'text-success\': item.paystatus == 0, \'text-orange\': item.paystatus == 1}" bo-bind="item.paystatus | formatStatusFilter : \'server_order_paystatus\'"></span><span bo-if="item.status == 4">已关闭</span></span>',
                        "width": 75
                    },
                    {
                        "id": 8,
                        "name": "工时费",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | number : \'2\'"></span>',
                        "width": 77
                    },
                    {
                        "id": 9,
                        "name": "商品材料费",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.psaleprice | number : \'2\'"></span>',
                        "width": 90
                    },
                    {
                        "id": 10,
                        "name": "总费用",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.totalprice | number : \'2\'"></span>',
                        "width": 77
                    },
                    {
                        "id": 11,
                        "name": "优惠",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="text-red" bo-if="item.preferentialmsg" cb-popover="" popover-template-id="orderPreferentialmsgTemplate.html" popover-placement="top-left" popover-animation="false"  popover-template-data="item.preferentialmsg">-<span class="state-unread" bo-bind="item.preferentialprice | number : \'2\'"></span></span><span class="text-red" bo-if="!item.preferentialmsg">-<span class="state-unread" bo-bind="item.preferentialprice | number : \'2\'"></span></span>',
                        "width": 77
                    },
                    {
                        "id": 12,
                        "name": "实收",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" ng-bind="item.actualprice | number : \'2\'"></span>',
                        "width": 77
                    },
                    {
                        "id": 14,
                        "name": "订单编号",
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.guid"></span>',
                        "width": 90
                    },
                    {
                        "id": 15,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-bind="item.createtime"></span>',
                        "name": '开单时间',
                        "width": 133
                    },
                    {
                        "id": 16,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" bo-text="item.creatorname"></span>',
                        "name": '开单人',
                        "width": 68
                    },
                    {
                        "id": 17,
                        "cssProperty": "state-column",
                        "fieldDirective": '<span class="state-unread" style="white-space:nowrap;" bo-text="item.remark"></span>',
                        "name": '备注',
                        "width": 120
                    }
                ],
                "config": {
                    'settingColumnsSupport': false,   // 设置表格列表项
                    'sortSupport': true,     // 排序
                    'sortPrefer': true,     //  服务端排序
                    'paginationSupport': true,  // 是否有分页
                    'selectedProperty': "selected",  // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true,  // 是否单向绑定
                    'exportDataSupport': true, // 导出
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': [
                        '<a class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:trade:porder:add" ui-sref="trade.order.add()">开　单</a> '
                    ],
                    'batchOperationBarDirective': [
                        '<div class="FootConfig total">' +
                        '<p><strong>服务项目<span ng-bind="propsParams.statistics.servercount"></span> 项&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.ssalepriceAll | number : \'2\'"></span></label></p>' +
                        '<p><strong>商品材料 <span ng-bind="propsParams.statistics.productcount"></span> 项&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.psalepriceAll | number : \'2\'"></span></p>' +
                        '<p><strong>优惠&nbsp;</strong><label style="color: red;">&yen;&nbsp;-<span ng-bind="propsParams.statistics.preferentialprice | number : \'2\'"></span></label></p>' +
                        '<p><strong>合计&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.totalprice | number : \'2\'"></span></label></p>' +
                        '</div>'
                    ]
                }
            },
            DEFAULT_SEARCH: {
                createtime: [
                    {
                        "label": "今日",
                        id: 0,
                        start: "0",
                        end: "0"
                    },
                    {
                        "label": "本周",
                        id: 1,
                        start: "1",
                        end: "1"
                    },
                    {
                        "label": "本月",
                        id: 2,
                        start: "2",
                        end: "2"
                    },
                    {
                        "label": "本年度",
                        id: 3,
                        start: "3",
                        end: "3"
                    }
                ],
                status: [
                    {
                        id: 1,
                        label: "服务中"
                    },
                    {
                        id: 2,
                        label: "已完工"
                    },
                    {
                        id: 4,
                        label: "已关闭",
                        tooltip: {
                            text: "该状态查询时包含已关闭订单（已关闭订单金额不计入统计项)",
                            dir: "right"
                        }
                    }
                ],
                paystatus: [
                    {
                        id: 0,
                        label: "已结算"
                    },
                    {
                        id: 1,
                        label: "未结算"
                    }
                ],
                orderstype: [
                    {
                        id: 0,
                        label: "会员"
                    },
                    {
                        id: 1,
                        label: "临客"
                    }
                ],
                paytype: [
                    {
                        id: 1,
                        label: "现金"
                    },
                    {
                        id: 5,
                        label: "银行卡"
                    },
                    {
                        id: 0,
                        label: "储值卡"
                    },
                    {
                        id: 6,
                        label: "套餐卡"
                    },
                    {
                        id: 7,
                        label: '其他'
                    }
                ],
                config: function (params, isShowmore) {
                    return {
                        other: params,
                        keyword: {
                            placeholder: "请输入订单编号、会员信息、车辆信息等关键字",
                            model: params.keyword,
                            name: "keyword",
                            isShow: true,
                            isShowmore: isShowmore
                        },
                        searchDirective: [
                            {
                                label: "时间",
                                all: true,
                                custom: true,
                                region: true,
                                type: "date",
                                name: "createtime",
                                model: "",
                                list: this.createtime,
                                start: {
                                    name: "createtime0",
                                    model: params.createtime0,
                                    config: {
                                        minDate: new Date("2017/01/01 00:00:00")
                                    }
                                },
                                end: {
                                    name: "createtime1",
                                    model: params.createtime1,
                                    config: {
                                        minDate: new Date("2017/01/05 00:00:00")
                                    }
                                }
                            },
                            {
                                label: "订单状态",
                                all: true,
                                type: "list",
                                name: "status",
                                model: params.status,
                                list: this.status
                            },
                            {
                                label: "结算状态",
                                all: true,
                                type: "list",
                                name: "paystatus",
                                model: params.paystatus,
                                list: this.paystatus
                            },
                            {
                                label: "结算方式",
                                all: true,
                                type: "list",
                                name: "paytype",
                                model: params.paytype,
                                list: this.paytype
                            },
                            {
                                label: "客户类型",
                                all: true,
                                type: "list",
                                name: "orderstype",
                                model: params.orderstype,
                                list: this.orderstype
                            }
                        ]
                    }
                }
            }
        }
    }
})();
