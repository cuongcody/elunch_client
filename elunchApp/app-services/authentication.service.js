(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $cookieStore, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.updateCredentials = updateCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(email, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            $timeout(function () {
                var response;
                var user = [];
                var data = 'email=' + email + '&password=' + password;
                console.log(data);
                UserService.Login(data)
                    .then(function (res) {
                        console.log(res);
                        if (res !== null && res.status =='success') {
                            response = { success: true };
                            user['authentication_token'] = res.data.authentication_token;
                            user['id'] =res.data.id;
                            user['avatar_content_file'] = res.data.avatar_content_file;
                            user['email'] = res.data.email;
                            user['want_vegan_meal'] = res.data.want_vegan_meal;
                            user['shift_id'] = res.data.shift_id;
                            user['first_name'] = res.data.first_name;
                            SetCredentials(user);
                        } else {
                            response = { success: false, message: res.message };
                        }
                        callback(response);
                    });
            }, 1000);

        }

        function SetCredentials(user) {
            ClearCredentials();
            $rootScope.globals = {
                currentUser: {
                    id: user['id'],
                    email: user['email'],
                    authentication_token: user['authentication_token'],
                    avatar_content_file : user['avatar_content_file'],
                    want_vegan_meal : user['want_vegan_meal'],
                    shift_id : user['shift_id'],
                    first_name : user['first_name']
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Bearer ' + user['authentication_token']; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function updateCredentials(globals) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + globals.currentUser.authentication_token;
            $cookieStore.remove('globals');
            $cookieStore.put('globals', globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Bearer';
        }
    }

})();