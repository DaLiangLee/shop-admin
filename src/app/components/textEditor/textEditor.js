/**
 * Created by Administrator on 2016/11/1.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('textEditor', textEditor);

  /** @ngInject */
  function textEditor() {
    var htmlfilter = function(value, parameter){
      var setthe = {},s,p,n;
      if(parameter != undefined){
        setthe.fhtml = parameter.fhtml || true;
        setthe.fjs = parameter.fjs || false;
        setthe.fcss = parameter.fcss || false;
        setthe.fself = parameter.fself || false;
      }else{
        setthe.fhtml = true;
        setthe.fjs = false;
        setthe.fcss = false;
        setthe.fself = false;
      }
      if(angular.isString(value)){
        s = value;
      }else if( angular.isObject(value)){
        s = value.value;
        p = value.preplace;
        n = value.nextplace;
      }
      if(!s){
        return s;
      }
      if (!setthe.fhtml && !setthe.fjs && !setthe.fcss && !setthe.fself){
        setthe.fhtml = true;
      }
      if (setthe.fjs){
        s = s.replace(/<\s*script[^>]*>(.|[\r\n])*?<\s*\/script[^>]*>/gi, '');
      }
      if (setthe.fcss){
        s = s.replace(/<\s*style[^>]*>(.|[\r\n])*?<\s*\/style[^>]*>/gi, '');
      }
      if (setthe.fhtml) {
        s = s.replace(/<\/?[^>]+>/g, '');
        s = s.replace(/\&[a-z]+;/gi, '');
        s = s.replace(/\s+/g, '\n');
      }

      if (setthe.fself && angular.isObject(value)){
        s = s.replace(new RegExp(p, 'g'), n);
      }
      return s;
    };

    return {
      restrict: "A",
      scope: {
        editor: "="
      },
      templateUrl: 'app/components/textEditor/textEditor.html',
      link: function(scope, iElement, iAttrs){
        var maxLength = iAttrs.maxLength * 1;
        scope.options = {
          editor: scope.editor,
          total: maxLength,
          count: getCount(scope.editor),
          placeholder: iAttrs.placeholder
        };
        function getCount(value){
          var blank = 0;
          /**
           * 清除空格
           * @type {string}
           */
          value = _.trim(value).replace(/\s/gi, "");
          /**
           * 获取回车符数量
           */
          value.replace(/[\n\r]/g,function(){
            blank++;
          });
          /**
           * 总才长度减去回车符数量
           * 实际的输入字符数
           */
          return value.length - blank;
        }
        function getText(value){
          var blank = 0;
          /**
           * 获取空格,回车符数量
           */
          value.replace(/[\s\n\r]/g,function(){
            blank++;
          });
          /**
           * 总才长度减去回车符数量
           * 实际的输入字符数
           */
          return value.substring(0, maxLength + blank);
        }
        var options = scope.$watch('options', function (value) {
          var editor = htmlfilter(value.editor);
          var length = getCount(editor);
          if(length > maxLength){
            scope.options.editor = getText(editor);
          }else{
            scope.options.editor = editor;
          }
          scope.options.count = length;
          scope.editor = scope.options.editor;
        }, true);

        scope.$on('$destroy', function() {
          options();
        });
      }
    }
  }
})();
