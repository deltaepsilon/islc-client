'use strict';

angular.module('islcClientApp')
  .directive('qvDisable', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function () {
          var selector = attrs.qvDisable,
            body = angular.element(document.body);

          element.on('click', function () {
            body.find(selector).addClass('disabled').attr('disabled', true);

            if (attrs.stopPropagation || attrs.preventDefault) {
              body.find(selector).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
              });

              element.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
              });
            }

          });
        });

      }
    };
  });
