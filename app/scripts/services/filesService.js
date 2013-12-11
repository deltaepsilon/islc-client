'use strict';

angular.module('islcClientApp')
  .service('filesService', function filesService(Restangular) {
    return {
      get: function () {
        return Restangular.all('file').getList();
      },

      secure: function (prefix) {
        return Restangular.one('file', prefix).post();
      }
    };
  });
