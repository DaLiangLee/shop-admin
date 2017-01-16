/**
 * Created by Administrator on 2016/11/3.
 */
(function() {
  /**
   * 留言板   支持编辑和留言2种功能
   * message    只能查看数据
   * content    编写数据
   * config     配置信息
   *
   */
  'use strict';

  angular
    .module('shopApp')
    .directive('cbMessageBoard', cbMessageBoard);

  /** @ngInject */
  function cbMessageBoard(cbDialog){
    var DEFAULT_DATA = {
      maxLength: 300,
      placeholder: "写点什么吧!",
      interceptor: {
        show: false,
        text: '不写点什么吗？',
        confirmText: '我再想想',
        closeText: '去意已决'
      }
    };
    return {
      restrict: "A",
      scope: {
        content: "=",
        config: "=",
        reviewItem: '&'
      },
      link: function(scope, iElement, iAttrs){
        /**
         * config 配置默认参数
         * @type {any}
         */
        scope.config = angular.extend({}, DEFAULT_DATA, scope.config || {});

        function handler(childScope) {
          childScope.type = iAttrs.cbMessageBoard || 'editor';
          childScope.title = iAttrs.title;
          childScope.interceptor = angular.copy(scope.config.interceptor);
          childScope.editor = {
            content: scope.content,
            maxLength: angular.copy(scope.config.maxLength),
            placeholder: angular.copy(scope.config.placeholder)
          };
          childScope.confirm = function () {
            childScope.interceptor.show = true;
          };

          /**
           * 拦截器
           */
          childScope.interceptorConfirm = function () {
            scope.reviewItem({data: {"status":"0", "type": childScope.type, 'content': childScope.editor.content}});
            childScope.close();
          }
        }


        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.reviewItem({data: {"status":"-1", "data":"打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/components/cbMessageboard/cbMessageboard.html", handler, {
            windowClass: "viewFramework-message-board-dialog"
          });
        });
        /**
         * 销毁操作
         */

      }
    }
  }

})();
