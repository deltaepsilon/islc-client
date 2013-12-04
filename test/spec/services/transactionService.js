'use strict';

describe('Service: Transactionservice', function () {

  // load the service's module
  beforeEach(module('IslcclientApp'));

  // instantiate service
  var Transactionservice;
  beforeEach(inject(function (_Transactionservice_) {
    Transactionservice = _Transactionservice_;
  }));

  it('should do something', function () {
    expect(!!Transactionservice).toBe(true);
  });

});
