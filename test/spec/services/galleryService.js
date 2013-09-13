'use strict';

describe('Service: galleryService', function () {

  // load the service's module
  beforeEach(module('islcClientApp'));

  // instantiate service
  var galleryService;
  beforeEach(inject(function (_galleryService_) {
    galleryService = _galleryService_;
  }));

  it('should do something', function () {
    expect(!!galleryService).toBe(true);
  });

});
