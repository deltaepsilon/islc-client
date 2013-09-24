'use strict';

describe('Controller: DrawerCtrl', function () {

  // load the controller's module
  beforeEach(module('islcClientApp'));

  var DrawerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DrawerCtrl = $controller('DrawerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
