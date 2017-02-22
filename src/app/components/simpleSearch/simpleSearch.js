/**
 * Created by Administrator on 2016/10/17.
 */
/**
 * simpleSearch是一个通用的表格组件搜索筛选
 * 搜索功能
 * 1，列表选中其中一项
 * 2，自定义区间搜索，start end
 * 3，列表+自定义区间
 * 4，每个搜索项都有一个全部
 * 5，搜索框输入
 * 6，搜索框有一个按钮显示筛选条件
 * 7，搜索框和更多按钮有是否显示功能
 * 8，自定义区间搜索返回开始和结束
 * 9，列表+自定义区间返回列表中的start end相对应 根据
 *
 * 包括
 * config  全局配置参数     必填
 * searchHandler  事件回调 返回搜索信息 必填
 *
 * config    全局配置参数
 *    keyword
 *      isShow           是否显示
 *      value            值
 *      placeholder      输入框显示的占位符
 *
 *
 *
 *
 *    searchDirective    必填
 *       label           当前项名称          必填
 *       cssProperty     当前列表项的class
 *       list            当前项列表          如果没有all就必填，如果有all可以不填
 *       all             是否有全部
 *       custom          是否有自定义
 *       type            当前类型
 *              list     列表
 *              all      自定义搜索无类型
 *              number   自定义搜索数字类型
 *              int      自定义搜索整型
 *              float    自定义搜索浮点数
 *              money    自定义搜索金额
 *              date     自定义搜索时间
 *       name            显示的搜索字段         必填
 *       model           当前值
 *       start           自定义区间开始配置
 *              name     显示的自定义开始搜索字段
 *              model    显示的自定义开始搜索当前值
 *              config   显示的自定义开始配置信息
 *
 *       end             自定义区间结束配置
 *               name     显示的自定义结束搜索字段
 *              model    显示的自定义结束搜索当前值
 *              config   显示的自定义结束配置信息
 *
 */

