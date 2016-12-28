/**
 * Created by Administrator on 2016/10/10.
 */
(function() {
    'use strict';


    angular
        .module('shopApp')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        /**
         * 路由跳转配置
         * @param otherwise             默认跳转页面
         * @param when(name, router)    指定路由(当前状态,指定路由)
         */
        $urlRouterProvider
            .otherwise('/notfound')         // 页面找不到
            .when('', '/desktop/home')       // 工作台
            .when('/', '/desktop/home')       // 工作台
            .when('/desktop', '/desktop/home')       // 工作台
            .when('/desktop/', '/desktop/home')       // 工作台
            .when('/store', '/store/shop/')      // 店铺管理
            .when('/store/', '/store/shop/')
            .when('/store/shop', '/store/shop/home')
            .when('/store/shop/', '/store/shop/home')
            .when('/store/shop/home', '/store/shop/home/info')
            .when('/store/shop/home/', '/store/shop/home/info')
            .when('/product', '/notfound')                  // 抛出异常
            .when('/product/', '/notfound')                 // 抛出异常
            .when('/product/goods', '/product/goods/list/')     // 产品管理
            .when('/product/goods/', '/product/goods/list/')
            .when('/product/goods/list', '/product/goods/list/1')
            .when('/product/goods/list/', '/product/goods/list/1')
            .when('/product/server', '/product/server/list/')     // 产品管理
            .when('/product/server/', '/product/server/list/')
            .when('/product/server/list', '/product/server/list/1')
            .when('/product/server/list/', '/product/server/list/1')
            .when('/trade/porder', '/trade/porder/list/')              // 商品订单管理
            .when('/trade/porder/', '/trade/porder/list/')
            .when('/trade/porder/list', '/trade/porder/list/1')
            .when('/trade/porder/list/', '/trade/porder/list/1')
            .when('/member', '/member/employee/list/')                  // 服务管理
            .when('/member/', '/member/employee/list/')
            .when('/member/employee', '/member/employee/list/')
            .when('/member/employee/', '/member/employee/list/')
            .when('/member/employee/list', '/member/employee/list/1')
            .when('/member/employee/list/', '/member/employee/list/1')
            .when('/system', '/notfound')                  // 抛出异常
            .when('/system/', '/notfound')                 // 抛出异常
            .when('/system/role', '/system/role/list/')    // 角色管理
            .when('/system/role/', '/system/role/list/')
            .when('/system/role/list', '/system/role/list/1')
            .when('/system/role/list/', '/system/role/list/1');

        /**
         * 路由配置
         * @param name        路由状态
         * @param {}          路由配置
         *    url             显示url
         *    templateUrl     模板url
         *    controller      控制器
         *    controllerAs    设置别名显示在view层
         *    title           当前页面标题
         *    permission      权限设置
         *      categoryId    组名
         *      productId     当前id
         */
        $stateProvider
            .state('forbidden', {
                url: '/forbidden',
                templateUrl: 'app/pages/error/forbidden.html',
                controller: 'ErrorForbiddenController',
                controllerAs: 'vm',
                title: '没有访问权限',
                permission: {
                    parentid: -1,
                    category: "error",
                    sectionid: 1
                }
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'app/pages/error/notfound.html',
                controller: 'ErorNotfoundController',
                controllerAs: 'vm',
                title: '页面没找到',
                permission: {
                    parentid: -1,
                    category: "error",
                    sectionid: 2
                }
            })
            .state('desktop', {
                url: '/desktop',
                title: '工作台首页',
                template: '<div ui-view class="desktop"></div>',
                permission: {
                    parentid: 1,
                    category: "desktop",
                    sectionid: 2
                }
            })
            .state('desktop.home', {
                url: '/home',
                templateUrl: 'app/pages/desktop_home/home.html',
                controller: 'DesktopHomeController',
                controllerAs: 'vm',
                title: '工作台管理',
                permission: {
                    parentid: 1,
                    category: "desktop",
                    sectionid: 2
                }
            })
            .state('store', {   // 店铺管理
                url: '/store',
                title: '店铺管理',
                template: '<div ui-view></div>',
                permission: {
                    parentid: 1,
                    category: "store",
                    sectionid: 3
                }
            })
            .state('store.shop', {   // 店铺管理
                url: '/shop',
                template: '<div ui-view></div>',
                title: '店铺管理',
                permission: {
                    parentid: 3,
                    category: "store",
                    sectionid: 30000
                }
            })
            .state('store.shop.home', {   // 店铺信息管理
              url: '/home',
              templateUrl: 'app/pages/store_shop/home.html',
              controller: 'StoreShopHomeController',
              controllerAs: 'vm',
              title: '店铺管理',
              permission: {
                parentid: 30000,
                category: "store",
                sectionid: 30001
              }
            })
            .state('store.shop.home.info', {   // 店铺信息管理信息
                url: '/info',
                templateUrl: 'app/pages/store_shop/info.html',
                controller: 'StoreShopHomeController',
                controllerAs: 'vm',
                title: '店铺管理',
                permission: {
                    parentid: 30000,
                    category: "store",
                    sectionid: 30001
                }
            })
            .state('store.shop.home.aptitude', {   // 店铺信息管理  店铺资质
              url: '/aptitude',
              templateUrl: 'app/pages/store_shop/aptitude.html',
              controller: 'StoreShopHomeAptitudeController',
              controllerAs: 'vm',
              title: '店铺管理',
              permission: {
                parentid: 30000,
                category: "store",
                sectionid: 30001
              }
            })
            .state('store.shop.home.contact', {   // 店铺信息管理 联系方式
              url: '/contact',
              templateUrl: 'app/pages/store_shop/contact.html',
              controller: 'StoreShopHomeContactController',
              controllerAs: 'vm',
              title: '店铺管理',
              permission: {
                parentid: 30000,
                category: "store",
                sectionid: 30001
              }
            })
            .state('store.shop.home.bank', {   // 店铺信息管理  银行
              url: '/bank',
              templateUrl: 'app/pages/store_shop/bank.html',
              controller: 'StoreShopHomeBankController',
              controllerAs: 'vm',
              title: '店铺管理',
              permission: {
                parentid: 30000,
                category: "store",
                sectionid: 30001
              }
            })
            .state('product', {     // 产品管理
                url: '/product',
                template: '<div ui-view></div>',
                title: '产品管理',
                permission: {
                    parentid: 1,
                    category: "product",
                    sectionid: 4
                }
            })
            .state('product.goods', {     // 商品管理
                url: '/goods',
                template: '<div ui-view></div>',
                title: '商品管理',
                permission: {
                    parentid: 4,
                    category: "product",
                    sectionid: 40000
                }
            })
            .state('product.goods.list', {     // 商品管理
                url: '/list/:page',
                templateUrl: 'app/pages/product_goods/list.html',
                controller: 'ProductGoodsListController',
                controllerAs: 'vm',
                title: '商品管理',
                permission: {
                    parentid: 40000,
                    category: "product",
                    sectionid: 40001
                }
            })
            .state('product.goods.add', {     // 商品管理
                url: '/add',
                templateUrl: 'app/pages/product_goods/change.html',
                controller: 'ProductGoodsChangeController',
                controllerAs: 'vm',
                title: '添加商品',
                permission: {
                    parentid: 40000,
                    category: "product",
                    sectionid: 40002
                }
            })
            .state('product.goods.edit', {     // 编辑商品
                url: '/edit/:pskuid',
                templateUrl: 'app/pages/product_goods/change.html',
                controller: 'ProductGoodsChangeController',
                controllerAs: 'vm',
                title: '编辑商品',
                permission: {
                    parentid: 40000,
                    category: "product",
                    sectionid: 40003
                }
            })
            .state('product.server', {     // 服务项目管理
                url: '/server',
                template: '<div ui-view></div>',
                title: '服务管理',
                permission: {
                    parentid: 4,
                    category: "product",
                    sectionid: 40100
                }
            })
            .state('product.server.list', {     // 服务项目管理
                url: '/list/:page',
                templateUrl: 'app/pages/product_server/list.html',
                controller: 'ProductServerListController',
                controllerAs: 'vm',
                title: '服务管理',
                permission: {
                    parentid: 40100,
                    category: "product",
                    sectionid: 40101
                }
            })
            .state('product.server.add', {     // 新增项目
                url: '/add',
                templateUrl: 'app/pages/product_server/change.html',
                controller: 'ProductServerChangeController',
                controllerAs: 'vm',
                title: '新增服务',
                permission: {
                    parentid: 40100,
                    category: "product",
                    sectionid: 40101
                }
            })
            .state('product.server.addGoods', {     // 新增服务报价商品添加
              url: '/addGoods?serverid&offerid&edit',
              templateUrl: 'app/pages/product_server/add_goods.html',
              controller: 'ProductServerAddGoodsController',
              controllerAs: 'vm',
              title: '管理商品',
              permission: {
                parentid: 40100,
                category: "product",
                sectionid: 40101
              }
            })
            .state('product.server.edit', {     // 编辑项目
                url: '/edit/:serverid',
                templateUrl: 'app/pages/product_server/change.html',
                controller: 'ProductServerChangeController',
                controllerAs: 'vm',
                title: '编辑服务',
                permission: {
                    parentid: 40100,
                    category: "product",
                    sectionid: 40103
                }
            })
            .state('product.package', {     // 套餐管理
                url: '/package',
                template: '<div ui-view></div>',
                title: '套餐管理',
                permission: {
                    parentid: 4,
                    category: "product",
                    sectionid: 40200
                }
            })
            .state('product.package.list', {     // 套餐管理
                url: '/list/:page',
                templateUrl: 'app/pages/product_package/list.html',
                controller: 'ProductPackageListController',
                controllerAs: 'vm',
                title: '套餐管理',
                permission: {
                    parentid: 40100,
                    category: "product",
                    sectionid: 40201
                }
            })
            .state('product.package.add', {     // 新增套餐
                url: '/add',
                templateUrl: 'app/pages/product_package/change.html',
                controller: 'ProductPackageChangeController',
                controllerAs: 'vm',
                title: '新增套餐',
                permission: {
                    parentid: 40200,
                    category: "product",
                    sectionid: 40202
                }
            })
            .state('product.package.edit', {     // 编辑套餐
                url: '/edit/:id',
                templateUrl: 'app/pages/product_package/change.html',
                controller: 'ProductPackageChangeController',
                controllerAs: 'vm',
                title: '编辑套餐',
                permission: {
                    parentid: 40200,
                    category: "product",
                    sectionid: 40203
                }
            })
            .state('trade', {      // 交易管理
                url: '/trade',
                template: '<div ui-view></div>',
                title: '交易管理',
                permission: {
                    parentid: 40100,
                    category: "product",
                    sectionid: 40103
                }
            })
            .state('trade.porder', {      // 商品订单管理
                url: '/porder',
                template: '<div ui-view></div>',
                title: '商品订单管理',
                permission: {
                    parentid: 5,
                    category: "trade",
                    sectionid: 50000
                }
            })
            .state('trade.porder.list', {      // 商品订单管理
                url: '/list/:page',
                templateUrl: 'app/pages/trade_porder/list.html',
                controller: 'TradePorderListController',
                controllerAs: 'vm',
                title: '商品订单管理',
                permission: {
                    parentid: 50000,
                    category: "trade",
                    sectionid: 50000
                }
            })
            .state('trade.sorder', {      // 服务订单管理
                url: '/sorder',
                template: '<div ui-view></div>',
                title: '服务订单管理',
                permission: {
                    parentid: 5,
                    category: "trade",
                    sectionid: 50100
                }
            })
            .state('trade.sorder.list', {      // 服务订单管理
                url: '/list/:page',
                templateUrl: 'app/pages/trade_sorder/list.html',
                controller: 'TradeSorderListController',
                controllerAs: 'vm',
                title: '服务订单管理',
                permission: {
                    parentid: 50100,
                    category: "trade",
                    sectionid: 50100
                }
            })
            .state('trade.sorder.add', {     // 新增服务订单
                url: '/add',
                templateUrl: 'app/pages/trade_sorder/change.html',
                controller: 'TradeSorderChangeController',
                controllerAs: 'vm',
                title: '新增服务订单',
                permission: {
                    parentid: 50100,
                    category: "trade",
                    sectionid: 50101
                }
            })
            .state('trade.sorder.edit', {     // 编辑服务订单
                url: '/edit/:id',
                templateUrl: 'app/pages/trade_sorder/change.html',
                controller: 'TradeSorderChangeController',
                controllerAs: 'vm',
                title: '编辑服务订单',
                permission: {
                    parentid: 50100,
                    category: "trade",
                    sectionid: 50101
                }
            })
            .state('trade.sorder.detail', {     // 服务订单详情
                url: '/detail/:orderid',
                templateUrl: 'app/pages/trade_sorder/detail.html',
                controller: 'TradePorderDetailController',
                controllerAs: 'vm',
                title: '服务订单详情',
                permission: {
                    parentid: 50100,
                    category: "trade",
                    sectionid: 50103
                }
            })
            .state('finance', {      // 财务管理
                url: '/finance',
                template: '<div ui-view></div>',
                title: '财务管理',
                permission: {
                    parentid: 6,
                    category: "finance",
                    sectionid: 60000
                }
            })
            .state('finance.account', {      // 账户管理
                url: '/account',
                template: '<div ui-view></div>',
                title: '账户管理',
                permission: {
                    parentid: 6,
                    category: "finance",
                    sectionid: 60000
                }
            })
            .state('finance.account.home', {      // 账户管理
                url: '/home',
                templateUrl: 'app/pages/finance_account/home.html',
                controller: 'FinanceAccountHomeController',
                controllerAs: 'vm',
                title: '账户管理',
                permission: {
                    parentid: 60000,
                    category: "finance",
                    sectionid: 60001
                }
            })
            .state('finance.account.list', {      // 交易记录
                url: '/home',
                templateUrl: 'app/pages/finance_account/list.html',
                controller: 'FinanceAccountListController',
                controllerAs: 'vm',
                title: '交易记录',
                permission: {
                    parentid: 60000,
                    category: "finance",
                    sectionid: 60001
                }
            })
            .state('finance.receivable', {      // 收款管理
                url: '/receivable',
                template: '<div ui-view></div>',
                title: '收款管理',
                permission: {
                    parentid: 6,
                    category: "finance",
                    sectionid: 60100
                }
            })
            .state('finance.receivable.list', {      // 收款管理
                url: '/list/:page',
                templateUrl: 'app/pages/finance_receivable/list.html',
                controller: 'FinanceReceivableLsitController',
                controllerAs: 'vm',
                title: '收款管理',
                permission: {
                    parentid: 60100,
                    category: "finance",
                    sectionid: 60101
                }
            })
            .state('finance.refund', {      // 退款管理
                url: '/refund',
                template: '<div ui-view></div>',
                title: '退款管理',
                permission: {
                    parentid: 6,
                    category: "finance",
                    sectionid: 60200
                }
            })
            .state('finance.refund.list', {      // 退款管理
                url: '/list/:page',
                templateUrl: 'app/pages/finance_refund/list.html',
                controller: 'FinanceRefundListController',
                controllerAs: 'vm',
                title: '退款管理',
                permission: {
                    parentid: 60200,
                    category: "finance",
                    sectionid: 60201
                }
            })
            .state('user', {      // 会员管理
                url: '/user',
                template: '<div ui-view></div>',
                title: '会员管理',
                permission: {
                    parentid: 1,
                    category: "user",
                    sectionid: 7
                }
            })
            .state('user.customer', {      // 会员管理
                url: '/customer',
                template: '<div ui-view></div>',
                title: '会员管理',
                permission: {
                    parentid: 7,
                    category: "user",
                    sectionid: 70000
                }
            })
            .state('user.customer.list', {      // 会员管理
                url: '/list/:page',
                templateUrl: 'app/pages/user_customer/list.html',
                controller: 'UserCustomerListController',
                controllerAs: 'vm',
                title: '会员管理',
                permission: {
                    parentid: 70000,
                    category: "user",
                    sectionid: 70001
                }
            })
            .state('user.customer.add', {      // 新增会员
                url: '/add',
                templateUrl: 'app/pages/user_customer/add.html',
                controller: 'UserCustomerAddController',
                controllerAs: 'vm',
                title: '新增会员',
                permission: {
                    parentid: 70000,
                    category: "user",
                    sectionid: 70002
                }
            })
            .state('user.customer.add2', {      // 新增会员
              url: '/add/:mobile',
              templateUrl: 'app/pages/user_customer/change.html',
              controller: 'UserCustomerChangeController',
              controllerAs: 'vm',
              title: '新增会员',
              permission: {
                parentid: 70000,
                category: "user",
                sectionid: 70002
              }
            })
            /*.state('user.customer.add2', {      // 新增会员
              url: '/add/:mobile',
              templateUrl: 'app/pages/user_customer/change.html',
              controller: 'UserCustomerChangeController',
              controllerAs: 'vm',
              title: '新增会员',
              permission: {
                parentid: 70000,
                category: "user",
                sectionid: 70002
              }
            })*/
            .state('user.comment', {      // 评价管理
                url: '/comment',
                template: '<div ui-view></div>',
                title: '评价管理',
                permission: {
                    parentid: 7,
                    category: "user",
                    sectionid: 70200
                }
            })
            .state('user.comment.list', {      // 评价管理
                url: '/list/:page',
                templateUrl: 'app/pages/user_comment/list.html',
                controller: 'UserCommentListController',
                controllerAs: 'vm',
                title: '评价管理',
                permission: {
                    parentid: 70200,
                    category: "user",
                    sectionid: 70201
                }
            })
            .state('user.grade', {      // 会员等级
              url: '/grade',
              template: '<div ui-view></div>',
              title: '会员管理',
              permission: {
                parentid: 7,
                category: "user",
                sectionid: 70000
              }
            })
            .state('user.grade.list', {      // 会员等级列表
              url: '/list',
              templateUrl: 'app/pages/user_grade/list.html',
              controller: 'UserGradeListController',
              controllerAs: 'vm',
              title: '会员等级',
              permission: {
                parentid: 70000,
                category: "user",
                sectionid: 70001
              }
            })
            .state('stocks', {      // 货源中心
                url: '/stocks',
                template: '<div ui-view></div>',
                title: '货源中心',
                permission: {
                    parentid: 1,
                    category: "stocks",
                    sectionid: 8
                }
            })
            .state('stocks.terminal', {      // 硬件出库安装
                url: '/terminal',
                template: '<div ui-view></div>',
                title: '硬件出库安装',
                permission: {
                    parentid: 8,
                    category: "stocks",
                    sectionid: 80000
                }
            })
            .state('stocks.terminal.list', {      // 硬件出库安装
                url: '/list/:page',
                templateUrl: 'app/pages/stocks_terminal/list.html',
                controller: 'StocksTerminalListController',
                controllerAs: 'vm',
                title: '硬件出库安装',
                permission: {
                    parentid: 80000,
                    category: "goods",
                    sectionid: 80001
                }
            })
            .state('member', {      // 员工管理
                url: '/member',
                template: '<div ui-view></div>',
                title: '员工管理',
                permission: {
                    parentid: 1,
                    category: "member",
                    sectionid: 9
                }
            })
            .state('member.employee', {      // 员工管理
                url: '/employee',
                template: '<div ui-view></div>',
                title: '员工管理',
                permission: {
                    parentid: 9,
                    category: "member",
                    sectionid: 90000
                }
            })
            .state('member.employee.list', {      // 员工管理
                url: '/list/:page',
                templateUrl: 'app/pages/member_employee/list.html',
                controller: 'MemberEmployeeListController',
                controllerAs: 'vm',
                title: '员工管理',
                permission: {
                    parentid: 90000,
                    category: "member",
                    sectionid: 90001
                }
            })
            .state('member.employee.add', {      // 添加新员工管理
              url: '/add',
              templateUrl: 'app/pages/member_employee/change.html',
              controller: 'MemberEmployeeChangeController',
              controllerAs: 'vm',
              title: '添加新员工',
              permission: {
                parentid: 90000,
                category: "member",
                sectionid: 90002
              }
            })
            .state('member.employee.edit', {      // 编辑员工员工管理
              url: '/edit/:id',
              templateUrl: 'app/pages/member_employee/change.html',
              controller: 'MemberEmployeeChangeController',
              controllerAs: 'vm',
              title: '编辑员工',
              permission: {
                parentid: 90000,
                category: "member",
                sectionid: 90002
              }
            })
            .state('system', {      // 系统管理
                url: '/system',
                template: '<div ui-view></div>',
                title: '系统管理',
                permission: {
                    parentid: 1,
                    category: "system",
                    sectionid: 10
                }
            })
            .state('system.role', {      // 角色管理
                url: '/role',
                template: '<div ui-view></div>',
                title: '角色管理',
                permission: {
                    parentid: 10,
                    category: "system",
                    sectionid: 100000
                }
            })
            .state('system.role.list', {      // 角色管理
                url: '/list/:page',
                templateUrl: 'app/pages/system_role/list.html',
                controller: 'SystemRoleLsitController',
                controllerAs: 'vm',
                title: '角色管理',
                permission: {
                    parentid: 10,
                    category: "system",
                    sectionid: 100000
                }
            })
            .state('system.personal', {      // 个人信息
                url: '/personal',
                template: '<div ui-view></div>',
                title: '个人信息',
                permission: {
                    parentid: 100400,
                    category: "system",
                    sectionid: 100401
                }
            })
            .state('system.modpwd', {      // 修改密码
                url: '/modpwd',
                templateUrl: 'app/pages/system_modpwd/modpwd.html',
                controller: 'SystemModpwdController',
                controllerAs: 'vm',
                title: '修改密码',
                permission: {
                    parentid: 10,
                    category: "system",
                    sectionid: 100200
                }
            });
    }
})();
