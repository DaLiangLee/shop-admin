/**
 * Created by Administrator on 2016/10/12.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .provider("cbTruncateTextConfig", cbTruncateTextConfig)
        .directive("cbTruncateText",cbTruncateText)
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
    function cbTruncateTextConfig(){
        var options = {
            copyText: false,
            textLength: 12
        };
        return {
            config: function (param) {
                param && (options.copyText = param.copyText, options.textLength = param.textLength);
            }, $get: function () {
                return options;
            }
        }
    }

    /** @ngInject */
    function cbTruncateText($compile, $sanitize, $filter, cbTruncateTextConfig){
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
                var length = iAttrs.textLength || cbTruncateTextConfig.textLength;
                var value = iElement.html();
                var copy = iAttrs.copyText || false;
                var trigger = iAttrs.trigger || "mouseenter",
                    tooltipPlacement = iAttrs.tooltipPlacement || "top";
                if (copy != 1 && copy != "true") {
                    copy = cbTruncateTextConfig.copyText;
                }
                if (value) {
                    value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    var escape = htmlToText(value);
                    if(escape.length > length){
                        var text = escape.substr(0, length);
                        text.length < escape.length && (text += "...");
                        text = textToHtml(text);
                        value = value.replace(/["]/g, "&quot;");
                        value = $filter('doubleBracketFilter')(value);
                        if(!copy){
                            iElement.html('<span tooltip-trigger="' + trigger + '" tooltip-placement="' + tooltipPlacement + '"  cb-tooltip="' + value + '" content-html="false">' + text + "</span>");
                        }else{
                            iElement.html('<span tooltip-trigger="' + trigger + '" tooltip-placement="' + tooltipPlacement + '"  tooltip="' + value + '">' + text + "</span>");
                        }
                        $compile(iElement.contents())(scope);
                    }else{
                        iElement.text(value)
                    }
                }
            }
        };
    }
})();
