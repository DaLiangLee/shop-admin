/**
 * Created by Administrator on 2016/11/1.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('textEditor', textEditor);

  /** @ngInject */
  function textEditor($compile) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function(scope, iElement, iAttrs, ngModelCtrl){
        // 如果没有ng-model则什么都不做
        if (!ngModelCtrl) {
          return;
        }
        /**
         * 判断传入最大值是否合法
         */
        if (_.isEmpty(iAttrs.valueMax) || isNaN(iAttrs.valueMax*1) || iAttrs.valueMax*1 === 0){
          throw Error('value-max需要传入一个大于0的数字');
        }
        /**
         * 把字符串处理成数字
         * @type {number}
         */
        var valueMax = iAttrs.valueMax * 1;

        // 创建一个子作用域
        var subScope = scope.$new(true);
        // 给父元素添加一个class, 用于添加css样式
        iElement.parent().addClass('m-text-editor');
        subScope.options = {
          total: valueMax,
          count: getCount(ngModelCtrl.$viewValue)
        };
        // 写DOM结构
        var tpl = [
          '<div class="text-right h5 f-tar">',
          '<span>' ,
          '<span class="text-danger" ng-bind="options.count"></span>/<span class="text-danger" ng-bind="options.total"></span></span>',
          '</div>'
          ].join('');
        // 将模版添加到parent
        iElement.parent().append($compile(tpl)(subScope));

        ngModelCtrl.$formatters.push(function (modelValue) {
          if(_.isUndefined(modelValue)){
            subScope.options.count = 0;
            return '';
          } else {
            subScope.options.count = getCount(ngModelCtrl.$modelValue);
            return modelValue;
          }
        });

        // $parsers接受一个数组，用于将viewValue转化成modelValue
        ngModelCtrl.$parsers.push(function (viewValue) {
          if (angular.isUndefined(viewValue)) {
            return "";
          }
          var value;
          if (angular.isString(viewValue)) {
            // 中间可以带空格
            value = getText(viewValue);
            // 去掉中间空格
            subScope.options.count = getCount(value);
            if (value !== viewValue) {
              ngModelCtrl.$setViewValue(value);
              ngModelCtrl.$render();
            }
          }
          return value;
        });
        function getCount(value){
          if(!value){
            return 0;
          }
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
          return value.substring(0, valueMax + blank);
        }
      }
    }
  }
})();
