/**
 * Created by Administrator on 2016/10/15.
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
    .directive('shopHomeSettingsHours', shopHomeSettingsHours)
    .directive('shopHomeSettingsTelephone', shopHomeSettingsTelephone);

  /** @ngInject */
  function shopHomeSettingsHours($filter, cbDialog){
    return {
      restrict: "A",
      scope: {
        time: "=",
        settingItem: '&'
      },
      link: function(scope, iElement){
        function handler(childScope) {
          childScope.hours = {
            start: timeChange(angular.copy(scope.time).start),
            end : timeChange(angular.copy(scope.time).end)
          };
          childScope.hstep = 1;
          childScope.mstep = 5;
          childScope.ismeridian = false;
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
           };
           childScope.interceptorConfirm = function () {
             scope.settingItem({data: {"status":"0", "data":{
               start: $filter('date')(childScope.hours.start, 'HH:mm'),
               end: $filter('date')(childScope.hours.end, 'HH:mm')
             }}});
             childScope.close();
           }
        }
        function timeChange(time) {
          var DATE = new Date();
          var date = DATE.getFullYear() + DATE.getMonth() + DATE.getDay() +" "+ time + ":00";
          return (new Date(date));
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.settingItem({data: {"status":"-1", "data":"设置营业时间打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/store_shop/shop_home_settings_hours.html", handler, {
            windowClass: "viewFramework-shop-home-settings-hours-dialog"
          });
        });
      }
    }
  }

  /** @ngInject */
  function shopHomeSettingsTelephone(cbDialog){
    return {
      restrict: "A",
      scope: {
        telephone: "=",
        settingItem: '&'
      },
      link: function(scope, iElement){
        function handler(childScope) {
          childScope.telephone = angular.copy(scope.telephone);
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
          };
          childScope.interceptorConfirm = function () {
            scope.settingItem({data: {"status":"0", "data": childScope.telephone}});
            childScope.close();
          }
        }
        /**
         * 点击按钮
         */
        iElement.click(function (t) {
          scope.settingItem({data: {"status":"-1", "data":"设置客服电话打开成功"}});
          t.preventDefault();
          t.stopPropagation();
          cbDialog.showDialogByUrl("app/pages/store_shop/shop_home_settings_telephone.html", handler, {
            windowClass: "viewFramework-shop-home-settings-telephone-dialog"
          });
        });
      }
    }
  }
})();


