/**
 * Created by Administrator on 2016/11/2.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleGridChangeStatus', simpleGridChangeStatus);


  /*function simpleGridChangeStatus(){
    return {
      restrict: "A",
      replace: true,
      scope: {
        item: "=",
        list: "=",
        changeStatus: "&"
      },
      link: function(scope, iElement, iAttrs){
        iElement.on('click',function(){
          var results = [],     // 返回结果
            items,     // 返回当前修改的项目，和后台交互
            mark = iAttrs.simpleGridChangeStatus || "id",    // 用来比较查找的对象
            data = angular.copy(scope.item),   // 获取要修改的项目
            statusText = iAttrs.statusText,   // 改变状态字段
            statusCode = scope.$eval(iAttrs.statusCode);   // 改变状态的数值，返回一个数组，批量操作是一个数值，单个操作是两个值

          if(angular.isArray(data)){  // 批量操作
            if(!data.length){
              return false;
            }
            items = [];
            angular.forEach(data, function (value) {
              if(value.selected){
                value[statusText] = statusCode[0];
                items.push(value);
              }
            });
            if(!items.length){   //没有勾选项
              return false;
            }
            results = data;
          }else if(angular.isObject(data)){  // 单个操作
            var list = angular.copy(scope.list);
            if(!angular.isArray(list)) {  // 如果不是数组就返回 防止下面操作报错
              return ;
            }
            angular.forEach(list, function (value) {
              if(value[mark] === data[mark]){
                if(value[statusText] === statusCode[0]){
                  value[statusText] = statusCode[1];
                }else{
                  value[statusText] = statusCode[0];
                }
              }
            });
            results = list;
            data[statusText] === statusCode[0] ? statusCode[1] : statusCode[0];
            items = data;
          }else{
            throw Error('传递参数不对');
          }
          scope.$apply(function(){
            scope.changeStatus({
              data: {
                list: results,
                item: items
              }
            });
          });
        })
      }
    }
  }  */


  /** @ngInject */
  function simpleGridChangeStatus($log, cbDialog){
    /**
     * 删除逻辑
     *  1，填写删除的对应字段 simpleGridChangeStatus
     *  2，点击时候判断是单个修改状态还是批量修改状态 通过item字段和list来判断
     *         单个删除   item是个json对象 list是个数组
     *         批量删除   item是个数组     list是个空或者undefined
     *  3, 批量修改状态先要去查询一下选中的个数 如果为0就直接返回，
     *  4，定义变量管理
     *      leftover  数组         记录未删除的项
     *      removal   数组         已经删除项
     *      transmit  数组|字符串   删除的id，给服务端使用
     *  5，删除操作
     *      将删除的项添加到removal数组当中，
     *      删除id添加到transmit当中
     *      剩下的项添加到leftover数组当中
     *  6，通过statusItem返回数据，供控制器后续操作
     */
    return {
      restrict: "A",
      replace: true,
      scope: {
        item: "=",
        list: "=",
        statusItem: "&"
      },
      link: function(scope, iElement, iAttrs){
        /**
         * 用来比较查找的对象
         * @type {string}
         */
        var mark = iAttrs.statusId || "id",
          /**
           * 当前状态
           * @type {boolean}
           */
          type = iAttrs.simpleGridChangeStatus || "",
          /**
           * 判断是单个还是批量
           * @type {boolean}
           */
          isBatch = angular.isUndefined(iAttrs.list),
          /**
           * 记录未删除的项
           * @type {array}
           */
          leftover = [],
          /**
           * 已经删除项
           * @type {array}
           */
          removal = [],
          /**
           * 删除的id，给服务端使用
           * @type {array|string}
           */
          transmit;
        /**
         * 判断是单个删除操作还是批量删除操作
         * @type {null is Array<any>|boolean}
         */
        function handler(childScope){
          childScope.config = {
            title: "状态修改提示",
            message: iAttrs.message || "修改此项状态后，会影响该账号使用，您确定要修改吗？",
            messageClass: "text-danger",
            confirmText: "确定修改",
            closeText: "暂不修改"
          };
          childScope.confirm = function () {
            remove();
            childScope.close();
          }
        }

        /**
         * 删除操作
         * @returns {boolean}
         */
        function remove(){
          if(isBatch){
            transmit = [];
            /**
             * 批量操作
             * 直接获取已删除的项，把id添加到transmit当中
             */
            $log(removal, leftover);
            _.forEach(removal, function(value){
              transmit.push(value[mark]);
            });
          }else{
            /**
             * 单个操作
             * 如果没有传递list就抛错
             * 如果有就拷贝待用
             */
            if(!_.isArray(scope.list)) {
              throw Error('list传递参数不对，需要传递一个数组');
            }
            var list = angular.copy(scope.list);
            /**
             * 把删除的添加到removal当中
             * 获取删除的id 给后台api快捷调用
             */
            removal.push(scope.item);
            transmit = removal[0][mark];
            /**
             * 把未删除的过滤掉 返回给页面
             */
            leftover = _.filter(list, function(value){
              return value[mark] !== transmit;
            });
          }
          /**
           * 手动把数据更新给视图 返回一个函数
           */
          scope.statusItem({
            data: {
              status: 0,
              type: type,
              transmit: transmit,
              leftover: leftover,
              removal: removal
            }
          });
        }

        /**
         * 点击按钮
         */
        iElement.on('click',function(t){
          if(!_.isObject(scope.item) && !_.isFunction(scope.item)){
            throw Error('传递参数不对');
          }
          /**
           * 批量删除一定要有选中的才能继续操作
           */
          if(isBatch){
            leftover = angular.copy(scope.item);
            /**
             * 把选中的删除掉返回给removal
             * @type {array}
             */
            removal = _.remove(leftover, function(value){
              return value.selected;
            });
            /**
             * 如果未选中任何操作 就直接返回
             */
            if(!removal.length){
              return false;
            }
          }
          scope.statusItem({
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
})();
