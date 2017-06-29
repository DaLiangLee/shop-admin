/**
 * Created by Administrator on 2017/1/18.
 */
(function() {
  'use strict';

  angular
    .module('shopApp')
    .directive('cbTimeSlider', cbTimeSlider);

  /** @ngInject */
  function cbTimeSlider($document) {
    return {

      restrict: "A",
      replace: true,
      scope: {
        value: "=",
        up: "&",
        move: "&",
        down: "&"
      },
      templateUrl: "app/components/cbTimeSlider/cbTimeSlider.html",
      link: function(scope, iElement, iAttrs){
        var min = iAttrs.min * 1,
            max = iAttrs.max * 1,
            pWdith = iElement.width(),
            $sliderbar = iElement.find('.sliderbar'),
            width = $sliderbar.width(),
            disX,maxWidth,minWidth;
        /**
         * 最大移动距离
         * 当前条宽度 - 当前滑块的宽度
         * @type {number}
         */
        maxWidth = pWdith - width;

        /**
         * 最小移动距离
         * 1，如果当前最小移动距离是0，那么最小移动距离为0
         * 2，如果不为0，就需要根据当前最小值计算当前距离
         *
         * 计算公式：
         * 最小值    最小移动距离
         * ------ = -----------
         * 最大值    最大移动距离
         *
         * 最小移动距离 = 最小值/最大值*最大移动距离
         * @type {number}
         */
        minWidth = min === 0 ? 0 : Math.ceil(min/max*maxWidth);

        /**
         * 当前位置
         * 2，如果scope.value 不为未定义，就需要根据当前值计算当前位置
         *
         * 计算公式：
         * 当前值      当前位置
         * ------ = -----------
         * 最大值    最大移动距离
         *
         * 当前位置 = 当前值/最大值*最大移动距离
         * @type {number}
         */
        angular.isDefined(scope.value) && $sliderbar.css({left: Math.ceil(scope.value/max*maxWidth)});
        iElement.on('mousedown', '.sliderbar', function(event){
          var _this = angular.element(this);
          disX = event.pageX;
          angular.isDefined(scope.value) && (disX -= scope.value/max*maxWidth);
          scope.$apply(function(){
            scope.up({data: {value: "", type: "up"}});
          });
          $document.on('mousemove.slider', function(event){
            // 当前位置
            var position = event.pageX - disX;

            // 不能小于最小移动距离 不能大于最大移动距离
            if(position < minWidth){
              position = minWidth;
            }else if(position > maxWidth) {
              position = maxWidth;
            }

            /**
             * 计算返回值
             * 当前值      当前位置
             * ------ = -----------
             * 最大值    最大移动距离
             *
             * 当前值 = 当前位置/最大移动距离*最大值
             */

            _this.css({left: position});
            scope.$apply(function(){
              scope.value = Math.ceil(position/maxWidth*max);
              scope.move({data: {value: Math.ceil(position/maxWidth*max),type: "move"}});
            });
          });
          $document.on('mouseup.slider', function(){
            $document.off('.slider');
            scope.$apply(function(){
              scope.down({data: 3,type: "up"});
            });
          });
          return false;
        });
        // 确保工具提示被销毁和删除。
        /*scope.$on('$destroy', function() {
          status();
        });*/
      }
    }
  }

})();
