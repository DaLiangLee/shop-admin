/**
 * Created by Administrator on 2017/05/16.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('FeedBackController', FeedBackController);

    /** @ngInject */
    function FeedBackController(systemFeedback, cbAlert, utils) {
        var vm = this;
        /**
         * 表单对象  提交api用
         * @type {{}}
         */
        vm.dataBase = {};
        vm.dataBase.type = '1';

        var type_status = {
          "1": '感谢您的反馈，我们会尽快处理',
          "2": '感谢您的建议， 我们会尽快处理'
        };

        vm.submitFeedback = function() {
            systemFeedback.save(_.merge(vm.dataBase, {createtime: new Date()}))
                .then(utils.requestHandler)
                .then(function() {
                    cbAlert.tips(type_status[vm.dataBase.type]);
                    vm.dataBase.context = "";
                    vm.dataBase.title = "";
                });
        };
    }

})();
