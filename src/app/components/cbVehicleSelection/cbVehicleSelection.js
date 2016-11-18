/**
 * Created by Administrator on 2016/11/8.
 */
(function () {
  'use strict';
  angular
    .module('shopApp')
    .factory('vehicleSelection', vehicleSelection)
    .directive('cbVehicleSelection', cbVehicleSelection);

  /** @ngInject */
  function vehicleSelection() {
    /**
     * 通过本地存储来保存文件
     * sessionStorage   在关闭页面后即被清空
     * localStorage     一直保存
     * 设置数据    setItem(key,value)
     * 全部数据    valueOf()
     * 获取数据    getItem(key)
     * 删除数据    removeItem(key)
     * 清空数据    clear()
     * 存储熟练    length
     * 事件监听    storage[ie有兼容性问题]
     */
      /**
       * 汽车名字
       * @type {{}}
       */
      var vehicleNames = {};
      /**
       * 汽车品牌
       * @type {{}}
       */
       var vehicleBrands = {};
       /**
       * 汽车品牌分类
       */
       var vehicleBrandsClasses = {};
  }

  /**
   * data         获取交互数据
   * config       配置信息
   * selectItem   返回数据
   */

  /** @ngInject */
  function cbVehicleSelection(vehicleSelection) {
    return {
      restrict: "A",
      scope: {
        data: "=",
        config: "=",
        selectItem: '&'
      },
      templateUrl: "app/components/cbVehicleSelection/cbVehicleSelection.html",
      link: function (scope, iElement, iAttrs) {
        scope.search = {
          text: "",
          handler: function(){
            if(!this.text){
              return ;
            }
            /*vehicleSelection.query(this.text).then(function () {

            });*/
            console.log(this);
          }
        }
      }
    }
  }
})();
