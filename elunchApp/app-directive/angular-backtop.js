var backtop = angular.module('angular.backtop', []);

backtop.directive('backTop', function(){

    return {
        restrict: 'E'
        , replace: true
        , template: '<a href="javascript:void(0);" id="to-top" style="display: block;"><i class="fa fa-angle-up"></i></a>'
        , link: function($scope, element, attrs) {

            $(window).scroll(function(){

                if ($(window).scrollTop() <= 0) {
                    $(element).fadeOut();
                }
                else {
                    $(element).fadeIn();
                }

            });

            $(element).on('click', function(){
                $('html, body').animate({ scrollTop: 0 }, 'slow');
            });

        }
    }

});