/**
 * Created by Administrator on 201/07/13.
 */
(function() {
  'use strict';

  angular
      .module('shopApp')
      .directive("autoTabTo", autoTabTo);

  /** @ngInject */
  function autoTabTo($document){
    return {
      restrict: 'A',
      link: function(scope, iElement, iAttrs){
        iElement.bind('keyup', function(e) {
          if (e.keyCode === 13) {
            var element = $document.getElementById(iAttrs.autoTabTo);
            if (element) {
              element.focus();
            }
          }
        })
      }
    };
  }
})();
