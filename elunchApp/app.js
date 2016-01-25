(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngAnimate', 'angular.backtop'])
        .directive('handleMenu', function () {
            return {
                link: function (scope, elem, attrs) {
                   // elem.bind('click', function () {
                   //  elem.html('You clicked me!');
                   //  console.log('asdddd');
                   //  });
                    var sideNav = $('.site-nav');
                    console.log($(this));
                    $('.site-menu-toggle').bind('click', function(){
                        sideNav.toggleClass('site-nav-visible');
                    });

                    sideNav.bind('mouseleave', function(){
                        $(this).removeClass('site-nav-visible');
                    });
                  }
            }
        })
        .config(config)
        .run(run)
        .factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
                return {
                    response: function(response){
                        if (response.status === 401) {
                            console.log("Response 401");
                        }
                        return response || $q.when(response);
                    },
                    responseError: function(rejection) {
                        if (rejection.status === 401) {
                            console.log("Response Error 401",rejection);
                            $location.path('/login'));
                        }
                        return $q.reject(rejection);
                    }
                }
            }])
            .config(['$httpProvider',function($httpProvider) {
                //Http Intercpetor to check auth failures for xhr requests
                $httpProvider.interceptors.push('authHttpResponseInterceptor');
            }]);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'components/home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'components/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/user_profile', {
                controller: 'UserController',
                templateUrl: 'components/user_profile/user_profile.view.html',
                controllerAs: 'vm'
            })

            .when('/change_password', {
                controller: 'UserController',
                templateUrl: 'components/user_profile/change_password.view.html',
                controllerAs: 'vm'
            })

            .when('/menu', {
                controller: 'MenuController',
                templateUrl: 'components/menu/menu.view.html',
                controllerAs: 'vm'
            })

            .when('/favourite_dishes', {
                controller: 'FavouriteDishesController',
                templateUrl: 'components/favourite_dishes/favourite_dishes.view.html',
                controllerAs: 'vm'
            })

            .when('/comments', {
                controller: 'CommentsController',
                templateUrl: 'components/comments/comments.view.html',
                controllerAs: 'vm'
            })

            .when('/comment/:id', {
                controller: 'CommentsController',
                templateUrl: 'components/comments/detail_comment.view.html',
                controllerAs: 'vm'
            })

            .when('/announcements', {
                controller: 'AnnouncementsController',
                templateUrl: 'components/announcements/announcements.view.html',
                controllerAs: 'vm'
            })

            .when('/announcement/:id', {
                controller: 'AnnouncementsController',
                templateUrl: 'components/announcements/detail_announcement.view.html',
                controllerAs: 'vm'
            })

            .when('/choose_tables', {
                controller: 'TablesController',
                templateUrl: 'components/tables/choose_tables.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.authentication_token; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            $rootScope.location = $location;
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }

        });
    }

})();