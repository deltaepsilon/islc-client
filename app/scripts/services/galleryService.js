'use strict';

angular.module('islcClientApp')
  .service('galleryService', function galleryService($rootScope, $q, $http, envService) {
    return {
      getGalleries: function () {
        var deferred = $q.defer();
        envService.get('/getGalleries', deferred);

        return deferred.promise;
      }
    }

  });
