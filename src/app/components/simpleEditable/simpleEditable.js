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
  function simpleEditable(cbAlert) {

    /**
     * 默认配置
     * @type {{searchParams: string, searchPrefer: boolean, searchDirective: Array}}
     */
    var DEFAULT_CONFIG = {
      searchID: "",               //表单id
      searchPrefer: false,       //过滤形式（客户端false还是服务端true）   如果数据少可以选择本地过滤。后期扩展使用暂不适用
      searchDirective: []        //自定义列表项配置    必填项
    };
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
        // 是否可以为空不填
        var isEmpty = (iAttrs.required || "true") === "false";
        // 输入类型检查
        var type = iAttrs.simpleEditable || 'other';
        // 根据类型正则检查
        var check = {
          'int': function(value){
            return /^(0|[1-9][0-9]*)$/.test(value);
          },
          'float': function(value){
            return /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/.test(value);
          },
          'money': function(value){
            return /(^[1-9]([0-9]){0,7}?(\.[0-9]{1,2})?$)|(^0$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value);
          },
          'other': function(value){
            return !!value.length;
          }
        };
        // 根据类型提示错误消息
        var message = {
          'int': "请输入整数",
          'float': "请输入小数",
          'money': "请输入保留2位小数金额",
          'other': "请输入内容"
        };
        var $input = iElement.find('.editable-input');
        iElement.on('click', '.editable', function(){
          var parent = iElement.parent();
          $input.val(scope.editor);
          iElement.addClass('open').css({
            'width': iElement.width(),
            'left': 0,
            'top': -6
          });
        });

        iElement.on('click', '.confirm', function(){
          if(isEmpty && !$input.val()){

          }else{
            if(!check[type]($input.val())){
              cbAlert.alert(message[type]);
              return ;
            }
          }
          scope.$apply(function(){
            scope.editorHandler({data: $input.val()});
          });
          hide();
        });
        iElement.on('click', '.cancel', function(){
          hide();
        });

        function hide(){
          iElement.css({
            'width': '',
            'left': '',
            'top': ''
          });
          iElement.removeClass('open');
          $input.val('');
        }

      }
    }
  }
})();
