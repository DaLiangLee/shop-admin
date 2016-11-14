/**
 * Created by Administrator on 2016/10/19.
 */
(function() {
    /**
     * config
     *      type     消息类型     必填
     *          success   0    成功
     *          failed    1  失败
     *          error     2  网络异常
     *      icon     消息icon     可选自定义配置
     *          success    成功
     *          failed     失败
     *          error      网络异常
     *      title    消息标题
     *          默认 提示消息
     *      message  消息内容(可以写html)      必填
     *          默认 空
     *      delay    延迟多少毫秒关闭
     *          默认 3000ms自动关闭
     *      close    关闭按钮
     *          默认 false
     */
    'use strict';

    angular
        .module('shopApp')
        .directive('cbMessageTips', cbMessageTips);

    /** @ngInject */
    function cbMessageTips($compile, $timeout){
        var DEFAULT_CONFIG_ICON = {
            "0": "icon-success",
            "1": "icon-failed",
            "2": "icon-error"
        };
        var DEFAULT_CONFIG = {
            type: 0,
            icon: "icon-success",
            title: "提示消息",
            message: "",
            delay: 2000,
            close: false
        };
        var template = '<div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <h4 class="modal-title" ng-bind="config.title"></h4>\
                    </div>\
                    <div class="modal-body">\
                        <div class="icon {{config.icon}}"></div>\
                        <div class="message message{{config.type}}" ng-bind-html="config.message"></div>\
                    </div>\
                    <div class="modal-footer" ng-if="config.close">\
                        <div class="inline-block margin-right">\
                            <button class="btn btn-default" ng-click="close()">关闭</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';
        return {
            restrict: "A",
            scope: {
                config: "="
            },
            link: function(scope){
                var transitionTimeout = null;
                var messageTips;
                var body = angular.element('body');
                /**
                 * config 配置默认参数
                 * @type {any}
                 */
                scope.config = angular.extend({}, DEFAULT_CONFIG, scope.config || {});
                scope.config.icon = DEFAULT_CONFIG_ICON[scope.config.type];
                create();
                /**
                 * 如果有的消息提醒先销毁在创建添加到body后面
                 */
                function create(){
                    if(angular.element('.cb-message-tips').length > 0){
                      $timeout.cancel( transitionTimeout );
                      angular.element('.cb-message-tips').remove();
                    }
                    messageTips = angular.element('<div class="cb-message-tips">'+ template +'</div>');
                    body.append($compile(messageTips)(scope));
                    show();
                }

                function show(){
                    messageTips.fadeIn().css("top", 300);
                    hind();
                }
                /**
                 * 关闭操作
                 */
                function close(){
                    $timeout.cancel( transitionTimeout );
                    messageTips.fadeOut(500,function () {
                      messageTips && messageTips.remove();
                    });
                }
                function hind(){
                    /**
                     * 如果有关闭按钮就不延迟了
                     */
                    if(!scope.config.close){
                        transitionTimeout = $timeout(function(){
                            close();
                        }, scope.config.delay);
                    }
                }
                /**
                 * 关闭按钮
                 */
                scope.close = function(){
                    close();
                };

                /**
                 * 销毁操作
                 */
                scope.$on('$destroy', function() {
                    close();
                    messageTips = null;
                    transitionTimeout = null;
                });
            }
        }
    }

})();
