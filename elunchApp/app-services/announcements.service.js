(function () {
    'use strict';

    angular
        .module('app')
        .factory('AnnouncementsService', AnnouncementsService);

    AnnouncementsService.$inject = ['$http'];
    function AnnouncementsService($http) {
        var service = {};
        var base_url = 'http://localhost/WebPortal/Development/source/eLunch/';
        var days = 10;
        service.getAnnouncements = getAnnouncements;
        service.postReply = postReply;
        service.getRepliesOfAnnouncement = getRepliesOfAnnouncement;
        service.haveReadRepliesAnnouncement = haveReadRepliesAnnouncement;
        service.haveReadAnnouncement = haveReadAnnouncement;
        return service;

        function getAnnouncements(user_id, current_date) {
            return $http.get(base_url + 'user/'+ user_id + '/announcements?to='+ current_date + "&days=" + days).then(handleSuccess, handleError('Error getting announcements'));
        }

        function postReply(data) {
            console.log(data);
            return $http({
                method: 'POST',
                url: base_url + 'announcement',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error post Reply'));
        }

        function getRepliesOfAnnouncement(user_id, announcement_id) {
            return $http.get(base_url + 'user/'+ user_id + '/announcement/'+ announcement_id).then(handleSuccess, handleError('Error getting announcements'));
        }

        function haveReadRepliesAnnouncement(data) {
            console.log(data);
            return $http({
                method: 'PUT',
                url: base_url + 'read_replies_announcement',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error have read replies announcement'));
        }

        function haveReadAnnouncement(data) {
            console.log(data);
            return $http({
                method: 'PUT',
                url: base_url + 'read_announcement',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error have read replies announcement'));
        }

        // private functions

        function handleSuccess(res) {
            console.log("response: " + res);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
