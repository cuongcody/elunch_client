(function (){
    'use strict';
    angular
        .module('app')
        .directive('detailTable', function($timeout){
            return {
                link: function(scope, elements, attrs) {
                    if ($(window).width() < 767) {
                        scope.$watch('vm.table_clicked', function() {
                            $timeout(function(){
                                var elem = $('.detail-table');
                                $('.table-active').parent().append(elem);
                                $(elem).addClass('animation-fadeIn');
                            });
                        }, true);
                    }
                }
            };
        })
        .controller('TablesController', TablesController);
    TablesController.$inject = ['TablesService', '$rootScope', 'FlashService'];
    function TablesController(TablesService, $rootScope, FlashService) {
        var vm = this;
        var shift_id;
        vm.isTablesNormal = true;
        vm.key = new Date();
        vm.tables = [];
        vm.users = [];
        initTablesController();
        vm.getUsersInTable = getUsersInTable;
        vm.leaveTable = leaveTable;
        vm.joinTable = joinTable;
        vm.selectedTab = selectedTab;
        function initTablesController() {
            $rootScope.title = 'Tables';
            vm.user_id = $rootScope.globals.currentUser.id;
            vm.want_vegan_meal = $rootScope.globals.currentUser.want_vegan_meal;
            shift_id = $rootScope.globals.currentUser.shift_id;
            getTables(shift_id, false);
        }

        function getTables(shift_id, for_vegan) {
            TablesService.getTablesByShift(shift_id, for_vegan).then(function (res) {
                if (res.status == 'success') {
                    vm.tables = res.data;
                    angular.forEach(vm.tables, function (value1, key1) {
                        angular.forEach(value1.users, function (value2, key2) {
                            if (value2.id == vm.user_id) {
                                vm.table_joined = value1;
                            }
                        })
                    })
                }
                else {
                    FlashService.Error(res.message);
                }
            })
        }

        function selectedTab() {
            clearData();
            vm.isTablesNormal = !vm.isTablesNormal;
            if (vm.isTablesNormal) {
                getTables(shift_id, false);
            }
            else if (!vm.isTablesNormal && vm.want_vegan_meal) {
                getTables(shift_id, true);
            }
            else {
                vm.users = [];
                vm.tables = [];
                FlashService.Error("You don't want to eat vegan meals");
            }
        }

        function clearData() {
            vm.table_joined = null;
            vm.table_clicked = null;
            FlashService.clearFlashMessage();
        }

        function getUsersInTable(table) {
            vm.table_clicked = table;
            if (table.users != null) {
                vm.users = table.users;
            }
            else vm.users = [];
            vm.selectedTable = table.id;
        }

        function joinTable(table_id) {
            FlashService.clearFlashMessage();
            var data = 'user_id=' + vm.user_id + '&table_id=' + table_id;
            TablesService.joinTable(data).then(function (res) {
                if (res.status == 'success') {
                   vm.table_joined = vm.table_clicked;
                   var user = {};
                   user.avatar_content_file = $rootScope.globals.currentUser.avatar_content_file;
                   user.first_name = $rootScope.globals.currentUser.first_name;
                   user.id = $rootScope.globals.currentUser.id;
                   vm.users.push(user);
                   updateSeatOnTable(-1);
                }
                else {
                    FlashService.Error(res.message);
                }
            })
        }

        function leaveTable(table_id) {
            FlashService.clearFlashMessage();
            TablesService.leaveTable(vm.user_id, table_id).then(function (res) {
                if (res.status == 'success') {
                    removeUserFromTable(vm.user_id, vm.users);
                    updateSeatOnTable(1);
                    vm.table_joined = null;
                }
                else {
                    FlashService.Error(res.message);
                }
            })
        }

        function removeUserFromTable(user, users_in_table) {
            var index = 0;
            angular.forEach(users_in_table, function (value, key) {
                if (user == value.id) {
                    index = key;
                    users_in_table.splice(key, 1);
                    return 0;
                }
            })
        }

        function updateSeatOnTable(index) {
            angular.forEach(vm.tables, function (value, key){
                if (value == vm.table_clicked) {
                    value.available_seats += index;
                }
            })
        }
    }
})();