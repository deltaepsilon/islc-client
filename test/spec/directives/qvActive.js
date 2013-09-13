'use strict';

describe('Directive: qvActive', function () {

  // load the directive's module
  beforeEach(module('islcClientApp', function ($provide) {
    $provide.value('$location', {url: function () {
      return '/settings';
    }});
  }));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile  ) {
    element = angular.element('<ul qv-active="qv-active-route"><li class="active" qv-active-route="/settings"></li><li class="active" qv-active-route="/write"></li></ul>');
    element = $compile(element)($rootScope);

    $rootScope.$emit('$locationChangeSuccess');
    expect(angular.element(element.children()[0]).hasClass('active')).toBe(true);
    expect(angular.element(element.children()[1]).hasClass('active')).toBe(false);
  }));
});
