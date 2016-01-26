(function () {
    'use strict';

    angular
        .module('app')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['FlashService', '$location'];
    function SessionService(FlashService, $location) {
        var service = {};

        service.expiredSession = expiredSession;

        return service;

        function expiredSession(res) {
            if (res.status === 401) {
                $location.path('/login');
                FlashService.Error('Your session expired. Please re-login !');
                return;
            }
        }
    }

})();