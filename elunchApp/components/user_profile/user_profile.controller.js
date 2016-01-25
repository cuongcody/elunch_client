(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController)
        .directive('pwCheck', function () {
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    var newPassword = '#' + attrs.pwCheck;
                    elem.add(newPassword).on('keyup', function () {
                      scope.$apply(function () {
                        var v = elem.val() === $(newPassword).val();
                        ctrl.$setValidity('noMatch', v);
                      });
                    });
                  }
            }
        });

    UserController.$inject = ['UserService', '$rootScope', 'FlashService', 'AuthenticationService', '$http', '$cookieStore'];
    function UserController(UserService, $rootScope, FlashService, AuthenticationService, $http, $cookieStore) {
        var vm = this;
        var user_id = null;
        vm.isPreferencesView = true;
        vm.user = null;
        vm.whatTaste = null;
        vm.isVegan = null;
        vm.updateUser = updateUser;
        vm.changePassword = changePassword;

        initController();

        function initController() {
            user_id = $rootScope.globals.currentUser.id;
            loadCurrentUser();
        }

        function loadCurrentUser() {
            UserService.GetById(user_id)
                .then(function (res) {
                    console.log(res.data);
                    vm.user = res.data;
                    vm.whatTaste = vm.user.what_taste;
                    vm.isVegan = vm.user.want_vegan_meal;
                });
        }

        function updateUser() {
            vm.dataLoading = true;
            var data = [];
            data['user_id'] = user_id;
            data['params'] = 'what_taste='+ vm.whatTaste + '&want_vegan_meal=' + vm.isVegan;
            UserService.Update(data)
                .then(function (res) {
                    console.log(res);
                    vm.dataLoading = false;
                    if (res.status == 'success')
                    {
                        $rootScope.globals.currentUser.want_vegan_meal = vm.isVegan;
                        AuthenticationService.updateCredentials($rootScope.globals);
                        FlashService.Success(res.message);
                    }
                    else
                    {
                        FlashService.Error(res.message);
                    }
                })
        }

        function changePassword() {
            vm.dataLoading = true;
            var data = [];
            data['params'] = 'user_id=' + user_id +
                             '&current_password=' + vm.currentPassword +
                             '&new_password=' + vm.newPassword +
                             '&confirm_new_password=' + vm.confirmNewPassword;
            UserService.changePasswordOfUserById(data)
            .then(function (res) {
                console.log(res);
                vm.dataLoading = false;
                if (res.status == 'success') {
                    $rootScope.globals.currentUser.authentication_token = res.data.authentication_token;
                    AuthenticationService.updateCredentials($rootScope.globals);
                    FlashService.Success(res.message);
                }
                else
                {
                    FlashService.Error(res.message);
                }
            })
        }
    }

})();