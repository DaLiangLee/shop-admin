/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('MemberEmployeeListController', MemberEmployeeListController);

    /** @ngInject */
    function MemberEmployeeListController($timeout, $state, $log,permissions, preferencenav, memberEmployee, memberEmployeeConfig) {
        var vm = this;
        var currentState = $state.current;
        var currentStateName = currentState.name;
        var currentParams = $state.params;
        var total = 0;

        /**
         * 消息提醒
         */
        vm.message = {
            loadingState: false
        };

        /**
        * 表格配置
        *
        */
        vm.gridModel = {
            columns: angular.copy(memberEmployeeConfig.DEFAULT_GRID.columns),
            itemList: [],
            config: angular.copy(memberEmployeeConfig.DEFAULT_GRID.config),
            loadingState: true,      // 加载数据
            pageChanged: function(data){    // 监听分页
                var page = angular.extend({}, currentParams, {page:data});
                $log.debug('updateGridPaginationInfo', page);
                //console.log(page);
                $state.go(currentStateName, page);
            }
        };

        /**
        * 组件数据交互(子指令和控制交互)
        * roleItems     角色列表
        * employeeItem  添加编辑员工
        * removeItem    删除项
        * statusItem    修改状态
        * resetItem     重置密码
        */
        vm.gridModel.config.propsParams = {
          roleItems: [
            {
              "id": 0,
              "name": "老板"
            },
            {
              "id": 1,
              "name": "运营经理"
            },
            {
              "id": 2,
              "name": "财务经理"
            },
            {
              "id": 3,
              "name": "管理员"
            },
            {
              "id": 4,
              "name": "打杂"
            },
            {
              "id": 5,
              "name": "网管"
            }
          ],
          employeeItem: function (data) {
            $log.debug('employeeItem', data.data);
            if(data.status == -1){
              vm.message.loadingState = false;
            }else {
              vm.message.loadingState = true;
              var message = "";
              if(data.type == "add"){
                if(_.isEmpty(data.data.data)){
                  message = "添加成功";
                }else{
                  message = data.data.data;
                }
                vm.message.config = {
                  type: data.data.status,
                  message: message
                };
              }
              if(data.type == "edit"){
                if(_.isObject(data.data.data) || _.isEmpty(data.data.data)){
                  message = "修改成功";
                }else{
                  message = data.data.data;
                }
                vm.message.config = {
                  type: data.data.status,
                  message: message
                };
                /**
                 * 如果是个对象就去设置权限，防止出错
                 */
                if(_.isObject(data.data.data)){
                  permissions.setPermissions(data.data.data);
                  if(!permissions.findPermissions(currentState.permission)) {
                    vm.message.loadingState = false;
                    preferencenav.removePreference(currentState);
                    $state.go('desktop.home');
                  }
                }
              }
              getList();
            }
          },
          removeItem: function(data){
            $log.debug('removeItem',data);
            if(data.status == -1){
              vm.message.loadingState = false;
            }else{
              memberEmployee.remove({id:data.transmit}).then(function(data) {
                var message = "";
                if(_.isObject(data.data.data) || _.isEmpty(data.data.data)){
                  message = "删除成功";
                }else{
                  message = data.data.data;
                }
                vm.message.loadingState = true;
                vm.message.config = {
                  type: data.data.status,
                  message: message
                };
                /**
                 * 如果是个对象就去设置权限，防止出错
                 */
                if(_.isObject(data.data.data)){
                  permissions.setPermissions(data.data.data);
                  if(!permissions.findPermissions(currentState.permission)){
                    vm.message.loadingState = false;
                    preferencenav.removePreference(currentState);
                    $state.go('desktop.home');
                  }
                }
                getList();
              }, function(data) {
                $log.debug('removeItemError', data);
              });
            }
            // if(data.list.length <= 5 && total > 10){
            //     vm.gridModel.loadingState = true;
            //     $timeout(function (){
            //         getList();
            //     }, 3000);
            // }
            //vm.gridModel.itemList = data.list;

          },
          statusItem: function (data) {
            $log.debug('statusItem', data);
            if(data.status == -1){
              vm.message.loadingState = false;
            }else {
              memberEmployee[data.type]({id:data.transmit}).then(function(data) {
                var message = "";
                if(_.isObject(data.data.data) || _.isEmpty(data.data.data)){
                  message = "修改成功";
                }else{
                  message = data.data.data;
                }
                vm.message.loadingState = true;
                vm.message.config = {
                  type: data.data.status,
                  message: message
                };
                /**
                 * 如果是个对象就去设置权限，防止出错
                 */
                if(_.isObject(data.data.data)){
                  permissions.setPermissions(data.data.data);
                  if(!permissions.findPermissions(currentState.permission)){
                    vm.message.loadingState = false;
                    preferencenav.removePreference(currentState);
                    $state.go('desktop.home');
                  }
                }
                getList();
              }, function(data) {
                $log.debug('removeItemError', data);
              });
            }
          },
          resetItem: function (data) {
            $log.debug('resetItem', data);
            if(data.status == -1){
              vm.message.loadingState = false;
            }else {
              var message = "";
              if(_.isObject(data.data.data) || _.isEmpty(data.data.data)){
                message = "重置成功";
              }else{
                message = data.data.data;
              }
              vm.message.loadingState = true;
              vm.message.config = {
                type: data.data.status,
                message: message
              };
            }
          }
        };

        // 搜索操作
        vm.gridSearch = {
            'config': {
                searchID: 'staffManages',
                searchParams: $state.params,
                searchDirective: [
                    {
                        'label': "员工姓名",
                        'type': 'text',
                        'searchText': "name",
                        'placeholder': '员工姓名'
                    },
                    {
                        'label': "账号",
                        'type': 'text',
                        'searchText': "account",
                        'placeholder': '账号名称'
                    },
                    {
                        'label': "角色名称",
                        'type': 'select',
                        'searchText': "role",
                        'placeholder': '角色名称',
                        'list': [
                            {
                                'id': 0,
                                'name': '总经理'
                            },
                            {
                                'id': 1,
                                'name': '财务'
                            },
                            {
                                'id': 2,
                                'name': '运营'
                            },
                            {
                                'id': 3,
                                'name': '管理员'
                            }
                        ]
                    }
                ]
            },
            'handler': function (data) {
                $log.debug(data)
            }
        };

      /**
       * 获取员工列表
       */
      function getList(){
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if(!currentParams.page){
          return ;
        }
        memberEmployee.get(currentParams).then(function(data) {
          if(data.data.status == 0){
            if(!data.data.data.length && currentParams.page !=1){
              $state.go(currentStateName, {page: 1});
            }
            total = data.data.count;
            vm.gridModel.itemList = data.data.data;
            vm.gridModel.paginationinfo = {
              page:  currentParams.page*1,
              pageSize: 10,
              total: total
            };
            vm.gridModel.loadingState = false;
          }
        }, function(data) {
           $log.debug('getListError', data);
        });
      }
      getList();
    }

})();
