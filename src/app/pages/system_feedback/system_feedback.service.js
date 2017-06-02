(function() {
    'use strict';

    angular
        .module('shopApp')
        .factory('systemFeedback', systemFeedback);

    /** @ngInject */
    function systemFeedback(requestService) {
        return requestService.request('system', 'feedback');
    }
})();