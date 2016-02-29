(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'SessionService'];
    function UserService($http, SessionService) {
        var service = {};
        var base_url = 'http://113.160.225.76:8989/elunch/';
        service.Login = Login;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Update = Update;
        service.changePasswordOfUserById = changePasswordOfUserById;
        service.getPreferences = getPreferences;
        service.getPreferencesOfUser = getPreferencesOfUser;
        service.postPreferences = postPreferences;

        return service;

        function Login(user) {
            return $http({
                  method: 'POST',
                  url: base_url + 'login',
                  data : user,
                  headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError);
            //return $http.post('http://localhost/login', {email:email, password:password}).then(handleSuccess, handleError('Error login'));
        }

        function GetAll() {
            return $http.get(base_url + 'users').then(handleSuccess, handleError);
        }

        function GetById(id) {
            return $http.get(base_url + 'user/' + id).then(handleSuccess, handleError);
        }

        function changePasswordOfUserById(data) {
            return $http({
                  method: 'PUT',
                  url: base_url + 'change_password/',
                  data : data['params'],
                  headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError);
        }

        function Update(data) {
            return $http({
                  method: 'PUT',
                  url: base_url + 'user/' + data['user_id'],
                  data : data['params'],
                  headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError);
        }

        function getPreferences() {
            return $http.get(base_url + 'preferences').then(handleSuccess, handleError);
        }

        function getPreferencesOfUser(user_id) {
            return $http.get(base_url + 'user/' + user_id + '/preferences').then(handleSuccess, handleError);
        }

        function postPreferences(data) {
            return $http({
                  method: 'POST',
                  url: base_url + 'preferences/',
                  data : data['params'],
                  headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error updating password of user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            SessionService.expiredSession(res);
        }
    }

})();
