(function () {
    'use strict';

    angular
        .module('app')
        .factory('MenuService', MenuService);

    MenuService.$inject = ['$http'];
    function MenuService($http) {
        var service = {};
        var base_url = 'http://113.160.225.76:8989/elunch/';

        service.GetMeals = GetMeals;
        service.GetMealsByDate = GetMealsByDate;
        return service;

        function GetMeals() {
            return $http.get(base_url + 'meals/').then(handleSuccess, handleError('Error getting meals'));
        }

        function GetMealsByDate(date) {
            console.log(base_url + 'meals?from=' + date + "&days=1");
            return $http.get(base_url + 'meals?from=' + date + "&days=0").then(handleSuccess, handleError('Error getting meals'));
        }

        // private functions

        function handleSuccess(res) {
            console.log("response: " + res);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
