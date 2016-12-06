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
        startTime: "=",
        endTime: "=",
        settingItem: '&'
      },
      link: function(scope, iElement){
        function handler(childScope) {
          childScope.hours = {
            start: timeChange(scope.startTime, 0),
            end : timeChange(scope.endTime, 1)
          };
          console.log(childScope.hours);
          childScope.hstep = 1;
          childScope.mstep = 5;
          childScope.ismeridian = false;
          childScope.interceptor = false;
          childScope.confirm = function () {
            childScope.interceptor = true;
           };
           childScope.interceptorConfirm = function () {
             var opentime = $filter('date')(childScope.hours.start, 'HH:mm'),
                 closetime = $filter('date')(childScope.hours.end, 'HH:mm');
             if(scope.startTime == opentime && closetime == scope.endTime){
               scope.settingItem({data: {"status":"1", "data":""}});
             }else{
               scope.settingItem({data: {"status":"0", "data":{
                 opentime: opentime,
                 closetime: closetime
               }}});
             }
             childScope.close();
           }
        }
        function format(time, num){
          if(time%num < num){
            time = time - time%num + num;
          }
          if(time < 10){
            time = "0"+time;
          }else{
            time = ""+time;
          }
          return time;
        }
        function timeChange(time, num) {
          var DATE = new Date();
          if(time == '0'){
            time = DATE.getHours()+":"+DATE.getMinutes();
          }
          if(time.indexOf(":") > -1){
            if(time.split(":")[0]*1+num > 23){
              time = "00:"+time.split(":")[1];
              console.log('if1',time);
            }else{
              time = time.split(":")[0]*1+num +":"+ format(time.split(":")[1]*1, 5);
              console.log('if2',time);
            }
          }else{
            if(time+num > 23){
              time = "00:00"
            }else{
              time = (time+num)+":00";
            }
          }
          var date = DATE.getFullYear()+ "-" + DATE.getMonth() + "-" + DATE.getDay() +" "+ time + ":00:00";
          return (new Date(date)).getTime();
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
            if(scope.telephone == childScope.telephone){
              scope.settingItem({data: {"status":"1", "data": ""}});
            }else{
              scope.settingItem({data: {"status":"0", "data": childScope.telephone}});
            }
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


