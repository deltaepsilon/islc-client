'use strict';

describe('Service: Discountservice', function () {

  // load the service's module
  beforeEach(module('IslcclientApp'));

  // instantiate service
  var Discountservice;
  beforeEach(inject(function (_Discountservice_) {
    Discountservice = _Discountservice_;
  }));

  it('should do something', function () {
    expect(!!Discountservice).toBe(true);
  });

});
