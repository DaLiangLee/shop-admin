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
                    "get": {
                      "url": "/product/goods/attrsku",
                      "type": "POST"
                    },
                    "list": {
                      "url": "/product/goods/attrsku",
                      "type": "POST"
                    },
                    "add": {
                      "url": "/product/goods/add",
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
                }
            }
        });

})();
