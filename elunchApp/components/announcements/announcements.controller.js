(function () {
    'use strict';

    angular
        .module('app')
        .controller('AnnouncementsController', AnnouncementsController);

    AnnouncementsController.$inject = ['AnnouncementsService', 'MenuService' , 'DateService', '$rootScope', '$routeParams', '$filter', 'FlashService'];
    function AnnouncementsController(AnnouncementsService, MenuService, DateService, $rootScope, $routeParams, $filter, FlashService) {
        var vm = this;
        vm.announcements = [];
        vm.dishes = [];
        vm.replies = [];
        vm.repliesRead;
        vm.announcement_id = null;
        vm.is_more_announcements = false;
        vm.date_get_more_announcements;
        vm.loadAnnouncements = loadAnnouncements;
        vm.getDetailAnnouncement = getDetailAnnouncement;
        vm.postReply = postReply;
        vm.formatDate = formatDate;
        var user_id;
        var current_date;
        initController();

        function initController() {
            user_id = $rootScope.globals.currentUser.id;
            vm.avatar_content_file = $rootScope.globals.currentUser.avatar_content_file;
            current_date = $filter('date')(new Date(), 'yyyy-MM-dd');
            if ($rootScope.location.path() != "/announcements") {
                getDetailAnnouncement($routeParams.id);
            }
            else {
                loadAnnouncements(current_date);
            }
        }

        function loadAnnouncements(date) {
            vm.dataLoading = true;
            AnnouncementsService.getAnnouncements(user_id, date)
                .then(function (res) {
                    vm.dataLoading = false;
                    FlashService.clearFlashMessage();
                    if (res.status == 'success') {
                        vm.announcements.push.apply(vm.announcements, res.data.messages);
                        vm.is_more_announcements = res.data.is_more_announcements;
                        vm.date_get_more_announcements = res.data.date_get_more_announcements;
                    }
                    else {
                        FlashService.Error(res.message);
                    }
                });
        }

        function getDetailAnnouncement(announcement_id) {
            AnnouncementsService.getRepliesOfAnnouncement(user_id, announcement_id).then(function (res) {
                if (res.status == 'success') {
                    if (res.data.replies.length > 0) {
                        vm.replies = res.data.replies;
                        vm.haveReadRepliesAnnouncement = res.data.have_read_replies_announcement;
                        readAnnouncement();
                    }
                    else FlashService.Error("This announcement doesn't have any replies");
                }
                else {
                    vm.replies = [];
                    FlashService.Error("This announcement doesn't have any replies");
                }

            })
        }

        function postReply() {
            vm.dataLoading = true;
            var announcement_id = $routeParams.id;
            var data = 'user_id=' + user_id + '&announcement_id=' + announcement_id + "&content=" + vm.content;
            AnnouncementsService.postReply(data).then(function (res) {
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

        function readReplies() {
            var haveReadRepliesAnnouncementArr = vm.haveReadRepliesAnnouncement.split(";");
            var NoReadRepliesAnnouncement = "";
            angular.forEach(vm.replies, function (value, key) {
                if (haveReadRepliesAnnouncementArr.indexOf(value.id.toString()) == -1) {
                    NoReadRepliesAnnouncement += value.id + ";";
                }
            })
            NoReadRepliesAnnouncement = NoReadRepliesAnnouncement.substr(0, NoReadRepliesAnnouncement.length - 1);
            if (NoReadRepliesAnnouncement != "") {
                var announcement_id = $routeParams.id;
                var data = 'user_id=' + user_id + '&announcement_id=' + announcement_id + '&reply_ids=' + NoReadRepliesAnnouncement;
                AnnouncementsService.haveReadRepliesAnnouncement(data).then(function (res) {
                    if (res.status == 'success') {

                    }
                    else {

                    }
                })
            }
        }

        function readAnnouncement() {
            var announcement_id = $routeParams.id;
            var data = 'user_id=' + user_id + '&announcement_id=' + announcement_id;
            AnnouncementsService.haveReadAnnouncement(data).then(function (res) {
                if (res.status = 'success') readReplies();
            })
        }

        function formatDate(dateString) {
            return DateService.formatDate(dateString);
        }

    }

})();