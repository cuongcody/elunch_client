(function (){
    'use strict';
    angular
        .module('app')
        .controller('MenuController', MenuController);
    MenuController.$inject = ['MenuService', '$rootScope', 'FlashService'];
    function MenuController(MenuService, $rootScope, FlashService) {
        var vm = this;
        vm.key = new Date();
        vm.meals = null;
        initMenuController();
        function initMenuController()
        {
            $rootScope.title = 'Menu';
            MenuService.GetMeals().then(function (res) {
                if (res.status == 'success') {
                    vm.meals = res.data;
                }
                else {
                    FlashService.Error(res.message);
                }
            })
        }
    }
})();