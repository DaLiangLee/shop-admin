(function () {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbPhoneFormat', cbPhoneFormat);

    /** @ngInject */
    function cbPhoneFormat() {
        return {
            restrict: 'A',
            replace: true,
            require: '?ngModel',
            scope: {},
            link: function(scope, iElement, iAttrs, ngModelCtrl) {

                if (angular.isUndefined(ngModelCtrl)) {
                    return;
                }

                // This is the toModel routine
                var parser = function (value) {
                        if (!value) {
                            return undefined;
                        }
                        // // get rid of currency indicators
                        // value = value.toString().replace(thisFormat.replace, '');
                        // // Check for parens, currency filter (5) is -5
                        // removeParens = value.replace(/[\(\)]/g, '');
                        // // having parens indicates the number is negative
                        // if (value.length !== removeParens.length) {
                        //     value = -removeParens;
                        // }
                        return value.replace(/\s+/g, '') || undefined;
                    },
                    // This is the toView routine
                    formatter = function (value) {
                        // the currency filter returns undefined if parse error
                        // return $filter(attrs.format)(parser(value)) || thisFormat.symbol || '';

                        if (value) {
                            value = value.replace(/(\w{0,3})(\w{3,})/g, function($1, $2, $3){ return  $2 +" "+ $3.replace(/([A-Za-z0-9]{4})(?=[A-Za-z0-9])/g, "$1 ") })
                                || '';
                        }
                        return value;
                    };

                // This sets the format/parse to happen on blur/focus
                iElement.on("blur", function () {
                    if (this.value.length !== 11 && _.trim(this.value).length > 0) {
                        ngModelCtrl.$setValidity("mobile", false);
                        return false;
                    }
                    ngModelCtrl.$setValidity("mobile", true);
                    ngModelCtrl.$setViewValue(formatter(this.value));
                    ngModelCtrl.$render();
                }).on("focus", function () {
                    ngModelCtrl.$setViewValue(parser(this.value));
                    ngModelCtrl.$render();
                });
                // Model Formatter
                ngModelCtrl.$formatters.push(formatter);
                // Model Parser
                ngModelCtrl.$parsers.push(parser);
                // var numberType = iAttrs.cbPhoneFormat;
                // var inputValue;
                // var modelValue;
                //
                // // 获取相应类型的对象
                // var typeObj = numberFormatter[numberType];
                // console.log('t', typeObj);
                // // console.log('phone', cbPhoneCtrl.isValidPhone);
                // var replaceReg = typeObj["replaceReg"],
                //     verificateReg = typeObj["verificateReg"],
                //     maxlength = typeObj["maxlength"],
                //     seperator = typeObj["seperator"],
                //     blocks = typeObj["blocks"],
                //     placeholder = typeObj["placeholder"];
                //
                // function getFormat(viewValue) {
                //
                //     if (angular.isUndefined(viewValue)) {
                //         return '';
                //     }
                //
                //     var value;
                //
                //     if (angular.isString(viewValue)) {
                //         // 不允许输入非数字
                //         value = viewValue.replace(replaceReg, '');
                //
                //         // 限制输入位数
                //         value = value.substring(0, maxlength);
                //
                //         modelValue = value;
                //
                //         if (numberType == "mobile") {
                //             if (value.length === 11) {
                //
                //                 if (!verificateReg.test(value)) {
                //                     console.log('格式错误');
                //                 } else {
                //                     var $0 = value.substring(0, getBlocks(1, blocks));
                //                     var $1 = value.substring(getBlocks(1, blocks), getBlocks(2, blocks));
                //                     var $2 = value.substring(getBlocks(2, blocks), getBlocks(3, blocks));
                //
                //                     value = $0 + seperator + $1 + seperator + $2;
                //                 }
                //
                //
                //             }
                //         }
                //         if (modelValue !== viewValue) {
                //             console.log('modelValue ', value);
                //             ngModelCtrl.$setViewValue(value);
                //             ngModelCtrl.$render();
                //
                //             //ngModelCtrl.$modelValue = modelValue;
                //
                //         }
                //     }
                //     inputValue = value;
                //     console.log('inpuit', inputValue)
                //     return value;
                // }
                //
                // // 对输入格式进行控制
                // ngModelCtrl.$parsers.push(getFormat);
                //
                // scope.format = function() {
                //     ngModelCtrl.$parsers.unshift(getFormat)
                //     ngModelCtrl.$formatters.push(function(modelView) {
                //         console.log('modelView', modelView.replace(/\s/g, ''))
                //         return modelView.replace(/\s/g, '');
                //     });
                //
                // }
                // console.log('ngModelCtrl ', ngModelCtrl)

            }
        }
    }
})();
