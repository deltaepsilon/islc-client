'use strict';

describe('Directive: qvGalleryViewer', function () {

  // load the directive's module
  beforeEach(module('islcClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<qv-gallery-viewer></qv-gallery-viewer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the qvGalleryViewer directive');
  }));
});
