'use strict';

describe('Service: Filesservice', function () {

  // load the service's module
  beforeEach(module('IslcclientApp'));

  // instantiate service
  var Filesservice;
  beforeEach(inject(function (_Filesservice_) {
    Filesservice = _Filesservice_;
  }));

  it('should do something', function () {
    expect(!!Filesservice).toBe(true);
  });

});
