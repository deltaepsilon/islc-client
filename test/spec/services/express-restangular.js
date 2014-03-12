'use strict';

describe('Service: ExpressRestangular', function () {

  // load the service's module
  beforeEach(module('islcClientApp'));

  // instantiate service
  var ExpressRestangular;
  beforeEach(inject(function (_ExpressRestangular_) {
    ExpressRestangular = _ExpressRestangular_;
  }));

  it('should do something', function () {
    expect(!!ExpressRestangular).toBe(true);
  });

});
