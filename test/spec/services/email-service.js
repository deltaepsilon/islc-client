'use strict';

describe('Service: EmailService', function () {

  // load the service's module
  beforeEach(module('islcClientApp'));

  // instantiate service
  var EmailService;
  beforeEach(inject(function (_EmailService_) {
    EmailService = _EmailService_;
  }));

  it('should do something', function () {
    expect(!!EmailService).toBe(true);
  });

});
