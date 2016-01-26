(function () {
    'use strict';

    angular
        .module('app')
        .factory('TablesService', TablesService);

    TablesService.$inject = ['$http', 'SessionService'];
    function TablesService($http, SessionService) {
        var service = {};
        var base_url = 'http://113.160.225.76:8989/elunch/';

        service.getTablesByShift = getTablesByShift;
        service.joinTable = joinTable;
        service.leaveTable = leaveTable;
        return service;

        function getTablesByShift(shift_id, for_vegans) {
            return $http.get(base_url + 'shift/' + shift_id + '/tables?for_vegans=' + for_vegans).then(handleSuccess, handleError);
        }

        function joinTable(data) {
            return $http({
                method: 'POST',
                url: base_url + 'seat',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError);
        }

        function leaveTable(user_id, table_id) {
            return $http.delete(base_url + 'seat?user_id=' + user_id + '&table_id=' + table_id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            console.log("response: " + res);
            return res.data;
        }

        function handleError(res) {
            SessionService.expiredSession(res);
        }
    }

})();
