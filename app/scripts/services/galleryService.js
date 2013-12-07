'use strict';

angular.module('islcClientApp')
  .service('galleryService', function galleryService(Restangular, _) {
    return {
      getGalleries: function (options) {

        var newOptions = _.clone(options) || {};

        if (options.filter ) {
          if (options.filter.column && options.filter.text && options.filter.text.length) {
            newOptions['filter:' + options.filter.column] = options.filter.text;
          }

          delete newOptions.filter;

        }

        return Restangular.one('page', options.page || 1).one('limit', options.limit || 50).all('gallery').getList(newOptions)

      },
      get: function (id) {
        return Restangular.one('gallery', id).get();
      },
      updateGallery: function (gallery) {
        return gallery.put();
      }
    }

  });
