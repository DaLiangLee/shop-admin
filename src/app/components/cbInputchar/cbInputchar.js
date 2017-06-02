(function () {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbInputcharModel', cbInputcharModel)
        .directive('cbInputchar', cbInputchar);


    /** @ngInject */
    function cbInputchar() {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                maxChar: '=',
                setMaxChar: '&'
            },
            templateUrl: 'app/components/cbInputchar/cbInputchar.html',
            controller: function($scope, $attrs){
                // 传给子作用域
                this.maxCharNum = $attrs.maxCharNum;

                $scope.maxCharNum = this.maxCharNum;
            },
            link: function(scope, iElement, iAttrs) {
                scope.curCharNum = '';
                scope.maxCharNum = iAttrs.maxCharNum || '0';
                scope.isBlur = true;

                // blur 显示字数
                scope.showCharNum = function() {
                    // 如果什么都没有的话，则将其设置为初始状态
                    if (!scope.curCharNum) {
                        scope.isBlur = true;
                        return;
                    }
                    scope.isBlur = false;
                };
                // focus 显示清空'x'
                scope.showCharClear = function() {
                    scope.isBlur = true;
                };

                // 清空输入框 并获取焦点
                scope.clearContent = function() {
                    scope.curCharNum = ''; // 清空内容
                    iElement.find('input').focus(); // 获取焦点
                    scope.isBlur = true;
                };

                scope.setMaxChar({data: {}});
            }
        };
    }

    /** @ngInject */
    function cbInputcharModel() {
        return {
            restrict: 'A',
            require: ['?^cbInputchar', '?^ngModel'],
            link: function(scope, iElement, iAttrs, controllers) {
                var cbInputcharCtrl = controllers[0];
                var ngModelCtrl = controllers[1];

                var maxCharNum = cbInputcharCtrl.maxCharNum * 1;

                // 将viewValue更新为modelValue
                ngModelCtrl.$parsers.push(function (viewValue) {

                    if (angular.isUndefined(viewValue)) {
                        return '';
                    }
                    var value;
                    if (angular.isString(viewValue)) {

                        // 将多个空格变为1个
                        value =viewValue.replace(/\s+/g,' ');
                        // 如果大于最大输入字符，则截取前面的，限制输入
                        value = value.substring(0, maxCharNum);

                        if (value != viewValue) {
                            ngModelCtrl.$setViewValue(value);
                            ngModelCtrl.$render();
                        }

                    }

                    return value;
                });
            }
        };
    }

})();
