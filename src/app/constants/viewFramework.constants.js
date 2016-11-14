/**
 * Created by Administrator on 2016/10/11.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .constant('viewFrameworkConfigData', {
            TOPBAR_DEFAULT_CONS: {
                "navLinks": {
                    "help": {
                        "id": "help",
                        "links": [
                            {
                                "href": "",
                                "id": "help",
                                "target": "_blank",
                                "text": "帮助与文档"
                            }
                        ],
                        "show": false,
                        "text": "帮助与文档"
                    },
                    "logo": {
                        "title": "车边生活",
                        "href": "/",
                        "icon": "icon-logo1 icon-logo-new",
                        "show": true,
                        "target": "_blank"
                    },
                    "message": {
                        "blankText": "您暂时没有公告消息",
                        "href": "innerMsg/unread/0",
                        "messageUrl": "innerMsg/allDetail/",
                        "show": true,
                        "subscribeLink": "http://localhost:9090/shopservice/#/subscribeMsg",
                        "subscribeTitle": "消息接收管理",
                        "text": "查看更多",
                        "title": "站内消息通知"
                    },
                    "service": {
                        "icon": "icon-service",
                        "phone": "400-1234-567",
                        "show": true
                    },
                    "qrcode": {
                        "href": "app",
                        "icon": "icon-qrcode",
                        "image": "http://localhost:9090/shopservice/tps/TB1ArlALpXXXXXhXXXXXXXXXXXX-100-100.png",
                        "show": false,
                        "text": "手机版",
                        "title": "扫码下载手机阿里云"
                    },
                    "requestUrl": {
                        "updateMessageInfo": "http://localhost:9090/shopservice/updateMessageInfo.js"
                    },
                    "search": {
                        "href": "search",
                        "placeholder": "搜索",
                        "show": false,
                        "text": "搜索"
                    },
                    "user": {
                        "account": {},
                        "show": true,
                        "links": [
                            {
                                "href": "/logout",
                                "target": "_self",
                                "text": "退出"
                            }
                        ]
                    }
                }
            },
            SIDEBAR_DEFAULT_CONS: {
                navConfig: [
                    {
                        category: "store",
                        title: "店铺管理",
                        id: 3,
                        customize: false,
                        customizeTitle: "自定义店铺管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 30000,
                                name: "店铺信息管理",
                                link: "store.shop.home",
                                openStatus: true
                            }
                        ],
                        preference: [30000]
                    },
                    {
                        category: "product",
                        title: "产品服务",
                        id: 4,
                        customize: false,
                        customizeTitle: "自定义产品服务",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 40000,
                                name: "商品管理",
                                link: "product.goods.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 40100,
                                name: "服务管理",
                                link: "product.server.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 40200,
                                name: "套餐管理",
                                link: "product.package.list",
                                openStatus: true
                            }
                        ],
                        preference: [40000, 40100, 40200]
                    },
                    {
                        category: "trade",
                        title: "交易管理",
                        id: 5,
                        customize: false,
                        customizeTitle: "自定义销售管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items:[
                            {
                                icon: "icon-account-2",
                                id: 50000,
                                name: "商品订单管理",
                                link: "trade.porder.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 50100,
                                name: "服务订单管理",
                                link: "trade.sorder.list",
                                openStatus: true
                            }
                        ],
                        preference: [50000, 50100]
                    },
                    {
                        category: "finance",
                        title: "财务管理",
                        id: 6,
                        customize: false,
                        customizeTitle: "自定义财务管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items:[
                            {
                                icon: "icon-account-2",
                                id: 60000,
                                name: "账户管理",
                                link: "finance.account.home",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 60100,
                                name: "收款管理",
                                link: "finance.receivable.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 60200,
                                name: "退款管理",
                                link: "finance.refund.list",
                                openStatus: true
                            }
                        ],
                        preference: [60000, 60100, 60200]
                    },
                    {
                        category: "user",
                        title: "会员管理",
                        id: 7,
                        customize: false,
                        customizeTitle: "自定义会员管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 70000,
                                name: "会员管理",
                                link: "user.customer.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 70200,
                                name: "评价管理",
                                link: "user.comment.list",
                                openStatus: true
                            }
                        ],
                        preference: [70000, 70200]
                    },
                    {
                        category: "goods",
                        title: "货源中心",
                        id: 8,
                        customize: false,
                        customizeTitle: "自定义会员管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 80000,
                                name: "硬件出库安装",
                                link: "goods.terminal.list",
                                openStatus: true
                            }
                        ],
                        preference: [80000]
                    },
                    {
                        category: "member",
                        id: 9,
                        title: "员工管理",
                        customize: false,
                        customizeTitle: "自定义员工管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 90000,
                                name: "员工管理",
                                link: "member.employee.list",
                                openStatus: true
                            }
                        ],
                        preference: [90000]
                    },
                    {
                        category: "system",
                        title: "系统管理",
                        id: 10,
                        customize: false,
                        customizeTitle: "自定义系统管理",
                        folded: false,
                        show: true,
                        showManageButton: true,
                        items: [
                            {
                                icon: "icon-account-2",
                                id: 100100,
                                name: "角色管理",
                                link: "system.role.list",
                                openStatus: true
                            },
                            {
                                icon: "icon-account-2",
                                id: 100400,
                                name: "修改密码",
                                link: "system.modpwd",
                                openStatus: true
                            }
                        ],
                        preference: [100100, 100400]
                    }
                ],
                requestUrl: {setUserPreference: ""} //设置自定义菜单地址
            },
            SIDEBAR_FOLD_COOKIENAME: "sidebar-type"
        })
        .factory('viewFrameworkHelper', viewFrameworkHelper);

    function viewFrameworkHelper($cookieStore, viewFrameworkConfigData){
        var sidebar;
        var cookies = $cookieStore;
        /**
         * 初始化
         * @param config
         */
        function init(config) {
            var sidebarType;
            if(config){
                sidebar = config.sidebar;
                sidebarType = pullCookie();
                if(sidebarType){
                    config.sidebar = sidebarType;
                    sidebar = sidebarType;
                }
            }
        }

        /**
         * 获取当前侧边栏的状态
         */
        function getSidebarType() {
            var type = pullCookie() || sidebar;
            return type !== "mini" && type !== "full" && (type = "full"), type
        }

        /**
         * 返回侧边栏状态是否展开
         * @returns {boolean}
         */
        function isSidebarFold() {
            return getSidebarType() === "mini";
        }

        /**
         * 获取Cookie值 sidebar-type
         * @returns {*}
         */
        function pullCookie() {
            return cookies.get(viewFrameworkConfigData.SIDEBAR_FOLD_COOKIENAME)
        }

        return {
            init: init,
            getCookie: cookies.get,
            setCookie: cookies.put,
            getSidebarType: getSidebarType,
            isSidebarFold: isSidebarFold
        }
    }
})();
