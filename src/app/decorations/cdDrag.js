/**
 * Created by Administrator on 2016/10/13.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .directive('cbDrag', cbDrag);

    /** @ngInject */
    function cbDrag($document) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                item: "=",
                store: "="
            },
            link: function(scope, iElement) {
                iElement.on('mousedown', function () {
                    $document.on('mousemove', function () {

                    });
                    $document.on('mouseup', function () {

                    });
                });
            }
        }
    }
})();
