'use strict';

angular.module('islcClientApp')
  .service('_', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return new _;
  });
