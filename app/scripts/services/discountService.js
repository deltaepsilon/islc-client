'use strict';

angular.module('islcClientApp')
  .service('discountService', function discountService(envService, Restangular) {

    return {
      get: function (id) {
        if (id) {
          return Restangular.one('discount', id).get();
        } else {
          return Restangular.all('discount').getList();
        }


      }
    }
  });
