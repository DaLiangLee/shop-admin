/**
 * Created by Administrator on 2017/3/10.
 */

(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('editmore', editmore);


  function  editmore() {
    return {
      restrict: 'E',
      templateUrl: "app/components/editmore/editmore.html",
      replace: true
    };
  }
})();
