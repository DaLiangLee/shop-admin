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
      template: '<div class="f-tac">\
                    <span class="icon-not_data"></span>\
                    <div class="tip-text" ng-bind-html="infoMsg"></div>\
                  </div>'
    }
  }
})();
