/**
 * Created by Administrator on 2016/10/17.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('shopHome', shopHome);

    /** @ngInject */
    function shopHome(requestService) {
      return requestService.request('store', 'shop');
    }
})();
