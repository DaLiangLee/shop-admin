/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive('tradeOrderItems', tradeOrderItems)
        .directive('oraderReceivedDialog', oraderReceivedDialog)
        .directive('orderServiceDialog', orderServiceDialog)
        .directive('oraderPackageDialog', oraderPackageDialog)
        .directive('orderProductDialog', orderProductDialog)
        .directive('orderOffersReceivedDialog', orderOffersReceivedDialog)
        .directive('tableScrollPosition', tableScrollPosition)
        .directive('tradeViewAction', tradeViewAction)
        .directive('oraderOffersDialog', oraderOffersDialog)
        .directive('fastAddServerDialog',fastAddServerDialog)
        .directive('serverNameSelect',serverNameSelect);

    function formatMoney(price) {
        if (_.isUndefined(price)) {
            price = 0;
        }
        if (!angular.isString(price)) {
            price = price.toString();
        }

        var index = price.lastIndexOf('.');
        if (index === -1) {
            return price + '.00';
        } else {
            var precision = price.split('.')[1].length;

            if (precision === 1) {
                return price + '0';
            }
            return price;
        }
    }

    /**
     * 超过1百万上限
     * @param num
     * @returns {boolean}
     */
    function isExceedlimit(num) {
        return num > 1000000;
    }

    /** @ngInject */
    function tradeViewAction($window) {
        return {
            restrict: "A",
            link: function(scope, iElement, iAttrs) {
                var isShowMore = !scope.$eval(iAttrs.tradeViewAction);
                var win = angular.element($window);
                var width = win.width();
                win.on('resize.tradeViewAction', _.throttle(function() {
                    width = win.width();
                    setClass(width, isShowMore);
                }, 300));
                var simpleSearchShowMoreEvent = scope.$on('simpleSearchShowMoreEvent', function(event, data) {
                    isShowMore = data.data;
                    setClass(width, isShowMore)
                });

                function setClass(width, isShowMore) {
                    iElement.toggleClass('action-fixed', !(width <= 1280 || isShowMore));
                }

                setClass(width, isShowMore);

                scope.$on('$destroy', function() {
                    simpleSearchShowMoreEvent();
                    win.off('resize.tradeViewAction');
                });
            }
        }
    }

    /** @ngInject */
    function tableScrollPosition($rootScope, $window) {
        return {
            restrict: "A",
            link: function(scope, iElement) {
                var scroll = iElement.find('.table-scroll .table-body');
                var updateViewFrameworkConfigSidebar = $rootScope.$on('updateViewFrameworkConfigSidebar', function() {
                    setClass();
                });
                var tableFixed = scroll.find('.table-fixed');
                var scrollRight = iElement.find('.table-fixed-right');
                var scrollLeft = iElement.find('.table-fixed-left');

                function setClass() {
                    if (iElement.width() > tableFixed.data('min-width')) {
                        iElement.addClass('table-scroll-position-left');
                        iElement.addClass('table-scroll-position-right');
                    } else {
                        iElement.removeClass('table-scroll-position-right');
                    }
                }

                setClass();
                var rightCol = scrollRight.find('colgroup col');
                var leftCol = scrollLeft.find('colgroup col');
                var scrollTh = scroll.find('th');

                function setRightWidth() {
                    rightCol.css({
                        "width": scrollTh.eq(scrollTh.size() - rightCol.size()).width()
                    });
                }

                function setLeftWidth() {
                    leftCol.each(function(index, domEle) {
                        angular.element(domEle).css({
                            "width": scrollTh.eq(index).width()
                        })
                    });
                }


                angular.element($window).on('resize', _.throttle(function() {
                    setLeftWidth();
                    setClass();
                    setRightWidth();
                }, 300));
                setLeftWidth();

                setRightWidth();

                scroll.on('scroll', function() {
                    if (angular.element(this).scrollLeft() === 0) {
                        iElement.addClass('table-scroll-position-left');
                    } else {
                        iElement.removeClass('table-scroll-position-left');
                    }
                    if (angular.element(this).scrollLeft() >= tableFixed.width() - angular.element(this).width()) {
                        iElement.addClass('table-scroll-position-right');
                    } else {
                        iElement.removeClass('table-scroll-position-right');
                    }
                });

                scope.$on('$destroy', function() {
                    updateViewFrameworkConfigSidebar();
                });
            }
        }
    }

    /** @ngInject */
    function tradeOrderItems($filter, cbAlert, utils, computeService, tadeOrderItems, productGoods, productServer) {
        /**
         * 计算单个服务下所有商品总数
         * @param products
         * @returns {number}
         */
        function computeProductTotalPrice(products) {
            if (_.isUndefined(products) || products.length === 0) {
                return 0;
            }
            return _.reduce(products, function(result, value) {
                return computeService.add(result, value.$allprice);
            }, 0);
        }

        /**
         * 统计商品个数
         * @param products
         * @returns {number}
         */
        function conputeProductCount(products) {
            if (_.isUndefined(products) || products.length === 0) {
                return 0;
            }
            return _.reduce(products, function(result, value) {
                return computeService.add(result + value.num);
            }, 0);
        }

        return {
            restrict: "A",
            replace: true,
            templateUrl: "app/pages/trade_order/trade_order_items.html",
            scope: {
                items: "=",
                handler: "&",
                clear: "=",
                package: "=",
                base: "="
            },
            controller: ["$scope", function($scope) {
                var vm = this;
                // 申明一个项目存储数组
                $scope.details = [];

                // 去监听清空操作
                var clear = $scope.$watch('clear', function(value) {
                    if (value) {
                        $scope.details = [];
                        $scope.isPackage = _.isObject($scope.currentPackage);
                        $scope.isService = false;
                        $scope.handler({
                            data: {
                                details: [],
                                statistics: {
                                    serviceCount: 0,
                                    ssalepriceAll: 0,
                                    productCount: 0,
                                    psalepriceAll: 0,
                                    totalprice: 0
                                }
                            }
                        });
                    }
                });

                $scope.togglePackage = function() {
                    $scope.packageShow = !$scope.packageShow;
                };

                /**/
                $scope.addPackage = function(data, items) {

                };


                /**
                 * 给数组添加一个项目
                 * @param item
                 */
                function addDetails(item) {
                    $scope.details = $scope.details.concat(item);
                    computeTotalPrice($scope.details);
                }


                /**
                 * 添加服务
                 */
                $scope.addService = function(data) {
                    if (data.status === "0") {
                        foldedDefault();
                        _.forEach(data.data, function(item) {
                            item.$productCount = 0;
                            item.itemtype = '0';
                        });
                        $scope.packageShow = false;
                        $scope.isService = true;
                        $scope.orderstype = $scope.base.$isuser ? "0" : "1";
                        addDetails(data.data);
                    }
                };

                /**
                 * 更新商品服务数量
                 * @param item
                 * @param subitem
                 */
                $scope.updateItemNum = function(item, subitem) {
                    // 父级项处理
                    if (_.isUndefined(subitem)) {
                        if (computeAllprice(item)) {
                            cbAlert.alert('商品费用超出100万上限');
                            return false;
                        }
                        computeTotalPrice($scope.details);
                        return false;
                    }
                    if (computeAllprice(subitem)) {
                        cbAlert.alert('商品费用超出100万上限');
                        return false;
                    }
                    item.$productCount = conputeProductCount(item.products);
                    item.$productprice = computeProductTotalPrice(item.products);
                    computeTotalPrice($scope.details);
                };
                /**
                 * 更新商品服务价格
                 * @param item
                 * @param subitem
                 */
                $scope.updateItemPrice = function(item, subitem) {
                    // 父级项处理
                    if (_.isUndefined(subitem)) {
                        if (computeAllprice(item)) {
                            cbAlert.alert('商品费用超出100万上限');
                            return false;
                        }
                        computeTotalPrice($scope.details);
                        return false;
                    }
                    if (computeAllprice(subitem)) {
                        cbAlert.alert('商品费用超出100万上限');
                        return false;
                    }
                    item.$productprice = computeProductTotalPrice(item.products);
                    computeTotalPrice($scope.details);
                };


                function computeAllprice(item) {
                    if (isExceedlimit($filter('moneySubtotalFilter')([item.num, item.price]))) {
                        return true;
                    }
                    item.$allprice = $filter('moneySubtotalFilter')([item.num, item.price]);
                }


                /**
                 * 添加只卖商品服务
                 */
                $scope.addProduct = function(data) {
                    $scope.isService = true;
                    $scope.addServiceProduct(data);
                    $scope.orderstype = $scope.base.$isuser ? "0" : "1";
                };

                /**
                 * 卖商品直接添加索引值 默认-1, 添加以后就是数组索引
                 * @type {number}
                 */
                var addProductsIndex = -1;
                /**
                 * 给对应的服务添加商品
                 * @param data
                 * @param item
                 */
                $scope.addServiceProduct = function(data, item) {
                    if (data.status === "0") {
                        if (!data.data.length) {
                            return;
                        }
                        /**
                         * 直接添加商品是没有item这个对象，需要去手动设置一个空对象
                         */
                        if (_.isUndefined(item)) {
                            _.forEach(data.data, function(item) {
                                item.itemtype = '1';
                                item.$productCount = 0;
                                item.$productprice = item.$allprice;
                                item.$totalPrice = computeService.add(item.$productprice, item.$allprice);
                                $scope.details.push(item);
                            });
                        } else {
                            if (!_.isArray(item.products)) {
                                item.products = [];
                            }
                            item.products = item.products.concat(data.data);
                            item.$productprice = computeService.add(item.$productprice, data.productprice);
                            item.$totalPrice = computeService.add(item.$productprice, item.$allprice);
                            item.$productCount = conputeProductCount(item.products);
                            foldedDefault();
                            item.$folded = true;
                            /**
                             * 如果有索引值的时候，就需要去处理
                             */
                            if (addProductsIndex !== -1) {
                                item.itemtype = '1';
                                /**
                                 * 把创建的对象和创建的商品服务合并
                                 */
                                $scope.details[addProductsIndex] = _.assign({}, $scope.details[addProductsIndex], item);
                                vm.details = $scope.details;
                                /**
                                 * 操作完成以后重置
                                 * @type {number}
                                 */
                                addProductsIndex = -1;
                            }
                        }
                        computeTotalPrice($scope.details);
                    }
                };

                if ($scope.items.length) {
                    if ($scope.base.orderstype === '2') {
                        $scope.currentPackage = angular.fromJson($scope.base.extra);
                        console.log($scope.base)
                        $scope.extra = $scope.currentPackage;
                        $scope.isSelectedPackage = true;
                        $scope.isPackage = true;
                        $scope.isService = false;
                    } else {
                        $scope.isService = true;
                    }
                    // 申明一个项目存储数组
                    $scope.details = [];
                    _.chain($scope.items)
                        .cloneDeep()
                        .tap(function(value) {
                            var items = [];
                            _.forEach(value, function(item) {
                                if (item.itemtype === '0') {
                                    items.push(item);
                                }
                                if (item.itemtype === '1') {
                                    _.forEach(item.products, function(subitem) {
                                        subitem.itemtype = '1';
                                        items.push(subitem);
                                    });
                                }
                            });
                            _.forEach(items, function(item) {
                                if (item.itemtype === '0') {
                                    addDetails([item]);
                                } else {
                                    $scope.addServiceProduct({ status: '0', data: [item] });
                                }
                            });
                        }).value();
                }

                /**
                 * 设置全部收起
                 */
                function foldedDefault() {
                    _.forEach($scope.details, function(item) {
                        item.$folded = false;
                    });
                }

                /**
                 * 计算合计，统计商品项和合计，统计服务项和合计
                 */
                function computeTotalPrice(details) {
                    $scope.handler({
                        data: {
                            details: getDetails(details),
                            statistics: tadeOrderItems.computeTally(details),
                            orderstype: $scope.orderstype,
                            extra: $scope.extra
                        }
                    });
                }


                /**
                 * 将数据格式化成后台需要数据
                 * @param details         前端显示的数据
                 * @returns {TResult[]}   返回后台数据
                 */
                function getDetails(details) {
                    // 不是数组直接抛错
                    if (!_.isArray(details)) {
                        throw Error('参数不是一个数组')
                    }
                    // 空数组直接返回
                    if (_.isEmpty(details)) {
                        return [];
                    }
                    return _.map(details, function(item) {
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
                }

                /**
                 * 给当前项设置常用并提交给后台
                 * @param item
                 * @param subitem
                 */
                $scope.setCommonlyused = function(item, subitem) {
                    var items = null;
                    if (item.itemtype === '0') {
                        items = {
                            'guid': item.itemskuid,
                            'serverid': item.itemid,
                            'commonlyused': item.commonlyused
                        };
                        if (!_.isUndefined(subitem)) {
                            items = {
                                'guid': subitem.itemskuid,
                                'serverid': subitem.itemid,
                                'commonlyused': subitem.commonlyused
                            };
                            productGoods.updateProductSku(items).then(utils.requestHandler);
                            return;
                        }
                        productServer.updateServerSku(items).then(utils.requestHandler);
                    }
                    if (item.itemtype === '1') {
                        items = {
                            'guid': item.itemskuid,
                            'productid': item.itemid,
                            'commonlyused': item.commonlyused
                        };
                        productGoods.updateProductSku(items).then(utils.requestHandler);
                    }
                };

                /**
                 * 更新备注
                 * @param data
                 * @param item
                 */
                $scope.updateItemRemark = function(data, item) {
                    item.remark = data;
                    computeTotalPrice($scope.details);
                };

                /**
                 * 根据guid删除某一项
                 * @param item
                 * @param subitem
                 */
                $scope.removeItem = function(item, subitem) {
                    if (_.isUndefined(subitem)) {
                        _.remove($scope.details, function(key) {
                            return key.itemskuid === item.itemskuid;
                        });
                    } else {
                        _.remove(item.products, function(key) {
                            return key.itemskuid === subitem.itemskuid;
                        });
                        item.$productCount = item.products.length;
                        item.$productPrice = _.reduce(item.products, function(result, value) {
                            return computeService.add(result, value.$allprice);
                        }, 0);
                    }
                    if (!$scope.details.length) {
                        $scope.isPackage = _.isObject($scope.currentPackage);
                        $scope.isService = false;
                    }
                    computeTotalPrice($scope.details);
                };


                vm.computeTotalPrice = function() {
                    computeTotalPrice($scope.details);
                };

                // 确保工具提示被销毁和删除。
                $scope.$on('$destroy', function() {
                    clear();
                });
            }]
        }
    }

    /** @ngInject */
    function oraderReceivedDialog($q, cbDialog, tadeOrder, simpleDialogService, computeService, marktingJk) {
        return {
            restrict: "A",
            scope: {
                item: "=",
                itemHandler: "&"
            },
            link: function(scope, iElement) {
                /**
                 * 打开弹窗
                 * @type {boolean}
                 */
                var isOpen = false;
                var checkstoreuseraccount = 0;
                var geekscoupons = [{
                    id: "-1",
                    name: "不赠送优惠券"
                }];
                var usercoupons = [];

                function handler(childScope) {

                    /**
                     * 验证表单
                     * @type {{paycode: boolean}}
                     */
                    childScope.checkForm = {
                        paycode: true,
                        preferentialprice: true,
                        validate: function() {
                            return this.paycode || this.preferentialprice;
                        }
                    };

                    /**
                     * 临时获取显示的数据集
                     * @type {{}}
                     */
                    childScope.cache = {};


                    childScope.cache.getPreferentialprice = function(error) {
                        if (error && error.cbMoneyRange) {
                            return "抹零必须小于应收金额";
                        }
                    };
                    /**
                     * 验证支付密码
                     */
                    childScope.paycodeHandle = function(code) {
                        childScope.checkForm.paycode = code.length !== 6;
                    };
                    childScope.item = angular.copy(scope.item);
                    childScope.item.checkstoreuseraccount = checkstoreuseraccount;
                    childScope.item.shared = true;
                    childScope.item.arrearsprice = computeService.pullMoney(childScope.item.arrearsprice);
                    childScope.item.preferentialprice = "";
                    childScope.item.jKCouponId = "-1";
                    childScope.usercouponsModel = {
                        store: usercoupons,
                        handler: function(data) {
                            var items = _.find(usercoupons, { id: data });
                            childScope.item.deductible = items.coupon.price;
                            childScope.item.shared = items.coupon.canMix;
                            if (!items.coupon.canMix) {
                                childScope.item.deductibletype = "1";
                            } else {
                                childScope.item.deductibletype = "0";
                            }
                            childScope.item.userJKCoupon = _.omit(items, ['couponname']);
                            setPaytype();
                        }
                    };
                    childScope.item.handler = function(data) {
                        this.deductibletype = data;
                        setPaytype();
                    };
                    childScope.item.paid = function() {
                        // 如果验证出错就会出现问题
                        var preferentialprice = _.isUndefined(this.preferentialprice) ? 0 : this.preferentialprice;
                        // 公式： 优惠金额 = 合计 X 会员折扣 - 输入优惠
                        if (this.orderstype === '0') {
                            if (this.shared) { // 优惠金额和优惠劵共享
                                var total = 0;
                                if (_.isUndefined(this.deductible)) {
                                    total = preferentialprice;
                                } else {
                                    total = computeService.pullMoney(this.deductible + computeService.pushMoney(preferentialprice));
                                }
                                return round(this.arrearsprice, total) < 0 ? 0 : round(this.arrearsprice, total);
                            } else { // 优惠金额和优惠劵取一
                                if (this.deductibletype === "2") { // 优惠金额
                                    return round(this.arrearsprice, preferentialprice);
                                } else { // 优惠劵
                                    return round(this.arrearsprice, computeService.pullMoney(this.deductible));
                                }
                            }
                        }
                        return round(this.arrearsprice, preferentialprice);
                    };

                    /**
                     * 保留2位小数，不5入，大于2位小数直接干掉
                     * @param num1 {number}
                     * @param num2 {number}
                     * @returns {number}
                     */
                    function round(num1, num2) {
                        return computeService.pullMoney(computeService.pushMoney(num1) - computeService.pushMoney(num2))
                    }

                    childScope.item.deductibletypeList = [{
                            "label": "使用优惠劵",
                            "value": "1"
                        },
                        {
                            "label": "不使用优惠劵",
                            "value": "2"
                        }
                    ];

                    /**
                     * 提交错误提示
                     * @type {{show: boolean}}
                     */
                    childScope.error = {
                        show: false
                    };
                    // 如果当前优惠和初始优惠不一样，就算手动优惠。
                    childScope.item.checkDiscounttype = function() {
                        setPaytype();
                    };

                    if (childScope.item.orderstype === '2') {
                        childScope.item.extra = angular.fromJson(childScope.item.extra);
                    }

                    // 失去焦点如果优惠没有填默认是0
                    childScope.item.setPreferentialprice = function(error) {
                        if (error && error.cbMoneyRange) {
                            return false;
                        }
                        if (childScope.item.preferentialprice === "" || _.isUndefined(childScope.item.preferentialprice)) {
                            childScope.item.preferentialprice = "";
                        }else{
                            childScope.item.preferentialprice = Number(childScope.item.preferentialprice).toFixed(2);
                        }
                        setPaytype();
                    };

                    childScope.interceptor = false;

                    childScope.confirm = function() {
                        childScope.interceptor = true;
                        childScope.error.show = false;
                    };

                    function setPaytype() {
                        childScope.paytype = [{
                                "label": "现金",
                                "isBalance": true,
                                "value": "1",
                                "current": !(childScope.item.checkstoreuseraccount >= childScope.item.paid())
                            },
                            {
                                "label": "银行卡",
                                "isBalance": true,
                                "value": "5",
                                "current": false
                            },
                            {
                                "label": "其他",
                                "isBalance": true,
                                "value": "7",
                                "current": false
                            }
                        ];

                        if (scope.item.orderstype === '0') {
                            childScope.paytype.unshift({
                                "label": "储值卡",
                                "account": childScope.item.checkstoreuseraccount,
                                "isBalance": (childScope.item.checkstoreuseraccount >= childScope.item.paid()),
                                "value": "0",
                                "current": (childScope.item.checkstoreuseraccount >= childScope.item.paid())
                            })
                        }

                        if (childScope.item.orderstype === '2') {
                            childScope.item.paytype = '6';
                        } else {
                            childScope.item.paytype = (childScope.item.checkstoreuseraccount >= childScope.item.paid()) ? "0" : "1";
                            childScope.error.show = childScope.item.paytype === "0" && childScope.error.msg;
                        }
                    }

                    setPaytype();

                    childScope.setPaytype = function(item) {
                        _.map(childScope.paytype, function(key) {
                            key.current = false;
                        });
                        item.current = true;
                        childScope.item.paytype = item.value;
                    };

                    childScope.interceptorConfirm = function() {
                        childScope.isLoadData = true;
                        childScope.error.show = false;
                        var data = _.pick(childScope.item, ['guid', 'paytype', 'paycode', 'remarks', 'preferentialprice', 'userJKCoupon']);
                        data.preferentialprice = computeService.pushMoney(data.preferentialprice);
                        if (childScope.item.deductibletype === "1") {
                            data.preferentialprice = 0;
                        }
                        if (!data.preferentialprice) {
                            data.preferentialprice = 0;
                        }
                        if (childScope.item.deductibletype === "2") {
                            data = _.omit(data, ['userJKCoupon']);
                        }
                        if (data.paytype !== '0' && childScope.item.orderstype === '0' || childScope.item.orderstype === '1') {
                            data = _.omit(data, ['paycode']);
                        }
                        tadeOrder.update(data).then(function(results) {
                            if (results.data.status === 0) {
                                if (childScope.item.orderstype === '0' || childScope.item.orderstype === '2') {
                                    childScope.showGift = true;
                                } else {
                                    childScope.close();
                                    isOpen = false;
                                    scope.itemHandler({ data: { "status": '1' } });
                                }
                            } else {
                                childScope.error.show = true;
                                childScope.error.msg = results.data.data;
                                childScope.interceptor = false;
                            }
                            childScope.isLoadData = false;
                        }).catch(function() {
                            childScope.isLoadData = false;
                        });
                    };

                    childScope.giftConfirm = function() {
                        var data = _.pick(childScope.item, ['jKCouponId']);
                        var status;
                        if (_.isEmpty(data.jKCouponId) || data.jKCouponId === '-1') {
                            status = "1";
                        } else {
                            status = "0";
                            data.userinfo = angular.toJson(scope.item.userinfo);
                        }
                        childScope.cancel();
                        scope.itemHandler({ data: { "status": status, "data": data } });
                    };

                    childScope.closed = function() {
                        var status = childScope.showGift ? '1' : '2';
                        childScope.cancel();
                        scope.itemHandler({ data: { "status": status, "data": {} } });
                    };

                    childScope.cancel = function() {
                        childScope.close();
                        isOpen = false;
                    };


                    /**
                     * 领卷选择下拉
                     * @type {{store: Array, handler: handler}}
                     */
                    childScope.couponsModel = {
                        store: geekscoupons,
                        handler: function(data) {}
                    };
                }

                /**
                 * 点击按钮
                 */
                iElement.click(function(t) {
                    if (scope.item.paystatus === "0" && scope.item.status !== "4" || scope.item.paystatus === "1" && scope.item.status === "4") {
                        return false;
                    }
                    if (isOpen) {
                        return false;
                    }
                    isOpen = true;
                    scope.itemHandler({ data: { "status": "-1", "data": "打开成功" } });
                    t.preventDefault();
                    t.stopPropagation();
                    if (scope.item.orderstype === '1') { // 客户
                        checkstoreuseraccount = false;
                        cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
                            windowClass: "viewFramework-orader-received-dialog"
                        });
                    } else if (scope.item.orderstype === '0') { // 会员
                        var totalprice = computeService.add(scope.item.psaleprice, scope.item.ssaleprice);
                        $q.all([tadeOrder.checkstoreuseraccount(scope.item.guid), tadeOrder.getAvaCouponByUserID({ userid: scope.item.userinfo.guid }), marktingJk.userjkcouponlistbyuserid({ userid: scope.item.userinfo.guid })])
                            .then(function(results) {
                                if (results[0].data.status === 0 && results[1].data.status === 0 && results[2].data.status === 0) {
                                    checkstoreuseraccount = computeService.pullMoney(results[0].data.data);
                                    geekscoupons.push.apply(geekscoupons, results[1].data.data);
                                    usercoupons = _.chain(results[2].data.data)
                                        .filter(function(char) { // 总价大于使用门槛金额才能使用
                                            return totalprice >= char.coupon.conditionPrice;
                                        })
                                        .map(function(value) {
                                            value.coupon = _.omit(value.coupon, ['creator', 'store']);
                                            value.couponname = value.coupon.name;
                                            return _.omit(value, ['user'])
                                        }).value();
                                    cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
                                        windowClass: "viewFramework-orader-received-dialog"
                                    });
                                } else {
                                    isOpen = false;
                                    simpleDialogService.error(results.data.data);
                                }
                            });
                    } else if (scope.item.orderstype === '2') { // 会员套餐
                        tadeOrder.getAvaCouponByUserID({ userid: scope.item.userinfo.guid })
                            .then(function(results) {
                                if (results.data.status === 0) {
                                    geekscoupons.push.apply(geekscoupons, results.data.data);
                                    cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
                                        windowClass: "viewFramework-orader-received-dialog"
                                    });
                                } else {
                                    simpleDialogService.error(results.data.data);
                                    isOpen = false;
                                }
                            });
                    }
                })
            }
        }
    }

    /** @ngInject */
    function oraderPackageDialog($filter, cbDialog, marktingPackage, utils, computeService) {
        return {
            restrict: "A",
            scope: {
                items: "=",
                change: "=",
                handler: "&"
            },
            link: function(scope, iElement) {
                var packageData = null;

                function handler(childScope) {
                    childScope.packageData = _.cloneDeep(scope.items);
                    if (_.isEmpty(scope.change)) {
                        _.forEach(packageData, function(item) {
                            (!item.unit && item.type === "1") && (item.unit = "件");
                            if (utils.isNumber(item.num)) {
                                item.num = 0;
                            }
                            item.use = 0;
                        });
                    } else {
                        _.forEach(packageData, function(item) {
                            (!item.unit && item.type === "1") && (item.unit = "件");
                            if (utils.isNumber(item.num)) {
                                item.num = 0;
                            }
                            item.use = 0;
                            _.forEach(scope.change, function(nitem) {
                                if (item.objectid === nitem.itemskuid) {
                                    item.use = nitem.num * 1;
                                    return false;
                                }
                            });
                        });
                    }
                    childScope.packageData.packageItems = packageData;

                    /**
                     * 获取剩余数量
                     * @type {T[]|string[]}
                     */
                    childScope.balance = _.filter(childScope.packageData.packageItems, function(item) {
                        return item.num !== 0;
                    });

                    childScope.selectDisabled = true;

                    /**
                     * 获取本次使用数量
                     * @type {any[]|string[]}
                     */
                    childScope.selectUse = function(data, item) {
                        item.use = data;
                        childScope.selectDisabled = _.filter(childScope.packageData.packageItems, function(item) {
                            return item.use > 0;
                        }).length;
                    };

                    /**
                     * 获取提交的数据
                     * @returns {[]}
                     */
                    function getData() {
                        return _.chain(childScope.packageData.packageItems)
                            .filter(function(item) {
                                return item.num > 0;
                            })
                            .filter(function(item) {
                                return item.use > 0;
                            })
                            .map(function(item) {
                                var items = angular.fromJson(item.item);
                                var itemid = null;
                                var productprice = 0,
                                    productCount = 0;
                                if (!_.isUndefined(items.serverid)) {
                                    itemid = items.serverid;
                                }
                                var originprice = computeService.pullMoney(item.originprice);
                                var price = computeService.pullMoney(item.price);
                                if (!_.isUndefined(items.productid)) {
                                    itemid = items.productid;
                                    productprice = computeService.multiply(price, item.use);
                                    productCount = 1;
                                }
                                var originpriceuse = $filter('moneySubtotalFilter')([originprice, item.use]);
                                var priceuse = $filter('moneySubtotalFilter')([price, item.use]);

                                return {
                                    userpackageitemid: item.id,
                                    userpackageid: item.userpackageid,
                                    itemname: item.name,
                                    price: price,
                                    num: item.use,
                                    $unit: item.unit,
                                    itemsku: item.item,
                                    itemid: itemid,
                                    itemskuid: items.guid,
                                    itemtype: item.type,
                                    originprice: originprice,
                                    preferential: computeService.pullMoney(computeService.pushMoney(originpriceuse) - computeService.pushMoney(priceuse)),
                                    $allprice: priceuse,
                                    $totalPrice: productprice,
                                    $productprice: productprice,
                                    $productCount: productCount,
                                    commonlyused: items.commonlyused
                                };
                            })
                            .value();
                    }

                    /**
                     * 把数据提交给控制器
                     */
                    childScope.confirm = function() {
                        scope.handler({ data: { "status": "0", "data": getData() } });
                        childScope.close();
                    };
                }


                /**
                 * 点击按钮
                 */
                iElement.click(function(t) {
                    scope.handler({ data: { "status": "-1", "data": "打开成功" } });
                    t.preventDefault();
                    t.stopPropagation();
                    marktingPackage.getuserpackageitembyuserid({
                        userpackageid: scope.items.id,
                        userid: scope.items.userid
                    }).then(utils.requestHandler).then(function(results) {
                        packageData = results.data;
                        cbDialog.showDialogByUrl("app/pages/trade_order/orader-package-dialog.html", handler, {
                            windowClass: "viewFramework-order-package-dialog"
                        });
                    });
                });
            }
        }
    }

    /**
     * 分类服务和商品
     * @param items
     * @returns {{service: Array, product: Array}}
     */
    function getItemsData(items) {
        return _.reduce(items, function(result, item) {
            if (item.itemtype === "0") {
                result.service.push(item);
            } else {
                result.product.push(item);
            }
            return result;
        }, { service: [], product: [] });
    }

    /** @ngInject */
    function orderServiceDialog($filter, cbDialog, computeService, category, tadeOrder) {
        return {
            restrict: "A",
            scope: {
                items: "=",
                handler: "&"
            },
            link: function(scope, iElement) {
                var service = null;

                function handler(childScope) {
                    /**
                     * 请求数据初始化
                     * @type {{pageSize: number, page: string, stencilstore: string, order: string}}
                     */
                    var currentParams = { pageSize: 15, page: "1", stencilstore: "0", order: "1" };

                    /**
                     * 保留商品
                     * @type {Array}
                     */
                    var saveProductData = getItemsData(scope.items).product;

                    /**
                     * 初始化结果
                     * @type {Array}
                     */
                    childScope.dataSources = getItemsData(scope.items).service;

                    /**
                     * 初始化结果
                     * @type {Array}
                     */
                    childScope.dataSources = getItemsData(scope.items).service;

                    childScope.tooltip = {
                        title: "从【车边库】选择的服务将自动添加到您的服务库"
                    };

                    childScope.searchModel = {
                        search: {
                            stencilstore: "0",
                            order: "1",
                            scateid1: "-1"
                        },
                        stencilstore: [{
                                label: "本店",
                                value: "0"
                            },
                            {
                                label: "车边库",
                                value: "1"
                            }
                        ],
                        order: [{
                                label: "常用",
                                value: "1"
                            },
                            {
                                label: "默认",
                                value: "0"
                            }
                        ],
                        scateid1: [{
                            value: "-1",
                            label: "全部"
                        }].concat(_.map(service, function(item) {
                            return {
                                value: item.id,
                                label: item.catename
                            };
                        })),
                        handler: function(data, type) {
                            if (!_.isUndefined(data) && !_.isUndefined(type)) {
                                this.search[type] = data;
                            }
                            currentParams = angular.extend({}, currentParams, this.search);
                            currentParams.page = "1";
                            getList(currentParams);
                        },
                        searchHandler: _.debounce(function() {
                            this.handler();
                        }, 500)
                    };

                    /**
                     * gridModel 表格
                     * @type {{}}
                     */
                    childScope.gridModel = {
                        loadingState: true,
                        itemList: [],
                        pageChanged: function(page) {
                            currentParams.page = page;
                            getList(currentParams);
                        },
                        // 全选
                        changeSelectionAll: function(checked) {
                            var _this = this;
                            _.forEach(this.itemList, function(item) {
                                item.$checked = checked;
                                _this.changeSelection(checked, item);
                            });
                            if(checked){
                                childScope.isEmptyData = false;
                            }
                        },
                        // 单个选中
                        changeSelection: function(checked, item) {
                            if (checked) {
                                !isExist(item.guid) && childScope.dataSources.push(item);
                                childScope.isEmptyData = false;
                                return false;
                            } else {
                                _.remove(childScope.dataSources, { 'itemskuid': item.itemskuid });
                                return false;
                            }
                        },
                        checkedAll: false,
                        indeterminate: function() {
                            if (!this.itemList.length) {
                                this.checkedAll = false;
                                return false;
                            }
                            var checkedAll = _.filter(this.itemList, '$checked');
                            this.checkedAll = checkedAll.length === this.itemList.length;
                            return checkedAll.length > 0 && checkedAll.length < this.itemList.length;
                        },
                        handler: function($event, item) {
                            if (item.$disabled) {
                                return false;
                            }
                            item.$checked = !item.$checked;
                            this.changeSelection(item.$checked, item);
                        }
                    };

                  /*
                   *  快速新增服务弹窗指令回调   by   yigeng   2017/08/24
                   *
                   * */
                  childScope.fastAddServerCb = function(data){
                    // 如果回调状态为 '0' 则重新获取列表数据
                    if(data.status == '0'){
                      console.log(data);
                      currentParams.order = "0";
                      getList(currentParams);
                    }
                  };


                    /**
                     * 获取列表
                     * @param params
                     */
                    function getList(params) {
                        childScope.gridModel.loadingState = true;
                        if (params.scateid1 === "-1") {
                            delete params.scateid1;
                        }
                        if (params.order === "0") {
                            delete params.order;
                        }
                        tadeOrder.getOrderServer(params).then(function(results) {
                            // 防止用户手动输入没有数据
                            if (!results.data.totalCount && params.page !== "1") {
                                currentParams.page = "1";
                                getList(currentParams);
                            }
                            handleListResult(results.data);
                        })
                    }

                    /**
                     * 初始化调用
                     */
                    getList(currentParams);


                    /**
                     * 处理列表结果
                     * @param results
                     * @returns {boolean}
                     */
                    function handleListResult(results) {
                        childScope.gridModel.checkedAll = false;
                        var total = results.totalCount;
                        // 如果没有数据就阻止执行，提高性能，防止下面报错
                        if (total === 0) {
                            childScope.gridModel.itemList = [];
                            childScope.gridModel.loadingState = false;
                            childScope.ordersDetails = undefined;
                            return false;
                        }

                        /**
                         * 组装数据
                         * @type {*}
                         */
                        childScope.gridModel.itemList = _.map(results.data, formatItemList);

                        childScope.gridModel.checkedAll = _.every(childScope.gridModel.itemList, '$checked');
                        childScope.gridModel.paginationinfo = {
                            page: currentParams.page * 1,
                            pageSize: currentParams.pageSize,
                            total: total
                        };
                        childScope.gridModel.loadingState = false;
                    }

                    /**
                     * 格式化列表数据
                     * @param item
                     * @returns {*}
                     */
                    function formatItemList(item) {
                        item.$checked = isExist(item.guid);
                        item.itemskuid = item.guid;
                        item.$itemname = item.servername + " " + item.manualskuvalues;
                        item.$price = $filter('moneySubtotalFilter')([item.serverprice, item.servertime]);
                        item.defaultsku = currentParams.stencilstore === "1";
                        return item;
                    }

                    /**
                     * 检查当前这些是否在提交列表中
                     * @param id
                     * @returns {boolean}
                     */
                    function isExist(id) {
                        return !_.isUndefined(_.find(childScope.dataSources, { 'itemskuid': id }));
                    }

                    /**
                     * 格式化结果列表数据
                     * @param item
                     * @returns {*}
                     */
                    function formatDataSources(item) {
                        if (_.isUndefined(item.guid)) {
                            return _.find(scope.items, { 'itemskuid': item.itemskuid });
                        }
                        /**
                         * 适配手机开发修改
                         */
                        var price = !_.isUndefined(item.$price) ? computeService.pullMoney(item.$price) : item.price;
                        var num = _.isUndefined(item.num) ? 1 : item.num;
                        var allprice = _.isUndefined(item.$allprice) ? price : item.$allprice;
                        var totalPrice = _.isUndefined(item.$totalPrice) ? price : item.$totalPrice;
                        var productCount = _.isUndefined(item.$productCount) ? 0 : item.$productCount;
                        var productprice = _.isUndefined(item.$productprice) ? 0 : item.$productprice;
                        var itemname = _.isUndefined(item.$itemname) ? item.itemname : item.$itemname;
                        var remark = _.isUndefined(item.remark) ? "" : item.remark;
                        var itemid = _.isUndefined(item.serverid) ? item.itemid : item.serverid;
                        var itemsku = _.isUndefined(item.itemsku) ? angular.toJson(_.omit(item, ['$itemname', '$price', '$checked', '$disabled'])) : item.itemsku;
                        var itemskuid = _.isUndefined(item.itemskuid) ? item.guid : item.itemskuid;
                        var defaultsku = _.isUndefined(item.defaultsku) ? false : item.defaultsku;
                        var products = _.isUndefined(item.products) ? [] : item.products;
                        var servicer = _.isUndefined(item.servicer) ? "" : item.servicer;
                        var servicername = _.isUndefined(item.servicername) ? "" : item.servicername;
                        return {
                            $allprice: allprice,
                            $totalPrice: totalPrice,
                            $productCount: productCount,
                            $productprice: productprice,
                            itemname: itemname,
                            price: Number(price).toFixed(2),
                            num: num,
                            remark: remark,
                            itemid: itemid,
                            itemskuid: itemskuid,
                            itemtype: "0",
                            itemsku: itemsku,
                            servicer: servicer,
                            servicername: servicername,
                            defaultsku: defaultsku,
                            products: products
                        };
                    }

                    /**
                     * 合并提交数据
                     */
                    function mergePushData() {
                        return _.chain(childScope.dataSources)
                            .map(formatDataSources)
                            .concat(saveProductData)
                            .value();
                    }

                    /*{
                      itemname: 服务名称+sku名称
                      price: 单价*工时
                      num: 数量 默认1
                      servicer：施工人员id
                      servicername：施工人员姓名
                      remark：备注
                      itemsku：当前sku
                      itemid：当前服务id
                      itemskuid：当前skuid
                      itemtype：订单项类型（服务0、商品1）
                    }*/

                    function isEmptyData() {
                        return !childScope.dataSources.length;
                    }

                    /**
                     * 把数据提交给控制器
                     */
                    childScope.confirm = function() {
                        if(isEmptyData()){
                            childScope.isEmptyData = true;
                            return false;
                        }
                        scope.handler({ data: { "status": "0", "data": mergePushData() } });
                        childScope.close();
                        service = null;
                    };
                }


                /**
                 * 点击按钮
                 */
                iElement.click(function(t) {
                    scope.handler({ data: { "status": "-1", "data": "打开成功" } });
                    t.preventDefault();
                    t.stopPropagation();
                    /**
                     * 获取筛选类目
                     */
                    category.server().then(function(results) {
                        service = results;
                        cbDialog.showDialogByUrl("app/pages/trade_order/order-service-dialog.html", handler, {
                            windowClass: "viewFramework-order-service-dialog"
                        });
                    });
                });
            }
        }
    }

    /** @ngInject */
    function orderProductDialog(cbDialog, category, computeService, tadeOrder, localstorage) {
        return {
            restrict: "A",
            scope: {
                items: "=",
                handler: "&"
            },
            link: function(scope, iElement, iAttrs) {
                /**
                 * 商品类目
                 * @type {null}
                 */
                var product = null;
                /**
                 * 防止多次点击
                 * @type {boolean}
                 */
                var isOpen = false;

                function handler(childScope) {
                    /**
                     * 初始化请求参数
                     * @type {{pageSize: number, page: string, stencilstore: string, order: string}}
                     */
                    var currentParams = { pageSize: 15, page: "1", stencilstore: "0", order: "1" };
                    var productService = iAttrs.productService === "true";
                    /**
                     * 保留服务
                     * @type {Array}
                     */
                    var saveServiceData = getItemsData(scope.items).service;

                    /**
                     * 初始化结果
                     * @type {Array}
                     */
                    childScope.dataSources = getItemsData(scope.items).product;

                    /**
                     * 存储到本地存储里面只有10条
                     * @type {Array}
                     */
                    var orderProductLastuse = [];

                    /**
                     * searchModel 搜索
                     * @type {*}
                     */
                    childScope.searchModel = {
                        search: {
                            stencilstore: "0",
                            order: "1",
                            pcateid1: "-1"
                        },
                        stencilstore: [{
                                label: "本店",
                                value: "0"
                            },
                            {
                                label: "车边库",
                                value: "1"
                            }
                        ],
                        order: [{
                                label: "常用",
                                value: "1"
                            },
                            {
                                label: "默认",
                                value: "0"
                            }
                        ],
                        pcateid1: [{
                            value: "-1",
                            label: "全部"
                        }].concat(_.map(product, function(item) {
                            return {
                                value: item.id,
                                label: item.catename
                            };
                        })),
                        handler: function(data, type) {
                            if (!_.isUndefined(data) && !_.isUndefined(type)) {
                                this.search[type] = data;
                            }
                            currentParams = angular.extend({}, currentParams, this.search);
                            currentParams.page = "1";
                            getList(currentParams);
                        },
                        searchHandler: _.debounce(function() {
                            this.handler();
                        }, 500),
                        lastuse: function() {
                            if (localstorage.get('orderProductLastuse')) {
                                orderProductLastuse = localstorage.get('orderProductLastuse');
                            }
                            return localstorage.get('orderProductLastuse') || [];
                        },
                        clearlastuse: function() {
                            orderProductLastuse = [];
                            localstorage.remove('orderProductLastuse');
                            this.lastuse();
                        },
                        lastusehandler: function($event, item) {
                            this.search.keyword = item;
                            this.isOpen = false;
                            this.handler();
                        }
                    };


                    /**
                     * gridModel 表格
                     * @type {{}}
                     */
                    childScope.gridModel = {
                        loadingState: true,
                        itemList: [],
                        pageChanged: function(page) {
                            currentParams.page = page;
                            getList(currentParams);
                        },
                        // 全选
                        changeSelectionAll: function(checked) {
                            var _this = this;
                            _.forEach(this.itemList, function(item) {
                                item.$checked = checked;
                                _this.changeSelection(checked, item);
                            });
                            if(checked){
                                childScope.isEmptyData = false;
                            }
                        },
                        // 单个选中
                        changeSelection: function(checked, item) {
                            if (checked) {
                                !isExist(item.guid) && childScope.dataSources.push(item);
                                childScope.isEmptyData = false;
                                return false;
                            } else {
                                _.remove(childScope.dataSources, { 'itemskuid': item.itemskuid });
                                return false;
                            }
                        },
                        checkedAll: false,
                        indeterminate: function() {
                            if (!this.itemList.length) {
                                this.checkedAll = false;
                                return false;
                            }
                            var checkedAll = _.filter(this.itemList, '$checked');
                            this.checkedAll = checkedAll.length === this.itemList.length;
                            return checkedAll.length > 0 && checkedAll.length < this.itemList.length;
                        },
                        handler: function($event, item) {
                            item.$checked = !item.$checked;
                            this.changeSelection(item.$checked, item);
                        }
                    };

                    /**
                     * 获取列表
                     * @param params
                     */
                    function getList(params) {
                        childScope.gridModel.loadingState = true;
                        if (params.pcateid1 === "-1") {
                            delete params.pcateid1;
                        }
                        if (params.order === "0") {
                            delete params.order;
                        }
                        tadeOrder.getOrderProduct(params).then(function(results) {
                            // 防止用户手动输入没有数据
                            if (!results.data.totalCount && params.page !== "1") {
                                currentParams.page = "1";
                                getList(currentParams);
                            }
                            handleListResult(results.data);
                        })
                    }

                    /**
                     * 初始化调用
                     */
                    getList(currentParams);

                    /**
                     * 处理列表结果
                     * @param results
                     * @returns {boolean}
                     */
                    function handleListResult(results) {
                        childScope.gridModel.checkedAll = false;
                        var total = results.totalCount;
                        // 如果没有数据就阻止执行，提高性能，防止下面报错
                        if (total === 0) {
                            childScope.gridModel.itemList = [];
                            childScope.gridModel.loadingState = false;
                            childScope.ordersDetails = undefined;
                            return false;
                        }

                        /**
                         * 组装数据
                         * @type {*}
                         */
                        childScope.gridModel.itemList = _.map(results.data, formatItemList);

                        childScope.gridModel.checkedAll = _.every(childScope.gridModel.itemList, 'checked');
                        childScope.gridModel.paginationinfo = {
                            page: currentParams.page * 1,
                            pageSize: currentParams.pageSize,
                            total: total
                        };
                        childScope.gridModel.loadingState = false;
                    }

                    /**
                     * 格式化列表数据
                     * @param item
                     * @returns {*}
                     */
                    function formatItemList(item) {
                        item.$checked = isExist(item.guid);
                        item.salepriceText = computeService.pullMoney(item.salepriceText);
                        if (currentParams.stencilstore === "1") {
                            item.defaultsku = true;
                            item.$unit = item.unit;
                            item.unit = null;
                        } else {
                            if ((_.isEmpty(item.stock) && !_.isNumber(item.stock))) {
                                item.$stock = "无限";
                            } else {
                                item.$stock = item.stock;
                                item.$stockwarn = item.stock <= 0;
                            }
                        }
                        item.itemskuid = item.guid;
                        return item;
                    }

                    /**
                     * 检查当前这些是否在提交列表中
                     * @param id
                     * @returns {boolean}
                     */
                    function isExist(id) {
                        return !_.isUndefined(_.find(childScope.dataSources, { 'itemskuid': id }));
                    }

                    /**
                     * 格式化结果列表数据
                     * @param item
                     * @returns {*}
                     */
                    function formatDataSources(item) {
                        if (_.isUndefined(item.guid)) {
                            return _.find(scope.items, { 'itemskuid': item.itemskuid });
                        }
                        // orderProductLastuse.unshift(item.cnname + " " + item.productname + " " + item.manualskuvalues);
                        /**
                         * 适配手机
                         */
                        var unit = _.isUndefined(item.$unit) ? (item.unit || '件') : item.$unit;
                        var itemname = _.isUndefined(item.itemname) ? item.cnname + " " + item.productname + " " + item.manualskuvalues : item.itemname;
                        var itemid = _.isUndefined(item.productid) ? item.itemid : item.productid;
                        var itemskuid = _.isUndefined(item.itemskuid) ? item.guid : item.itemskuid;
                        var remark = _.isUndefined(item.remark) ? "" : item.remark;
                        var num = _.isUndefined(item.num) ? 1 : item.num;
                        var price = _.isUndefined(item.salepriceText) ? item.price : item.salepriceText;
                        var allprice = _.isUndefined(item.$allprice) ? item.salepriceText : item.$allprice;
                        var itemsku = _.isUndefined(item.itemsku) ? angular.toJson(_.omit(item, ['$checked'])) : item.itemsku;
                        var defaultsku = _.isUndefined(item.defaultsku) ? false : item.defaultsku;
                        if (productService) {
                            var servicer = _.isUndefined(item.servicer) ? "" : item.servicer;
                            var servicername = _.isUndefined(item.servicername) ? "" : item.servicername;
                            return {
                                $unit: unit,
                                $allprice: allprice,
                                itemname: itemname,
                                price: Number(price).toFixed(2),
                                num: num,
                                remark: remark,
                                itemid: itemid,
                                itemskuid: itemskuid,
                                itemtype: "1",
                                itemsku: itemsku,
                                defaultsku: defaultsku,
                                servicer: servicer,
                                servicername: servicername
                            };
                        } else {
                            return {
                                $unit: unit,
                                $allprice: allprice,
                                itemname: itemname,
                                price: Number(price).toFixed(2),
                                num: num,
                                remark: remark,
                                itemid: itemid,
                                itemskuid: itemskuid,
                                itemtype: "1",
                                itemsku: itemsku,
                                defaultsku: defaultsku
                            };
                        }
                    }

                    /**
                     * 合并提交数据
                     */
                    function mergePushData() {
                        var results = {
                            productprice: 0,
                            itemList: null
                        };

                        results.itemList = saveServiceData.concat(_.chain(childScope.dataSources)
                            .map(formatDataSources)
                            .value());
                        results.productprice = _.reduce(childScope.dataSources, function(result, value) {
                            return computeService.add(result, value.$allprice);
                        }, 0);
                        return results;
                    }
                    function isEmptyData() {
                        return !childScope.dataSources.length;
                    }

                    /**
                     * 确定
                     */
                    childScope.confirm = function() {
                        if(isEmptyData()){
                            childScope.isEmptyData = true;
                            return false;
                        }
                        var data = mergePushData();
                        scope.handler({
                            data: {
                                "status": "0",
                                "data": data.itemList,
                                "productprice": data.productprice
                            }
                        });
                        orderProductLastuse = orderProductLastuse.slice(0, 10);

                        localstorage.set('orderProductLastuse', orderProductLastuse);
                        childScope.closed();
                    };

                    childScope.closed = function() {
                        isOpen = false;
                        childScope.close();
                    };
                }

                /**
                 * 点击按钮
                 */
                iElement.click(function(t) {
                    if (isOpen) {
                        return false;
                    }
                    isOpen = true;
                    scope.handler({ data: { "status": "-1", "data": "打开成功" } });
                    t.preventDefault();
                    t.stopPropagation();
                    /**
                     * 获取筛选类目
                     */
                    category.goods().then(function(results) {
                        product = results;
                        cbDialog.showDialogByUrl("app/pages/trade_order/order-product-dialog.html", handler, {
                            windowClass: "viewFramework-order-product-dialog"
                        });
                    });
                });
            }
        }
    }

    /**
     * 获取当前选择优惠类型
     * (支付:0折扣券,1会员折扣,2优惠,3服务优惠,4商品优惠,98套餐卡优惠,99抹零)
     * @param discounttype
     * @param options
     * @returns {string}
     */
    function getDiscounttype(discounttype, options) {
        if (discounttype === "1") {
            var isAll = _.every(options, 'checked');
            if (isAll) {
                return discounttype;
            } else {
                if (options[0].checked) {
                    return "3";
                }
                if (options[1].checked) {
                    return "4";
                }
                return "0";
            }
        }
        return discounttype;
    }

    /** @ngInject */
    function oraderOffersDialog($filter, cbDialog, userCustomer, simpleDialogService, computeService) {
        return {
            restrict: "A",
            scope: {
                carno: "=",
                userid: "=",
                offers: "=",
                orderstype: "=",
                offersHandler: "&"
            },
            link: function(scope, iElement) {
                var isOpen = false;
                var discount = undefined;

                function handler(childScope) {
                    childScope.orderstype = scope.orderstype;

                    /**
                     * 临时获取显示的数据集
                     * @type {{}}
                     */
                    childScope.cache = {};

                    /**
                     * 需要提交给后台的数据集
                     * @type {{}}
                     */
                    // childScope.store = {};

                    /**
                     * 会员折扣方式
                     * @type {{options: Array, change: Function}}
                     */
                    childScope.simpleCheckbox = {
                        change: function(data, item) {
                            item.checked = data;
                            item.checked ? getUserDiscount(item.type) : getUserDiscountDefault(item.type);
                            childScope.cache.paid();
                        }
                    };
                    // 传递是一个0-100数字，需要先除100；
                    if (scope.orderstype === '2') {
                        childScope.cache = _.pick(scope.offers, ['preferentialprice']);
                        childScope.cache.psalepriceAll = scope.offers.poriginpriceAll;
                        childScope.cache.ssalepriceAll = scope.offers.soriginpriceAll;
                        childScope.cache.totalprice = computeService.add(scope.offers.poriginpriceAll, scope.offers.soriginpriceAll);
                        childScope.cache.discounttype = "98";
                        childScope.cache.paid = function() {
                            return scope.offers.totalprice;
                        };
                    } else {
                        childScope.cache = _.pick(scope.offers, ['psalepriceAll', 'ssalepriceAll', 'totalprice']);
                        childScope.cache.preferentialprice = undefined;
                        childScope.cache.discount = discount;
                        childScope.cache.discounttype = scope.orderstype === '0' ? "1" : "0";
                        var discountRate = computeService.pullMoney(discount);
                        var discountFormat = "（" + discount / 10 + "折）";

                        childScope.simpleCheckbox.options = [{
                                label: "服务打折：- ¥ " + $filter('number')(getUserDiscount('ssalepriceAll'), 2) + discountFormat,
                                value: "3",
                                checked: true,
                                type: 'ssalepriceAll'
                            },
                            {
                                label: "商品打折：- ¥ " + $filter('number')(getUserDiscount('psalepriceAll'), 2) + discountFormat,
                                value: "4",
                                checked: true,
                                type: 'psalepriceAll'
                            }
                        ];
                        childScope.cache.paid = function() {
                            var userDiscount = add(this['$$psalepriceAll'], this['$$ssalepriceAll']);
                            var preferentialprice = 0;
                            if (!_.isUndefined(this.preferentialprice)) {
                                preferentialprice = this.preferentialprice;
                            }
                            return round(userDiscount, preferentialprice);
                        };
                    }
                    childScope.cache.carno = scope.carno;

                    function getUserDiscount(type) {
                        childScope.cache['$$' + type] = $filter('moneySubtotalFilter')([childScope.cache[type], discountRate]);
                        childScope.cache['$' + type] = round(childScope.cache[type],childScope.cache['$$' + type]);
                        return childScope.cache['$' + type];
                    }

                    function getUserDiscountDefault(type) {
                        childScope.cache['$$' + type] = childScope.cache[type];
                    }

                    /**
                     * 保留2位小数，不5入，大于2位小数直接干掉
                     * @param num1 {number}
                     * @param num2 {number}
                     * @returns {number}
                     */
                    function round(num1, num2) {
                        return computeService.pullMoney(computeService.pushMoney(num1) - computeService.pushMoney(num2))
                    }

                    /**
                     * 保留2位小数，不5入，大于2位小数直接干掉
                     * @param num1 {number}
                     * @param num2 {number}
                     * @returns {number}
                     */
                    function add(num1, num2) {
                        return computeService.pullMoney(computeService.pushMoney(num1) + computeService.pushMoney(num2))
                    }

                    childScope.cache.getPreferentialprice = function(error) {
                        if (error && error.cbMoneyRange) {
                            return "优惠必须小于总费用";
                        }
                    };

                    /**
                     * 优惠方式配置
                     * @type {{options: Array, change: Function}}
                     */
                    childScope.simpleRadio = {
                        options: [{
                                value: "1",
                                label: "会员折扣"
                            },
                            {
                                value: "2",
                                label: "优惠"
                            },
                            {
                                value: "0",
                                label: "无优惠"
                            }
                        ],
                        change: function(data) {
                            childScope.cache.discounttype = data;
                            if (childScope.cache.discounttype === '1') {
                                childScope.cache.discount = discount;
                                if (childScope.simpleCheckbox.options[0].checked) {
                                    getUserDiscount('ssalepriceAll');
                                } else {
                                    getUserDiscountDefault('psalepriceAll');
                                }
                                if (childScope.simpleCheckbox.options[1].checked) {
                                    getUserDiscount('psalepriceAll');
                                } else {
                                    getUserDiscountDefault('ssalepriceAll');
                                }
                            } else {
                                childScope.cache.discount = 100;
                                getUserDiscountDefault('psalepriceAll');
                                getUserDiscountDefault('ssalepriceAll');
                            }
                            if (childScope.cache.discounttype !== '2') {
                                childScope.cache.preferentialprice = "";
                            }
                            childScope.cache.paid();
                        }
                    };

                    childScope.cache.setPreferentialprice = function (error) {
                        if (error && error.cbMoneyRange) {
                            return false;
                        }
                        if (childScope.cache.preferentialprice === "" || _.isUndefined(childScope.cache.preferentialprice)) {
                            childScope.cache.preferentialprice = "";
                        }else{
                            console.log(childScope.cache.preferentialprice)

                            childScope.cache.preferentialprice = Number(childScope.cache.preferentialprice).toFixed(2);
                        }
                    };


                    /**
                     * 如果是临客单就把会员折扣删除
                     */
                    if (childScope.orderstype === '1') {
                        _.remove(childScope.simpleRadio.options, { 'label': "会员折扣" });
                    }

                    /**
                     * 确定
                     */
                    childScope.confirm = function() {
                        var store = _.pick(childScope.cache, ['preferentialprice', 'discount']);
                        store.discounttype = getDiscounttype(childScope.cache.discounttype, childScope.simpleCheckbox.options);
                        scope.offersHandler({
                            data: {
                                "status": "0",
                                "data": store || 0,
                                "next": true
                            }
                        });
                        childScope.close();
                        discount = undefined;
                        isOpen = false;
                    };
                    childScope.closed = function() {
                        scope.offersHandler({ data: { "status": "0", "price": 0, "next": false } });
                        isOpen = false;
                        discount = undefined;
                        childScope.close();
                    }
                }

                /**
                 * 点击按钮
                 */
                iElement.click(function(event) {
                    if (isOpen) {
                        return;
                    }
                    isOpen = true;
                    event.preventDefault();
                    event.stopPropagation();
                    scope.offersHandler({ data: { "status": "-1", "data": "打开成功" } });
                    userCustomer.getDiscount({ userid: scope.userid }).then(function(results) {
                        if (results.data.status === 0) {
                            discount = results.data.data;
                            cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-dialog.html", handler, {
                                windowClass: "viewFramework-orader-offers-dialog"
                            });
                        } else {
                            simpleDialogService.error("错误提示", results.data.data);
                            isOpen = false;
                        }
                    });

                });

            }
        }
    }

    /** @ngInject */
    function orderOffersReceivedDialog($q, $filter, cbDialog, userCustomer, marktingJk, cbAlert, computeService, tadeOrder, tadeOrderItems) {
        return {
            restrict: "A",
            scope: {
                offers: "=",
                database: "=",
                handler: "&"
            },
            link: function(scope, iElement) {
                var discount = 100;
                var checkstoreuseraccount = 0;
                var geekscoupons = [{
                    id: "-1",
                    name: "不赠送优惠券"
                }];
                var usercoupons = [];

                function handler(childScope) {
                    childScope.isNext = false;

                    /**
                     * 临时获取显示的数据集
                     * @type {{}}
                     */
                    childScope.cache = {};

                    /**
                     * 会员折扣方式
                     * @type {{options: Array, change: Function}}
                     */
                    childScope.simpleCheckbox = {
                        change: function(data, item) {
                            item.checked = data;
                            item.checked ? getUserDiscount(item.type) : getUserDiscountDefault(item.type);
                            childScope.cache.paid();
                        }
                    };
                    if (scope.database.orderstype === '2') {
                        childScope.cache.preferentialpricetemp = scope.offers.preferentialprice;
                        childScope.cache.psalepriceAll = scope.offers.poriginpriceAll;
                        childScope.cache.ssalepriceAll = scope.offers.soriginpriceAll;
                        childScope.cache.totalprice = computeService.add(scope.offers.poriginpriceAll, scope.offers.soriginpriceAll);
                        childScope.cache.discounttype = "98";
                        childScope.cache.packagename = angular.fromJson(scope.database.extra).packagename;
                        /**
                         * 开单的应收金额
                         * @returns {number|*}
                         */
                        childScope.cache.paid = function() {
                            return scope.offers.totalprice;
                        };
                    } else {
                        childScope.cache = _.pick(scope.offers, ['psalepriceAll', 'ssalepriceAll', 'totalprice']);
                        childScope.cache.discount = discount;
                        childScope.cache.preferentialpricetemp = undefined;
                        // 如果是会员直接选择会员折扣
                        childScope.cache.discounttype = scope.database.orderstype === "0" ? "1" : "0";
                        /**
                         * 开单的应收金额
                         * @returns {number}
                         */
                        var discountRate = computeService.pullMoney(discount);
                        var discountFormat = "（" + discount / 10 + "折）";
                        childScope.simpleCheckbox.options = [{
                                label: "服务打折：- ¥ " + $filter('number')(getUserDiscount('ssalepriceAll'), 2) + discountFormat,
                                value: "3",
                                checked: true,
                                type: 'ssalepriceAll'
                            },
                            {
                                label: "商品打折：- ¥ " + $filter('number')(getUserDiscount('psalepriceAll'), 2) + discountFormat,
                                value: "4",
                                checked: true,
                                type: 'psalepriceAll'
                            }
                        ];
                        childScope.cache.paid = function() {
                            var userDiscount = add(this['$$psalepriceAll'], this['$$ssalepriceAll']);
                            var preferentialprice = 0;
                            if (!_.isUndefined(this.preferentialpricetemp)) {
                                preferentialprice = this.preferentialpricetemp;
                            }
                            return round(userDiscount, preferentialprice);
                        };
                    }
                    childScope.cache.carno = scope.database.carno;

                    function getUserDiscount(type) {
                        childScope.cache['$$' + type] = $filter('moneySubtotalFilter')([childScope.cache[type], discountRate]);
                        childScope.cache['$' + type] = round(childScope.cache[type],childScope.cache['$$' + type]);
                        return childScope.cache['$' + type];
                    }

                    function getUserDiscountDefault(type) {
                        childScope.cache['$$' + type] = childScope.cache[type];
                    }
                    childScope.cache.jKCouponId = "-1";

                    childScope.cache.orderstype = scope.database.orderstype;
                    childScope.cache.shared = true;
                    /**
                     * 收款的应收金额
                     * @returns {number}
                     */
                    childScope.cache.paid2 = function() {
                        // 公式： 优惠金额 = 合计 X 会员折扣 - 输入优惠
                        if (this.orderstype === '0') {
                            if (this.shared) { // 优惠金额和优惠劵共享
                                var total = 0;
                                if (_.isUndefined(this.deductible)) {
                                    total = this.preferentialpricenew || 0;
                                } else {
                                    total = computeService.pullMoney(this.deductible + computeService.pushMoney(this.preferentialpricenew || 0));
                                }
                                return round(this.$arrearsprice, total) < 0 ? 0 : round(this.$arrearsprice, total);
                            } else { // 优惠金额和优惠劵取一
                                if (this.deductibletype === "2") { // 优惠金额
                                    return round(this.$arrearsprice, this.preferentialpricenew || 0);
                                } else { // 优惠劵
                                    return round(this.$arrearsprice, computeService.pullMoney(this.deductible));
                                }
                            }
                        }
                        return round(this.$arrearsprice, this.preferentialpricenew || 0);
                    };

                    /**
                     * 保留2位小数，不5入，大于2位小数直接干掉
                     * @param num1 {number}
                     * @param num2 {number}
                     * @returns {number}
                     */
                    function round(num1, num2) {
                        return computeService.pullMoney(computeService.pushMoney(num1) - computeService.pushMoney(num2))
                    }

                    /**
                     * 保留2位小数，不5入，大于2位小数直接干掉
                     * @param num1 {number}
                     * @param num2 {number}
                     * @returns {number}
                     */
                    function add(num1, num2) {
                        return computeService.pullMoney(computeService.pushMoney(num1) + computeService.pushMoney(num2))
                    }

                    childScope.cache.deductibletypeList = [{
                            "label": "使用优惠劵",
                            "value": "1"
                        },
                        {
                            "label": "不使用优惠劵",
                            "value": "2"
                        }
                    ];

                    /**
                     * 优惠方式配置
                     * @type {{options: Array, change: Function}}
                     */
                    childScope.simpleRadio = {
                        options: [{
                                value: "1",
                                label: "会员折扣"
                            },
                            {
                                value: "2",
                                label: "优惠"
                            },
                            {
                                value: "0",
                                label: "无优惠"
                            }
                        ],
                        change: function(data) {
                            childScope.cache.discounttype = data;
                            if (childScope.cache.discounttype === '1') {
                                childScope.cache.discount = discount;
                                if (childScope.simpleCheckbox.options[0].checked) {
                                    getUserDiscount('ssalepriceAll');
                                } else {
                                    getUserDiscountDefault('psalepriceAll');
                                }
                                if (childScope.simpleCheckbox.options[1].checked) {
                                    getUserDiscount('psalepriceAll');
                                } else {
                                    getUserDiscountDefault('ssalepriceAll');
                                }
                            } else {
                                childScope.cache.discount = 100;
                                getUserDiscountDefault('psalepriceAll');
                                getUserDiscountDefault('ssalepriceAll');
                            }
                            if (childScope.cache.discounttype !== '2') {
                                childScope.cache.preferentialpricetemp = "";
                            }
                            childScope.cache.paid();
                        }
                    };
                    /**
                     * 如果是临客单就把会员折扣删除
                     */
                    if (childScope.cache.orderstype === '1') {
                        _.remove(childScope.simpleRadio.options, { 'label': "会员折扣" });
                    }


                    // 如果当前优惠和初始优惠不一样，就算手动优惠。
                    childScope.cache.checkDiscounttype = function () {
                        setPaytype();
                    };

                    // 失去焦点如果优惠没有填默认是空
                    childScope.cache.setPreferentialprice1 = function (error) {
                        if (error && error.cbMoneyRange) {
                            return false;
                        }
                        if (childScope.cache.preferentialpricetemp === "" || _.isUndefined(childScope.cache.preferentialpricetemp)) {
                            childScope.cache.preferentialpricetemp = "";
                        }else{
                            childScope.cache.preferentialpricetemp = Number(childScope.cache.preferentialpricetemp).toFixed(2);
                        }
                    };


                    // 失去焦点如果优惠没有填默认是空
                    childScope.cache.setPreferentialprice2 = function (error) {
                        if (error && error.cbMoneyRange) {
                            return false;
                        }
                        if (childScope.cache.preferentialpricenew === "" || _.isUndefined(childScope.cache.preferentialpricenew)) {
                            childScope.cache.preferentialpricenew = "";
                        }else{
                            childScope.cache.preferentialpricenew = Number(childScope.cache.preferentialpricenew).toFixed(2);
                        }
                    };

                    function setPaytype() {
                        childScope.cache.paytypeList = [{
                                "label": "现金",
                                "isBalance": true,
                                "value": "1",
                                "current": !(checkstoreuseraccount >= childScope.cache.paid2())
                            },
                            {
                                "label": "银行卡",
                                "isBalance": true,
                                "value": "5",
                                "current": false
                            },
                            {
                                "label": "其他",
                                "isBalance": true,
                                "value": "7",
                                "current": false
                            }
                        ];

                        if (childScope.cache.orderstype === '0') {
                            childScope.cache.paytypeList.unshift({
                                "label": "储值卡",
                                "account": checkstoreuseraccount,
                                "isBalance": (checkstoreuseraccount >= childScope.cache.paid2()),
                                "value": "0",
                                "current": (checkstoreuseraccount >= childScope.cache.paid2())
                            })
                        }

                        if (childScope.cache.orderstype === '2') {
                            childScope.cache.paytype = '6';
                        } else {
                            childScope.cache.paytype = (checkstoreuseraccount >= childScope.cache.paid2()) ? "0" : "1";
                            childScope.error.show = childScope.cache.paytype === "0" && childScope.error.msg;
                        }
                    }

                    /**
                     * 提交错误提示
                     * @type {{show: boolean}}
                     */
                    childScope.error = {
                        show: false
                    };

                    childScope.cache.getPreferentialprice = function(error) {
                        if (error && error.cbMoneyRange) {
                            return "优惠必须小于总费用";
                        }
                    };

                    childScope.cache.getPreferentialprice1 = function(error) {
                        if (error && error.cbMoneyRange) {
                            return "抹零必须小于应收金额";
                        }
                    };

                    childScope.cache.setPaytype = function (item) {
                        _.map(childScope.cache.paytypeList, function (key) {
                            key.current = false;
                        });
                        item.current = true;
                        childScope.cache.paytype = item.value;
                    };

                    childScope.usercouponsModel = {
                        handler: function(data) {
                            var items = _.find(usercoupons, { id: data });
                            childScope.cache.deductible = items.coupon.price;
                            childScope.cache.shared = items.coupon.canMix;
                            if (!items.coupon.canMix) {
                                childScope.cache.deductibletype = "1";
                            } else {
                                childScope.cache.deductibletype = "0";
                            }
                            childScope.cache.userJKCoupon = _.omit(items, ['couponname']);
                            setPaytype();
                        }
                    };

                    childScope.cache.handler = function (data) {
                        childScope.cache.deductibletype = data;
                        setPaytype();
                    };

                    /**
                     * 上一步开单
                     */
                    childScope.prev = function() {
                        if (childScope.cache.discounttype === '1') {
                            childScope.cache.preferentialprice = "";
                        }
                        childScope.cache.preferentialpricetemp = childScope.cache.preferentialprice;
                        childScope.cache.preferentialpricenew = "";
                        childScope.isNext = false;
                    };

                    /**
                     * 下一步收款
                     */
                    childScope.next = function() {
                        childScope.cache.$arrearsprice = childScope.cache.paid();
                        if (_.isUndefined(childScope.cache.preferentialpricetemp)) {
                            childScope.cache.preferentialprice = 0;
                        } else {
                            childScope.cache.preferentialprice = childScope.cache.preferentialpricetemp;
                        }
                        setPaytype();
                        var totalprice = computeService.pushMoney(childScope.cache.paid());
                        childScope.usercouponsModel.store = _.chain(usercoupons)
                            .filter(function(char) { // 总价大于使用门槛金额才能使用
                                return totalprice >= char.coupon.conditionPrice;
                            })
                            .map(function(item) {
                                item.coupon = _.omit(item.coupon, ['creator', 'store']);
                                item.couponname = item.coupon.name;
                                return _.omit(item, ['user']);
                            }).value();
                        childScope.isNext = true;
                    };

                    /**
                     * 确定
                     */
                    childScope.confirm = function() {
                        // (支付:0折扣券,1会员折扣,2优惠,3服务优惠,4商品优惠,98套餐卡优惠,99抹零)
                        childScope.isLoadData = true;
                        childScope.error.show = false;
                        var data = _.pick(childScope.cache, ['guid', 'paytype', 'paycode', 'remarks', 'discounttype', 'preferentialprice', 'preferentialpricenew', 'userJKCoupon']);
                        data.discounttype = getDiscounttype(childScope.cache.discounttype, childScope.simpleCheckbox.options);
                        if (!data.preferentialpricenew) {
                            data.preferentialpricenew = 0;
                        }
                        /*if (childScope.item.deductibletype === "1") {
                            data.preferentialprice = 0;
                        }
                        if (childScope.item.deductibletype === "2") {
                            console.log(_.omit(childScope.item, ['userJKCoupon']))
                            data = _.omit(childScope.item, ['userJKCoupon']);
                        }
                        if (data.paytype !== '0' && childScope.item.orderstype === '0' || childScope.item.orderstype === '1') {
                            console.log(_.omit(childScope.item, ['paycode']))
                            //data = _.omit(data, ['paycode']);
                        }
                        console.log(getDiscounttype(childScope.item.discounttype))*/
                        if (childScope.cache.deductibletype === "2") {
                            data = _.omit(data, ['userJKCoupon']);
                        }
                        var dataBase = _.assign({}, scope.database, data);
                        tadeOrder.saveOrderAndPay(tadeOrderItems.getDataBase(dataBase))
                            .then(function(results) {
                                if (results.data.status === 0) {
                                    if (childScope.cache.orderstype === '0' || childScope.cache.orderstype === '2') {
                                        childScope.showGift = true;
                                    } else {
                                        childScope.close();
                                        scope.handler({ data: { "status": "1" } });
                                    }
                                } else {
                                    childScope.error.show = true;
                                    childScope.error.msg = results.data.data;
                                }
                                childScope.isLoadData = false;
                            });
                    };
                    childScope.closed = function() {
                        var status = childScope.showGift ? '1' : '2';
                        childScope.close();
                        scope.handler({ data: { "status": status, "price": 0 } });
                    };

                    /**
                     * 领卷确认
                     */
                    childScope.giftConfirm = function() {
                        var data = _.pick(childScope.item, ['jKCouponId']);
                        var status;
                        if (_.isEmpty(data.jKCouponId) || data.jKCouponId === '-1') {
                            status = "1";
                        } else {
                            status = "0";
                            data.userinfo = angular.toJson(scope.database.userinfo);
                        }
                        childScope.close();
                        scope.handler({ data: { "status": status, "data": data } });
                    };

                    /**
                     * 领卷选择下拉
                     * @type {{store: Array, handler: handler}}
                     */
                    childScope.couponsModel = {
                        store: geekscoupons,
                        handler: function() {}
                    };

                }

                /**
                 * 点击按钮
                 */
                iElement.click(function(t) {
                    scope.handler({ data: { "status": "-1", "data": "打开成功" } });
                    t.preventDefault();
                    t.stopPropagation();
                    if (scope.database.orderstype === '1') { // 客户
                        checkstoreuseraccount = 0;
                        cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
                            windowClass: "viewFramework-orader-offers-received-dialog"
                        });
                    } else if (scope.database.orderstype === '0') { // 会员
                        var userid = scope.database.userinfo.guid;
                        if (_.isUndefined(scope.database.guid)) {
                            checkstoreuseraccount = computeService.pullMoney(scope.database.userinfo.balance);
                            $q.all([userCustomer.getDiscount({ userid: userid }), tadeOrder.getAvaCouponByUserID({ userid: userid }), marktingJk.userjkcouponlistbyuserid({ userid: userid })])
                                .then(function(results) {
                                    if (results[0].data.status === 0 && results[1].data.status === 0 && results[2].data.status === 0) {
                                        discount = results[0].data.data;
                                        geekscoupons.push.apply(geekscoupons, results[1].data.data);
                                        usercoupons = results[2].data.data;
                                        cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
                                            windowClass: "viewFramework-orader-offers-received-dialog"
                                        });
                                    } else {
                                        cbAlert.error(results.data.data);
                                    }
                                });
                        } else {
                            $q.all([tadeOrder.checkstoreuseraccount(scope.database.guid), userCustomer.getDiscount({ userid: userid }), tadeOrder.getAvaCouponByUserID({ userid: userid }), marktingJk.userjkcouponlistbyuserid({ userid: userid })])
                                .then(function(results) {
                                    if (results[0].data.status === 0 && results[1].data.status === 0 && results[2].data.status === 0 && results[3].data.status === 0) {
                                        checkstoreuseraccount = computeService.pullMoney(results[0].data.data);
                                        discount = results[1].data.data;
                                        geekscoupons.push.apply(geekscoupons, results[2].data.data);
                                        usercoupons = results[3].data.data;
                                        cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
                                            windowClass: "viewFramework-orader-offers-received-dialog"
                                        });
                                    } else {
                                        cbAlert.error(results.data.data);
                                    }
                                });
                        }
                    } else if (scope.database.orderstype === '2') { // 会员套餐
                        tadeOrder.getAvaCouponByUserID({ userid: scope.database.userinfo.guid }).then(function(results) {
                            if (results.data.status === 0) {
                                geekscoupons.push.apply(geekscoupons, results.data.data);
                                cbDialog.showDialogByUrl("app/pages/trade_order/orader-offers-received-dialog.html", handler, {
                                    windowClass: "viewFramework-orader-offers-received-dialog"
                                });
                            } else {
                                cbAlert.error(results.data.data);
                            }
                        });
                    }
                });
            }
        }
    }


    /*
    * 快速新增服务弹窗指令  2017/08/23   by  yigeng
    * */

    function fastAddServerDialog(cbDialog,category,$document,$timeout,productServer,cbAlert,simpleDialogService,$filter,computeService) {
      return {
        restrict: "A",
        scope:{
          item:'@',
          itemHandler:'&'
        },
        link:function(scope,iElement){
          var serverCategory;

          function handler(childScope){
            var isEdit = false;
            childScope.showGuideInfo = true;
            childScope.showTips = false;
            childScope.showSelect = false;
            childScope.serverCategory = serverCategory;
            childScope.dataBase = {
              serverSkus:[]
            };

            /*
            * 点击页面其它位置隐藏服务名称下拉框
            * */
            $document.on('click',function(){
              scope.$apply(function () {
                childScope.showSelect = false;
              });
            });

            /*
            * 友情提示关闭
            * */

            childScope.hideGuideInfo = function(){
              childScope.showGuideInfo = false;
            };


            /*
            * 1. 5秒后右上角右上角自动消失
            * */
            $timeout(function(){
              childScope.hideGuideInfo();
            },5000);


            /*
            * 服务名称输入框聚焦后处理函数
            * */
            childScope.changeServername = function(e){
              e.stopPropagation();
              childScope.$isServernameEmpty = false;
              if(!childScope.dataBase.scateid1){
                childScope.showTips = true;
              } else{
                childScope.showSelect = true;
              }
            };

            /*
            * 手动输入服务名称时的处理函数
            * */

            var timer = null;
            childScope.serachServername = function(){
              if (!childScope.dataBase.servername){
                childScope.serverStore = servernameList;
                return;
              }

              /*var searchResult = [];
              _.forEach(childScope.serverStore,function(v){
                if(v.catename.indexOf(childScope.dataBase.servername) >= 0){
                  searchResult.push(v);
                }
              });

              childScope.serverStore = searchResult;*/
              // _.debounce(function(){
                console.log(childScope.dataBase.servername);
                childScope.serverStore = $filter('filter')(servernameList,{
                  catename:childScope.dataBase.servername
                })
              // },500);

            };


            var servernameList = [];

            /*
            *  选择服务类目后的处理思路
            * 1.确定服务名称的范围
            * 2.隐藏‘请先选择类目’提示文字
            * 3.隐藏服务名称选择下拉框
            * */

            childScope.selectCategory = function(data){
              // console.log(data);
              // console.log(childScope.dataBase.scateid1);
              // console.log(childScope.serverCategory);
              childScope.dataBase.servername = undefined;
              childScope.dataBase.manualskuvalues = '';
              childScope.dataBase.serverprice = '';
              childScope.dataBase.skudescription = '';
              childScope.$isServernameEmpty = false;
              childScope.$isManualskuvaluesEmpty = false;
              childScope.$isServerpriceEmpty = false;
              _.forEach(childScope.serverCategory,function(v){
                if(v.id == data){
                  childScope.serverStore = v.items;
                  servernameList = v.items;
                  return;
                }
              });
              // console.log(childScope.serverStore);
              childScope.showSelect = false;
              childScope.showTips = false;

            };

            /**
             * 服务名称下拉框点击回调
             * @param data
             */

            childScope.selectServerCallback = function(data){
              if(data.status === '0'){
                childScope.dataBase.servername = data.data.catename;
                childScope.dataBase.scateid2 = data.data.id;
                childScope.showSelect = false;

                productServer.checkServer({scateid1: childScope.dataBase.scateid1, servername: childScope.dataBase.servername}).then(function(results){
                  if(results.data.status === 0){
                    console.log('没有同名');
                  }else{
                    console.log('有同名');
                    isEdit = true;
                    /*
                    * 如果有同名的则获取该服务详细信息
                    * */
                    productServer.getServerSkus({id: results.data.guid}).then(function(result){
                      var data = result.data;
                      console.log(data.data);
                      childScope.dataBase = data.data;
                    })
                  }
                })
                // console.log(childScope.dataBase);
              }
            };

            /*
            * 格式化数据
            * */

            function setDataBase(dataBase){
              var serverSkus = {
                attrvalues:'{}',
                manualskuvalues:dataBase.manualskuvalues,
                serverprice:computeService.pushMoney(dataBase.serverprice),
                skudescription:dataBase.skudescription,
                status:'1',
                servertime:'1.0'
              };
              if(!isEdit){
                serverSkus.sortsku = 0
              } else {
                serverSkus.sortsku = childScope.dataBase.serverSkus.length;
                serverSkus.serverid = childScope.dataBase.guid;
              }
              childScope.dataBase.serverSkus.push(serverSkus);
              childScope.dataBase.status = 1;
            }

            /*
            * 表单验证拦截器
            * */
            childScope.serverpriceWarning = '请输入服务费';

            function interception(){
              var flag = true;
              //服务类目
              if(!childScope.dataBase.scateid1) {
                childScope.$isScateid1Empty = true;
                flag = false;
              }
              //服务名称
              if(!childScope.dataBase.servername){
                childScope.$isServernameEmpty = true;
                childScope.showTips = false;
                flag = false;
              }
              //服务sku规格
              if(!childScope.dataBase.manualskuvalues){
                childScope.$isManualskuvaluesEmpty = true;
                flag = false;
              }
              //服务sku服务费
              if(!childScope.dataBase.serverprice){
                childScope.$isServerpriceEmpty = true;
                flag = false;
              }
              if(childScope.dataBase.serverprice && childScope.dataBase.serverprice*1 > 999999){
                childScope.$isOverMax = true;
                // childScope.serverpriceWarning = '服务费最大值为999999';
                flag = false;
              }

              return flag;
            }

            /*
            * 向后台提交数据
            * */


            childScope.confirm = function(){
              /*
              * 将表单数据提交给后台，成功后执行指令回调
              * */
              if(!interception()){
                return;
              }
              /*childScope.dataBase.status = 1;
              childScope.dataBase.serverSkus[0].status = '1';
              childScope.dataBase.serverSkus[0].attrvalues = {};
              childScope.dataBase.serverSkus[0].serverprice = computeService.pushMoney(childScope.dataBase.serverSkus[0].serverprice);*/

              setDataBase(childScope.dataBase);
              console.log(childScope.dataBase);

              productServer.saveServer(childScope.dataBase).then(function (results) {
                if (results.data.status === 0) {
                  scope.itemHandler({
                    data:{
                      status:'0',
                      data:'执行回调'
                    }
                  });
                  childScope.close();
                  simpleDialogService.success('创建成功');
                } else {
                  simpleDialogService.error( results.data.data,"错误提示");
                }
              });
            }
          }
          
          iElement.on('click',function (e) {
            e.stopPropagation();
            e.preventDefault();
            cbDialog.showDialogByUrl("app/pages/trade_order/fast-add-server-dialog.html", handler, {
              windowClass: "viewFramework-fast-add-server-dialog"
            });

            category.server().then(function (results) {
              serverCategory = results;
            });

          })
        }
      }
    }

    function serverNameSelect() {
      return {
        restrict:'A',
        replace:true,
        scope:{
          item:'=',
          itemHandler:'&'
        },
        templateUrl:'app/pages/trade_order/server-name-select.html',
        link:function(scope){
          scope.select = function(item){
            scope.itemHandler({
              data:{
                status:'0',
                data:{
                  catename:item.catename,
                  id:item.id
                }
              }
            })
          }
        }
      }
    }
})();