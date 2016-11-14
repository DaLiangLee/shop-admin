/**
 * Created by Administrator on 2016/10/17.
 */
(function () {
    'use strict';
    angular
        .module('shopApp')
        .directive('simpleGridPagination', simpleGridPagination);

    /** @ngInject */
    function simpleGridPagination() {

        return {
            restrict: "A",
            scope: {
                paginationInfo: "=",
                maxSize: "=",
                onSelectPage: "&"
            },
            templateUrl: 'app/components/simpleGrid/simpleGridPagination.html',
            link: function(scope, iElement, iAttrs){
                // 是否配置跳转分页
                var isPageGoto = angular.isDefined(iAttrs.showPageGoto) && iAttrs.showPageGoto === 'true';
                scope.$watch("paginationInfo", function (newValue) {
                    if (newValue && isPageGoto) {
                        var total = newValue.total,
                            pageSize = newValue.pageSize,
                            s = Math.ceil(total / pageSize);
                        newValue.totalPage = s;
                        newValue.showPageGoto = s >= 5;
                        scope.pageGoto = "";
                    }
                });
                scope.$watch("pageGoto", function (t) {
                    t && t != "0" && t > 0 ? scope.gotoPageBtnDisabled = t > scope.paginationInfo.totalPage : scope.gotoPageBtnDisabled = !0
                });
                scope.gotoPage = function () {
                    scope.paginationInfo.page = scope.pageGoto*1;
                };
                scope.$watch("paginationInfo.page", function (newValue, oldValue) {
                    if(newValue != oldValue){
                        scope.onSelectPage({page: newValue});
                    }
                });
            }
        }
    }
})();
