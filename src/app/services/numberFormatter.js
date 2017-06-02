/**
 * Created by Administrator on 2017/5/17.
 */

(function () {
    'use strict';

    angular
        .module('shopApp')
        .value('numberFormatter', {
            creditCard: {
                replaceReg: /[^\d]/g,
                verificateReg:  /^(\d{16}|\d{19})$/,
                maxlength: 19,
                blocks: [4, 4, 4, 4, 3],
                seperator: ' '
            },
            mobile: {
                replaceReg: /[^\d]/g,
                verificateReg:  /^0{0,1}(1[34578][1-9])[0-9]{8}$/,
                maxlength: 14,
                blocks: [3, 4, 4],
                seperator: ' '
            },
            telphone: {
                replaceReg: /[^\d]/g,
                verificateReg:  /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
                maxlength: 14,
                blocks: [3, 4, 4],
                seperator: ' '
            },
            idCard: {
                replaceReg: /[^\dXx]/g,
                verificateReg:  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                maxlength: 18,
                blocks: [3, 4, 4, 4, 3],
                seperator: ' '
            },
            mileage: {
                replaceReg: /[^\d]/g,
                verificateReg:  /\d/,
                maxlength: 17,
                blocks: [],
                seperator: ' '
            }
        })


})();
