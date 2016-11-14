/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('SystemModpwdController', SystemModpwdController);

    /** @ngInject */
    function SystemModpwdController($log) {
        var vm = this;
        /**
         * 表单对象  提交api用
         * @type {{}}
         */
        vm.form = {};

        /**
         * 提交按钮
         */
        vm.submitBtn = function () {
            $log(vm.form);
        }
    }

})();
