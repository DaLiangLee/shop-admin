/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('selectUserDialog', selectUserDialog);

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
            handler: function(data){
              console.log((_.isEmpty(data.realname) && _.isEmpty(data.username)));
              if(_.isEmpty(data) || (_.isEmpty(data.realname) && _.isEmpty(data.username))){
                childScope.gridModel.loadingState = false;
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
              childScope.gridModel.loadingState = true;
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
                "fieldDirective": '<span class="state-unread" bo-text="item.source"></span>'
              },
              {
                "id": 3,
                "name": "会员类型",
                "cssProperty": "state-column",
                "fieldDirective": '<span class="state-unread" bo-text="item.usertype"></span>'
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
              'noneDataInfoMessage': "请先输入用户姓名或者联系方式再点击搜索",
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

})();
