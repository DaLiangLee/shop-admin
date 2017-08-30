/**
 * Created by Administrator on 2017/4/26.
*/

/**
 * valueMax        最大值
 */
(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('cbStringRange', cbStringRange);

    /** @ngInject */
    function cbStringRange($compile, $timeout) {
        return {
            restrict: 'A',
            require: "?ngModel",
            scope: {},
            link: function (scope, iElement, iAttrs, ngModelCtrl) {
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

                /**
                 * subScope参数
                 * max: 允许输入的最大字符数
                 * min: 既表示默认值，又表示当前输入字符长度
                 * isBlur： boolean 输入框是否失去焦点，默认为false
                 * isEmpty： boolean 判断输入框是否为空，默认为true
                 */
                subScope.max = valueMax;
                subScope.min = 0;
                subScope.isBlur = false;
                subScope.isEmpty = true;

                $timeout(function(){
                  if(!_.isEmpty(ngModelCtrl.$viewValue)){
                    subScope.min = ngModelCtrl.$viewValue.length;
                    subScope.isEmpty = !subScope.min;
                    subScope.isBlur = !!subScope.min;
                  }
                }, 1);

                // $parsers接受一个数组，用于将viewValue转化成modelValue
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (angular.isUndefined(viewValue)) {
                        return "";
                    }
                    var value;
                    if (angular.isString(viewValue)) {
                        // 中间可以带空格
                        value = viewValue.substring(0, valueMax);
                        // 去掉中间空格
                        //value = viewValue.replace(/\s+/g, "").substring(0, valueMax);
                        subScope.min = value.length;
                        subScope.isEmpty = !subScope.min;
                        if (value !== viewValue) {
                            ngModelCtrl.$setViewValue(value);
                            ngModelCtrl.$render();
                        }
                    }
                    ngModelCtrl.$setValidity("cbStringRange", true);
                    return value;
                });

                // 清除文本框中的内容
                subScope.clearContent = function() {
                    subScope.min = 0;
                    subScope.isBlur = false;
                    subScope.isEmpty = true;
                    iElement.focus();
                    ngModelCtrl.$setViewValue('');
                    ngModelCtrl.$render();
                };

                iElement.on('blur', function() {
                    setIsBlur(true);
                });

                iElement.on('focus', function() {
                    setIsBlur(false);
                });

                function setIsBlur(flag) {
                    $timeout(function() {
                        subScope.isBlur = flag;
                    }, 0);
                }
                // 给父元素添加一个class, 用于添加css样式
                iElement.parent().addClass('input-group m-string-range');

                // 写DOM结构
                var tpl = [
                    '<span class="input-addon m-string-item" ng-if="!isBlur || isEmpty">',
                    '<span class="min" ng-bind="min"></span>/<span class="max" ng-bind="max"></span>',
                    '</span>',
                    '<span class="input-addon m-string-item m-string-icon" ng-if="isBlur&&!isEmpty">',
                    '<i class="icon-remove-circle m-string-clear" ng-click="clearContent()"></i>',
                    '</span>'].join('');
                // 将模版添加到parent
                iElement.parent().append($compile(tpl)(subScope))
            }
        }
    }
})();

