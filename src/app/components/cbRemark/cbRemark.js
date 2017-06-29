(function() {
  'use strict';

  angular
      .module('shopApp')
      .directive('cbRemark', cbRemark);

  /** @ngInject */
  function cbRemark() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        handleRemark: '&',
        remarkContent: '='
      },
      templateUrl: 'app/components/cbRemark/cbRemark.html',
      link: function(scope, iElement) {
        var currentContent = ''; // 先将文本内容存在这个全局变量上
        scope.config = {
          isRemarkShow: false, // 是否显示输入框
          emptyRemark: true,
          remarkContent: scope.remarkContent // 将获取的数据赋给对象上
        };
        currentContent = scope.config.remarkContent;
        isEmptyRemark(currentContent); // 一开始就判断remarkContent是否为空,用来渲染icon样式


        // 获取元素的信息
        var iconBook = iElement.find('.w-icon-note'),
            inputBox = iElement.find('.input-control'),
            inputBoxHeight = inputBox.outerHeight(true),
            remarkPart = iElement.find('.w-remark-content');

        // 切换显示
        scope.config.toggleRemark = function() {
          scope.config.isRemarkShow = !scope.config.isRemarkShow;

          // 每次显示的时候计算一下icon的位置，避免页面中其它结构变化对其造成影响
          var iconBookPosition = iconBook.position(),
              iconTop = iconBookPosition.top,
              iconLeft = iconBookPosition.left;

          remarkPart.css({
            position: 'absolute',
            top: iconTop - inputBoxHeight / 2,
            left: iconLeft - 438
            // right: 100
          });
        };

        /**
         * @param value 输入框中的值
         */
        scope.config.confirm = function(value) {
          scope.handleRemark({data: value});
          currentContent = value;
          judgeAndClose(value);
        };

        /**
         * 取消操作
         */
        scope.config.cancel = function() {
          // 如果一开始是空，点取消则清空输入框内的内容
          if (isEmptyRemark(currentContent)) {
            scope.config.remarkContent = '';
            scope.handleRemark({data: scope.config.remarkContent});
            judgeAndClose(currentContent);
          } else if (!isEmptyRemark(currentContent) && currentContent !== scope.config.remarkContent) { // 如果一开始不是空，点取消则还原为先前的内容
            scope.config.remarkContent = currentContent;
            scope.handleRemark({data: scope.config.remarkContent});
            judgeAndClose(currentContent);
          } else {
            judgeAndClose(currentContent);
          }
        };

        /**
         * 判断输入框内是否有内容存在
         * 主要用于改变icon样式
         * @param value
         * @returns {boolean}
         */
        function isEmptyRemark(value) {
          return scope.config.emptyRemark = value === '';
        }

        /**
         * 关闭输入框
         */
        function close() {
          scope.config.isRemarkShow = false;
        }

        /**
         * 判断输入框是否为空然后在关闭
         * 这个是对上面2个函数的封装
         */
        function judgeAndClose(value) {
          isEmptyRemark(value);
          close();
        }

      }
    }
  }
})();
