/**
 * Created by Administrator on 2016/12/3.
 */
(function() {
  'use strict';
  angular
    .module('shopApp')
    .factory('categoryGoods', categoryGoods)
    .factory('categoryServer', categoryServer);

  /** @ngInject */
  function categoryGoods(requestService) {
    return requestService.request('category', 'goods');
  }

  /** @ngInject */
  function categoryServer(requestService) {
    return requestService.request('category', 'server');
  }

})();
