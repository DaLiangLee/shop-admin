/**
 * Created by Administrator on 2017/1/12.
 */
/**
 * 数字范围验证
 * valueMin        最小值
 * valueMax        最大值
 * rangeEnabled    验证范围是否开启
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('cbPullDownMenu', cbPullDownMenu);

  /** @ngInject */
  function cbPullDownMenu($parse) {
    return {
      require: "ngModel",
      link: function (scope, iElement, iAttrs, ngModel) {
        var PullDownMenu,
          position = {
            width: iElement.outerWidth(true),
            left: iElement.offset().left,
            top: iElement.offset().top + iElement.outerHeight(true) - 1
          },
          dataList,
          clickSatatus = false;

        iElement.on('focus', function () {
          dataList = scope.$eval(iAttrs.cbPullDownMenu);
          dataList.length && render(position, dataList);
        });
        console.log(ngModel);
        iElement.on('blur', function () {
          !clickSatatus && hide();
        });

        scope.$parent.$watch($parse(iAttrs.ngModel), function(value) {
          PullDownMenu && PullDownMenu.find('li').removeClass('active');
          setActive(value, dataList);
        });

        function hide(){
          PullDownMenu.hide();
          PullDownMenu.find('li').removeClass('active');
        }

        function render(position, data) {
          if (!PullDownMenu) {
            create(data);
            PullDownMenu.css(position);
            PullDownMenu.show();
          } else {
            PullDownMenu.show();
          }
          PullDownMenu.hover(function(){
            clickSatatus = true;
          },function(){
            clickSatatus = false;
          });
          PullDownMenu.on('click', 'li', function(){
            var value = angular.element(this).text();
            scope.$apply(function(){
              ngModel.$setViewValue(value);
              ngModel.$render();
            });
            clickSatatus = false;
            iElement.blur();
          });
          setActive(ngModel, data);
        }

        function setActive(ngModel, data){
          var index = _.findIndex(data, function(item){
            return item.posname == ngModel.$modelValue;
          });
          index > -1 && PullDownMenu.find('li').eq(index).addClass('active');
        }

        function create(data) {
          PullDownMenu = angular.element('<div id="j-pullDownMenu" class="k-pullDownMenu"></div>');
          var list = "<ul>";
          angular.forEach(data, function (item) {
            list += '<li>' + item.posname + '</li>';
          });
          list += "</ul>";
          PullDownMenu.html(list);
          angular.element('body').append(PullDownMenu);
        }

      }
    }
  }
})();
