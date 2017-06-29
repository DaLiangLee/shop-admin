/**
 * Created by Administrator on 2016/12/29.
 */
/**
 * simpleEditable是一个通用的简单编辑组件
 *
 * type     输入类型
 *  int     整型
 *  float   浮点数
 *  money   货币（保留2位小数）
 *  other   其他（不验证）   默认
 * editor   编辑内容
 *
 */



(function () {
  'use strict';
  angular
    .module('shopApp')
    .constant('simpleEditableConfig', {})
    .directive('simpleEditable', simpleEditable);


  /** @ngInject */
  function simpleEditable() {
    return {
      restrict: "A",
      replace: true,
      scope: {
        editor: "=",
        editorHandler: "&"
      },
      templateUrl: "app/components/simpleEditable/simpleEditable.html",
      link: function(scope, iElement, iAttrs){
        // 获取提示显示
        scope.placeholder = iAttrs.placeholder || "请输入内容";
        scope.min = iAttrs.min;
        scope.max = iAttrs.max;
        scope.step = iAttrs.step;
        scope.open = function () {
          scope.newEditor = scope.editor;
          iElement.addClass('open').css({
            'width': iElement.width(),
            'left': 0,
            'top': -6
          });
        };
        scope.confirm = function () {
          scope.editorHandler({data: scope.newEditor});
          hide();
        };
        scope.cancel = function () {
          hide();
        };
        function hide(){
          iElement.css({
            'width': '',
            'left': '',
            'top': ''
          });
          iElement.removeClass('open');
          scope.newEditor = "";
        }
      }
    }
  }
})();
