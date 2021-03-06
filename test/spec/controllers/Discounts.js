'use strict';

describe('Controller: DiscountsCtrl', function () {

  // load the controller's module
  beforeEach(module('islcClientApp'));

  var DiscountsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscountsCtrl = $controller('DiscountsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
