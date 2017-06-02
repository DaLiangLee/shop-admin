(function () {
    'use strict';

    angular
        .module('shopApp')
        // .directive('cbPhoneModel', cbPhoneModel)
        .directive('cbPhoneFormat', cbPhoneFormat);

    function getBlocks(num, blocks) {
        var block = 0;
        for (var i = 0; i < num; i++) {
            block += blocks[i]
        }
        return block;
    }

    // /** @ngInject */
    // function cbPhoneModel($timeout,  numberFormatter) {
    //     console.log(numberFormatter);
    //     return {
    //         restrict: 'A',
    //         require: ['?^cbPhoneFormat', '?ngModel'],
    //         link: function(scope, iElement, iAttrs, ctrls) {
    //             var cbPhoneCtrl = ctrls[0];
    //             var ngModelCtrl = ctrls[1];
    //
    //             scope.cardNumber = ngModelCtrl.cardNumber;
    //             var inputValue;
    //             var flag;
    //
    //             // 输入框的类型
    //             var numberType = cbPhoneCtrl.numberType;
    //             // 获取相应类型的对象
    //             var typeObj = numberFormatter[numberType];
    //             console.log('t', typeObj);
    //             console.log('phone', cbPhoneCtrl.isValidPhone);
    //             var replaceReg = typeObj["replaceReg"],
    //                 verificateReg = typeObj["verificateReg"],
    //                 maxlength = typeObj["maxlength"],
    //                 sperator = typeObj["sperator"],
    //                 blocks = typeObj["blocks"],
    //                 placeholder = typeObj["placeholder"];
    //
    //
    //             if (!ngModelCtrl) {
    //                 return;
    //             }
    //
    //             scope.formatPhone = function() {
    //                 console.log('input', inputValue);
    //                 // var reg = /^0{0,1}(1[34578][1-9])[0-9]{8}$/;
    //                 // console.log('in ', inputValue);
    //                 // if (!reg.test((inputValue|| ''))) {
    //                 //     console.log('error format');
    //                 // }
    //                 // var $0 = inputValue.substring(0, 3);
    //                 // var $1 = inputValue.substring(3, 7);
    //                 // var $2 = inputValue.substring(7, 11);
    //                 // inputValue = $0 + ' ' + $1 + ' ' + $2;
    //                 //
    //                 // console.log(',,,', inputValue);
    //                 //
    //                 // ngModelCtrl.$setViewValue(inputValue);
    //                 // ngModelCtrl.$render();
    //                 $timeout(function() {
    //                     console.log('11')
    //                     cbPhoneCtrl.showErrorInfo(flag);
    //                     // ngModelCtrl.$setValidity(cbPhoneCtrl.isValidPhone);
    //                     ngModelCtrl.$setViewValue(inputValue);
    //                     ngModelCtrl.$render();
    //                 }, 0)
    //
    //             }
    //
    //             // 对输入格式进行控制
    //             ngModelCtrl.$parsers.push(function(viewValue) {
    //
    //                 if (angular.isUndefined(viewValue)) {
    //                     return '';
    //                 }
    //
    //                 var value;
    //
    //
    //                 if (angular.isString(viewValue)) {
    //                     // 不允许输入非数字
    //                     value = viewValue.replace(replaceReg, '');
    //
    //                     // 限制输入位数
    //                     value = value.substring(0, maxlength);
    //
    //
    //                     if (numberType == "mobile") {
    //                         if (value.length === 11) {
    //
    //                             if (!verificateReg.test(value)) {
    //                                 console.log('格式错误');
    //                                 flag = false;
    //                                 // ngModelCtrl.$setViewValue(value);
    //                                 // ngModelCtrl.$render();
    //                                 console.log('cb', cbPhoneCtrl.isValidPhone)
    //                             } else {
    //                                 var $0 = value.substring(0, getBlocks(1, blocks));
    //                                 var $1 = value.substring(getBlocks(1, blocks), getBlocks(2, blocks));
    //                                 var $2 = value.substring(getBlocks(2, blocks), getBlocks(3, blocks));
    //
    //                                 value = $0 + sperator + $1 + sperator + $2;
    //                                 flag = true;
    //                                 console.log('cb2', cbPhoneCtrl.isValidPhone)
    //                             }
    //
    //
    //                         }
    //                     }
    //
    //                     // // 对手机号进行格式化
    //                     // if (value.length === 11) {
    //                     //
    //                     //     if (!verificateReg.test(value)) {
    //                     //         console.log('格式错误');
    //                     //         flag = false;
    //                     //         // ngModelCtrl.$setViewValue(value);
    //                     //         // ngModelCtrl.$render();
    //                     //         console.log('cb', cbPhoneCtrl.isValidPhone)
    //                     //     } else {
    //                     //         var $0 = value.substring(0, 3);
    //                     //         var $1 = value.substring(3, 7);
    //                     //         var $2 = value.substring(7, 11);
    //                     //
    //                     //         value = $0 + ' ' + $1 + ' ' + $2;
    //                     //         flag = true;
    //                     //         console.log('cb2', cbPhoneCtrl.isValidPhone)
    //                     //     }
    //                     //
    //                     //
    //                     // }
    //
    //                     if (value !== viewValue) {
    //                         ngModelCtrl.$setViewValue(value);
    //                         ngModelCtrl.$render();
    //                         scope.cardNumber = value;
    //                         console.log('65555', scope.cardNumber)
    //                         scope.getNumber(scope.cardNumber);
    //                     }
    //                 }
    //                 inputValue = value;
    //                 return value;
    //             })
    //
    //             scope.getNumber(scope.cardNumber);
    //             console.log('scope.cardNumber', scope.cardNumber)
    //         }
    //     }
    // }

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
                    if (this.value.length !== 11) {
                        console.log('1111');
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