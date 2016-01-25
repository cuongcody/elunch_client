(function () {
    'use strict';

    angular
        .module('app')
        .factory('CommentsService', CommentsService);

    CommentsService.$inject = ['$http'];
    function CommentsService($http) {
        var service = {};
        var base_url = 'http://113.160.225.76:8989/elunch/';
        var days = 10;
        service.getComments = getComments;
        service.postReply = postReply;
        service.postComment = postComment;
        service.getRepliesOfComment = getRepliesOfComment;
        service.haveReadRepliesComment = haveReadRepliesComment;
        return service;

        function getComments(user_id, current_date) {
            return $http.get(base_url + 'user/'+ user_id + '/comments?to='+ current_date + "&days=" + days).then(handleSuccess, handleError('Error getting comments'));
        }

        function postComment(data) {
            console.log(data);
            return $http({
                method: 'POST',
                url: base_url + 'comment',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error login'));
        }

        function postReply(data) {
            console.log(data);
            return $http({
                method: 'POST',
                url: base_url + 'reply',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error post Reply'));
        }

        function getRepliesOfComment(user_id, comment_id) {
            return $http.get(base_url + 'user/'+ user_id + '/comment/'+ comment_id).then(handleSuccess, handleError('Error getting comments'));
        }

        function haveReadRepliesComment(data) {
            console.log(data);
            return $http({
                method: 'PUT',
                url: base_url + 'read_replies_comment',
                data : data,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then( handleSuccess, handleError('Error have read replies comment'));
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
