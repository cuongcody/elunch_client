(function () {
    'use strict';

    angular
        .module('app')
        .factory('DateService', DateService);

    DateService.$inject = ['$filter'];
    function DateService($filter) {
        var service = {};
        service.formatDate = formatDate;

        return service;

        function formatDate(dateString) {
            return $filter('date')(new Date(dateString), 'yyyy-MMM-dd HH:mm');
        }

    }

})();
