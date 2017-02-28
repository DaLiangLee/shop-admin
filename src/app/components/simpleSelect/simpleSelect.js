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
    .directive('simpleSelect', simpleSelect);

  /** @ngInject */
  function simpleSelect($document, $filter, $timeout) {
    return {
      restrict: "A",
      replace: true,
      scope: {
        store: "=",
        select: "=",
        selectHandler: "&",
        searchHandler: "&"
      },
      templateUrl: "app/components/simpleSelect/simpleSelect.html",
      link: function(scope, iElement, iAttrs){
        /**
         * 设置配置参数
         * @type config
         *  multiple: boolean,    是否多选
         *  search: boolean，     是否开启搜索
         *  once: boolean,        是否只点击一此
         *  value: string,        指定返回的值的字段
         *  name: string          指定显示列表的字段
         *  image: string         指定显示列表的字段
         */
        scope.config = {
          search: angular.isDefined(iAttrs.search),
          multiple: angular.isDefined(iAttrs.multiple),
          once: angular.isDefined(iAttrs.once),
          value: getOptions()[0],
          name: getOptions()[1],
          image: getOptions()[2]
        };

        if(scope.config.multiple && !angular.isArray(scope.select)){
          scope.select = [];
        }
        var $list,$select;

        var placeholder = angular.isDefined(iAttrs.placeholder) ? iAttrs.placeholder : "请点击选择";
        /**
         * 获取字段参数  格式 options="value,name | value,name,image"
         * @returns {*}
         */
        function getOptions(){
          // 如果参数里面没有一个‘,’ 直接抛异常，防止其他BUG
          if(iAttrs.simpleSelect.indexOf(',') < 0){
            throw Error('填写的格式有误，‘value,name | value,name,image’，value是提交的值')
          }
          var items = iAttrs.simpleSelect.split(",");
          // 如果只填了value和name，image需要填充一个undefined来占位，防止获取报错
          if(items.length === 2){
            items[2] = undefined;
          }
          return items;
        }

        var value = scope.config.value;
        var name = scope.config.name;
        var image = scope.config.image;
        var timer = null;
        /**
         * 值相关操作
         * @type {{once: boolean, image: string, text: string, toggle: toggle}}
         */
        scope.choose = {
          once: false,
          image: "",
          text: "-- "+placeholder+" --",
          list: [],
          hide: function () {
            this.focus = false;
            scope.search.params = "";
            if(scope.config.multiple){
              this.text = "-- "+placeholder+" --";
            }
          }
        };

        iElement.on('click', '.value', function (event) {
          event.stopPropagation();
          if(scope.choose.once){
            return ;
          }
          close();
          scope.$apply(function () {
            if(scope.config.multiple){
              scope.choose.text = "-- 连续点击可以选择多项 --";
              $timeout(function(){
                $list = iElement.find('.value');
                $select = iElement.find('.select');
                // 更新高度
                $select.css({'top': $list.height()});
              },1);
            }
          });
          iElement.toggleClass('isOpen');
        });

        // 关闭所有
        function close(){
          $document.find('.k-simple-select').removeClass('isOpen');
        }

        /**
         * 筛选操作
         * @type {{}}
         */
        var search = {};
        search[name] = undefined;
        scope.search = {
          prefer: scope.config.search,
          params: undefined,
          handler: function (data) {
            search[name] = data || undefined;
            scope.items = $filter('filter')(scope.store, search);
            scope.searchHandler({data: data});
          }
        };


        /**
         * 监听数据变化
         * @type {(()=>void)|*|(())}
         */
        var store = scope.$watch('store', function (value) {
          scope.items = value || [];
          scope.choose.once = scope.items.length === 1 && angular.isDefined(iAttrs.once) && scope.select;
          if(scope.items.length){
            if(scope.config.search){
              scope.search.prefer = value.length > 6;
            }
            if(!scope.select){
              scope.choose.text = "-- "+placeholder+" --";
            }else{
              if(scope.config.multiple){
                scope.choose.text = "-- "+placeholder+" --";
                value && (scope.choose.list = getList(value, scope.select));
              }else{
                scope.choose.text = getValue(scope.items, scope.select).text;
                scope.choose.image = getValue(scope.items, scope.select).image;
              }
            }
          }
        });

        function getList(store, select){
          if(angular.isUndefined(select) || !select.length || !store.length){
            return [];
          }
          var results = [];
          angular.forEach(select, function (item) {
            results.push(_.find(store, function (key) {
              return key[value] == item[value];
            }));
          });
          return results;
        }

        /**
         * 监听数据变化
         * @type {(()=>void)|*|(())}
         */
        var select = scope.$watch('select', function (value) {
          if(angular.isUndefined(value)){
            scope.choose.text = "-- "+placeholder+" --";
          }
        });
        function getValue(items, select){
          if(!select){
            return "-- "+placeholder+" --";
          }
          var item = _.remove(angular.copy(items), function(item){
            return item[scope.config.value] == select;
          });
          return {
            text: item.length && item[0][name] ? item[0][name] : "-- "+placeholder+" --",
            image: item.length && item[0][image] ? item[0][image] : ""
          };
        }
        scope.setClass = function (item) {
          if(!item){
            return ;
          }
          if(scope.config.multiple){
            return  _.findIndex(scope.choose.list, function (key) {
                return key[value] == item[value];
              }) > -1;
          }else{
            return item[value] == scope.select;
          }
        };
        scope.options = function ($event, item) {
          $event.stopPropagation();
          if(scope.config.multiple){   // 多选
            var index = _.findIndex(scope.select, function (key) {
              return key == item[value];
            });
            if(index < 0){
              scope.select.push(item[value]);
              scope.choose.list.push(item);
            }else{
              scope.select.splice(index, 1);
              _.remove(scope.choose.list, function(key){
                return key[value] == item[value];
              });
            }
            // 更新高度
            $timeout(function(){
              $select.css({'top': $list.height()});
            },1);
          }else{   //单选
            scope.select = item[value];
            scope.choose.text = item[name];
            scope.choose.image = item[image];
            scope.choose.once = scope.config.once;
            scope.choose.hide();
            close();
          }
          scope.selectHandler({
            data: scope.select
          });
        };
        scope.remove = function ($event, item) {
          $event.stopPropagation();

          var index = _.findIndex(scope.select, function (key) {
            return key[value] == item[value];
          });
          scope.select.splice(index, 1);
          _.remove(scope.choose.list, function(key){
            return key[value] == item[value];
          });
          // 更新高度
          $timeout(function(){
            $select.css({'top': $list.height()});
          },1);
          scope.selectHandler({
            data: scope.select
          });
        };
        iElement.on('mouseenter', function () {
          $timeout.cancel(timer);
        });
        iElement.on('mouseleave', function () {
          $timeout.cancel(timer);
          timer = $timeout(function(){
            scope.choose.hide();
            close();
          }, 300);
        });
        $document.on('click', function () {
          scope.$apply(function(){
            scope.choose.hide();
          });
          close();
        });
        /**
         * 销毁操作
         */
        scope.$on('$destroy', function() {
          store();
          select();
        });
      }
    }
  }
})();
