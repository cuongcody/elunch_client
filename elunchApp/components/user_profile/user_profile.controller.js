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
        vm.preferencesIds = new Array();
        vm.user = null;
        vm.whatTaste = null;
        vm.isVegan = null;
        vm.updateUser = updateUser;
        vm.changePassword = changePassword;
        vm.getPreferences = getPreferences;
        vm.getPreferencesOfUser = getPreferencesOfUser;
        initController();

        function initController() {
            user_id = $rootScope.globals.currentUser.id;
            loadCurrentUser();
            if (vm.isPreferencesView) {
                getPreferences();
            }
        }

        function loadCurrentUser() {
            UserService.GetById(user_id)
                .then(function (res) {
                    vm.user = res.data;
                    vm.whatTaste = vm.user.what_taste;
                    vm.isVegan = vm.user.want_vegan_meal;
                });
        }

        function getPreferences() {
            UserService.getPreferences()
                .then(function (res) {
                    vm.preferences = res.data;
                    getPreferencesOfUser();
                });
        }

        function getPreferencesOfUser() {
            UserService.getPreferencesOfUser(user_id)
                .then(function (res) {
                    vm.userPreferences = res.data;
                    angular.forEach(vm.preferences, function (value1, key1) {
                        angular.forEach(value1, function (value2, key2) {
                            angular.forEach(vm.userPreferences, function (value3, key3) {
                                angular.forEach(value3, function (value4, key4) {
                                    if (value2.id == value4.id) {
                                        value2.selected = true;
                                    }
                                });
                            });
                        });
                    });
                });
        }

        function updateUser() {
            var selectedPreferences = "";
            angular.forEach(vm.preferences, function (value1, key1) {
                angular.forEach(value1, function (value2, key2) {
                    if (value2.selected == true) {
                        selectedPreferences += value2.id + ';';
                    }
                });
            });
            var lastIndexOfChar = selectedPreferences.lastIndexOf(';');
            if (lastIndexOfChar != -1) selectedPreferences = selectedPreferences.substr(0, lastIndexOfChar);
            vm.dataLoading = true;
            var data = [];
            data['user_id'] = user_id;
            data['params'] = 'want_vegan_meal=' + vm.isVegan;
            UserService.Update(data)
                .then(function (res) {
                    if (res.status == 'success')
                    {
                        $rootScope.globals.currentUser.want_vegan_meal = vm.isVegan;
                        AuthenticationService.updateCredentials($rootScope.globals);
                        var data2 = [];
                        data2['params'] = 'preferences_ids=' + selectedPreferences + '&user_id=' + user_id;
                        UserService.postPreferences(data2)
                            .then(function (res) {
                                vm.dataLoading = false;
                                if (res.status == 'success')
                                {
                                    FlashService.Success(res.message);
                                }
                                else
                                {
                                    FlashService.Error(res.message);
                                }
                            });
                    }
                    else
                    {
                        FlashService.Error(res.message);
                    }
                });

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