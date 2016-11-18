/**
 * Created by Administrator on 2016/11/18.
 */
(function() {
  'use strict';
  /**
   * 权限控制， 传递栏目id，如果id不存在就删除这个dom
   */
    var cbDelegateDirectives = {};
    angular.forEach(
      'Click Dblclick Mousedown Mouseup Mouseover Mouseout Mousemove Mouseenter Mouseleave'.split(' '),
      function(name) {
        var directiveName = 'dg' + name;
        cbDelegateDirectives[directiveName] = ['$parse', function($parse) {
          return {
            restrict: 'A',
            compile: function($element, attr) {
              var fn = $parse(attr[directiveName], null,  true);
              var eventName = name.toLowerCase();
              var selector = attr.selector || "";
              return function(scope, element) {
                element.on(eventName, selector, function(event) {
                  var iElement = element.find(event.target);
                  if(iElement.length){
                    scope.$apply(function(){
                      fn(angular.element(iElement).scope(), {$event: event, $params: [].slice.call(arguments, 1)});
                    });
                  }
                });
              };
            }
          };
        }];
    });
    angular.module('shopApp').directive(cbDelegateDirectives);
})();
