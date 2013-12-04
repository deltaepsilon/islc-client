'use strict';

angular.module('islcClientApp')
  .directive('qvClickTarget', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var selector = attrs.qvClickTarget,
          body = angular.element(document.body),
          targetClass = attrs.qvClickClass || 'clicked';

        element.on('click', function () {
          body.find(selector).toggleClass(targetClass);
        });
      }
    };
  });
