/**
 * Created by Administrator on 2016/11/2.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleGridNoneData', simpleGridNoneData);

  /** @ngInject */
  function simpleGridNoneData(){
    return {
      restrict: "A",
      replace: true,
      scope: {
        infoMsg : "@"
      },
      template: '<div class="row-padding row-margin text-center">\
                    <span class="text-size-16 text-success icon-info-1" style="vertical-align: middle">？</span>\
                    <div class="text-size-16 tip-text inline-block" ng-bind-html="infoMsg"></div>\
                  </div>'
    }
  }
})();
