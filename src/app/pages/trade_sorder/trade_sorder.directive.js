/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('selectUserDialog', selectUserDialog)
    .directive('tradeSorderConfirmTakecarDialog', tradeSorderConfirmTakecarDialog)
    .directive('tradeSorderAddMotors', tradeSorderAddMotors)
    .directive('tradeSorderAddItems', tradeSorderAddItems);

  /** @ngInject */
  function tradeSorderConfirmTakecarDialog(cbDialog, tradeSorder) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          childScope.item = angular.copy(scope.item);
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            scope.itemHandler({data: {"status":"0", "data": childScope.item}});
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
          cbDialog.showDialogByUrl("app/pages/trade_sorder/trade_sorder_confirm_takecar_dialog.html", handler, {
            windowClass: "trade_sorder_confirm_takecar_dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function selectUserDialog(cbDialog, tradeSorder) {
    return {
      restrict: "A",
      scope: {
        itemHandler: "&"
      },
      link: function(scope, iElement){
        function handler(childScope){
          var search = {
            realname: "",
            username: "",
            page: 1
          };
          function searchList(params){
            tradeSorder.user(params).then(function(data){
              childScope.gridModel.itemList = data.data.data;
              childScope.gridModel.paginationinfo = {
                page: params.page,
                pageSize: 5,
                total: data.data.count
              };
              childScope.gridModel.loadingState = false;
            });
          }
          /**
           * 搜索
           * @type {{config: {searchID: string, searchDirective: [*]}, handler: handler}}
           */
          childScope.gridSearch = {
            config: {
              "searchID": 'select-user',
              "searchDirective": [
                {
                  'label': "会员姓名",
                  'type': 'text',
                  'searchText': "realname",
                  'placeholder': '会员姓名'
                },
                {
                  'label': "联系方式",
                  'type': 'text',
                  'searchText': "username",
                  'placeholder': '联系方式'
                }
              ]
            },
            tips: true,
            handler: function(data){
              console.log((_.isEmpty(data.realname) && _.isEmpty(data.username)));
              if(_.isEmpty(data) || (_.isEmpty(data.realname) && _.isEmpty(data.username))){
                childScope.gridSearch.tips = true;
                childScope.gridModel.itemList = [];
                search.page = 1;
                return ;
              }
              if(angular.isDefined(data.realname)){
                search.realname = data.realname;
              }
              if(angular.isDefined(data.realname)){
                search.username = data.username;
              }
              childScope.gridSearch.tips = false;
              searchList(search);
            }
          };
          /**
           * 表格
           * @type {{columns: [*], config: {settingColumnsSupport: boolean, checkboxSupport: boolean, sortSupport: boolean, paginationSupport: boolean, selectedProperty: string, selectedScopeProperty: string, useBindOnce: boolean, paginationInfo: {maxSize: number, showPageGoto: boolean}, addColumnsBarDirective: [*]}}}
           */
          childScope.gridModel = {
            "columns": [
              {
                "id": 0,
                "name": "会员名称",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.realname"></span>'
              },
              {
                "id": 1,
                "name": "联系方式",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.username"></span>'
              },
              {
                "id": 2,
                "name": "会员来源",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.source | formatStatusFilter : \'user_source\'"></span>'
              },
              {
                "id": 3,
                "name": "会员类型",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.usertype | formatStatusFilter : \'user_type\'"></span>'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary"  ng-click="propsParams.select(item)">选择</button>',
                "name": '操作',
                "width": 50
              }
            ],
            "config": {
              'paginationSupport': true,  // 是否有分页
              'useBindOnce': true,  // 是否单向绑定
              "paginationInfo": {   // 分页配置信息
                maxSize: 5,
                showPageGoto: true
              }
            },
            itemList: [],
            loadingState: false,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              search.page = data;
              searchList(search);
            }
          };

          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            select: function (data) {   // 服务完成
              console.log(data);
              scope.itemHandler({data: {"status":"0", "data": data}});
              childScope.close();
            }
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_sorder/trade_sorder_select_user_dialog.html", handler, {
            windowClass: "trade_sorder_select_user_dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function tradeSorderAddItems(cbDialog, tradeSorder) {
    var columns = {
      "0": [
        {
          "id": 0,
          "name": "服务名称",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.scatename2"></span>'
        },
        {
          "id": 1,
          "name": "服务类型",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.scatename1"></span>'
        },
        {
          "id": 2,
          "cssProperty": "state-column",
          "fieldDirective": '<button class="btn btn-primary"  ng-click="propsParams.select(item)">选择</button>',
          "name": '操作',
          "width": 50
        }
      ],
      "1": [
        {
          "id": 0,
          "name": "套餐名称",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.servername"></span>'
        },
        {
          "id": 1,
          "name": "服务类型",
          "cssProperty": "state-column",
          "fieldDirective": '<span class="state-unread" bo-bind="item.username"></span>'
        },
        {
          "id": 2,
          "cssProperty": "state-column",
          "fieldDirective": '<button class="btn btn-primary"  ng-click="propsParams.select(item)">选择</button>',
          "name": '操作',
          "width": 50
        }
      ]
    };
    return {
      restrict: "A",
      scope: {
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        function handler(childScope){
          var search = {
            page: 1,
            scatename2: ""
          };
          var type = "offerprice";
          childScope.ordertype = 0;
          /**
           * tab切换
           * @type {{}}
           */
          childScope.tab = {
            config: [
              {
                name: "服务项目",
                active: true,
                ordertype: 0,
                placeholder: "请输入服务相关关键词",
                type: "offerprice"
              },
              {
                name: "套餐项目",
                active: false,
                ordertype: 1,
                placeholder: "请输入套餐相关关键词",
                type: "offerprice"
              }
            ],
            loading: true,
            handler: function (item) {
              if(item.active){
                return ;
              }
              this.loading = false;
              angular.forEach(this.config, function (key) {
                key.active = false;
              });
              item.active = true;
              childScope.ordertype = item.ordertype;
              childScope.gridModel.columns = columns[item.ordertype];
              type = item.type;
              searchList(type, search);
              this.loading = true;
            }
          };
          childScope.search = {
            text: "",
            handler: function () {
              searchList(type, {
                "scatename2": "",
                "page": searchPage
              });
            }
          };
          function searchList(type, params){
            tradeSorder[type](params).then(function(data){
              childScope.gridModel.itemList = data.data.data;
              childScope.gridModel.paginationinfo = {
                page: params.page,
                pageSize: 5,
                total: data.data.count
              };
              childScope.gridModel.loadingState = false;
            });
          }

          searchList(type, search);
          /**
           * 表格
           * @type {{columns: [*], config: {settingColumnsSupport: boolean, checkboxSupport: boolean, sortSupport: boolean, paginationSupport: boolean, selectedProperty: string, selectedScopeProperty: string, useBindOnce: boolean, paginationInfo: {maxSize: number, showPageGoto: boolean}, addColumnsBarDirective: [*]}}}
           */
          childScope.gridModel = {
            "columns": columns[childScope.ordertype],
            "config": {
              'paginationSupport': true,  // 是否有分页
              'useBindOnce': true,  // 是否单向绑定
              "paginationInfo": {   // 分页配置信息
                maxSize: 5,
                showPageGoto: false
              }
            },
            itemList: [],
            loadingState: false,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              search.page = data;
              console.log(data);
              searchList(type, search);
            }
          };
          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            select: function (data) {   // 服务完成
              console.log(data);
              scope.itemHandler({data: {"status":"0", "data": data}});
              childScope.close();
            }
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          if(!iAttrs.tradeSorderAddItems){
            scope.itemHandler({data: {"status":"1", "data":"请先选择用户"}});
            return ;
          }
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_sorder/trade_sorder_add_items_dialog.html", handler, {
            windowClass: "trade_sorder_add_items_dialog"
          });
        })
      }
    }
  }

  /** @ngInject */
  function tradeSorderAddMotors(cbDialog, tradeSorder) {
    return {
      restrict: "A",
      scope: {
        itemHandler: "&"
      },
      link: function(scope, iElement, iAttrs){
        var userid = "";
        function handler(childScope){
          var search = {
            userid: userid
          };
          /**
           * tab切换
           * @type {{}}
           */
          childScope.tab = {
            config: [
              {
                name: "客户车辆",
                active: true,
                type: 0
              },
              {
                name: "新增车辆",
                active: false,
                type: 1
              }
            ],
            type: 0,
            loading: true,
            handler: function (item) {
              if(item.active){
                return ;
              }
              this.loading = false;
              angular.forEach(this.config, function (key) {
                key.active = false;
              });
              item.active = true;
              searchList(type, search);
              this.loading = true;
            }
          };
          childScope.search = {
            text: "",
            handler: function () {
              searchList(type, {
                "scatename2": "",
                "page": searchPage
              });
            }
          };
          function searchList(params){
            tradeSorder.motor(params).then(function(data){
              childScope.gridModel.itemList = data.data.data;
              childScope.gridModel.paginationinfo = {
                page: params.page,
                pageSize: 5,
                total: data.data.count
              };
              childScope.gridModel.loadingState = false;
            });
          }

          searchList(search);
          /**
           * 表格
           * @type {{columns: [*], config: {settingColumnsSupport: boolean, checkboxSupport: boolean, sortSupport: boolean, paginationSupport: boolean, selectedProperty: string, selectedScopeProperty: string, useBindOnce: boolean, paginationInfo: {maxSize: number, showPageGoto: boolean}, addColumnsBarDirective: [*]}}}
           */
          childScope.gridModel = {
            "columns": [
              {
                "id": 0,
                "name": "车牌号",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.licence"></span>'
              },
              {
                "id": 1,
                "name": "车型",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.model"></span>'
              },
              {
                "id": 2,
                "name": "VIN码",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.vin"></span>'
              },
              {
                "id": 3,
                "name": "总里程（公里）",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-bind="item.enginenumber"></span>'
              },
              {
                "id": 4,
                "cssProperty": "state-column",
                "fieldDirective": '<button class="btn btn-primary"  ng-click="propsParams.select(item)">选择</button>',
                "name": '操作',
                "width": 50
              }
            ],
            "config": {
              'paginationSupport': true,  // 是否有分页
              'useBindOnce': true,  // 是否单向绑定
              "paginationInfo": {   // 分页配置信息
                maxSize: 5,
                showPageGoto: false
              }
            },
            itemList: [],
            loadingState: false,      // 加载数据
            pageChanged: function (data) {    // 监听分页
              search.page = data;
              console.log(data);
              searchList(type, search);
            }
          };
          /**
           * 组件数据交互
           *
           */
          childScope.gridModel.config.propsParams = {
            select: function (data) {   // 服务完成
              console.log(data);
              scope.itemHandler({data: {"status":"0", "data": data}});
              childScope.close();
            }
          };
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          if(!iAttrs.tradeSorderAddMotors){
            scope.itemHandler({data: {"status":"1", "data":"请先选择用户"}});
            return ;
          }
          userid = iAttrs.tradeSorderAddMotors;
          scope.itemHandler({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/trade_sorder/trade_sorder_add_motors_dialog.html", handler, {
            windowClass: "trade_sorder_add_motors_dialog"
          });
        })
      }
    }
  }
})();
