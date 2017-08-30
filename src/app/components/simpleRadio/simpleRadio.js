/**
 * simpleRadio是一个通用的单选框组件
 *
 * config    全局配置参数
 *    value              根据 value 进行比较，判断是否选中    字符串 默认空
 *    onChange           选项变化时的回调函数
 *    options            以配置形式设置子元素
 *       label              显示的字段
 *       value              提交给后台的字段
 *       disabled           是否禁用
 *       checked            指定当前是否选中   默认值 false
 */

(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('simpleRadio', simpleRadio)
        .directive('simpleRadioGroup', simpleRadioGroup);

    /** @ngInject */
    function simpleRadioGroup() {
        return {
            restrict: "A",
            replace: true,
            scope: {
                radioOptions: "=",
                radioValue: "=",
                onChange: "&"
            },
            templateUrl: "app/components/simpleRadio/simpleRadioGroup.html",
            controller: ["$scope", function ($scope) {
                if(!_.isArray($scope.radioOptions)){
                    throw Error('options 不是一个数组');
                }
                $scope.radioGroup = _.map($scope.radioOptions, function (item) {
                    var label = "",value = "";
                    if(_.isString(item)){
                        label = item;
                        value = item;
                    }else{
                        label = item.label;
                        value = item.value;
                    }
                    return {
                        data: item.data,
                        label: label,
                        value: value,
                        disabled: item.disabled,
                        checked: item.value === $scope.radioValue
                    }
                });
                $scope.radioChange = function (data, radio) {
                    if(radio.disabled){
                        return false;
                    }
                    _.forEach($scope.radioGroup, function (item) {
                        item.checked = false;
                    });
                    radio.checked = true;
                    $scope.radioValue = data;
                    $scope.onChange({data: data});
                };
            }]
        }
    }

    /** @ngInject */
    function simpleRadio() {
        return {
            restrict: "A",
            replace: true,
            scope: {
                radioLabel: "=",
                radioValue: "=",
                radioChecked: "=",
                radioDisabled: "=",
                onChange: "&"
            },
            templateUrl: "app/components/simpleRadio/simpleRadio.html",
            controller: ["$scope", function ($scope) {
                $scope.radioChange = function ($event, checked) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    if($scope.radioDisabled || checked){
                        return false;
                    }
                    $scope.radioChecked = true;
                    $scope.onChange({data: $scope.radioValue});
                };
            }]
        }
    }
})();
