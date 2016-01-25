(function () {
    'use strict';
    angular
        .module('app')
        .controller('FavouriteDishesController', FavouriteDishesController)
    FavouriteDishesController.$inject = ['DishesService', '$rootScope', 'FlashService'];
    function FavouriteDishesController(DishesService, $rootScope, FlashService) {
        var vm = this;
        var user_id = null;
        vm.vote_dishes = [];
        vm.dishes = [];
        vm.not_available = false;
        vm.voteForDishes = voteForDishes;
        vm.readyForVote = readyForVote;
        vm.removeVote = removeVote;
        vm.HaveVotedForDishes = false;
        initFavouriteDishesController();

        function initFavouriteDishesController()
        {
            user_id = $rootScope.globals.currentUser.id;
            getDishes();
            getVoteForDish();
        }

        function getDishes() {
            DishesService.GetDishes().then(function (res) {
                console.log(res);
                if (res.status == 'success') {
                    vm.dishes = res.data;
                }
                else {
                    FlashService.Error(res.message);
                    vm.not_available = true;
                }
            })
        }

        function getVoteForDish() {
             DishesService.GetVoteForDishes(user_id).then(function (res) {
                console.log(res);
                if (res.status == 'success') {
                    vm.vote_dishes = res.data;
                }
            })
        }

        function voteForDishes() {
            var data = null;
            var dishes_id = "";
            angular.forEach(vm.vote_dishes, function(value, key){
                if (key == vm.vote_dishes.length -1) dishes_id += value.id;
                else dishes_id += value.id + ";";
            });
            if (dishes_id != ""){
                data = 'user_id=' + user_id + "&dishes_id=" + dishes_id;
                DishesService.voteForDishes(data).then(function (res) {
                    console.log(res);
                    if (res.status == 'success') {
                        FlashService.Success(res.message);
                    }
                    else {
                        FlashService.Error(res.message);
                    }
                })
            }
            else {
                FlashService.Error("Please choose dish to vote");
            }
        }

        function readyForVote(dish) {
            if (vm.vote_dishes.length < 5)
            {
                FlashService.clearFlashMessage();
                var isDishesHaveVoted = false;
                angular.forEach(vm.vote_dishes, function(value, key){
                    if(value.id == dish.id) {
                        console.log('asdsad');
                        isDishesHaveVoted = true;
                    }
                });
                console.log(isDishesHaveVoted);
                if (isDishesHaveVoted == false) vm.vote_dishes.push(dish);
            }
            else
            {
                FlashService.Error("Max vote for dishes is 5");
            }
            // vm.dishVote = {
            //     'background' : 'red'
            // };
        }

        function removeVote(key) {
            vm.vote_dishes.splice(key, 1);
        }
    }
})();