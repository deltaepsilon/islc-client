'use strict';

describe('Controller: GalleriesCtrl', function () {

  // load the controller's module
  beforeEach(module('islcClientApp'));

  var GalleriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GalleriesCtrl = $controller('GalleriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
