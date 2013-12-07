'use strict';

angular.module('islcClientApp')
  .service('commentService', function commentService(Restangular, $sanitize, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getComments: function (options) {
        var newOptions = _.clone(options) || {};

        if (options.filter ) {
          if (options.filter.column && options.filter.text && options.filter.text.length) {
            newOptions['filter:' + options.filter.column] = options.filter.text;
          }

          delete newOptions.filter;

        }

        return Restangular.one('page', options.page || 1).one('limit', options.limit || 50).all('comment').getList(newOptions)
      },

      addComment: function (galleryID, text) {
        var comment = {
          comment: text,
          marked: false
        };

        return Restangular.one('gallery', galleryID).all('comment').post(comment)
      },

      updateComment: function (comment) {
        return Restangular.one('comment', comment.id).put(comment);
      },

      deleteComment: function (galleryID, comment) {
        var deferred = $q.defer();

        Restangular.one('comment', comment.id).get().then(function (res) {
          res.remove().then(function (res) {
            deferred.resolve(res);
          });

        });

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
