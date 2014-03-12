'use strict';

angular.module('islcClientApp')
  .filter('remove', function () {
    return function (input, filter) {
      var regex = new RegExp(filter, 'g');
      return input.replace(regex, '');
    };
  });
