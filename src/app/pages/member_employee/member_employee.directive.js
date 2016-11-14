/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('memberEmployeeReset', memberEmployeeReset)
    .directive('memberEmployeeDialog', memberEmployeeDialog);

  /** @ngInject */
  function memberEmployeeReset($interval, cbDialog, memberEmployee) {
    /**
     *  重置逻辑
     *  1，填写倒计时的时间 memberEmployeeReset
     *  2，点击时候判断是单个删除还是批量删除 通过item字段和list来判断
     *         单个删除   item是个json对象 list是个数组
     *         批量删除   item是个数组     list是个空或者undefined
     *  3, 批量删除先要去查询一下选中的个数 如果为0就直接返回，
     *  4，定义变量管理
     *      leftover  数组         记录未删除的项
     *      removal   数组         已经删除项
     *      transmit  数组|字符串   删除的id，给服务端使用
     *  5，删除操作
     *      将删除的项添加到removal数组当中，
     *      删除id添加到transmit当中
     *      剩下的项添加到leftover数组当中
     *  6，通过removeItem返回数据，供控制器后续操作
     */
    return {
      restrict: "A",
      replace: true,
      scope: {
        item: "=",
        resetItem: "&"
      },
      link: function(scope, iElement, iAttrs){
        /**
         * 获取倒计时间
         * @type {number}
         */
        var time = iAttrs.memberEmployeeReset ? iAttrs.memberEmployeeReset * 1 : 90;
        var timer = null;
        var isDisable = false;
        function handler(childScope){
          childScope.config = {
            title: "重置操作提示",
            message: "重置此账号密码，该账号密码为初始密码，您确定要重置吗？",
            messageClass: "text-danger",
            confirmText: "确定",
            closeText: "取消"
          };
          childScope.confirm = function () {
            memberEmployee.reset({id:scope.item}).then(function(data){
              scope.resetItem({
                status: 0,
                data: data
              });
              isDisable = true;
              timer = $interval(function () {
                iElement.text('等待'+time-- +'秒').removeClass('btn-warning').prop('disabled', isDisable);
                if(time < 1){
                  isDisable = false;
                  $interval.cancel(timer);
                  iElement.text('重置密码').addClass('btn-warning').prop('disabled', isDisable);
                }
              }, 1000);
            });
            childScope.close();
          }
        }

        /**
         * 点击按钮
         */
        iElement.on('click',function(t){
          if(!_.isObject(scope.item)){
            throw Error('传递参数不对');
          }
          if(isDisable){
            return false;
          }
          $interval.cancel(timer);
          scope.resetItem({
            data: {
              status: -1
            }
          });
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/components/simpleGrid/simpleGridInterceptor.html", handler, {
            windowClass: "viewFramework-simple-grid-interceptor"
          });
        });
      }
    }
  }

  /** @ngInject */
  function memberEmployeeDialog(cbDialog, memberEmployee) {
    return {
      restrict: "A",
      scope: {
        item: "=",
        employeeRole: "=",
        employeeItem: "&"
      },
      link: function(scope, iElement, iAttrs){
        var iEle = angular.element(iElement),
            type = iAttrs.memberEmployeeDialog;
          //roleList  = angular.copy(permissions.getPermissions());
        /**
         * 弹窗处理事件
         */
        function handler(childScope) {
          childScope.item = {};
          childScope.interceptor = false;
          childScope.title = iAttrs.title;
          childScope.roles = angular.copy(scope.employeeRole);
          /**
           * 编辑操作
           */
          if(type === 'edit'){
            /**
             * 拷贝一份数据备用
             * @type {any}
             */
            var copyDiff = angular.copy(scope.item);
            childScope.item = angular.copy(scope.item);
          }
          childScope.confirm = function () {
            /**
             * 拷贝数据，不然会修改页面数据
             */
            if(type === 'add'){
              confirm();
            }
            /**
             * 如果是编辑就给拦截提示，防止误操作
             */
            if(type === 'edit'){
              /**
               * 如果没有修改点击就直接关闭了，防止无修改给后台提交数据
               */
              if(angular.equals(childScope.item, copyDiff)){
                  childScope.close();
                  return false;
              }
              /**
               * 询问是否确定修改，防止误操作
               * @type {boolean}
               */
              childScope.interceptor = true;
            }
          };
          childScope.interceptorConfirm = function () {
            confirm();
          };
          function confirm(){
            childScope.close();
            /**
             * 提交数据
             */
            memberEmployee[type](childScope.item).then(function (data) {
              scope.employeeItem({data: {"type": type, "data": data.data}});
            });
          }
        }

        /**
         * 点击按钮
         */
        iEle.click(function (t) {
          scope.employeeItem({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/member_employee/member_employee_dialog.html", handler, {
            windowClass: "viewFramework-member-employee-dialog"
          });
        })
      }
    }
  }

})();
