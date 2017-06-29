/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('SystemModpwdController', SystemModpwdController);

    /** @ngInject */
    function SystemModpwdController(memberEmployee, cbAlert) {
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
          memberEmployee.changepwd(vm.form).then(function (results) {
            if (results.data.status == 0) {
              cbAlert.tips("操作成功");
              vm.form = {};
              vm.$change1 = false;
              vm.$change2 = false;
              vm.$change3 = false;
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
        };
    }

})();
