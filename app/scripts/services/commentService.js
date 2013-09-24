'use strict';

angular.module('islcClientApp')
  .service('commentService', function commentService($q, envService, _, $sanitize) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getComments: function (options) {
        var deferred = $q.defer(),
          query = [],
          page = 1,
          limit = 50,
          url,
          keys,
          key,
          value,
          i;
        if (options) {
          keys = Object.keys(options);
          i = keys.length;
          while (i--) {
            key = keys[i];
            value = options[key];

            if (key === 'page') { // Set page
              page = value;

            } else if (key === 'limit') { // Set limit
              limit = value;

            } else if (key === 'filter') { // Set filter
              if (value && value.column && value.text) {
                query.push('filter:' + value.column + '=' + value.text);
              }

            } else { // Set the rest
              query.push(keys[i] + '=' + options[keys[i]]);
            }

          }

          url = '/getComments/' + page + '/' + limit;
          if (query.length) {
            url += '?' + query.join('&');
          }
        }
        envService.get(url, null, deferred);

        return deferred.promise;
      },

      addComment: function (galleryID, comment) {
        var deferred = $q.defer();
        envService.post('/createComment/' + galleryID, {comment: comment, marked: false}, deferred);
        return deferred.promise;
      },

      updateComment: function (comment) {
        var deferred = $q.defer();
        envService.post('/updateComment/' + comment.id, _.pick(comment, ['comment', 'marked']), deferred);
        return deferred.promise;
      },

      deleteComment: function (id) {
        var deferred = $q.defer();
        envService.get('/deleteComment/' + id, {}, deferred);
        return deferred.promise;
      },

      scrubGalleryComments: function (gallery) {
        var i = gallery.comments.length;

        while (i--) {
          gallery.comments[i].comment = $sanitize(gallery.comments[i].comment);
        }
        return gallery;
      }
    };
  });
