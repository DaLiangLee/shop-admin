/**
 * Created by Administrator on 2016/11/1.
 */
(function() {
  'use strict';
  /**
   * 权限控制， 传递栏目id，如果id不存在就删除这个dom
   */
  angular
    .module('shopApp')
    .directive("cbEcharts",cbEcharts);

  /** @ngInject */
  function cbEcharts(){
    return {
      restrict: 'A',
      scope: {
        option: "="
      },
      link: function(scope, iElement){
        var myChart = echarts.init(iElement[0]);
        var option = scope.$watch('option', function (value) {
          myChart.setOption(value);
        });
        // 确保工具提示被销毁和删除。
        scope.$on('$destroy', function() {
          option();
        });
      }
    };
  }
})();
