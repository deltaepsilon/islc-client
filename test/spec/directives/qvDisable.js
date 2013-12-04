'use strict';

describe('Directive: qvDisable', function () {

  // load the directive's module
  beforeEach(module('islcClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<qv-disable></qv-disable>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the qvDisable directive');
  }));
});
