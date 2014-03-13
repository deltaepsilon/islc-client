'use strict';

angular.module('islcClientApp')
  .directive('qvSelectText', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('focus', function (e) {
          $timeout(function () {
            e.target.select();
          });

        });
      }
    };
  });
