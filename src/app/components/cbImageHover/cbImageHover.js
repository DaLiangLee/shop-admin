/**
 * Created by Administrator on 2016/11/16.
 */
(function() {
  /**
   * 图片缩略图hover查看大图
   * maxWidth   最大宽度
   * maxheight  最大高度
   * url        图片地址
   *
   */
  'use strict';

  angular
    .module('shopApp')
    .directive('cbImageHover', cbImageHover);

  /** @ngInject */
  function cbImageHover($timeout, $document){
    var template = [
        '<span class="arrow"></span>',
        '<img />',
    ].join('');
    return {
      restrict: "A",
      scope: {},
      link: function(scope, iElement, iAttrs){
        var IMAGES_URL = iAttrs.cbImageHover || "";
        var maxWidth = iAttrs.maxWidth * 1 || 300;
        var maxHeight = iAttrs.maxWidth * 1 || 300;
        var dir = iAttrs.position || "right";
        var imageTips = null;
        var image = null;
        var timer = null;
        function position(dir){
          var css = {};
          var offset = iElement.offset();
          var width = iElement.outerWidth();
          var height = iElement.outerHeight();
          switch (dir){
            case 'left':
              break;
            case 'right':
              css = {
                left: offset.left + width + 'px',
                top: offset.top + height + 'px'
              };
              break;
            case 'top':
              break;
            case 'bottom':
              break;
          }
          return css;
        }
        function moveIn() {
          if(!IMAGES_URL){
            return ;
          }
          image = new Image();
          image.onload = function () {
            show(image.width, image.height);
          };
          image.onerro = function () {
            image.onload = image.onerro = null;
            console.log('Image loading failed：'+IMAGES_URL);
          };
          image.src = IMAGES_URL;
        }
        function create() {
          if($document.find('.viewFramework-cb-image-hover').length){
            hide();
          }
          imageTips = $('<div class="viewFramework-cb-image-hover">'+template+'</div>');
          console.log(imageTips);
          $document.find('body').append(imageTips);
        }
        function moveOut() {

        }
        function hide(){
          imageTips.remove();
        }
        function show(width, height) {
          console.log(position());
          create();
          imageTips.find('img').attr('src', IMAGES_URL);
          imageTips.css(position('right'))
        }
        /**
         * 鼠标移入
         */
        iElement.on('mouseenter', _.debounce(moveIn, 300));
        /**
         * 鼠标移出
         */
        iElement.on('mouseleave', function () {
          hide();
        });
        /**
         * 销毁操作
         */
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          image = null;
        });
      }
    }
  }

})();
