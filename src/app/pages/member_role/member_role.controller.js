/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
  'use strict';

  angular
    .module('shopApp')
    .controller('MemberRoleLsitController', MemberRoleLsitController);
  /** @ngInject */
  function MemberRoleLsitController($state, $log, cbAlert, memberRole, memberRoleConfig, permissions) {
    var vm = this;
    var currentState = $state.current;
    var currentStateName = currentState.name;
    var currentParams = angular.extend({}, $state.params, {pageSize: 10});

    /**
     * 表格配置
     */
    vm.gridModel = {
      columns: angular.copy(memberRoleConfig.DEFAULT_GRID.columns),
      itemList: [],
      config: angular.copy(memberRoleConfig.DEFAULT_GRID.config),
      loadingState: true,      // 加载数据
      pageChanged: function (data) {    // 监听分页
        var page = angular.extend({}, currentParams, {page: data});
        $state.go(currentStateName, page);
      }
    };

    /**
     * 组件数据交互
     *
     */
    vm.gridModel.config.propsParams = {
      removeItem: function (data) {
        $log.debug('removeItem', data);
        if (data.status == 0) {
          memberRole.remove(data.transmit).then(function (results) {
            if (results.data.status == 0) {
              var message = "";
              if (_.isObject(results.data.data) || _.isEmpty(results.data.data)) {
                message = "删除成功";
              } else {
                message = results.data.data;
              }
              cbAlert.tips(message);
              /**
               * 如果是个对象就去设置权限，防止出错
               */
              if (_.isObject(results.data.data)) {
                permissions.setPermissions(results.data.data);
                if (!permissions.findPermissions(currentState.permission)) {
                  $state.go('desktop.home');
                }
              }
              getList(currentParams);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
        }
      },
      roleItem: function (data) {
        if (data.status == 0) {
          var message = "";
          if (data.type == "add") {
            if (_.isEmpty(data.data.data)) {
              message = "添加成功";
            } else {
              message = data.data.data;
            }
            cbAlert.tips(message);
          }
          if (data.type == "edit") {
            if (_.isObject(data.data.data) || _.isEmpty(data.data.data)) {
              message = "修改成功";
            } else {
              message = data.data.data;
            }
            cbAlert.tips(message);
            /**
             * 如果是个对象就去设置权限，防止出错
             */
            if (_.isObject(data.data.data)) {
              permissions.setPermissions(data.data.data);
              if (!permissions.findPermissions(currentState.permission)) {
                $state.go('desktop.home');
              }
            }
          }
          getList(currentParams);
        }
      }
    };

    /**
     * 搜索操作
     *
     */
    vm.searchModel = {
      'config': {
        other: currentParams,
        keyword: {
          placeholder: "请输入权限名称",
          model: currentParams.keyword,
          name: "keyword",
          isShow: true
        }
      },
      'handler': function (data) {
        // 如果路由一样需要刷新一下
        if(angular.equals(currentParams, data)){
          $state.reload();
        }else{
          $state.go(currentStateName, data);
        }

      }
    };

    // 获取数据列表
    function getList(params) {
      /**
       * 路由分页跳转重定向有几次跳转，先把空的选项过滤
       */
      if (!params.page) {
        return ;
      }
      vm.gridModel.loadingState = true;      // 加载数据
      memberRole.list(params).then(function (results) {
        var result = results.data;
        if (result.status == 0) {
          if (!result.data.length && params.page != 1) {
            $state.go(currentStateName, {page: 1});
          }
          vm.gridModel.itemList = result.data;
          vm.gridModel.paginationinfo = {
            page: params.page * 1,
            pageSize: params.pageSize,
            total: result.count
          };
          vm.gridModel.loadingState = false;
        }else{
          cbAlert.error("错误提示", result.data);
        }
      });
    }

    getList(currentParams);
  }

})();
