/**
 * Created by Administrator on 2016/10/19.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbAssertSameAs', cbAssertSameAs);


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
