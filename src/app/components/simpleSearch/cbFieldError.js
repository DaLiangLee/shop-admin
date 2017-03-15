/**
 * Created by Administrator on 2017/3/13.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('cbFieldError', cbFieldError);

  /** @ngInject */
  function cbFieldError(){
    return {
      "restrict": "A",
      "scope": {
        fieldErrorStatus: "=",
        fieldErrorMessage: "="
      },
      "link": function(scope, iElement, iAttrs){
        var tooltip = null,
            input = iElement.find('> input');
          iElement.css({'position': 'relative'});
        // 监听属性触发器
        var error = scope.$watch("fieldErrorStatus", function (val) {
          console.log('cbFieldError',arguments);
          if(angular.isDefined(val)){
            console.log('cbFieldError', val);
            if(val){
              create();
            }else{
              hide();
            }
          }
        });

        // 监听属性触发器
        var message = scope.$watch("fieldErrorMessage", function (val) {
          if(val){
            show(val);
          }
        });
        function show(val){
          tooltip && setContent(val);
        }
        function create(){
          if(!tooltip){
            tooltip = angular.element('<div class="tooltip top"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            iElement.append(tooltip);
            return;
          }
          tooltip.show();
        }
        function setContent(content){
          tooltip.find('.tooltip-inner').html(content);
          tooltip.css(setPosition(tooltip));
          tooltip.css({'opacity': 1});
        }

        function setPosition(tip){
          var iEw = input.outerWidth(true);
          var iTh = tip.height();
          var iTw = tip.width();
          var left = 0;
          if(iEw > iTw){
            left = (iEw - iTw)/2;
          }else{
            left = (iTw - iEw)/2;
          }
          return {
            left: left,
            top: -(iTh+7)
          }
        }

        function hide() {
          tooltip && tooltip.hide();
        }

        scope.$on('$destroy', function() {
          error();
          message();
          tooltip = null;
        });

      }
    }
  }


})();
