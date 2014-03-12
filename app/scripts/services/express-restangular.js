'use strict';

angular.module('islcClientApp')
  .factory('ExpressRestangular', function ExpressRestangular(Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/');
    });
  });
