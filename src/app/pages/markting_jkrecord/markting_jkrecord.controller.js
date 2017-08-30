(function () {
    'use strict';
    angular
        .module('shopApp')
        .controller('MarktingJkRecordController', MarktingJkRecordController);


    function MarktingJkRecordController($state, cbAlert, marktingJk, marktingJkRecordConfig, computeService) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = angular.extend({}, $state.params, {pageSize: 10});
        var propsParams = {};

        vm.gridModel = {
            columns: _.clone(marktingJkRecordConfig().DEFAULT_GRID.columns),
            userPackage: [],
            config: _.merge(marktingJkRecordConfig().DEFAULT_GRID.config, {propsParams: propsParams}),
            loadingState: true,      // 加载数据
            pageChanged: function (data) {    // 监听分页
                var page = angular.extend({}, currentParams, {page: data});
                $state.go(currentStateName, page);
            },
            sortChanged: function (data) {
                var orders = [];
                angular.forEach(data.data, function (item, key) {
                    orders.push({
                        "field": key.replace("", ""),
                        "direction": item
                    });
                });
                var order = angular.extend({}, currentParams, {orders: angular.toJson(orders)});
                getList(order);
            }

        };

        var DEFAULT_SEARCH = _.cloneDeep(marktingJkRecordConfig().DEFAULT_SEARCH);
        var searchModel = _.chain(_.clone(currentParams)).tap(function (value) {
            _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd']), function (item, key) {
                !_.isUndefined(item) && (value[key] = computeService.pullMoney(item));
            });
        }).value();

        vm.searchModel = {
            config: DEFAULT_SEARCH.config(searchModel),
            'handler': function (data) {
                var items = _.find(DEFAULT_SEARCH.conditionPrice, function (item) {
                    return item.id === data.conditionPriceStart * 1;
                });
                if (angular.isDefined(items)) {
                    data.conditionPriceEnd = undefined;
                }
                var search = _.chain(data).tap(function (value) {
                    _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd']), function (item, key) {
                        !_.isUndefined(item) && (value[key] = computeService.pushMoney(item));
                    });
                }).value();

                _.chain(currentParams).tap(function (value) {
                    _.forEach(_.pick(value, ['conditionPriceStart', 'conditionPriceEnd']), function (item, key) {
                        !_.isUndefined(item) && (value[key] *= 1);

                    });
                }).value();
                // 如果路由一样需要刷新一下
                if (angular.equals(currentParams, search)) {
                    $state.reload();
                } else {
                    search.page = '1';
                    $state.go(currentStateName, search);
                }
            }
        };

        /**
         * 检查oss返回的头像
         * @type {RegExp}
         */
        var AVATAR_OSS_REGULAR = /^http:\/\/|https:\/\//;
        function getList(params) {
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            if (!params.page) {
                return;
            }

            marktingJk.record(params).then(function (results) {
                var result = results.data;
                if (result.status * 1 === 0) {

                    vm.eg = result.data;
                    _.forEach(result.data, function (item) {
                        if (item.usedDate) {
                            /*已使用*/
                            item.coupon.state = "0";
                        } else {
                            var nowTime = (new Date()).getTime() - 24 * 3600 * 1000;
                            var maxTime = (new Date(item.end)).getTime();
                            if (nowTime - maxTime > 0) {
                                /*未使用已过期*/
                                item.coupon.state = "2";
                            } else {
                                /*未使用未过期*/
                                item.coupon.state = "1";
                            }
                        }
                        if (!AVATAR_OSS_REGULAR.test(item.avatar)) {
                            item.avatar = "";
                        }
                    });

                    vm.gridModel.itemList = result.data;
                    vm.gridModel.loadingState = false;
                    vm.gridModel.paginationinfo = {
                        page: params.page * 1,
                        pageSize: params.pageSize,
                        total: result.totalCount
                    };
                    vm.gridModel.config.propsParams.message = result.message;
                } else {
                    cbAlert.error("错误提示", result.data);
                }
            });
        }

        getList(currentParams);

    }

}());



