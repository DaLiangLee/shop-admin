/**
 * Created by Administrator on 2016/12/3.
 */
(function() {
  'use strict';
  angular
    .module('shopApp')
    .service('category', category);

  /** @ngInject */
  function category($q, requestService, productServer, cbAlert) {
    var goods = null;
    this.goods =function () {
      var deferred = $q.defer();
      if(goods !== null){
        deferred.resolve(goods);
      }else{
        requestService.request('category', 'goods').goods()
          .then(function (results) {
            if (results.data.status === 0) {
              goods = results.data.data;
              deferred.resolve(results.data.data);
            } else {
              cbAlert.error("错误提示", results.data.data);
            }
          });
      }
      return deferred.promise;
    };
    var server = null;
    this.server = function () {
      var deferred = $q.defer();
      if(server !== null){
        deferred.resolve(server);
      }else{
        $q.all([requestService.request('category', 'server').storeserver(), productServer.selectedonelevel()])
          .then(function (results) {
            var storeserver = results[0].data, selectedonelevel = results[1].data, errorMessages = "请求错误";
            if(storeserver.status === 0 && selectedonelevel.status === 0){
              server = getCategoryServer(storeserver.data, selectedonelevel.data);
              deferred.resolve(server);
            }else{
              if(storeserver.status !== 0){
                errorMessages = storeserver.data;
              }
              if(selectedonelevel.status !== 0){
                errorMessages = selectedonelevel.data;
              }
              cbAlert.error("错误提示", errorMessages);
            }
          });
      }
      return deferred.promise;
    };
  }
  /**
   * 获取该店铺可以使用的服务类目
   * @param storeserver
   * @param selectedonelevel
   * @returns {[]}
   */
  function getCategoryServer(storeserver, selectedonelevel){
    return _.filter(storeserver, function (item) {
      return !_.isUndefined(_.find(selectedonelevel, function (key) {
        return item.id*1 === key.id*1;
      }));
    });
  }

})();
