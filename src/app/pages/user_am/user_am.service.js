/**
 * Created by Administrator on 2016/12/26.
 */
(function () {
    'use strict';

    angular
        .module('shopApp')
        .factory('userAm', userAm);

    /** @ngInject */
    function userAm(requestService) {
        return requestService.request('users', 'am');
    }
})();