'use strict';

describe('Filter: remove', function () {

  // load the filter's module
  beforeEach(module('islcClientApp'));

  // initialize a new instance of the filter before each test
  var remove;
  beforeEach(inject(function ($filter) {
    remove = $filter('remove');
  }));

  it('should return the input prefixed with "remove filter:"', function () {
    var text = 'angularjs';
    expect(remove(text)).toBe('remove filter: ' + text);
  });

});
