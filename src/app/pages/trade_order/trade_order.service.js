/**
 * Created by Administrator on 2016/10/24.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('tadeOrder', tadeOrder)
        .factory('tadeOrderAddData', tadeOrderAddData)
        .service('storeItems', storeItems)
        .service('tadeOrderItems', tadeOrderItems)
        .constant('tadeOrderConfig', tadeOrderConfig);

    /** @ngInject */
    function storeItems() {
      var store = [];
      /**
       * 初始化 数组清空
       */
      this.init = function () {
        store = [];
      };

      /**
       * 给数据添加一个数据
       */
      this.add = function (value) {
        store.push(value);
        return this;
      };

      /**
       * 合并数据
       */
      this.merge = function (value) {
        store = store.concat(value);
        return this;
      };

      /**
       * 删除某一个项
       * @param key
       * @param value
       */
      this.remove = function (key, value) {
        var compare = null;
        if(_.isObject(value) && !_.isUndefined(value[key])){
          compare = value[key];
        } else if(_.isString(value) || _.isNumber(value)){
          compare = value;
        }else{
          return undefined;
        }
        _.remove(store, function (item) {
          return item[key] === compare;
        });
        return this;
      };

      /**
       * 删除全部
       */
      this.removeAll = function () {
        this.init();
        return this;
      };

      /**
       * 获取一个数据
       * @param key
       * @param value
       */
      this.get = function (key, value) {
        var compare = null;
        if(_.isObject(value) && !_.isUndefined(value[key])){
          compare = value[key];
        } else if(_.isString(value) || _.isNumber(value)){
          compare = value;
        }else{
          return undefined;
        }
        return _.find(store, function (item) {
          return item[key] === compare;
        });
      };

      /**
       * 更新某个数据
       * @param key
       * @param value
       */
      this.put = function (key, value) {
        var compare = null;
        if(_.isObject(value) && !_.isUndefined(value[key])){
          compare = value[key];
        }else{
          throw Error('value 不是一个｛｝对象，或者value里面没有对应的key');
        }
        var index = _.findIndex(store, function (item) {
          return item[key] === compare;
        });
        store[index] = value;
        return this;
      };

      /**
       * 获取全部数据
       */
      this.getAll = function () {
        return store;
      };
    }

    /** @ngInject */
    function tadeOrderItems($filter, storeItems, computeService, utils) {
      var store = [];
      /**
       * 统计数据
       * @type {{}}
       */
      var tally = {
        serviceCount: 0,
        ssalepriceAll: 0,
        productCount: 0,
        psalepriceAll: 0,
        totalprice: 0
      };

      /**
       * 根据guid删除某一项
       * @param item
       * @param subitem
       */
      this.removeItem = function (item, subitem) {
        if (_.isUndefined(subitem)) {
          storeItems.remove('itemid', item);
        } else {
          _.remove(item.products, function (key) {
            return key.itemid === subitem.itemid;
          });
        }
        this.computeTally(store);
      };

      /**
       * 获取计算后统计信息
       * @param details
       * @returns {{}}
       */
      this.computeTally = function (details) {
        // 服务计数
        tally.serviceCount = _.chain(details)
          .filter('itemtype', '0')
          .reduce(function (result, value) {
            return computeService.add(result, value.num);
          }, 0)
          .value();
        // 原价服务总和
        tally.soriginpriceAll = _.chain(details)
          .filter(function (char) {
            return !_.isUndefined(char.originprice) && char.itemtype === '0';
          })
          .reduce(function (result, value) {
            return computeService.add(result, value.originprice);
          }, 0)
          .value();
        // 原价商品总和
        tally.poriginpriceAll = _.chain(details)
          .filter(function (char) {
            return !_.isUndefined(char.originprice) && char.itemtype === '1';
          })
          .reduce(function (result, value) {
            return computeService.add(result, value.originprice);
          }, 0)
          .value();
        // 现价服务总和
        tally.ssalepriceAll = _.chain(details)
          .filter('itemtype', '0')
          .reduce(function (result, value) {
            return computeService.add(result, value.$allprice);
          }, 0)
          .value();
        // 优惠总和
        tally.preferentialprice = _.chain(details)
          .filter(function (char) {
            return !_.isUndefined(char.preferential);
          })
          .reduce(function (result, value) {
            return computeService.add(result, value.preferential);
          }, 0)
          .value();
        // 商品计数
        tally.productCount = _.chain(details)
          .filter('itemtype', '1')
          .reduce(function (result, value) {
            return computeService.add(result, value.num);
          }, _.reduce(details, function (result, value) {
            return computeService.add(result, value.$productCount);
          }, 0))
          .value();
        // 现价商品总和
        tally.psalepriceAll = _.reduce(details, function (result, value) {
          return computeService.add(result, value.$productprice);
        }, 0);
        // 总价
        tally.totalprice = computeService.add(tally.psalepriceAll, tally.ssalepriceAll);
        return tally;
      };

      /**
       * 获取统计结果
       */
      this.getTally = function () {
        return tally;
      };

      /**
       * 将数据格式化成后台需要数据
       * @param details         前端显示的数据
       * @returns {TResult[]}   返回后台数据
       */
      this.getDetails = function(details) {
        // 不是数组直接抛错
        if (!_.isArray(details)) {
          throw Error('参数不是一个数组')
        }
        // 空数组直接返回
        if (_.isEmpty(details)) {
          return [];
        }
        return _.map(details, function (item) {
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
      };

      /**
       * 拼装服务信息
       * @param details
       * @returns {*}
       */
      this.setServiceinfo = function(details) {
        var results = [], serviceinfo;
        _.forEach(details, function (item) {
          item && item.itemid && results.push(item.itemname);
        });
        if (!results.length) {
          return "";
        }
        serviceinfo = results.join('、');
        details.length > 1 && (serviceinfo = '（多项）' + serviceinfo);
        return serviceinfo;
      };

      /**
       * 拼装商品信息
       * @param details
       * @returns {*}
       */
      this.setProductinfo = function(details) {
        var results = [], products = [], productinfo;
        _.forEach(details, function (item) {
          products = products.concat(item.products);
        });
        _.forEach(products, function (item) {
          item && results.push(item.itemname);
        });
        if (!results.length) {
          return "";
        }
        productinfo = results.join('、');
        results.length > 1 && (productinfo = '（多项）' + productinfo);
        return productinfo;
      };

      /**
       * 处理获取的数据details，格式化数据
       * @param details
       */
      this.setDetails = function (details, isPackage) {
        // 不是数组直接抛错
        if(!_.isArray(details)){
          throw Error('参数不是一个数组')
        }
        // 空数组直接返回
        if(_.isEmpty(details)){
          return ;
        }
        // 处理数据
        _.chain(details)
          .forEach(function (result) {
            result.$productPrice = 0;
            if(_.isUndefined(result.products)){
              result.$productCount = 0;
            }else{
              result.$productCount = result.products.length;
            }
            if(!utils.isNumber(result.originprice)){
              result.originprice = computeService.pullMoney(result.originprice);
            }
            if(!utils.isNumber(result.price)){
              result.price = computeService.pullMoney(result.price);
              if(isPackage && !_.isUndefined(result.originprice)){
                result.price = result.originprice;
              }
            }
            result.$allprice = $filter('moneySubtotalFilter')([result.price, result.num]);
            if(!utils.isNumber(result.preferential)){
              result.preferential = computeService.pullMoney(result.preferential);
            }
            if(_.isUndefined(result.products) && _.isEmpty(result.itemid)){
              result.itemtype = '1';
            }
            if(!_.isEmpty(result.itemid) && !_.isEmpty(result.itemskuid)){
              result.itemtype = '0';
            }
            if(result.products && result.products.length > 0 && result.products[0].itemtype === '1'){
              result.itemtype = '1';
              result.price = 0;
              result.num = 0;
              result.itemname = "商品销售";
            }

            if(result.products && result.products.length === 1 && result.itemtype === '1'){
              result.price = 0;
              result.num = 0;
              result.itemname = "商品销售";
            }

            result.products && _.forEach(result.products, function (item) {
              if(!utils.isNumber(item.originprice)){
                item.originprice = computeService.pullMoney(item.originprice);
              }
              if(!utils.isNumber(item.price)){
                item.price = computeService.pullMoney(item.price);
                if(isPackage && !_.isUndefined(item.originprice)){
                  item.price = item.originprice;
                }
              }
              if(!utils.isNumber(item.preferential)){
                item.preferential = computeService.pullMoney(item.preferential);
              }
              item.$allprice = $filter('moneySubtotalFilter')([item.price, item.num]);
              result.$productPrice = computeService.add(result.$productPrice, item.$allprice);
            });
            result.$totalPrice = computeService.add(result.$productPrice, result.$allprice);
          })
          .value();
      };


      /**
       * 获可提交单数据
       * @param data
       * @returns {Object}
       */
      this.getDataBase = function(data) {
        var _this = this;
        return _.chain(data)
          .cloneDeep()
          .tap(function (result) {
            // 处理会员车辆信息
            if (!_.isUndefined(result.carinfo)) {
              result.carinfo = _.omit(result.carinfo, ['$$hashKey', '$baoyang']);
              result.carinfo.totalmile = result.totalmile;
            }
            result.carinfo = angular.toJson(result.carinfo);
          })
          .tap(function (result) {
            // 处理会员信息
            if (!_.isUndefined(result.userinfo)) {
              result.userinfo = _.omit(result.userinfo, ['$$hashKey', 'balance']);
              result.userinfo.totalmile = result.totalmile;
            }
            result.userinfo = angular.toJson(result.userinfo);
          })
          .tap(function (result) {
            // 是否店内等候
            result.waitinstore = result.waitinstore ? 1 : 0;
          })
          .tap(function (result) {
            // 处理优惠金额
            result.preferentialprice = computeService.pushMoney(result.preferentialprice);
          })
          .tap(function (result) {
            // 处理服务信息和商品信息
            result.serviceinfo = _this.setServiceinfo(result.details);
            result.productinfo = _this.setProductinfo(result.details);
          })
          .tap(function (result) {
            // 处理订单封面
            try {
              result.coveross = result.details[0].mainphoto;
            } catch (e) {
              result.coveross = result.details[0].products[0].mainphoto
            }
          })
          .tap(function (result) {
            result.details = _this.getDetails(result.details);
            // 处理金额
            _.forEach(result.details, function (item) {
              item.price = computeService.pushMoney(item.price);
              if(item.originprice){
                item.originprice = computeService.pushMoney(item.originprice);
              }
              if(item.preferential){
                item.preferential = computeService.pushMoney(item.preferential);
              }
              _.forEach(item.products, function (subitem) {
                subitem.price = computeService.pushMoney(subitem.price);
                if(subitem.originprice){
                  subitem.originprice = computeService.pushMoney(subitem.originprice);
                }
                if(subitem.preferential){
                  subitem.preferential = computeService.pushMoney(subitem.preferential);
                }
              });
            });
          })
          .value();
      }

    }

    /** @ngInject */
    function tadeOrder(requestService) {
      return requestService.request('trade', 'order');
    }

    /** @ngInject */
    function tadeOrderAddData($q, requestService, userCustomer) {
      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
      var userInfo;
      return {
        query: function (license) {
          return requestService.request('motors', 'customer').suggestCarNo({carNo: license}).then(function (results) {
            return results.data.status === 0 ? results.data.data : [];
          });
        },
        get: function (license, motorid) {
          if(_.isUndefined(userInfo)){
            return userCustomer.customer({carNo: license, motorId: motorid}).then(function (results) {
              var result = {};
              if(results.data.status === 0){
                result.licence = license;
                result.userType = results.data.data.userType;
                result.customers = results.data.data.customers;
                if (result.userType === 'u') {
                  result.mobile = result.customers[0].user.mobile;
                  result.realname = result.customers[0].user.realname;
                  result.user_avatar = result.customers[0].user.avatar;
                  result.motor_logo = result.customers[0].motor.logo;
                }
                if(result.userType === 'c'){
                  result.realname = "临客";
                  result.mobile = result.customers[0].mobile;
                }
                if(result.userType === 'n'){
                  result.realname = "新临客";
                }
              }else{
                result = null;
              }
              return result;
            });
          }
          deferred.resolve(userInfo);
          return deferred.promise;   // 返回承诺
        },
        updata: function (info) {
          userInfo = info;
        }
      }
    }

    // userType：n(找不到)，u(会员)，c(客户)。

    /** @ngInject */
    function tadeOrderConfig() {
        return {
            DEFAULT_GRID: {
                "columns": [
                    {
                        "id": 0,
                        "name": "序号",
                        "none": true,
                         "width": 20
                    },
                    {
                      "id": 1,
                      "name": "&nbsp;",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div class="editOrder" ><span class="edit-More text-default" ng-click="propsParams.nextshow(item,$event) ">•••</span><p class="edits" ng-show="item.$show"><a href="javascript:;" class="state-unread text-link edit-item" ng-if="item.paystatus == 1 && item.status != 4" orader-received-dialog item="item" item-handler="propsParams.received(data)">收款</a> ' +
                      '<a href="javascript:;" class="state-unread text-link  edit-item" ng-if="item.status == 1" ng-click="propsParams.completed(item)">完工</a>  ' +
                      '<a href="{{propsParams.printOrder(item)}}" class="state-unread text-link  edit-item" target="_blank">打印</a>  ' +
                      '<a ng-if="item.paystatus == 1 && item.status == 1" ui-sref="trade.order.edit({orderid: item.guid})" class="state-unread text-link edit-item">编辑</a>  ' +
                      '<a href="javascript:;" class="state-unread text-red edit-item" ng-if="item.status == 1 && item.paystatus == 1" ng-click="propsParams.closed(item)">关闭订单</a>',
                      "width": 30
                    },
                    {
                      "id": 2,
                      "name": "会员",
                      "cssProperty": "state-column",
                      "fieldDirective": '<div bo-if="item.orderstype == 0 || item.orderstype == 2" class="orderUser" cb-popover="" popover-placement="bottom" popover-template-id="orderUserTemplate.html" popover-animation="false"  popover-template-data="item.userinfo"><img bo-src-i="{{item.userinfo.avatar}}" alt=""><a class="state-unread" bo-bind="item.userinfo.realname"  href="javascript:;" ></a></div><div bo-if="item.orderstype == 1" class="orderUser"><span class="default-user-image" style="width: 24px; height: 24px; overflow: hidden; display: inline-block;" bo-if="!item.mainphoto"></span><span class="state-unread"  href="javascript:;" >临客</span></div>',
                      "width": 120
                    },
                    {
                      "id": 2,
                      "name": "车辆",
                      "cssProperty": "state-column",
                      "fieldDirective": '<a bo-if="item.orderstype == 0 || item.orderstype == 2" class="carUser" cb-popover="" popover-placement="bottom" popover-template-id="orderCarTemplate.html" popover-animation="false"  popover-template-data="item.carinfo" class="state-unread" bo-bind="item.carno"  href="javascript:;"></a><span class="" bo-if="item.orderstype == 1" bo-bind="item.carno"></span>',
                      "width": 90
                    },
                    // {
                    //   "id": 3,
                    //   "name": "客户留言",
                    //   "cssProperty": "state-column",
                    //   "fieldDirective": '<span class="state-unread" cb-truncate-text="{{item.remark}}" text-length="10"></span>',
                    //   "width": 150
                    // },
                    {
                      "id": 4,
                      "name": "订单状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-class="{\'text-success\': item.status == 2, \'text-red\': item.status == 1}" ng-bind="item.status | formatStatusFilter : \'server_order_status\'"></span>',
                      "width": 84
                    },
                    {
                      "id": 5,
                      "name": "付款状态",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread"><span bo-if="item.status != 4" ng-class="{\'text-success\': item.paystatus == 0, \'text-orange\': item.paystatus == 1}" bo-bind="item.paystatus | formatStatusFilter : \'server_order_paystatus\'"></span><span bo-if="item.status == 4">已关闭</span></span>',
                      "width": 75
                    },
                    // {
                    //   "id": 6,
                    //   "name": "服务/项目",
                    //   "cssProperty": "state-column",
                    //   "fieldDirective": '<span class="state-unread text-danger" cb-truncate-text="{{item.serviceinfo}}" text-length="10"></span>',
                    //   "width": 150
                    // },
                    // {
                    //   "id": 7,
                    //   "name": "商品/材料",
                    //   "cssProperty": "state-column",
                    //   "fieldDirective": '<span class="state-unread text-danger" cb-truncate-text="{{item.productinfo}}" text-length="9"></span>',
                    //   "width": 150
                    // },
                    {
                      "id": 8,
                      "name": "工时费",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.ssaleprice | number : \'2\'"></span>',
                      "width": 77
                    },
                    {
                      "id": 9,
                      "name": "商品材料费",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.psaleprice | number : \'2\'"></span>',
                      "width": 90
                    },
                    {
                      "id": 10,
                      "name": "总费用",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.totalprice | number : \'2\'"></span>',
                      "width": 77
                    },
                    {
                      "id": 11,
                      "name": "优惠",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="text-red">-<span class="state-unread" bo-bind="item.preferentialprice | number : \'2\'"></span></span>',
                      "width": 77
                    },
                    {
                      "id": 12,
                      "name": "实收",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" ng-bind="item.actualprice | number : \'2\'"></span>',
                      "width": 77
                    },
                    // {
                    //   "id": 13,
                    //   "name": "支付方式",
                    //   "cssProperty": "state-column",
                    //   "fieldDirective": '<span class="state-unread" ng-bind="item.paytype | formatStatusFilter : \'server_order_paytype\'"></span>',
                    //   "width": 110
                    // },
                    {
                      "id": 14,
                      "name": "订单编号",
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.guid"></span>',
                      "width": 90
                    },
                    {
                      "id": 15,
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-bind="item.createtime"></span>',
                      "name": '开单时间',
                      "width": 133
                    },
                    {
                      "id": 16,
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" bo-text="item.creatorname"></span>',
                      "name": '开单人',
                      "width": 68
                    },
                    {
                      "id": 17,
                      "cssProperty": "state-column",
                      "fieldDirective": '<span class="state-unread" style="white-space:nowrap;" bo-text="item.remark"></span>',
                      "name": '备注',
                      "width": 120
                    }
                ],
                "config": {
                    'settingColumnsSupport': false,   // 设置表格列表项
                    'sortSupport': true,     // 排序
                    'sortPrefer': true,     //  服务端排序
                    'paginationSupport': true,  // 是否有分页
                    'selectedProperty': "selected",  // 数据列表项复选框
                    'selectedScopeProperty': "selectedItems",
                    'useBindOnce': true,  // 是否单向绑定
                    'exportDataSupport': true, // 导出
                    "paginationInfo": {   // 分页配置信息
                        maxSize: 5,
                        showPageGoto: true
                    },
                    'addColumnsBarDirective': [
                      '<a class="u-btn u-btn-primary u-btn-sm" cb-access-control="chebian:store:trade:porder:add" ui-sref="trade.order.add()">开　单</a> '
                    ],
                    'batchOperationBarDirective': [
                      '<div class="FootConfig total">' +
                      '<p><strong>服务项目<span ng-bind="propsParams.statistics.servercount"></span> 项&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.ssalepriceAll | number : \'2\'"></span></label></p>' +
                      '<p><strong>商品材料 <span ng-bind="propsParams.statistics.productcount"></span> 项&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.psalepriceAll | number : \'2\'"></span></p>' +
                      '<p><strong>优惠&nbsp;</strong><label style="color: red;">&yen;&nbsp;-<span ng-bind="propsParams.statistics.preferentialprice | number : \'2\'"></span></label></p>' +
                      '<p><strong>合计&nbsp;</strong><label>&yen;&nbsp;<span ng-bind="propsParams.statistics.totalprice | number : \'2\'"></span></label></p>' +
                      '</div>'
                    ]
                }
            },
            DEFAULT_SEARCH: {
              createtime: [
                {
                  "label": "今日",
                  id: 0,
                  start: "0",
                  end: "0"
                },
                {
                  "label": "本周",
                  id: 1,
                  start: "1",
                  end: "1"
                },
                {
                  "label": "本月",
                  id: 2,
                  start: "2",
                  end: "2"
                },
                {
                  "label": "本年度",
                  id: 3,
                  start: "3",
                  end: "3"
                }
              ],
              status: [
                {
                  id: 1,
                  label: "服务中"
                },
                {
                  id: 2,
                  label: "已完工"
                },
                // {
                //   id: 3,
                //   label: "已完成"
                // },
                {
                  id: 4,
                  label: "已关闭",
                  tooltip: {
                    text: "该状态查询时包含已关闭订单（已关闭订单金额不计入统计项)",
                    dir: "right"
                  }
                }
              ],
              paystatus: [
                {
                  id: 0,
                  label: "已付款"
                },
                {
                  id: 1,
                  label: "未付款"
                }
              ],
              orderstype: [
                {
                  id: 0,
                  label: "会员"
                },
                {
                  id: 1,
                  label: "临客"
                }
              ],
              config: function(params){
                return {
                  other: params,
                  keyword: {
                    placeholder: "请输入订单编号、会员信息、车辆信息等",
                    model: params.keyword,
                    name: "keyword",
                    isShow: true
                  },
                  searchDirective: [
                    {
                      label: "时间",
                      all: true,
                      custom: true,
                      region: true,
                      type: "date",
                      name: "createtime",
                      model: "",
                      list: this.createtime,
                      start: {
                        name: "createtime0",
                        model: params.createtime0,
                        config: {
                          minDate: new Date("2017/01/01 00:00:00")
                        }
                      },
                      end: {
                        name: "createtime1",
                        model: params.createtime1,
                        config: {
                          minDate: new Date("2017/01/05 00:00:00")
                        }
                      }
                    },
                    {
                      label: "订单状态",
                      all: true,
                      type: "list",
                      name: "status",
                      model: params.status,
                      list: this.status
                    },
                    {
                      label: "付款状态",
                      all: true,
                      type: "list",
                      name: "paystatus",
                      model: params.paystatus,
                      list: this.paystatus
                    },
                    {
                      label: "会员类型",
                      all: true,
                      type: "list",
                      name: "orderstype",
                      model: params.orderstype,
                      list: this.orderstype
                    }
                  ]
                }
              }
            }
        }
    }
})();
