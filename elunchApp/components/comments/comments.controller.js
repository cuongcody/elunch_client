(function () {
    'use strict';

    angular
        .module('app')
        .controller('CommentsController', CommentsController);

    CommentsController.$inject = ['CommentsService', 'MenuService' , 'DateService', '$rootScope', '$routeParams', '$filter', 'FlashService'];
    function CommentsController(CommentsService, MenuService, DateService, $rootScope, $routeParams, $filter, FlashService) {
        var vm = this;
        vm.comments = [];
        vm.dishes = [];
        vm.replies = [];
        vm.repliesRead;
        vm.comment_id = null;
        vm.is_more_comments = false;
        vm.isAllCommentsView = true;
        vm.date_get_more_comments;
        vm.loadComments = loadComments;
        vm.changeMealDate = changeMealDate;
        vm.newComment = newComment;
        vm.getDetailComment = getDetailComment;
        vm.postReply = postReply;
        vm.formatDate = formatDate;
        var user_id;
        var current_date;
        initController();

        function initController() {
            user_id = $rootScope.globals.currentUser.id;
            vm.avatar_content_file = $rootScope.globals.currentUser.avatar_content_file;
            current_date = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($rootScope.location.path() != "/comments") {
                getDetailComment($routeParams.id);
            }
            else {
                loadComments(current_date);
            }
        }

        function loadComments(date) {
            vm.dataLoading = true;
            CommentsService.getComments(user_id, date)
                .then(function (res) {
                    vm.dataLoading = false;
                    if (res.status == 'success') {
                        vm.comments.push.apply(vm.comments, res.data.comments);
                        vm.is_more_comments = res.data.is_more_comments;
                        vm.date_get_more_comments = res.data.date_get_more_comments;
                    }
                    else {
                        FlashService.Error(res.message);
                    }
                });
        }

        function newComment() {
            vm.dataLoading = true;
            var data = 'user_id=' + user_id + '&meal_date=' + vm.mealDate + '&title=' + vm.title + '&content=' + vm.content;
            if (vm.dishId != 0) data += '&dish_id=' + vm.dishId;
            CommentsService.postComment(data)
                .then(function (res) {
                    vm.dataLoading = false;
                    if (res.status == 'success') {
                        res.data.number_of_replies = 0;
                        vm.comments.splice(0, 0, res.data);

                        vm.isAllCommentsView = true;
                    }
                    else {
                        FlashService.Error(res.message);
                    }
                });
        }

        function getDetailComment(comment_id) {
            CommentsService.getRepliesOfComment(user_id, comment_id).then(function (res) {
                if (res.status == 'success') {
                    if (res.data.replies.length > 0) {
                        vm.replies = res.data.replies;
                        vm.haveReadRepliesComment = res.data.have_read_replies_comment;
                        readReplies();
                    }
                    else FlashService.Error("This comment doesn't have any replies");
                }
                else {
                    vm.replies = [];
                    FlashService.Error("This comment doesn't have any replies");
                }

            })
        }

        function postReply() {
            vm.dataLoading = true;
            var comment_id = $routeParams.id;
            var data = 'user_id=' + user_id + '&comment_id=' + comment_id + "&content=" + vm.content;
            CommentsService.postReply(data).then(function (res) {
                vm.dataLoading = false;
                if (res.status == 'success') {
                    res.data.email = $rootScope.globals.currentUser.email;
                    res.data.avatar_content_file = vm.avatar_content_file;
                    vm.replies.splice(0, 0, res.data);
                    FlashService.clearFlashMessage();
                }
                else {
                    FlashService.Error(res.message);
                }
            })
        }

        function changeMealDate() {
            var date = $filter('date')(new Date(vm.mealDate), 'yyyy-MM-dd');
            vm.dishes = MenuService.GetMealsByDate(date).then(function (res) {
                if (res.status == 'success') {
                    vm.dishes = res.data[date];
                }
                else {
                    vm.dishes = [];
                }
            })
        }

        function readReplies() {
            var haveReadRepliesCommentArr = vm.haveReadRepliesComment.split(";");
            var NoReadRepliesComment = "";
            angular.forEach(vm.replies, function (value, key) {

                if (haveReadRepliesCommentArr.indexOf(value.id.toString()) == -1) {
                    NoReadRepliesComment += value.id + ";";
                }
            })
            NoReadRepliesComment = NoReadRepliesComment.substr(0, NoReadRepliesComment.length - 1);
            if (NoReadRepliesComment != "") {
                var comment_id = $routeParams.id;
                var data = 'user_id=' + user_id + '&comment_id=' + comment_id + '&reply_ids=' + NoReadRepliesComment;
                CommentsService.haveReadRepliesComment(data).then(function (res) {
                    if (res.status == 'success') {

                    }
                    else {

                    }
                })
            }
        }

        function formatDate(dateString) {
            return DateService.formatDate(dateString);
        }

    }

})();