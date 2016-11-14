/**
 * Created by Administrator on 2016/11/7.
 */
(function() {
  /**
   * 留言板   支持编辑和留言2种功能
   * message    只能查看数据
   * content    编写数据
   * config     配置信息
   *
   */
  'use strict';

  angular
    .module('shopApp')
    .directive('cbVehicleInfoTips', cbVehicleInfoTips)


  /** @ngInject */
  function cbVehicleInfoTips(){
    var DEFAULT_TEMPLATE = {
      'logo': 'cbVehicleInfoTipsPopoverTemplate1.html',
      'info': 'cbVehicleInfoTipsPopoverTemplate2.html'
    };
    return {
      restrict: "A",
      scope: {
        content: "="
      },
      templateUrl: "app/components/cbVehicleInfoTips/cbVehicleInfoTips.html",
      link: function(scope, iElement, iAttrs){
        scope.template = DEFAULT_TEMPLATE[iAttrs.cbVehicleInfoTips || 'logo'];
      }
    }
  }

})();
