'use strict';

describe('Service: ImagesService', function () {

  // load the service's module
  beforeEach(module('islcClientApp'));

  // instantiate service
  var ImagesService;
  beforeEach(inject(function (_ImagesService_) {
    ImagesService = _ImagesService_;
  }));

  it('should do something', function () {
    expect(!!ImagesService).toBe(true);
  });

});
