/**
 * Created by Administrator on 2017/3/2.
 */
(function () {
  'use strict';
  /**
   * 车边分页
   *  指令属性配置
   *    boundary-links             默认：false     是否显示第一个/最后一个按钮。
   *    boundary-link-numbers      默认: false    是否总是显示第一个和最后一个页码。如果最大尺寸小于的页数,然后第一个和最后一个页面数量仍然显示与椭圆中间。注:最大尺寸是指范围的中心。这个选项可能会增加两个数字两边显示范围的最终值,将是一个省略号,但取而代之的是,因为它是连续的。
   *    direction-links            默认:true      是否显示之前/下一个按钮。
   *    First Text                 默认:首页      第一个页按钮文本
   *    last-text                  默认:尾页      最后一页按钮文本
   *    previous-text              默认:上一页    上一页按钮文本
   *    next-text                  默认:上一页    下一页按钮文本
   *    total-items
   */

  angular
    .module('shopApp')
    .constant('simpleGridPageConfig', {
      itemsPerPage: 10,
      boundaryLinks: false,
      boundaryLinkNumbers: false,
      directionLinks: true,
      firstText: '首页',
      previousText: '上一页',
      nextText: '下一页',
      lastText: '尾页',
      rotate: true,
      forceEllipses: false
    })
    .directive('simpleGridPage', simpleGridPage);

  /** @ngInject */
  function simpleGridPage() {
    return {
      restrict: "A",
      scope: {
        totalItems: '=',
        firstText: '@',
        previousText: '@',
        nextText: '@',
        lastText: '@',


        ngDisabled:'=',
        onSelectPage: "&",
        paginationInfo: "="
      },
      templateUrl: 'app/components/simpleGrid/simpleGridPage.html',
      controller: ['$scope', '$attrs', '$parse', 'simpleGridPageConfig', function($scope, $attrs, $parse, simpleGridPageConfig) {
        // 是否显示首尾按钮
        $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : simpleGridPageConfig.boundaryLinks;

        // 是否显示上一页下一页按钮
        $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : simpleGridPageConfig.directionLinks;

        // 是否显示更多页码省略号
        var boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : simpleGridPageConfig.boundaryLinkNumbers;

        var forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : simpleGridPageConfig.forceEllipses;

        var rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : simpleGridPageConfig.rotate;
        // 一页多少条数据
        if(angular.isDefined($scope.paginationInfo)){
          var maxSize = angular.isDefined($scope.paginationInfo.pageSize) ? $scope.paginationInfo.pageSize : simpleGridPageConfig.itemsPerPage;
        }else{
          var maxSize = simpleGridPageConfig.itemsPerPage;
        }

        // 格式化内容
        var pageLabel = function(num){
          return num;
        };


        // 显示按钮信息  首页 上一页 下一页 尾页
        $scope.getText = function(key){
          return $scope[key + 'Text'] || simpleGridPageConfig[key + 'Text'];
        };

        // 当前页面
        $scope.page = $scope.paginationInfo.page;

        // 计算总页数
        $scope.totalPages = Math.ceil($scope.paginationInfo.total/$scope.paginationInfo.pageSize);

        // 禁止上一页
        $scope.noPrevious = function(){
          return $scope.page === 1;
        };

        // 禁止下一页
        $scope.noNext = function(){
          return $scope.page === $scope.totalPages;
        };



        // 分页显示列表按钮
        $scope.pages = getPages($scope.page, $scope.totalPages);

        // 创建页面对象模板中使用
        function makePage(number, text, isActive) {
          return {
            number: number,
            text: text,
            active: isActive
          };
        }


        /**
         * 获取分页列表
         * @param currentPage   当前页
         * @param totalPages    总页数
         * @returns {Array}     分页列表
         */
        function getPages(currentPage, totalPages){
          var pages = [];
          // 默认的页面限制

          // 开始页面，总条数
          var startPage = 1, endPage = totalPages;
          var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

          // 计算最小和最大页面
          if (isMaxSized) {
            if (rotate) {
              // 显示当前页面中可见的页面
              startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
              endPage = startPage + maxSize - 1;

              // 调整如果超过限制
              if (endPage > totalPages) {
                endPage = totalPages;
                startPage = endPage - maxSize + 1;
              }
            } else {
              // 可见页面分页的最最小
              startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

              // 调整最后一页是否超过限制
              endPage = Math.min(startPage + maxSize - 1, totalPages);
            }
          }

          // 添加页码链接
          for (var i = startPage; i <= endPage; i++) {
            var page = makePage(i, pageLabel(i), i === currentPage);
            pages.push(page);
          }

          // 添加链接之间移动页面集 省略号
          if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
            if (startPage > 1) {
              if (!boundaryLinkNumbers || startPage > 3) { //需要省略所有的选项,除非范围是太接近开始
                var previousPageSet = makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
              }
              if (boundaryLinkNumbers) {
                if (startPage === 3) { //需要更换省略号按钮时将顺序
                  var secondPageLink = makePage(2, '2', false);
                  pages.unshift(secondPageLink);
                }
                //添加第一页
                var firstPageLink = makePage(1, '1', false);
                pages.unshift(firstPageLink);
              }
            }

            if (endPage < totalPages) {
              if (!boundaryLinkNumbers || endPage < totalPages - 2) { //需要省略所有的选项,除非范围是太接近结束
                var nextPageSet = makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
              }
              if (boundaryLinkNumbers) {
                if (endPage === totalPages - 2) { //需要更换省略号按钮时将顺序
                  var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
                  pages.push(secondToLastPageLink);
                }
                //添加最后一页
                var lastPageLink = makePage(totalPages, totalPages, false);
                pages.push(lastPageLink);
              }
            }
          }

          return pages;
        }



        // 分页跳转
        $scope.selectPage = function(page, event){
          if (event) {
            event.preventDefault();
          }
          console.log($scope.page !== page , page > 0 , page <= $scope.totalPages);
          var clickAllowed = true;//!$scope.paginationInfo.disabled || !event;
          if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
            $scope.page = page;
            $scope.pages = getPages($scope.page, $scope.totalPages);
            console.log($scope.page);
            $scope.onSelectPage({page: page});
          }
        };

      }],
      link: function(scope, iElement, iAttrs){
        // 是否配置跳转分页
        var isPageGoto = angular.isDefined(iAttrs.showPageGoto) && iAttrs.showPageGoto === 'true';
        scope.$watch("paginationInfo", function (newValue) {
          if (newValue && isPageGoto) {
            var total = newValue.total,
              pageSize = newValue.pageSize,
              s = Math.ceil(total / pageSize);
            newValue.totalPage = s;
            newValue.showPageGoto = s >= 5;
            scope.pageGoto = "";
          }
        });
        scope.$watch("pageGoto", function (t) {
          t && t != "0" && t > 0 ? scope.gotoPageBtnDisabled = t > scope.paginationInfo.totalPage : scope.gotoPageBtnDisabled = !0
        });
        scope.gotoPage = function () {
          scope.paginationInfo.page = scope.pageGoto*1;
        };
        scope.$watch("paginationInfo.page", function (newValue, oldValue) {
          if(newValue != oldValue){
            scope.onSelectPage({page: newValue});
          }
        });
      }
    }
  }
})();
