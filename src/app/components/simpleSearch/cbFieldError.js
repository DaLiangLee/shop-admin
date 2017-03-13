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
      "require": "ngModel",
      "scope": true,
      "link": function(scope, iElement, iAttrs, ngModel){
        var tooltip = null,
            parent = iElement.parent();
        parent.css({'position': 'relative'});
        // 监听属性触发器
        var error = iAttrs.$observe("cbFieldError", function (val) {
          console.log(arguments);

          if(angular.isDefined(val)){
            console.log(val);

            if(val){
              create();
            }else{
              hide();
            }
          }
        });

        // 监听属性触发器
        var message = iAttrs.$observe("fieldErrorMessage", function (val) {
          if(val){
            show(val);
          }
        });
        function show(val){
          setContent(val);
        }

        function create(){
          if(!tooltip){
            tooltip = angular.element('<div class="tooltip top"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');
            parent.append(tooltip);
          }
        }
        function setContent(content){
          tooltip.find('.tooltip-inner').html(content);
          setPosition(tooltip);
          tooltip.css({'opacity': 1});
        }


        function setPosition(tooltip){
          var iEh = iElement.outerHeight(true);
          var iEw = iElement.outerWidth(true);
          var iTh = tooltip.Height();
          var iTw = tooltip.width();

          var left = 0;
          if(iEw > iTw){
            left = (iEw - iTw)/2;
          }else{
            left = (iTw - iEw)/2;
          }
          tooltip.css({
            left: left,
            top: -iTh
          })
        }

        function hide() {
          tooltip.hide();
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
