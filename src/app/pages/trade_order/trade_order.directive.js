/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('oraderReceivedDialog', oraderReceivedDialog)
    .directive('orderUserDialog', orderUserDialog)
    .directive('orderServiceDialog', orderServiceDialog)
    .directive('orderProductDialog', orderProductDialog);

  /** @ngInject */
  function oraderReceivedDialog(cbDialog, tadeOrder, cbAlert) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        var checkstoreuseraccount = true;
        function handler(childScope){
          childScope.item = angular.copy(scope.item);
          childScope.item.paytype = checkstoreuseraccount ? "0" : "1";
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.paytype = [
            {
              "label": "储值卡",
              "isBalance": checkstoreuseraccount,
              "value": "0",
              "current": checkstoreuseraccount
            },
            {
              "label": "现金或银行卡",
              "isBalance": true,
              "value": "1",
              "current": !checkstoreuseraccount
            }
          ];
          childScope.setPaytype = function (item) {
            _.map(childScope.paytype, function (key) {
              key.current = false;
            });
            item.current = true;
            childScope.item.paytype = item.value;
          };
          childScope.interceptorConfirm = function () {
            scope.itemHandler({data: {"status":"0", "data": _.pick(childScope.item, ['guid', 'paytype'])}});
            childScope.close();
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          tadeOrder.checkstoreuseraccount(scope.item.guid).then(function(results){
            if (results.data.status == '0') {
              checkstoreuseraccount = results.data.data;
              cbDialog.showDialogByUrl("app/pages/trade_order/orader_received_dialog.html", handler, {
                windowClass: "viewFramework-orader-received-dialog"
              });
            }else{
              cbAlert.error(results.data.data);
            }
          });


        })
      }
    }
  }

  /** @ngInject */
  function orderUserDialog(cbDialog, userCustomer, cbAlert) {
    /**
     * 格式化权限数据
     * @param arr
     * @returns {Array}
     */
    function getRoleList(arr) {
      var results = [];
      angular.forEach(arr, function (item) {
        results.push({
          id: item.guid,
          label: item.gradename
        })
      });
      return results;
    }
    return {
      restrict: "A",
      scope: {
        handler: "&"
      },
      link: function(scope, iElement, iAttrs){
        function handler(childScope){
          var currentParams = angular.extend({}, {page: 1, pageSize: 5});
          /**
           * 搜索操作
           *
           */
          childScope.searchModel = {
            'handler': function (data) {
              currentParams = angular.extend({}, currentParams, data);
              getList(currentParams);
            }
          };

          userCustomer.grades().then(function (results) {
            var result = results.data;
            if (result.status == 0) {
              childScope.searchModel.config = {
                keyword: {
                  model: currentParams.keyword,
                  name: "keyword",
                  placeholder: "请输入会员名称、手机号、车牌号、品牌",
                  isShow: true
                },
                searchDirective: [
                  {
                    label: "会员等级",
                    all: true,
                    type: "list",
                    name: "grade",
                    model: currentParams.grade,
                    list: getRoleList(result.data)
                  },
                  {
                    label: "创建时间",
                    name: "Date",
                    all: true,
                    custom: true,
                    type: "date",
                    start: {
                      name: "startDate",
                      model: currentParams.startDate,
                      config: {
                        minDate: new Date("2010/01/01 00:00:00")
                      }
                    },
                    end: {
                      name: "endDate",
                      model: currentParams.endDate,
                      config: {
                        minDate: new Date("1950/01/01 00:00:00")
                      }
                    }
                  }
                ]
              }
            } else {
              cbAlert.error("错误提示", result.data);
            }
          });


          /**
           * 获取会员列表
           */
          function getList(params) {
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            if (!params.page) {
              return;
            }
            userCustomer.userList(params).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
                if (!result.data.length && params.page != 1) {
                  getList(angular.extend({}, currentParams, {page: 1}));
                }
                childScope.gridModel.itemList = result.data;
                childScope.gridModel.paginationinfo = {
                  page: params.page * 1,
                  pageSize: params.pageSize,
                  total: result.totalCount
                };
                childScope.gridModel.loadingState = false;
              } else {
                cbAlert.error("错误提示", result.data);
              }
            }).then(function (result) {
              console.log(result);


            });
          }

          /**
           * 表格配置
           *
           */
          childScope.gridModel = {
            columns: [
              {
                "id": 0,
                "name": "序号",
                "none": true
              },
              {
                "id": 1,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary" ng-click="propsParams.selectItem(item)">选择</button>',
                "name": '操作',
                "width": 100
              },
              {
                "id": 2,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.worknum"><img bo-if="item.avatar" bo-src-i="{{item.avatar}}?x-oss-process=image/resize,m_fill,w_30,h_30" alt=""><span bo-if="item.userclass == 0">车边认证</span></span>',
                "name": '头像',
                "width": 150
              },
              {
                "id": 3,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.nickname"></span>',
                "name": '昵称'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.realname"></span>',
                "name": '姓名'
              },
              {
                "id": 5,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>',
                "name": '手机号'
              },
              {
                "id": 6,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>',
                "name": '性别'
              },
              {
                "id": 7,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.storegrade"></span>',
                "name": '等级'
              },
              {
                "id": 8,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                "name": '储值金额'
              },
              {
                "id": 9,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
                "name": '公司名称'
              }
            ],
            itemList: [],
            config: {
              'paginationSupport': true,  // 是否有分页
              "paginationInfo": {   // 分页配置信息
                maxSize: 5,
                showPageGoto: true
              },
              'useBindOnce': true  // 是否单向绑定
            },
            loadingState: true,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              currentParams = angular.extend({}, currentParams, {page: data});
              getList(currentParams);
            }
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            selectItem: function (data) {
              scope.handler({data: {"status":"0", "data": data}});
              childScope.close();
            }
          };

          getList(currentParams);

        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_order/order-user-dialog.html", handler, {
            windowClass: "viewFramework-order-user-dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function orderServiceDialog(cbDialog, tadeOrder, cbAlert, computeService) {
    return {
      restrict: "A",
      scope: {
        handler: "&"
      },
      link: function(scope, iElement, iAttrs){
        function handler(childScope){
          var currentParams = angular.extend({}, {page: 1, pageSize: 5});
          /**
           * 搜索操作
           *
           */
          /*childScope.searchModel = {
            'handler': function (data) {
              currentParams = angular.extend({}, currentParams, data);
              getList(currentParams);
            }
          };

          /**
           * 获取会员列表
           */
          function getList(params) {
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            if (!params.page) {
              return;
            }
            tadeOrder.getOrderServer(params).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
                if (!result.data.length && params.page != 1) {
                  getList(angular.extend({}, currentParams, {page: 1}));
                }
                childScope.gridModel.itemList = mergedData(result.data);
                childScope.gridModel.paginationinfo = {
                  page: params.page * 1,
                  pageSize: params.pageSize,
                  total: result.totalCount
                };
                childScope.gridModel.loadingState = false;
              } else {
                cbAlert.error("错误提示", result.data);
              }
            });
          }

          /**
           * 拼合数据
           * @param data
           * @returns {Array}
           */
          function mergedData(data){
            console.log(data);
            var results = [];
            _.forEach(data, function (item) {
              if(item.serverSkus.length === 1){
                results.push(setItem(item, item.serverSkus[0]));
              }else{
                _.forEach(item.serverSkus, function (key) {
                  results.push(setItem(item, key));
                });
              }
            });



            console.log(results);
            return results;
          }

          /**
           * 重组单个数据 方便提交数据
           * @param parent
           * @param item
           * @returns {{$$skudescription: *, $$skuvalues: string, itemname: string, itemid, num: number, price: *, $$numprice: *, $$itemname: (string|string|string|string|Document.goods.servername|*), itemsku}}
           */
          function setItem(parent, item){
            parent.serverSkus = [item];
            parent.serverSkus[0].attrvalues = JSON.parse(parent.serverSkus[0].attrvalues);
            var itemname = "",skuvalues = "";
            if(angular.isDefined(item.manualskuvalues)){
              itemname = parent.servername + " 服务属性 " + item.manualskuvalues;
              skuvalues = _.trunc(item.manualskuvalues, {
                'length': 10,
                'omission': ' 等'
              });
            }
            if(angular.isDefined(item.skuvalues)){
              itemname = parent.servername + " 服务属性 " + item.skuvalues.skuname + item.skuvalues.items[0].skuvalue;
              skuvalues = _.trunc(item.skuvalues.skuname + item.skuvalues.items[0].skuvalue, {
                'length': 10,
                'omission': ' 等'
              });
            }
            return {
              $$skudescription: item.skudescription,
              $$skuvalues: skuvalues,
              itemname: itemname,
              itemid: parent.guid,
              num: item.servertime,
              price: item.serverprice,
              $$numprice: computeService.multiply(item.servertime || 0, item.serverprice || 0),
              $$itemname: parent.servername,
              itemsku: JSON.stringify(parent)
            }
          }


          /**
           * 表格配置
           *
           */
          childScope.gridModel = {
            columns: [
              {
                "id": 0,
                "name": "序号",
                "none": true
              },
              {
                "id": 1,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary" ng-click="propsParams.selectItem(item)">选择</button>',
                "name": '操作',
                "width": 100
              },
              {
                "id": 2,
                "cssProperty": "state-column",
                "fieldDirective": '<div><p bo-text="item.code"></p><span class="state-unread" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-service-image" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span></div>',
                "name": '服务编码/图片',
                "width": 150
              },
              {
                "id": 3,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.$$itemname"></span>',
                "name": '服务名称'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.$$skuvalues"></span>',
                "name": '属性'
              },
              {
                "id": 5,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.num"></span>',
                "name": '工时'
              },
              {
                "id": 6,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.price"></span>',
                "name": '单价（元）'
              },
              {
                "id": 7,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.$$numprice"></span>',
                "name": '工时费'
              },
              {
                "id": 8,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.$$skudescription"></span>',
                "name": '备注'
              }
            ],
            itemList: [],
            config: {
              'useBindOnce': true  // 是否单向绑定
            },
            loadingState: true,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              currentParams = angular.extend({}, currentParams, {page: data});
              getList(currentParams);
            }
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            selectItem: function (data) {
              scope.handler({data: {"status":"0", "data": data}});
              childScope.close();
            }
          };

          getList(currentParams);

        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_order/order-service-dialog.html", handler, {
            windowClass: "viewFramework-order-service-dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function orderProductDialog(cbDialog, tadeOrder, cbAlert, computeService) {
    return {
      restrict: "A",
      scope: {
        handler: "&"
      },
      link: function(scope, iElement, iAttrs){
        function handler(childScope){
          var currentParams = angular.extend({}, {page: 1, pageSize: 5});
          /**
           * 搜索操作
           *
           */
          childScope.searchModel = {
            'handler': function (data) {
              currentParams = angular.extend({}, currentParams, data);
              getList(currentParams);
            }
          };

          /**
           * 获取会员列表
           */
          function getList(params) {
            /**
             * 路由分页跳转重定向有几次跳转，先把空的选项过滤
             */
            if (!params.page) {
              return;
            }
            tadeOrder.getOrderProduct(params).then(function (results) {
              var result = results.data;
              if (result.status == 0) {
                if (!result.data.length && params.page != 1) {
                  getList(angular.extend({}, currentParams, {page: 1}));
                }
                childScope.gridModel.itemList = adapteeData(result.data);
                childScope.gridModel.paginationinfo = {
                  page: params.page * 1,
                  pageSize: params.pageSize,
                  total: result.totalCount
                };
                childScope.gridModel.loadingState = false;
              } else {
                cbAlert.error("错误提示", result.data);
              }
            });
          }

          /**
           * 拼合数据
           * @param data
           * @returns {Array}
           */
          function adapteeData(data){
            console.log(data);
            var results = [];
            _.forEach(data, function (item) {
              if(item.items.length === 1){
                results.push(setItem(item, item.items[0]));
              }else{
                _.forEach(item.items, function (key) {
                  results.push(setItem(item, key));
                });
              }
            });
            console.log(results);
            return results;
          }

          /**
           * 重组单个数据 方便提交数据
           * @param parent
           * @param item
           * @returns {{$$skudescription: *, $$skuvalues: string, itemname: string, itemid, num: number, price: *, $$numprice: *, $$itemname: (string|string|string|string|Document.goods.servername|*), itemsku}}
           */
          function setItem(parent, item){
            parent.items = [item];
            parent.items[0].skuvalues = JSON.parse(parent.items[0].skuvalues);
            var itemname = "",skuvalues = "";
            if(angular.isDefined(item.manualskuvalues)){
              itemname = parent.servername + " 服务属性 " + item.manualskuvalues;
              skuvalues = _.trunc(item.manualskuvalues, {
                'length': 10,
                'omission': ' 等'
              });
            }
/*
            if(angular.isDefined(item.skuvalues)){
              itemname = parent.servername + " 服务属性 " + item.skuvalues.skuname + item.skuvalues.items[0].skuvalue;
              skuvalues = _.trunc(item.skuvalues.skuname + item.skuvalues.items[0].skuvalue, {
                'length': 10,
                'omission': ' 等'
              });
            }
*/
            return {
              $$skudescription: item.skudescription,
              $$skuvalues: skuvalues,
              itemname: parent.productname,
              itemid: parent.guid,
              num: 1,
              price: item.saleprice,
              $$itemname: parent.servername,
              itemsku: JSON.stringify(parent)
            }
          }



          /**
           * 表格配置
           *
           */
          childScope.gridModel = {
            columns: [
              {
                "id": 0,
                "name": "序号",
                "none": true
              },
              {
                "id": 1,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary" ng-click="propsParams.selectItem(item)">选择</button>',
                "name": '操作',
                "width": 100
              },
              {
                "id": 2,
                "cssProperty": "state-column",
                "fieldDirective": '<div><p bo-text="item.code"></p><span class="state-unread" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-service-image" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span></div>',
                "name": '服务编码/图片',
                "width": 150
              },
              {
                "id": 3,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.nickname"></span>',
                "name": '商品名称'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.realname"></span>',
                "name": '品牌'
              },
              {
                "id": 5,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>',
                "name": '属性'
              },
              {
                "id": 6,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>',
                "name": '零售单价（元）'
              },
              {
                "id": 7,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.storegrade"></span>',
                "name": '库存数量'
              },
              {
                "id": 8,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                "name": '条形码'
              },
              {
                "id": 9,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
                "name": '零件码'
              },
              {
                "id": 10,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
                "name": '备注'
              }
            ],
            itemList: [],
            config: {
              'useBindOnce': true  // 是否单向绑定
            },
            loadingState: true,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              currentParams = angular.extend({}, currentParams, {page: data});
              getList(currentParams);
            }
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            selectItem: function (data) {
              console.log(data);
              childScope.gridModel2.itemList.push(data);
            }
          };

          getList(currentParams);



          /**
           * 已选的表格配置
           *
           */
          childScope.gridModel2 = {
            columns: [
              {
                "id": 0,
                "name": "序号",
                "none": true
              },
              {
                "id": 1,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary" ng-click="propsParams.removeItem(item)">选择</button>',
                "name": '操作',
                "width": 100
              },
              {
                "id": 2,
                "cssProperty": "state-column",
                "fieldDirective": '<div><p bo-text="item.code"></p><span class="state-unread" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" cb-image-hover="{{item.mainphoto}}" bo-if="item.mainphoto"><img bo-src-i="{{item.mainphoto}}?x-oss-process=image/resize,w_150" alt=""></span><span class="state-unread default-service-image" style="width: 100px; height: 80px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span></div>',
                "name": '服务编码/图片',
                "width": 150
              },
              {
                "id": 3,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.nickname"></span>',
                "name": '商品名称'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.realname"></span>',
                "name": '品牌'
              },
              {
                "id": 5,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.mobile"></span>',
                "name": '属性'
              },
              {
                "id": 6,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.gender | formatStatusFilter : \'sex\'"></span>',
                "name": '零售单价（元）'
              },
              {
                "id": 7,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.storegrade"></span>',
                "name": '库存数量'
              },
              {
                "id": 8,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.rolename"></span>',
                "name": '条形码'
              },
              {
                "id": 9,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
                "name": '零件码'
              },
              {
                "id": 10,
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.companyname"></span>',
                "name": '备注'
              }
            ],
            itemList: [],
            config: {
              'useBindOnce': true  // 是否单向绑定
            },
            loadingState: false
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel2.config.propsParams = {
            removeItem: function (data) {
              _.remove(childScope.gridModel2.itemList, function (item) {
                return item.guid == data.guid;
              });
            }
          };

          /**
           * 获取提交数据
           * @param data
           */
          function getData(data){
            var results = {
              productprice: 0,
              itemList: data
            };
            _.forEach(data, function (item) {
              results.productprice = computeService.add(results.productprice, computeService.multiply(item.num || 0, item.price || 0))
            });
            return results;
          };

          /**
           * 确定
           */
          childScope.confirm = function () {
            var data = getData(childScope.gridModel2.itemList);
            scope.handler({data: {"status":"0", "data": data.itemList, "productprice": data.productprice}});
            childScope.close();
          };



        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.handler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_order/order-product-dialog.html", handler, {
            windowClass: "viewFramework-order-product-dialog"
          });
        })
      }
    }
  }
})();
