(function () {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbAmountModel', cbAmountModel)
        .directive('cbAmount', cbAmount);

    /** @ngInject */
    function cbAmountModel() {
        return {
            restrict: 'A',
            replace: true,
            require: ['?^cbAmount', '?^ngModel'],
            link: function (scope, iElement, iAttrs, controllers) {
                /**
                 * controllers[0] 表示 cbAmount指令 中的控制器
                 * controllers[1] 表示 ngModel指令 中的控制器
                 */
                var cbAmountCtrl = controllers[0];
                var ngModelCtrl = controllers[1];

                var inputValue; // 用户输入的值，可以为空

                if (!ngModelCtrl) {
                    return;
                }

                var maxNum = cbAmountCtrl.maxNum;
                var minNum = cbAmountCtrl.minNum;
                var precision  = cbAmountCtrl.precision;

                // 修正用户输入
                scope.modifyAmount = function () {
                    if (inputValue >= maxNum) {
                        inputValue = maxNum + '';
                        cbAmountCtrl.getStyleState(false, true, inputValue * 1);
                        ngModelCtrl.$setViewValue(inputValue);
                        ngModelCtrl.$render();
                    } else if (inputValue <= minNum || inputValue == '') {
                        inputValue = minNum + '';
                        cbAmountCtrl.getStyleState(true, false, inputValue * 1);
                        ngModelCtrl.$setViewValue(inputValue);
                        ngModelCtrl.$render();
                    } else {
                        cbAmountCtrl.getStyleState(false, false, inputValue * 1);
                        ngModelCtrl.$setViewValue(inputValue);
                        ngModelCtrl.$render();
                    }
                };


                // 将viewValue更新为modelValue
                ngModelCtrl.$parsers.push(function (viewValue) {

                    if (angular.isUndefined(viewValue)) {
                        return '';
                    }
                    var value;
                    if (angular.isString(viewValue)) {

                        // 如果精度为0，则说明没有小数点
                        if (precision === 0) {
                            value = viewValue.replace(/[^\d]/g, '');
                        } else {
                            // 去除非数字或小数点字符
                            value = viewValue.replace(/[^\d.]/g, '');
                            if (/^0[0-9]/.test(value)) {
                                value = '0';
                            }
                            value = value.replace(/^\./g, '');
                            value = value.replace(/\.{2,}/g, '.');
                            value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

                            if (value.indexOf('.') > -1) {
                                value = value.substring(0, value.indexOf('.') + precision + 1);
                            }
                        }

                        if (value !== viewValue) {
                            ngModelCtrl.$setViewValue(value);
                            ngModelCtrl.$render();
                        }

                    }

                    // 将modelValue赋给全局变量inputValue
                    inputValue = value;

                    return value;
                });
            }
        };
    }


    /** @ngInject */
    function cbAmount() {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                maxNum: "=",
                minNum: "=",
                base: "=",
                getBase: "&"
            },
            templateUrl: 'app/components/cbAmount/cbAmount.html',
            controller: function ($scope, $attrs) { // 通过控制器向子指令传递属性和方法
                var vm = this;
                /**
                 * 给子组件传递数据
                 * maxNum 最大值
                 * minNum 最小值
                 * precision 精度， 表示保留小数的位数
                 */
                this.maxNum = $scope.maxNum * 1 || Number.MAX_VALUE;
                this.minNum = $scope.minNum * 1 || 0;
                this.precision = $attrs.precision || 0;

                function setDefaultNum(num, precision) {
                    var intNum = parseFloat(num);
                    intNum = intNum.toFixed(precision);
                    if (isNaN(intNum)) {
                        return vm.minNum;
                    } else {
                        if (intNum > vm.maxNum) {
                            return vm.maxNum;
                        } else if (intNum < vm.minNum) {
                            return vm.minNum;
                        }
                    }
                    return intNum;
                }

                /**
                 * 配置信息
                 * @type {{maxNum: *, minNum: *, defaultNum: string, isMinNum: boolean, isMaxNum: boolean}}
                 */
                $scope.config = {
                    maxNum: vm.maxNum,
                    minNum: vm.minNum,
                    defaultNum: setDefaultNum($scope.base, this.precision)
                };

                // 初始化操作: 数量， 是否最小， 是否最大
                $scope.getBase({data: $scope.config.defaultNum * 1});
                $scope.config.isMinNum = isEquality(vm.minNum);
                $scope.config.isMaxNum = isEquality(vm.maxNum);

                function isEquality(value) {
                    return $scope.config.defaultNum * 1 === value * 1;
                }

                /**
                 * 这个方法用来设置是否为禁用状态
                 * @param isMin boolean
                 * @param isMax boolean
                 */
                vm.getStyleState = function (isMin, isMax, inputValue) {
                    $scope.config.isMaxNum = isMax;
                    $scope.config.isMinNum = isMin;
                    $scope.getBase({data: inputValue * 1});
                };

                $scope.num = $scope.config.defaultNum;
            },
            link: function (scope, iElement, iAttrs) {

                if (_.isUndefined(iAttrs.factor)) {
                    iAttrs.factor = 1;
                }

                if (_.isUndefined(iAttrs.precision)) {
                    iAttrs.precision = 0;
                }

                // 改变数量
                scope.changeAmount = function (step) {
                    scope.num = parseFloat(scope.num) + step * iAttrs.factor; // 点击 '+' '-' 的幅度
                    scope.num = scope.num.toFixed(iAttrs.precision); // 保留小数点位数
                    if (scope.num <= scope.config.minNum) {
                        scope.num = scope.config.minNum;
                        scope.config.isMinNum = true;
                    } else if (scope.num >= scope.config.maxNum) {
                        scope.num = scope.config.maxNum;
                        scope.config.isMaxNum = true;
                    } else {
                        // scope.num = scope.num;
                        scope.config.isMinNum = false;
                        scope.config.isMaxNum = false;
                    }
                    scope.getBase({data: scope.num * 1});
                };

            }

        };
    }


})();
