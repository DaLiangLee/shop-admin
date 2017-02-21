/**
 * Created by Administrator on 2016/11/18.
 */
(function() {
  'use strict';
  /**
   * 这是一个事件委托的指令 支持Click Dblclick Mousedown Mouseup Mouseover Mouseout Mousemove Mouseenter Mouseleave这些事件
   * 示例：
   * <ul dg-click="select($event, item)" selector="li">
   *     <li ng-repeat="item in list"></li>
   * </ul>
   * dg-click接收一个函数
   * select函数接收2个以上参数（第一个是事件对象，第二个是ng-repeat的当前项）
   * selector接收一个选择，允许输入当前dom后代元素，尽量保证是子元素，减少查找节点。
   *
   *
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
