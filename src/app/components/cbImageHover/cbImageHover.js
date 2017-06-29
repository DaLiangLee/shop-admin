/**
 * Created by Administrator on 2016/11/16.
 */
/*
(function() {
  /!**
   * 图片缩略图hover查看大图
   * maxWidth   最大宽度
   * maxheight  最大高度
   * url        图片地址
   *
   *!/
  'use strict';

  angular
    .module('shopApp')
    .directive('cbImageHover', cbImageHover);

  /!** @ngInject *!/
  function cbImageHover($timeout, $document, $window){
    var template = [
        '<span class="arrow"></span>',
        '<img />',
    ].join('');
    return {
      restrict: "A",
      scope: {},
      link: function(scope, iElement, iAttrs){
        var IMAGES_URL = iAttrs.cbImageHover || "";
        var maxWidth = iAttrs.maxWidth * 1 || 500;
        var maxHeight = iAttrs.maxWidth * 1 || 500;
        var dir = iAttrs.position || "right";
        var win = $window;
        var imageTips = null;
        var image = null;
        var timer = null;
        function position(dir, image){
          var css = {};
          var winH = angular.element($window).height();

          var offset = iElement.offset();
          var width = iElement.outerWidth();
          var height = iElement.outerHeight();
          switch (dir){
            case 'left':
              break;
            case 'right':

              var top = offset.top - image.height/2 + height/2;
              if(top <= 0){
                top = 20;
              }else if(top + image.height > winH){
                console.log( top + image.height - winH );
                top = top - (top + image.height - winH) - 20;
              }


              css = {
                left: offset.left + width + 20 + 'px',
                top: top + 'px'
              };
              break;
            case 'top':
              break;
            case 'bottom':
              break;
          }
          return css;
        }

        /!**
         * 获取图片可显示宽高
         * @param imgW   图片宽度
         * @param imgH   图片高度
         * @returns {}   返回可显示的宽高
         *!/
        function getImageSize(imgW, imgH){
          /!**
           * 当前图片宽高小于限定的大小时，直接返回宽高
           *!/
          if(imgW <= maxWidth && imgH <= maxHeight){
            console.log('size');
            return {
              width: imgW,
              height: imgH
            }
          }else{
            /!**
             * 当图片宽高大于限定宽高，有3种情况，
             * 1，宽大于限定，高小于限定
             * 2，高大于限定，宽小于限定
             * 3，宽高都大于限定
             *!/
            if(imgW > maxWidth && imgH <= maxHeight){
              return {
                width: maxWidth,
                height: parseInt(imgH*(maxWidth/imgW), 10)
              }
            }else if(imgH > maxHeight && imgW <= maxWidth){
              return {
                width: parseInt(imgW*(maxHeight/imgH), 10),
                height: maxHeight
              }
            }else if(imgW > maxWidth && imgH > maxHeight){
              /!**
               * 如果宽高都大于限定，需要去判断宽和高
               * 1，宽大于高，按1处理
               * 2，宽小于高，按2处理
               * 3，宽等于高，等比处理
               *!/
              if(imgW > imgH){
                return {
                  width: maxWidth,
                  height: parseInt(imgH*(maxWidth/imgW), 10)
                }
              }else if(imgW < imgH){
                return {
                  width: parseInt(imgW*(maxHeight/imgH), 10),
                  height: maxHeight
                }
              }else{
                var size = maxWidth > maxHeight ? maxWidth : maxHeight;
                return {
                  width: size,
                  height: size
                }
              }
            }
          }
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
            $document.find('.viewFramework-cb-image-hover').remove();
          }
          imageTips = angular.element('<div class="viewFramework-cb-image-hover">'+template+'</div>');
          console.log(imageTips);
          $document.find('body').append(imageTips);
        }
        function moveOut() {

        }
        function hide(){
          imageTips && imageTips.remove();
        }
        function show(width, height) {
          console.log(position());
          create();
          imageTips.find('img').attr('src', IMAGES_URL).css(getImageSize(width, height));
          imageTips.css(position('right', getImageSize(width, height)));
        }
        /!**
         * 鼠标移入
         *!/
        //iElement.on('mouseenter', _.debounce(moveIn, 300));
        /!*$document.on('mousemove', function (event) {

          console.log(event.target);

        });*!/
        /!**
         * 鼠标移出
         *!/
        //iElement.on('mouseleave', function () {
          //console.log('mouseleave');

          //hide();
        //});
        /!**
         * 销毁操作
         *!/
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          image = null;
        });
      }
    }
  }

})();
*/
