/**
 * simpleCheckbox是一个通用的多选框组件
 *
 * config    全局配置参数
 *    checkboxLabel           显示的文字
 *    checkboxChecked         指定当前是否选中   默认值 false
 *    checkboxDisabled        指定当前是否禁用   默认值 false
 *    checkboxIndeterminate   指定当前是否关联一组多选框是否有选中   默认值 false
 *    onChange                选项变化时的回调函数  返回当前的是否选中
 *
 * simpleCheckboxGroup是一个通用的一组多选框组件
 *
 * config    全局配置参数
 *    checkboxValue      根据 value 进行比较，判断是否选中    选中的value数组 默认[]
 *    onChange           选项变化时的回调函数
 *    options            以配置形式设置子元素
 *       label              显示的文字        必填
 *       value              提交给后台的字段   必填
 *       disabled           是否禁用          默认值 false
 *       checked            指定当前是否选中   默认值 false
 */

(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('simpleCheckbox', simpleCheckbox)
        .directive('simpleCheckboxGroup', simpleCheckboxGroup);

    /** @ngInject */
    function simpleCheckbox() {
        return {
            restrict: "A",
            replace: true,
            scope: {
                checkboxLabel: "=",
                checkboxChecked: "=",
                checkboxDisabled: "=",
                checkboxIndeterminate: "=",
                onChange: "&"
            },
            templateUrl: "app/components/simpleCheckbox/simpleCheckbox.html",
            link: function (scope) {
                scope.checkboxChange = function ($event, checked) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    if(scope.checkboxDisabled){
                        return false;
                    }
                    scope.checkboxChecked = !checked;
                    scope.onChange({data: scope.checkboxChecked});
                };
            }
        }
    }

    /** @ngInject */
    function simpleCheckboxGroup() {
        return {
            restrict: "A",
            replace: true,
            scope: {
                checkboxValue: "=",
                checkboxOptions: "=",
                onChange: "&"
            },
            templateUrl: "app/components/simpleCheckbox/simpleCheckboxGroup.html",
            link: function (scope) {
                if(!_.isArray(scope.checkboxOptions)){
                    throw Error('checkboxOptions 不是一个数组');
                }
                if(!_.isArray(scope.checkboxValue)){
                    scope.checkboxValue = [];
                }else{
                    scope.checkboxValue = _.map(scope.checkboxValue, function (item) {
                        if(_.isObject(item) && item.value) {
                            return item.value;
                        }else{
                            return item;
                        }
                    });
                }

                scope.checkboxGroup = _.map(scope.checkboxOptions, function (item) {
                    var label = "",value = "";
                    if(_.isString(item)){
                        label = item;
                        value = item;
                    }else{
                        label = item.label;
                        value = item.value;
                    }
                    return {
                        label: label,
                        value: value,
                        disabled: !item.disabled,
                        checked: getCurrentValue(item.value)
                    }
                });

                /**
                 * 获取当前值是否选中
                 * @param value
                 * @returns {boolean}
                 */
                function getCurrentValue(value){
                    if(!scope.checkboxValue.length){
                        return false;
                    }
                    return !!_.find(scope.checkboxValue, function (item) {
                        return item === value;
                    });
                }

                scope.checkboxGroupChange = function (checked, item) {
                    if(checked){
                        scope.checkboxValue.push(item.value)
                    }else{
                        scope.checkboxValue = _.filter(scope.checkboxValue, function (value) {
                            return value !== item.value;
                        });
                    }
                    scope.onChange({data: scope.checkboxValue});
                };
            }
        }
    }
})();