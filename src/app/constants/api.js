/**
 * Created by Administrator on 2016/10/10.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .constant('webSiteApi', {
      WEB_SITE_API: {
        "store": {
          "shop": {
            "manager": {
              "url": "/store/shop/manager",
              "type": "POST"
            },
            "saveTime": {
              "url": "/store/shop/saveTime",
              "type": "POST"
            },
            "savePhotos": {
              "url": "/store/shop/savePhotos",
              "type": "POST"
            },
            "saveTelephone": {
              "url": "/store/shop/saveTelephone",
              "type": "POST"
            },
            "saveDescription": {
              "url": "/store/shop/saveDescription",
              "type": "POST"
            },
            "getStoreAptitude": {
              "url": "/store/shop/getStoreAptitude",
              "type": "POST"
            },
            "getStoreContact": {
              "url": "/store/shop/getStoreContact",
              "type": "GET"
            },
            "saveStoreContact": {
              "url": "/store/shop/saveStoreContact",
              "type": "POST"
            },
            "getStoreAccount": {
              "url": "/store/shop/getStoreAccount",
              "type": "GET"
            },
            "saveStoreAccount": {
              "url": "/store/shop/saveStoreAccount",
              "type": "POST"
            },
            "getBanks": {
              "url": "/common/getBanks",
              "type": "GET"
            }
          }
        },
        "product": {
          "goods": {
            "list": {
              "url": "/product/goods/list",
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
            "removeProduct": {
              "url": "/product/goods/removeProduct",
              "type": "POST"
            },
            "resetRemoveProduct": {
              "url": "/product/goods/resetRemoveProduct",
              "type": "POST"
            },
            "deleteProduct": {
              "url": "/product/goods/deleteProduct",
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
            "excelProduct": {
              "url": "/product/goods/excelProduct",
              "type": "GET"
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
            },
            "getProductSkus": {
              "url": "/product/goods/getProductSkus",
              "type": "POST"
            },
            "updateProductSku": {
              "url": "/product/goods/updateProductSku",
              "type": "POST"
            },
            "resetProductSku": {
              "url": "/product/goods/resetProductSku",
              "type": "POST"
            }
          },
          "server": {
            "list": {   // 服务列表
              "url": "/product/server/list",
              "type": "GET"
            },
            "checkServer": {  // 检查服务名称有没有重名
              "url": "/product/server/checkServer",
              "type": "POST"
            },
            "removeServerAll": {   //删除服务
              "url": "/product/server/removeServerAll",
              "type": "POST"
            },
            "getServerSkus": {    //获取子sku
              "url": "/product/server/getServerSkus",
              "type": "POST"
            },
            "updateServerSku": {   //更新子sku
              "url": "/product/server/updateServerSku",
              "type": "POST"
            },
            "removeServers": {   //下架服务
              "url": "/product/server/removeServers",
              "type": "POST"
            },
            "resetRemoveServers": {   //上架服务
              "url": "/product/server/resetRemoveServers",
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
            "excelServer": {  // 导出
              "url": "/product/server/excelServer",
              "type": "GET"
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
          "order": {
            "list": {
              "url": "/trade/order/search",
              "type": "GET"
            },
            "update": {
              "url": "/trade/order/update",
              "type": "POST"
            },
            "getOrdersDetails": {
              "url": "/trade/order/getOrdersDetails",
              "type": "POST"
            },
            "checkErrorCode": {
              "url": "/trade/order/checkErrorCode",
              "type": "POST"
            },
            "saveOrder": {
              "url": "/trade/order/saveOrder",
              "type": "POST"
            },
            "getOrderServer": {
              "url": "/product/server/getOrderServer",
              "type": "GET"
            },
            "getOrderProduct": {
              "url": "/product/goods/getOrderProduct",
              "type": "GET"
            },
            "checkstoreuseraccount": {
              "url": "/trade/order/checkstoreuseraccount",
              "type": "POST"
            },
            "excelorders": {
              "url": "/trade/order/excelorders",
              "type": "GET"
            }
          },
          "comment": {
            "list": {
              "url": "/trade/comment/search",
              "type": "GET"
            },
            "reply": {
              "url": "/trade/comment/reply",
              "type": "POST"
            }
          }
        },
        "users": {
          "customer": {
            "getUser": {
              "url": "/users/get",
              "type": "GET"
            },
            "getMotors": {
              "url": "/users/motors",
              "type": "GET"
            },
            "add": {
              "url": "/users/add",
              "type": "POST"
            },
            "addMotors": {
              "url": "/users/add/motors",
              "type": "POST"
            },
            "userList": {
              "url": "/users/list",
              "type": "GET"
            },
            "motorList": {
              "url": "/users/motor/list",
              "type": "GET"
            },
            "byMotor": {
              "url": "/users/byMotor",
              "type": "GET"
            },
            "grades": {
              "url": "/users/grades",
              "type": "GET"
            },
            "saveGrades": {
              "url": "/users/grades/add",
              "type": "POST"
            },
            "exist": {
              "url": "/users/exist",
              "type": "GET"
            },
            "verifyCode": {
              "url": "/users/joinStore/verifyCode",
              "type": "POST"
            },
            "verifyCodeCheck": {
              "url": "/users/joinStore/verifyCode/check",
              "type": "GET"
            },
            "export": {
              "url": "/users/export",
              "type": "GET"
            },
            "getDiscount": {
              "url": "/users/getDiscount",
              "type": "POST"
            }
          }
        },
        "member": {
          "employee": {
            "list": {
              "url": "/member/employee/list",
              "type": "GET"
            },
            "add": {
              "url": "/member/employee/add",
              "type": "POST"
            },
            "get": {
              "url": "/member/employee/get",
              "type": "GET"
            },
            "update": {
              "url": "/member/employee/update",
              "type": "POST"
            },
            "inservice": {
              "url": "/member/employee/inservice",
              "type": "POST"
            },
            "enable": {
              "url": "/member/employee/enable",
              "type": "POST"
            },
            "disable": {
              "url": "/member/employee/disable",
              "type": "POST"
            },
            "remove": {
              "url": "/member/employee/remove",
              "type": "POST"
            },
            "pwdReset": {
              "url": "/member/employee/pwdReset",
              "type": "POST"
            },
            "positions": {
              "url": "/member/employee/positions",
              "type": "GET"
            },
            "changeshow": {
              "url": "/member/employee/changeshow",
              "type": "POST"
            },
            "export": {
              "url": "/member/employee/export",
              "type": "GET"
            },
            "all": {
              "url": "/member/role/all",
              "type": "GET"
            },
            "changepwd": {
              "url": "/member/employee/changepwd",
              "type": "POST"
            }
          },
          "role": {
            "list": {
              "url": "/member/role",
              "type": "GET"
            },
            "get": {
              "url": "/member/role/get",
              "type": "GET"
            },
            "add": {
              "url": "/member/role/add",
              "type": "POST"
            },
            "edit": {
              "url": "/member/role/edit",
              "type": "POST"
            },
            "assign": {
              "url": "/member/role/assign",
              "type": "POST"
            },
            "remove": {
              "url": "/member/role/remove",
              "type": "POST"
            }
          }
        },
        "system": {
          "modpwd": {
            "edit": {
              "url": "/system/modpwd",
              "type": "POST"
            }
          }
        },
        "markting": {
          "debitcard": {
            "list": {
              "url": "/markting/storedebitcard/list",
              "type": "POST"
            },
            "saveorupdate": {
              "url": "/markting/storedebitcard/saveorupdate",
              "type": "POST"
            }
          }
        },
        "finance": {
          "debitcard": {
            "search": {
              "url": "/finance/journal/debitcard",
              "type": "GET"
            },
            "detail": {
              "url": "/finance/journal/debitcardDetail",
              "type": "GET"
            },
            "exceldebitcardDetail": {
              "url": "/finance/journal/exceldebitcardDetail",
              "type": "GET"
            }
          },
          "journal": {
            "search": {
              "url": "/finance/journal/search",
              "type": "GET"
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
          "storeBap": {
            "url": "/store/shop/uploadLicence",
            "field": "_BAP",
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
              "url": "/public/motor/brand",
              "type": "GET"
            },
            "series": {
              "url": "/public/motor/series",
              "type": "GET"
            },
            "year": {
              "url": "/public/motor/year",
              "type": "GET"
            },
            "output": {
              "url": "/public/motor/output",
              "type": "GET"
            },
            "model": {
              "url": "/public/motor/model",
              "type": "GET"
            },
            "prefix": {
              "url": "/public/motor/prefix",
              "type": "GET"
            },
            "insurances": {
              "url": "/public/insurances",
              "type": "GET"
            }
          }
        },
        "category": {
          "goods": {
            "goods": {
              "url": "/public/category/goods",
              "type": "POST"
            }
          },
          "server": {
            "storeserver": {
              "url": "/public/category/server",
              "type": "POST"
            }
          },
          "download": {
            "download": {
              "url": "/public/download",
              "type": "POST"
            }
          }
        }
      }
    })
    .constant('webDefaultConfig', {
      WEB_DEFAULT_IMAGE: {
        "logo": "",
        "user": "",
        "product": "",
        "server": ""
      }
    })

})();
