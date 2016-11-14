/**
 * Created by Administrator on 2016/11/10.
 */
/**
 * simpleSelect是一个通用的下拉组件
 *
 * config  全局配置参数     必填
 * selectPreHandler  事件回调 返回选择信息 必填
 *
 * config    全局配置参数
 *    multiple            是否开启多项选择
 *    searchPrefer        是否开启列表搜索
 *    searchParams        绑定的搜索字段
 *    searchPreHandler    搜索绑定事件供服务端搜索使用
 *    placeholder         提示信息
 *    selectDirective                                   必填
 *       cssProperty       当前列表项的class
 *       name              显示的字段
 *       value             提交给后台的字段
 *
 */



(function () {
  'use strict';
  angular
    .module('shopApp')
    .constant('simpleSelectConfig', simpleSelectConfig())
    .directive('simpleSelect', simpleSelect);

  /** @ngInject */
  function simpleSelectConfig(){
    return {
      multiple: false,
      once: false,
      searchPrefer: false,   //是否开启列表搜索
      searchParams: "id",        //绑定的搜索字段
      searchPreHandler: undefined,    //搜索绑定事件供服务端搜索使用
      selectDirective: {
        cssProperty: "",
        name: "name",
        value: "id",
        images: ""
      }  // 显示信息
    }
  }

  /** @ngInject */
  function simpleSelect($document, $filter, simpleSelectConfig) {
    return {
      restrict: "A",
      scope: {
        store: "=",
        config: "=",
        select: "=",
        selectPreHandler: "&"
      },
      templateUrl: "app/components/simpleSelect/simpleSelect.html",
      link: function(scope, iElement){
        var results = [];
        var select = null;
        var once = false;
        // config 配置默认参数
        scope.config = angular.extend({}, simpleSelectConfig, scope.config);
        var store = scope.$watch('store', function (value) {
          scope.items = value || [];
          angular.element(iElement).find('.text').html("-- 请点击选择 --");
        });
        scope.select = angular.copy(scope.select);
        var search = {};
        search[scope.config.searchParams] = undefined;
        scope.search = {
          params: undefined,
          handler: function (data) {
            if(!!scope.searchPreHandler){
              scope.searchPreHandler({data: data});
            }else{
              search[scope.config.searchParams] = data || undefined;
              scope.items = $filter('filter')(scope.store, search);
            }
          }
        };
        var value = scope.config.selectDirective.value;
        scope.setClass = function (item) {
          if(!item){
            return ;
          }
          if(scope.config.multiple){
            angular.forEach(scope.select, function (n) {
              n = n*1;
            });
            return _.indexOf(scope.select, item[value]) > -1
          }else{
            return item[value] == scope.select;
          }
        };
        iElement.on('click', function (event) {
          if(once){
            return ;
          }
          event.stopPropagation();
          scope.search.params = "";
          $document.find('.k-simple-select .select').hide();
          $document.find('.k-simple-select').removeClass('focus');
          select = angular.element(this).find('.select');
          if (!angular.element(this).data('toggle')){
            scope.config.multiple && angular.element(this).find('.text').html("-- 连续点击可以选择多项 --");
          }
          angular.element(this).data('toggle', true);
          select.toggle();
          angular.element(this).find('.k-simple-select').toggleClass('focus');
          scope.$apply();
        });

        $document.on('click', function () {
          if(select){
            hide();
            scope.$apply();
          }
        });
        function hide(){
          select.hide();
          $document.find('.k-simple-select').removeClass('focus');
          scope.config.multiple && angular.element(this).find('.text').html("-- 请点击选择 --");
          scope.search.params = "";
        }

        iElement.on('click', '.select', function (event) {
          event.stopPropagation();
        });
        iElement.on('click', '.select li', function (event) {
          event.stopPropagation();
          var _this = angular.element(this);
          var value = _this.data('value');
          if(scope.config.multiple){
            _this.toggleClass('active');
            if(_.indexOf(results, value) < 0){
              results.push(angular.element(this).data('value'));
            }else{
              _.remove(results, function(n) {
                return n == value;
              });
            }
            results.sort();
            scope.select = results.length ? results : undefined;
            scope.selectPreHandler({
              data: results
            });
          }else{
            _this.addClass('active').siblings().removeClass('active');
            scope.select = value;
            angular.element(iElement).find('.text').html(_this.text());
            scope.selectPreHandler({
              data: value
            });
            if(scope.config.once){
              once = true;
              angular.element(iElement).find('.value').css('background-color', "#ccc");
              angular.element(iElement).find('.caret').hide();
            }
            hide();
          }
          scope.$apply();
        });

        /**
         * 销毁操作
         */
        scope.$on('$destroy', function() {
          console.log('$destroy');
          store();
        });
      }
    }
  }
})();
