'use strict';

angular.module('islcClientApp')
  .service('commentService', function commentService($q, envService, _) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      addComment: function (galleryID, comment) {
        var deferred = $q.defer();
        envService.post('/createComment/' + galleryID, {comment: comment, marked: false}, deferred);
        return deferred.promise;
      },

      updateComment: function (comment) {
        var deferred = $q.defer();
        envService.post('/updateComment/' + comment.id, _.pick(comment, ['marked']), deferred);
        return deferred.promise;
      }
    };
  });
