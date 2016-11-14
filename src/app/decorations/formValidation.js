/**
 * Created by Administrator on 2016/10/19.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .constant('cbFormErrorInfo', {
            "required": "不能为空",
            "email": "邮箱格式不正确",
            "phone": "手机号码不正确",
            "number": "请输入数字"
        })
        .filter('cbFormErrorFilter', cbFormErrorFilter)
        .directive('cbAssertSameAs', cbAssertSameAs)
        .directive('cbFieldError', cbFieldError);

    /** @ngInject */
    function cbFormErrorFilter(cbFormErrorInfo){
        return function(name, customMessage){
            var errors = angular.extend({}, cbFormErrorInfo, customMessage);
            return errors[name] || name;
        }
    }

    /** @ngInject */
    function cbFieldError($compile){
        return {
            "restrict": "A",
            "require": "ngModel",
            "scope": true,
            "link": function(scope, element, attrs, ngModel){
                var iEle = angular.element(element);
                scope.cbFieldChange = false;

                // 创建一个新作用域
                var subScope = scope.$new(true);
                // 是否需要显示错误消息
                subScope.hasError = function(){
                    // 判断是否有效并且用户已经输入过，解决angular不能控制在什么状态下验证的问题，默认是input事件验证，很多情况需要在focus
                    return ngModel.$invalid && ngModel.$dirty;
                };
                // 返回所以的错误信息
                subScope.errors = function(){
                    return ngModel.$error;
                };
                // 获取错误信息提示文字
                subScope.customMessage = scope.$eval(attrs.cbFieldError);
                var dom = [
                    '<ul class="k-form-error" ng-if="hasError()">',
                    '<li ng-repeat="(name, wrong) in errors()" ng-if="wrong">{{name | cbFormErrorFilter : customMessage}}</li>',
                    '</ul>'
                ].join("");
              var hint = $compile(dom)(subScope);
              iEle.parent().append(hint);
            }
        }
    }

    /** @ngInject */
    function cbAssertSameAs(){
        return {
            "restrict": "A",
            "require": "ngModel",
            "link": function(scope, element, attrs, ngModel){
                var isSame = function(value){
                    var anotherValue = scope.$eval(attrs.cbAssertSameAs);
                    return value === anotherValue;
                };
                // 1.2.x只能用$parsers实现验证,添加到验证列表
                ngModel.$parsers.push(function(value){
                    // $setValidity设置验证结果，第一个参数名字，第二个$error返回结果
                    ngModel.$setValidity('same', isSame(value));
                    return isSame(value) ? value : undefined;
                });
                scope.$watch(function(){
                    return scope.$eval(attrs.cbAssertSameAs);
                }, function() {
                    // 对值进行实时监控改变结果
                    ngModel.$setValidity('same', isSame(ngModel.$modelValue));
                });
            }
        }
    }

})();
