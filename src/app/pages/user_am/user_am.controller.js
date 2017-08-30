/**
 * Created by Administrator on 2016/10/15.
 */
(function () {
    'use strict';

    angular
        .module('shopApp')
        .controller('UserAmListController', UserAmListController);

    /** @ngInject */
    function UserAmListController(simpleDialogService, userAm, utils, shophomeService, shopHome) {
        var vm = this;
        vm.dataLists = [];
        var loadingStatus = false;
        /**
         * gridModel 表格
         * @type {{}}
         */
        vm.gridModel = {
            loadingState: true,
            itemList: [],
            // 改变短信推送开关状态
            changeMobileStatus: function (item) {
                if (loadingStatus) {
                    return false;
                }
                var status = item.mobile === "1" ? "1" : "0";
                var message = item.mobile === "1" ? "关闭以后用户不能收到短信，<br />是否确定" : "开启以后用户将收到短信，<br />是否确定";
                simpleDialogService.confirm(message).then(function (isConfirm) {
                    isConfirm && changeStatus({
                        id: item.id,
                        mobile: status
                    });
                });
            },
            // 改变推送至车机开关状态
            changeChejiStatus: function (item) {
                var status = item.cheji === "1" ? "1" : "0";
                changeStatus({
                    id: item.id,
                    cheji: status
                });
            }
        };

        /**
         * 获取商铺所有数据
         */
        shophomeService.getInfo().then(function (results) {
            vm.dataBase = results.data;
        });

        /**
         * 修改客服电话
         * @param data
         */
        vm.telephoneHandler = function (data) {
            if (data.status === '0') {
                shopHome.saveTelephone({telephone: data.data}).then(utils.requestHandler).then(function () {
                    simpleDialogService.tips("修改客服电话成功");
                    shophomeService.setInfo(vm.dataBase);
                });
            }
        };

        vm.dragdrop = {
            stop: function (data) {
                console.log('拖拽结束', data);
            },
            drag: function (data) {
                console.log('拖拽中', data);
            }
        }

        /**
         * 改变状态
         * @param data
         */
        function changeStatus(data) {
            loadingStatus = true;
            userAm.update(data).then(utils.requestHandler).then(function () {
                simpleDialogService.success('设置成功');
                getList();
                loadingStatus = false;
            });
        }

        /**
         * 获取列表
         */
        function getList() {
            userAm.list().then(utils.requestHandler).then(handleListResult);
        }

        /**
         * 初始化调用
         */
        getList();

        /**
         * 处理列表结果
         * @param results
         * @returns {boolean}
         */
        function handleListResult(results) {
            var total = results.data.length;
            // 如果没有数据就阻止执行，提高性能，防止下面报错
            if (total === 0) {
                vm.gridModel.itemList = [];
                vm.gridModel.loadingState = false;
                return false;
            }

            /**
             * 组装数据
             * @type {*}
             */
            vm.gridModel.itemList = _.chain(results.data).filter(function (item) {
                return item.msgtype !== "-1";
            }).map(formatItemList).value();

            vm.gridModel.loadingState = false;
        }
    }
    /**
     * 格式化列表数据
     * @param item
     * @returns {*}
     */
    function formatItemList(item) {
        // 短信推送开关 0开启,1关闭
        // cb-switch 显示控件1 开启 0 是关闭
        item.mobile = item.mobile === "0" ? "1" : "0";


        if (item.msgtype === '4' || (item.msgtype === '3' &&  item.detail !== '0')  || (item.msgtype === '2' && (item.detail === '1' || item.detail === '2' || item.detail === '3' || item.detail === '4'))){
            item.mobile = "0";
            item.mobileDefaultDisabled = true;
        }
        if (item.msgtype === '5') {
            item.mobileDefaultDisabled = true;
        }
        // 车机开关 0 开启,1关闭
        // cb-switch 显示控件1 开启 0 是关闭
        item.cheji = item.cheji === "0" ? "0" : "1";
        item.chejiExist = item.msgtype === '4';
        item.mobileNotExist = item.msgtype === '4' && item.detail === '0';
        item.chejiDefaultDisabled = true;
        item.defaultOpen = false;
        item.defaultClose = false;
        return item;
    }
})();


