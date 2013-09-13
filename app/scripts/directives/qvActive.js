'use strict';

angular.module('islcClientApp')
  .directive('qvActive', function ($rootScope, $location) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var routeAttributes = attrs.qvActive.split('|'),
          routeAttribute = routeAttributes[0],
          activeClass = routeAttributes[1] || 'active',
          checkActive = function () {
            var url = $location.url(),
              children = element.find('[' + routeAttribute + ']'),
              i = children.length,
              child;

            children.removeClass(activeClass);
            while (i--) {
              child = angular.element(children[i]);
              if (child.attr(routeAttribute) === url) {
                child.addClass(activeClass);
              }
            }

          };

        if (!routeAttribute) {
          return console.error('Route attribute is missing. The form is <div qv-active="route-attribute|active-class"><a route-attribute="/my-route"></a></div>');
        }

        $rootScope.$on('$locationChangeSuccess', checkActive);
      }
    };
  });
