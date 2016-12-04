/**
 * Created by Administrator on 2016/10/10.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .constant('webSiteApi', {
            WEB_SITE_API: {
                "product": {
                  "goods": {
                    "list": {
                      "url": "/product/goods",
                      "type": "GET"
                    },
                    "add": {
                      "url": "/product/goods/add",
                      "type": "POST"
                    },
                    "save": {
                      "url": "/product/goods/save",
                      "type": "POST"
                    },
                    "edit": {
                      "url": "/product/goods/edit",
                      "type": "POST"
                    },
                    "putup": {
                      "url": "/product/goods/putup",
                      "type": "POST"
                    },
                    "putdown": {
                      "url": "/product/goods/putdown",
                      "type": "POST"
                    },
                    "price": {
                      "url": "/product/goods/price",
                      "type": "POST"
                    },
                    "import": {
                      "url": "/product/goods/import",
                      "type": "POST"
                    },
                    "export": {
                      "url": "/product/goods/export",
                      "type": "POST"
                    },
                    "remove": {
                      "url": "/product/goods/remove",
                      "type": "POST"
                    },
                    "search": {
                      "url": "/product/goods/search",
                      "type": "POST"
                    },
                    "attrsku": {
                      "url": "/product/goods/attrsku",
                      "type": "POST"
                    },
                    "category": {
                      "url": "/product/goods/category",
                      "type": "POST"
                    }
                  },
                  "server": {
                    "list": {   // 服务列表
                      "url": "/product/server",
                      "type": "GET"
                    },
                    "removeServer": {   //删除服务
                      "url": "/product/server/removeServer",
                      "type": "POST"
                    },
                    "putdownserver": {   // 暂停服务
                      "url": "/product/server/putdownserver",
                      "type": "POST"
                    },
                    "saveServer": {   // 保存服务
                      "url": "/product/server/saveServer",
                      "type": "POST"
                    },
                    "saveProduct": {    // 添加服务报价中的商品
                      "url": "/product/server/saveProduct",
                      "type": "POST"
                    },
                    "saveOfferprice": {   // 保存服务
                      "url": "/product/server/saveOfferprice",
                      "type": "POST"
                    },
                    "removeOfferprice": {   // 删除服务报价
                      "url": "/product/server/removeOfferprice",
                      "type": "POST"
                    },
                    "putupofferprice": {   // 恢复服务报价
                      "url": "/product/server/putupofferprice",
                      "type": "POST"
                    },
                    "putdownofferprice": {   // 暂停服务报价
                      "url": "/product/server/putdownofferprice",
                      "type": "POST"
                    },
                    "putupserver": {   //恢复服务
                      "url": "/product/server/putupserver",
                      "type": "POST"
                    },
                    "edit": {   // 编辑服务
                      "url": "/product/server/edit",
                      "type": "POST"
                    },
                    "offerprice": {   // 编辑报价
                      "url": "/product/server/offerprice",
                      "type": "POST"
                    },
                    "removeprice": {   // 删除报价
                      "url": "/product/server/removeprice",
                      "type": "POST"
                    },
                    "allpskulist": {   // 管理商品（获得全部的商品SKU列表）
                      "url": "/product/server/allpskulist",
                      "type": "POST"
                    },
                    "pskulist": {   // 管理商品（依据服务报价获得商品SKU列表）编辑时候使用
                      "url": "/product/server/pskulist",
                      "type": "POST"
                    },
                    "export": {  // 导出
                      "url": "/product/server/export",
                      "type": "POST"
                    },
                    "import": {   // 导入
                      "url": "/product/server/import",
                      "type": "POST"
                    },
                    "attrsku": {  // 获得与服务类目关联的品牌、属性集及其SKU
                      "url": "/product/server/attrsku",
                      "type": "POST"
                    },
                    "category": {   // 获取服务类目
                      "url": "/product/server/category",
                      "type": "POST"
                    },
                    "search": {   //搜索服务
                      "url": "/product/server/search",
                      "type": "POST"
                    }
                  }
                },
                "trade": {
                  "porder": {
                    "list": {
                      "url": "/trade/porder",
                      "type": "GET"
                    }
                  },
                  "sorder": {
                    "list": {
                      "url": "/trade/sorder",
                      "type": "GET"
                    },
                    "detail": {
                      "url": "/trade/detail",
                      "type": "POST"
                    },
                    "user": {
                      "url": "/trade/sorder/user",
                      "type": "POST"
                    },
                    "offerprice": {
                      "url": "/trade/sorder/offerprice",
                      "type": "POST"
                    },
                    "motor": {
                      "url": "/trade/sorder/motor",
                      "type": "POST"
                    },
                    "remind": {
                      "url": "/trade/sorder/remind",
                      "type": "POST"
                    },
                    "confirmMotor": {
                      "url": "/trade/sorder/confirmMotor",
                      "type": "POST"
                    },
                    "cancel": {
                      "url": "/trade/sorder/cancel",
                      "type": "POST"
                    },
                    "finish": {
                      "url": "/trade/sorder/finish",
                      "type": "POST"
                    },
                    "pickupMotor": {
                      "url": "/trade/sorder/pickupMotor",
                      "type": "POST"
                    },
                    "refund": {
                      "url": "/trade/sorder/refund",
                      "type": "POST"
                    }
                  }
                },
                "member": {
                  "employee": {
                    "get": {
                      "url": "/member/employee",
                      "type": "GET"
                    },
                    "add": {
                      "url": "/member/employee/add",
                      "type": "POST"
                    },
                    "edit": {
                      "url": "/member/employee/edit",
                      "type": "POST"
                    },
                    "enable": {
                      "url": "/member/employee/enable",
                      "type": "POST"
                    },
                    "disable":{
                      "url": "/member/employee/disable",
                      "type": "POST"
                    },
                    "remove": {
                      "url": "/member/employee/remove",
                      "type": "POST"
                    },
                    "reset": {
                      "url": "/member/employee/reset",
                      "type": "POST"
                    }
                  }
                },
                "system": {
                    "role": {
                        "get": {
                            "url": "/system/role",
                            "type": "GET"
                        },
                        "add": {
                            "url": "/system/role/add",
                            "type": "POST"
                        },
                        "edit": {
                            "url": "/system/role/edit",
                            "type": "POST"
                        },
                        "assign": {
                            "url": "/system/role/assign",
                            "type": "POST"
                        },
                        "remove": {
                            "url": "/system/role/remove",
                            "type": "POST"
                        }
                    },
                    "modpwd": {
                        "edit": {
                          "url": "/system/modpwd",
                          "type": "POST"
                        }
                    }
                },
                "upload": {
                  "user": {
                    "url": "/user/customer/uploadAvatar",
                    "field": "",
                    "version": false
                  },
                  "member": {
                    "url": "/member/employee/uploadAvatar",
                    "field": "",
                    "version": false
                  },
                  "storeCard": {
                    "url": "/store/shop/uploadLicence",
                    "field": "_CARD",
                    "version": true
                  },
                  "storeBiz": {
                    "url": "/store/shop/uploadLicence",
                    "field": "_BIZ",
                    "version": true
                  },
                  "storeLogo": {
                    "url": "/store/shop/uploadLicence",
                    "field": "_LOGO",
                    "version": false
                  },
                  "storeBanner": {
                    "url": "/store/shop/uploadLicence",
                    "field": "_BANNER",
                    "version": true
                  },
                  "storeCase": {
                    "url": "/store/shop/uploadLicence",
                    "field": "_CASE",
                    "version": true
                  },
                  "productMain": {
                    "url": "/product/goods/uploadShow",
                    "field": "_MAIN",
                    "version": true
                  },
                  "productCase": {
                    "url": "/product/goods/uploadShowDetails",
                    "field": "_CASE",
                    "version": true
                  },
                  "serverMain": {
                    "url": "/product/server/uploadShow",
                    "field": "_MAIN",
                    "version": true
                  },
                  "serverCase": {
                    "url": "/product/server/uploadShowDetails",
                    "field": "_CASE",
                    "version": true
                  }
                },
                "vehicle": {
                  "motor": {
                    "brand": {
                      "url": "/motor/brand",
                      "type": "POST"
                    },
                    "series": {
                      "url": "/motor/series",
                      "type": "POST"
                    },
                    "year": {
                      "url": "/motor/year",
                      "type": "POST"
                    },
                    "output": {
                      "url": "/motor/output",
                      "type": "POST"
                    },
                    "model": {
                      "url": "/motor/model",
                      "type": "POST"
                    },
                    "prefix": {
                      "url": "/motor/prefix",
                      "type": "POST"
                    }
                  }
                },
                "category": {
                  "goods": {
                    "goods": {
                      "url": "/category/goods",
                      "type": "POST"
                    }
                  },
                  "server": {
                    "server": {
                      "url": "/category/server",
                      "type": "POST"
                    }
                  }
                }
            }
        });

})();
