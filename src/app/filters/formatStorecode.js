/**
 * Created by Administrator on 2017/5/19.
 */
(function () {
    'use strict';

    /**
     * formatStorecodeFilter 店铺编码过滤
     * 店铺编码里面会有很多后台填充的0需要去掉
     * @param money 允许字符串数字，数字（正或负数）
     * @param num   保留2位小数位
     * return {string}
     */
    angular
        .module('shopApp')
        .filter('formatStorecodeFilter', formatStorecodeFilter)
        .filter('formatTotalmileFilter', formatTotalmileFilter);

    /** @ngInject */
    function formatStorecodeFilter() {
        return function (str) {
            // 如果没有穿直接返回
            if (!str) {
                return str;
            }
            return str.replace(/0+/, '');
        }
    }


    /**
     * 格式化车辆里程
     * @type {RegExp}
     */
    var FORMAT_TOTALMILE_REGULAR = /(?=(?!(\b))(\d{3})+$)/g;
    /** @ngInject */
    function formatTotalmileFilter() {
        return function (str, unit) {
            unit = unit || "km";
            // 如果没有穿直接返回
            if (!str) {
                return str;
            }
            str += "";
            return str.replace(FORMAT_TOTALMILE_REGULAR, ' ') + " " + unit;
        }
    }

})();
