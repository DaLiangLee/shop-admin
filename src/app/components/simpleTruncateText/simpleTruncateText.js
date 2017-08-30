(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive("simpleTruncateText",simpleTruncateText)
        .filter('doubleBracketFilter', doubleBracketFilter);

    /** @ngInject */
    function doubleBracketFilter() {
        return function (text) {
            if(angular.isDefined(text) && angular.isString(text)){
                return text.replace("{{", "\\{\\{")
            }else{
                return text;
            }
        }
    }

    /** @ngInject */
    function simpleTruncateText($compile, $window, $filter){
        function htmlToText(value) {
            return angular.element("<div/>").html(value).text();
        }
        function textToHtml(value) {
            return angular.element("<div/>").text(value).html();
        }
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, iElement, iAttrs){
                // 获取body
                var bodyElement = angular.element($window.document.body);
                // 创建一个子作用域
                var subScope = scope.$new(true);
                // 获取父级
                var parent = iElement.parent();
                // 获取当前字体大小
                var fontSize = parseInt(iElement.css('fontSize'), 10);
                // 获取偏移量
                var offset = iAttrs.offset*1 || 0;
                // 可以使用resize事件
                var resize = iAttrs.resize === "true" || false;
                // 父级有绑定事件
                var bindevent = iAttrs.bindevent === "true" || false;
                // 获取当前内容
                var value = iAttrs.simpleTruncateText || iElement.html();
                function getWidth(){
                    var copy = angular.element("<div/>");
                    copy.html(value).css({
                        'display': 'none',
                        'fontSize': fontSize + 'px',
                        'text-overflow': 'ellipsis',
                        'white-space': 'nowrap'
                    });
                    bodyElement.append(copy);
                    var width = copy.width();
                    copy.remove();
                    copy = null;
                    return width;
                }

                var trigger = iAttrs.trigger || "mouseenter",
                    tooltipPlacement = iAttrs.tooltipPlacement || "top";

                showValue();

                function showValue(){
                    if (value) {
                        value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var width = parent.width() - offset - 30;
                        if(width <= getWidth()){
                            var style = 'display: inline-block; vertical-align: middle; width:'+width+'px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap';
                            var text = textToHtml(htmlToText(value));
                            value = value.replace(/["]/g, "&quot;");
                            value = $filter('doubleBracketFilter')(value);
                            if(iElement.css('display') === 'inline'){
                                iElement.css({
                                    'display': 'inline-block',
                                    'vertical-align': 'middle',
                                    'width': width + 'px'
                                });
                            }
                            if(bindevent){
                                iElement.css({
                                    'overflow': 'hidden',
                                    'text-overflow': 'ellipsis',
                                    'white-space': 'nowrap'
                                }).html(text).attr({
                                    title: text
                                })
                            }else {
                                var tpl = '<span style="'+style+'" tooltip-trigger="' + trigger + '" tooltip-placement="' + tooltipPlacement + '"  cb-tooltip="' + value + '" content-html="false" tooltip-animation="false" tooltip-append-to-body="true" content-class="simple-truncate-text">' + text + '</span>';
                                iElement.html($compile(tpl)(subScope));
                            }
                        }else{
                            iElement.text(value);
                        }
                    }
                }
                resize && angular.element($window).on('resize', _.throttle(showValue, 300));
            }
        };
    }
})();