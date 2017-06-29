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
                navConfig: [],
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
