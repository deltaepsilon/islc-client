'use strict';

describe('Service: Announcementservice', function () {

  // load the service's module
  beforeEach(module('islcClientApp'));

  // instantiate service
  var Announcementservice;
  beforeEach(inject(function (_Announcementservice_) {
    Announcementservice = _Announcementservice_;
  }));

  it('should do something', function () {
    expect(!!Announcementservice).toBe(true);
  });

});
