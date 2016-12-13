/**
 * Created by Administrator on 2016/12/4.
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
    .directive('cbCarbrand', cbCarbrand);

  /** @ngInject */
  function cbCarbrand($timeout, $document, $window){
    return {
      restrict: "A",
      scope: {
        store: "="
      },
      templateUrl: "app/components/cbCarbrand/cbCarbrand.html",
      link: function(scope, iElement){
        var oLists = iElement.find('.lists');
        var aLi,length,oneWidth;
        var iCount = 0;
        var store = scope.$watch('store', function (value) {
          if(value){
            oLists.append(create(value));
            aLi = oLists.find('li');
            length = aLi.size();
            oneWidth = aLi.outerWidth();
            oLists.width(oneWidth*length);
            if(length > 4){
              iElement.find('.k-carbrand').addClass('move');
            }
          }
        });
        var prev = iElement.find('.prev');
        var next = iElement.find('.next');
        function create(data){
          if(!angular.isArray(data) || !data.length){
            return "";
          }
          var str = "";
          angular.forEach(data, function (item) {
            str += '<li><img src="'+item.brand.logo+'" alt=""></li>';
          });
          return str;
        }


        iElement.on('click', '.prev', function () {
          if(angular.element(this).hasClass('disabled')){
            return ;
          }
          if(iCount <= 1){
            iCount = 0;
            prev.addClass('disabled');
          }else{
            iCount--;
          }
          next.removeClass('disabled');
          console.log(iCount);
          oLists.stop().animate({left: -oneWidth*iCount});

        });
        iElement.on('click', '.next', function () {
          if(angular.element(this).hasClass('disabled')){
            return ;
          }
          if(iCount >= length - 4){
            iCount = length - 3;
            next.addClass('disabled');
          }else{
            iCount++;
          }
          prev.removeClass('disabled');
          console.log(iCount);
          oLists.stop().animate({left: -oneWidth*iCount})
        });
        /**
         * 销毁操作
         */
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          store();
        });
      }
    }
  }

})();
