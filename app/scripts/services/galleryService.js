'use strict';

angular.module('islcClientApp')
  .service('galleryService', function galleryService($rootScope, $q, envService, _) {
    return {
      getGalleries: function (options) {
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

          url = '/getGalleries/' + page + '/' + limit;
          if (query.length) {
            url += '?' + query.join('&');
          }
        }
        envService.get(url, null, deferred);

        return deferred.promise;
      },
      updateGallery: function (gallery) {
        var deferred = $q.defer();
        gallery.XDEBUG_SESSION_START = 17867;
        envService.post('/updateGallery/' + gallery.id, _.pick(gallery, ['marked', 'XDEBUG_SESSION_START']), deferred);

        return deferred.promise;
      }
    }

  });
