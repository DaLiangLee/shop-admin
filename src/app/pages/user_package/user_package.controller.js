/**
 * Created by Administrator on 2017/06/07.
 */
(function(angular) {
    'use strict';

    angular
        .module('shopApp')
        .controller('UserPackageLsitController', UserPackageLsitController)
        .controller('UserPackageDetailController', UserPackageDetailController);

    /** @ngInject */
    function UserPackageLsitController($filter, $state, cbAlert, marktingPackage, userPackageConfig, computeService, utils) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = angular.extend({}, $state.params, { pageSize: 10 });
        var propsParams = {};


        vm.gridModel = {
            columns: _.clone(userPackageConfig().DEFAULT_GRID.columns),
            userPackage: [],
            config: _.merge(userPackageConfig().DEFAULT_GRID.config, { propsParams: propsParams }),
            loadingState: true, // 加载数据
            pageChanged: function(data) { // 监听分页
                var page = angular.extend({}, currentParams, { page: data });
                $state.go(currentStateName, page);
            },
            sortChanged: function(data) {
                var orders = [];
                angular.forEach(data.data, function(item, key) {
                    orders.push({
                        "field": key.replace("", ""),
                        "direction": item
                    });
                });
                var order = angular.extend({}, currentParams, { orders: angular.toJson(orders) });
                getList(order);
            }

        };

        var DEFAULT_SEARCH = _.cloneDeep(userPackageConfig().DEFAULT_SEARCH);
        var searchModel = _.clone(currentParams);


        vm.searchModel = {
            config: DEFAULT_SEARCH.config(searchModel),
            'handler': function(data) {
                var items = _.find(DEFAULT_SEARCH.createtime, function(item) {
                    return item.id === data.createtime0 * 1;
                });
                if (angular.isDefined(items)) {
                    data.createtime1 = undefined;
                }
                var search = data;

                _.chain(currentParams).tap(function(value) {
                    _.forEach(_.pick(value, ['createtime0', 'createtime1']), function(item, key) {
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

            marktingPackage.getuserpackage(params).then(function(results) {
                var result = results.data;
                if (result.status * 1 === 0) {
                    /**
                     *办理时间和到期时间计算剩余天数
                     */
                    _.forEach(result.data, function(item) {
                        item.expireDay = utils.getComputeDay(new Date(), item.expire);
                        if (item.expireDay < 0 && item.status === '0') {
                            item.$packageState = '2';
                        } else {
                            item.$packageState = item.status;
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

    function UserPackageDetailController($state, cbAlert, marktingPackage, userPackageConfig, userCustomer, utils) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = angular.extend({}, $state.params, { page: 1, pageSize: 10 });

        /**
         * 需要返回操作
         * @type {boolean}
         */
        // $state.current.backspace = true;

        /**
         *调用用户信息接口获取用户详细信息
         */
        userCustomer.getUser({ mobile: currentParams.mobile }).then(function(results) {
            var result = results.data;
            if (result.status * 1 === 0) {
                vm.userModel = result.data;
                vm.userModel.avatar = utils.getImageSrc(vm.userModel.avatar, "user");
            } else {
                cbAlert.error("错误提示", result.data);
            }
        });


        /**
         * 组件数据交互
         *
         */
        var propsParams = {};

        /**
         * 表格配置
         *
         */
        vm.gridModel = {
            columns: _.clone(userPackageConfig().DEFAULT_GRID_DETAIL.columns),
            itemList: [],
            requestParams: {
                params: currentParams,
                request: "user,package,exceldebitcardDetail",
                permission: "shopapp:store:user:package:view"
            },
            config: _.merge(userPackageConfig().DEFAULT_GRID_DETAIL.config, { propsParams: propsParams }),
            loadingState: true, // 加载数据
            pageChanged: function(data) { // 监听分页
                var page = angular.extend({}, currentParams, { page: data });
                vm.gridModel.requestParams.params = page;
                getList(page);
            }
        };

        var DEFAULT_SEARCH_DETAIL = _.clone(userPackageConfig().DEFAULT_SEARCH_DETAIL);
        /**
         * 搜索操作
         *
         */
        vm.searchModel = {
            config: DEFAULT_SEARCH_DETAIL.config(currentParams),
            'handler': function(data) {
                var items = _.find(DEFAULT_SEARCH_DETAIL.createtime, function(item) {
                    return item.id === data.createtime0 * 1;
                });
                if (angular.isDefined(items)) {
                    data.createtime1 = undefined;
                }
                // 如果路由一样需要刷新一下
                if (angular.equals(currentParams, data)) {
                    $state.reload();
                } else {
                    data.page = '1';
                    $state.go(currentStateName, data);
                }
            }
        };


        /**
         * 延长套餐时间
         * @param data
         */
        vm.userpackageHandler = function(data) {
            if (data.status === '0') {
                marktingPackage.incexpire({ id: vm.userpackage.id, expireDay: data.data.time })
                    .then(utils.requestHandler)
                    .then(function() {
                        vm.userpackage.expire = data.data.expire;
                        vm.userpackage.expireDay = data.data.expireDay;
                        $state.reload();
                    });
            }
        };

        /**
         * 获取某个会员套餐卡详情列表
         */
        function getList(params) {
            marktingPackage.getuserpackageitem(params).then(function(results) {
                var result = results.data;
                if (result.status * 1 === 0) {
                    vm.packageDetail = _.map(result.data.userpackageitem, function(item) {
                        if (!item.num) {
                            item.num = 0;
                        }
                        return item;
                    });
                    vm.userpackage = result.data.userpackage;

                    vm.userpackage.expireDay = utils.getComputeDay(new Date(), vm.userpackage.expire);
                    if (vm.userpackage.expireDay < 0 && vm.userpackage.status === '0') {
                        vm.userpackage.$expireDay = 0;
                        vm.userpackage.$packageState = '2';
                    } else {
                        vm.userpackage.$expireDay = vm.userpackage.expireDay;
                        vm.userpackage.$packageState = vm.userpackage.status;
                    }


                    _.forEach(result.data.logs, function(item) {
                        if (!_.isEmpty(item.ordercreator) && angular.fromJson(item.ordercreator).realname) {
                            item.ordercreator = angular.fromJson(item.ordercreator).realname;
                        } else {
                            item.ordercreator = "管理员";
                        }
                    });


                    vm.gridModel.itemList = result.data.logs;
                    vm.gridModel.loadingState = false;
                    vm.gridModel.paginationinfo = {
                        page: params.page * 1,
                        pageSize: params.pageSize,
                        total: result.totalCount
                    };
                    vm.gridModel.config.propsParams.message = result.message;
                } else {
                    cbAlert.error(result.data);
                }
            });
        }

        getList(currentParams);
    }

})(angular);