(function () {
  'use strict';
  angular
    .module('shopApp')
    .directive('simpleSearch', simpleSearch)
    .directive('simpleSearchKeyword', simpleSearchKeyword)
    .directive('simpleSearchDate', simpleSearchDate)
    .directive('simpleSearchInteger', simpleSearchInteger)
    .directive('simpleSearchList', simpleSearchList);


  /** @ngInject */
  function simpleSearch() {
    return {
      restrict: "A",
      scope: {
        config: "=",
        searchHandler: "&"
      },
      templateUrl: "app/components/simpleSearch/simpleSearch.html",
      controller: ["$scope", function ($scope) {
        var _this = this;
        // 禁用对象
        var disabledMap = {};
        // 搜索配置
        var searchConfig = null;
        // 绑定参数
        this.searchParams = {};

        // 显示更多筛选条件 如果没有搜索框就直接显示出来，如果有就隐藏起来
        $scope.isShowmore = true;
        $scope.isKeywordShow = false;
        $scope.search = {};
        $scope.search.directive = [];
        // 监听配置
        var watchConfig = $scope.$watch('config', function (value) {
          if (value) {
            searchConfig = angular.extend({}, value);
            setItems(searchConfig);
            // 如果有搜索
            if (angular.isDefined(searchConfig.keyword)) {
              setKeyword(searchConfig);
              $scope.isKeywordShow = _this.keyword.isShow;
              _this.keyword.isMore = $scope.search.directive.length > 0;
            } else {
              $scope.isShowmore = true;
            }
          }
        });
        /**
         * 自定义数据
         * @type {Array}
         */
        var customData = [];

        /**
         *  保存自定义数据
         * @param item
         */
        function saveCustomData(item) {
          customData.push({
            name: item.name,
            start: item.start.name,
            end: item.end.name
          });
        }

        /**
         * 设置searchDirective
         */
        function setItems(config) {
          var isModel = 0;
          angular.forEach(config.searchDirective, function (item) {
            if (!angular.isArray(item.list) && !item.all) {
              throw Error(item.label + '：的配置项不全');
            }
            if (angular.isArray(item.list) && !item.list.length && !item.all) {
              throw Error(item.label + '：的配置项list为0');
            }
            // 如果是自定义需要吧当前想绑定的name+$$在后期处理
            item.custom && (item.name = "$$" + item.name);
            // 设置所有项数据
            disabledMap[item.name] = false;
            if (angular.isUndefined(item.model) || item.model == -1) {
              _this.searchParams[item.name] = -1;
            } else {
              _this.searchParams[item.name] = item.model;
              isModel++;
            }
            // 设置起始数据
            if (angular.isDefined(item.start)) {
              angular.isDefined(item.start.model) && (isModel++);
              _this.searchParams[item.start.name] = item.start.model;
              disabledMap[item.start.name] = false;
              if (!_.isUndefined(item.start.model)) {
                _this.searchParams[item.name] = -2;
              }
            }
            // 设置结束数据
            if (angular.isDefined(item.end)) {
              angular.isDefined(item.end.model) && (isModel++);
              _this.searchParams[item.end.name] = item.end.model;
              disabledMap[item.end.name] = false;
            }
            // 检查list是不是数组 如果不是就创建一个数组，给全部和自定义使用
            if (!angular.isArray(item.list)) {
              item.list = [];
            }
            // 全部 添加在数组第一项
            item.all && item.list.unshift({
              id: -1,
              label: "全部"
            });
            // 自定义 添加在数组第最后一项项
            item.custom && item.list.push({
              id: -2,
              label: "自定义"
            });
            // 保存自定义数据
            item.custom && saveCustomData(item);
            // 添加到筛选列表
            $scope.search.directive.push(item);
          });
          $scope.isShowmore = isModel > 0;
        }
        // 给子指令用 显示隐藏更多筛选条件
        this.showMore = function () {
          $scope.isShowmore = !$scope.isShowmore;
        };
        /**
         * 设置keyword
         */
        function setKeyword(config) {
          _this.keyword = config.keyword;
          _this.searchParams[_this.keyword.name] = _this.keyword.model;
        }

        /**
         * 是否禁用，有些输入验证失败
         * @param disabled
         */
        this.isDisabled = function (name, disabled) {
          disabledMap[name] = disabled;
          $scope.isDisabled = _.some(disabledMap);
        };

        /**
         * 根据id在列表获取匹配的项
         * @param id
         * @param list
         */
        this.findListItem = function (id, list) {
          return _.find(list, function (item) {
            return item.id == id;
          });
        };

        /**
         * 检查当前值是不是自定义数据里面某一项
         * @param value
         * @returns {boolean}
         */
        function isCustomData(value) {
          var items = _.find(customData, function(item){
            return item.name == value || item.start == value || item.end == value;
          });
          return !!items;
        }

        /**
         * 点击查询
         */
        $scope.setSearch = function () {
          $scope.searchHandler({data: getParams(_this.searchParams)});
        };

        function getParams(params) {
          var searchParams = angular.copy(searchConfig.other);
          angular.forEach(params, function (key, value) {
            if(!isCustomData(value) && key == -1){
              searchParams[value] = undefined;
            }else{
              searchParams[value] = key;
            }
            isCustomData(value) && !/^\$\$/.test(value) && (searchParams[value] = key);
          });
          console.log(searchParams, params);

          return searchParams;
        }


        // 确保监听被销毁。
        $scope.$on('$destroy', function () {
          watchConfig();
        });

      }]
    }
  }

  /** @ngInject */
  function simpleSearchKeyword() {
    return {
      restrict: "A",
      replace: true,
      require: '^simpleSearch',
      templateUrl: "app/components/simpleSearch/keyword.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        scope.keyword = iCtrl.keyword.model;
        scope.isMore = iCtrl.keyword.isMore;
        scope.placeholder = iCtrl.keyword.placeholder;
        scope.handler = function () {
          iCtrl.searchParams[iCtrl.keyword.name] = scope.keyword;
        };
        scope.toggle = function () {
          iCtrl.showMore();
        };
      }
    }
  }

  /** @ngInject */
  function simpleSearchList() {
    return {
      restrict: "A",
      replace: true,
      require: '^simpleSearch',
      scope: {
        items: "="
      },
      templateUrl: "app/components/simpleSearch/list.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        scope.searchParams = iCtrl.searchParams;
        scope.handler = function () {
          iCtrl.searchParams[scope.items.name] = scope.searchParams[scope.items.name];
        }
      }
    }
  }

  /** @ngInject */
  function simpleSearchDate() {
    return {
      restrict: "A",
      replace: true,
      require: '^simpleSearch',
      scope: {
        items: "="
      },
      templateUrl: "app/components/simpleSearch/date.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        scope.searchParams = iCtrl.searchParams;
        scope.handler = function () {
          iCtrl.searchParams[scope.items.name] = scope.searchParams[scope.items.name];
          if (scope.searchParams[scope.items.name] == -1 || scope.searchParams[scope.items.name] == -2) {
            iCtrl.searchParams[scope.items.start.name] = undefined;
            iCtrl.searchParams[scope.items.end.name] = undefined;
          } else {
            var current = iCtrl.findListItem(scope.searchParams[scope.items.name], scope.items.list) || {};
            iCtrl.searchParams[scope.items.start.name] = current.start;
            iCtrl.searchParams[scope.items.end.name] = current.end;
          }
        };
        // 起始时间配置
        scope.items.start.config = angular.extend({
          startingDay: 1,
          placeholder: "起始时间",
          minDate: new Date("2010/01/01 00:00:00"),
          maxDate: new Date()
        }, (scope.items.start.config || {}));
        // 终止时间配置
        scope.items.end.config = angular.extend({
          startingDay: 1,
          placeholder: "终止时间",
          minDate: new Date("2010/01/01 00:00:00"),
          maxDate: new Date()
        }, (scope.items.end.config || {}));
        //是否起始时间开启选择框
        scope.items.start.opened = false;
        //是否终止时间开启选择框
        scope.items.end.opened = false;

        // 是否有终止时间，如果没有就不走下面的
        if (angular.isDefined(scope.items.end)) {
          scope.items.start.open = function () {
            scope.items.end.opened = false;
          };
        }
        scope.items.start.handler = function (startDate, endDate) {
          console.log('start', startDate, endDate);
          /**
           * 如果没有选择结束时间
           */
          if (startDate) {
            var start = startDate.replace(/\-/, '/') + " 00:00:00";
            scope.items.end.config.minDate = new Date(start);
          }
          console.log(scope.items.end);

        };

        scope.items.end.open = function () {
          scope.items.start.opened = false;
        };
        scope.items.end.handler = function (endDate, startDate) {
          console.log('end', startDate, endDate);
          if (angular.isDefined(endDate)) {
            var end = endDate.replace(/\-/, '/') + " 00:00:00";
            scope.items.start.config.maxDate = new Date(end);
          }

        };

        function compare(endDate, startDate) {
          endDate = endDate.replace(/\-/, '/');
          startDate = startDate.replace(/\-/, '/');
          return (new Date(endDate) - new Date(startDate));
        }

      }
    }
  }

  /** @ngInject */
  function simpleSearchInteger(cbAlert) {
    return {
      restrict: "A",
      replace: true,
      require: '^simpleSearch',
      scope: {
        items: "="
      },
      templateUrl: "app/components/simpleSearch/integer.html",
      link: function (scope, iElement, iAttrs, iCtrl) {
        scope.searchParams = iCtrl.searchParams;
        scope.handler = function () {
          iCtrl.searchParams[scope.items.name] = scope.searchParams[scope.items.name];
          if (scope.searchParams[scope.items.name] == -1 || scope.searchParams[scope.items.name] == -2) {
            iCtrl.searchParams[scope.items.start.name] = undefined;
            iCtrl.searchParams[scope.items.end.name] = undefined;
          } else {
            var current = iCtrl.findListItem(scope.searchParams[scope.items.name], scope.items.list) || {};
            iCtrl.searchParams[scope.items.start.name] = current.start;
            iCtrl.searchParams[scope.items.end.name] = current.end;
          }
          iCtrl.isDisabled(scope.items.start.name, false);
          iCtrl.isDisabled(scope.items.end.name, false);
        };
        // 起始配置
        scope.items.start.config = angular.extend({
          placeholder: "",
          min: -1,
          max: 1000000
        }, (scope.items.start.config || {}));

        // 终止配置
        scope.items.end.config = angular.extend({
          placeholder: "",
          min: -1,
          max: 1000000
        }, (scope.items.end.config || {}));

        setPlaceholder('start');
        setPlaceholder('end');


        function setPlaceholder(dir) {
          var config = scope.items[dir].config;
          scope.items[dir].config.placeholder = "请输入 " + (config.min + 1) + " ~ " + (config.max - 1);
        }

        function getPlaceholder(dir) {
          var config = scope.items[dir].config;
          return "不在合法 " + config.min + " ~ " + config.max + "范围内";
        }

        // 起始处理函数
        scope.items.start.handler = function (start, end) {
          console.log('start', compare(start, end), rangeEnabled(start, scope.items.start.config));
          // 如果结束没有输入，只输入开始，就需要判断
          if (angular.isDefined(start) && angular.isUndefined(end)) {
            iCtrl.isDisabled(scope.items.end.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.end.name, false);
          }
          // 比较是否在合法范围内
          if (!rangeEnabled(start, scope.items.start.config)) {
            cbAlert.error(getPlaceholder('start'));
            iCtrl.isDisabled(scope.items.start.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.start.name, false);
          }
          // 比较大小
          if (angular.isDefined(start) && angular.isDefined(end) && !compare(start, end)) {
            cbAlert.error("结束输入不能比起始输入小");
            iCtrl.isDisabled(scope.items.start.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.start.name, false);
          }

        };

        // 终止处理函数
        scope.items.end.handler = function (start, end) {
          // 如果开始没有输入，只输入结束，就需要判断
          if (angular.isUndefined(start) && angular.isDefined(end)) {
            iCtrl.isDisabled(scope.items.start.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.start.name, false);
          }
          // 比较是否在合法范围内
          if (!rangeEnabled(start, scope.items.start.config)) {
            cbAlert.error(getPlaceholder('end'));
            iCtrl.isDisabled(scope.items.end.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.end.name, false);
          }
          // 比较大小
          if (angular.isDefined(start) && angular.isDefined(end) && !compare(start, end)) {
            cbAlert.error("结束输入不能比起始输入小");
            iCtrl.isDisabled(scope.items.end.name, true);
            return;
          } else {
            iCtrl.isDisabled(scope.items.end.name, false);
          }
        };


        // 是否在限制范围内
        function rangeEnabled(data, config) {
          console.log(data, config);
          data = data || 0;
          return config.min < data && data < config.max;
        }

        // 比较 结束是否比开始大 如果大于0就是正确，如果小于0就是错误
        function compare(start, end) {
          return end - start > 0;
        }

      }
    }
  }

})();



