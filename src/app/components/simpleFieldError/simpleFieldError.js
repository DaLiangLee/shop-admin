/**
 * simpleFieldError是一个通用表单验证错误组件
 *
 * config    全局配置参数
 *    fieldErrorStatus   表单验证$error对象
 *    simpleFieldError   表单错误提示信息 [] 数组格式
 *       [0]              显示的字段
 *       [1]              显示的错误信息
 *
 *    示例：
 *    simpleFieldError="[['required', '必填项']]";
 *
 *    数组位置决定错误提示的优先级，排名靠前的先显示
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .constant('simpleFieldErrorMessage', [['required', '必填项']])
        .directive('simpleFieldError', simpleFieldError);

    /** @ngInject */
    function simpleFieldError(simpleFieldErrorMessage){
        return {
            "restrict": "A",
            "scope": {
                fieldErrorStatus: "="
            },
            "link": function(scope, iElement, iAttrs){
                var tooltip = null,
                    input = iElement.find('> input');
                var isMessage = "";
                //var fieldErrorMessage = angular.extend(simpleFieldErrorMessage, scope.$eval(iAttrs.simpleFieldError));
                console.log(scope.$eval(iAttrs.simpleFieldError));
                var fieldErrorMessage = extendMessage([], scope.$eval(iAttrs.simpleFieldError));
                iElement.css({'position': 'relative'});
                // 监听属性触发器
                var error = scope.$watch("fieldErrorStatus", function (value) {
                    console.log(value)
                    value && getErrorMessage(value);
                }, true);
                create();
                function show(val){
                    tooltip && setContent(val);
                    tooltip.show();
                }
                function create(){
                    if(!tooltip){
                        tooltip = angular.element('<div class="tooltip top"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
                        iElement.append(tooltip);
                        return ;
                    }
                }
                function setContent(content){
                    tooltip.find('.tooltip-inner').html(content);
                    tooltip.css(setPosition(tooltip));
                    tooltip.css({'opacity': 1});
                }

                function setPosition(tip){
                    var iEw = input.outerWidth(true);
                    var iTh = tip.height();
                    var iTw = tip.width();
                    var left = 0;
                    if(iEw > iTw){
                        left = (iEw - iTw)/2;
                    }else{
                        left = (iTw - iEw)/2;
                    }
                    return {
                        left: left,
                        top: -(iTh+7)
                    }
                }

                function hide() {
                    tooltip && tooltip.hide();
                }

                function getErrorMessage(field) {
                    var isOpen = true;
                    _.forEach(fieldErrorMessage, function (item) {
                        if(field[item[0]]){
                            isMessage = item[1];
                            isOpen = false;
                            return false;
                        }
                    });
                    if(isOpen){
                        isMessage = "";
                        hide();
                    }
                }

                function extendMessage(simpleFieldErrorMessage, simpleFieldError) {
                    var message = [];
                    return simpleFieldError;
                }

                input.on('blur', function () {
                    if(isMessage){
                        iElement.addClass('has-error');
                        show(isMessage);
                    }
                }).on('focus', function () {
                    iElement.removeClass('has-error');
                    hide();
                });

                function destroy() {
                    tooltip && tooltip.remove();
                    tooltip = null;
                }

                scope.$on('$destroy', function() {
                    error();
                    destroy();
                });
            }
        }
    }

})();
