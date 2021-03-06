﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'AuthenticationService', 'FlashService'];
    function LoginController($rootScope, $location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            $rootScope.title = 'Login';
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.email, vm.password, function (response) {
                vm.dataLoading = false;
                if (response.success) {
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                }
            });
        };
    }

})();
