'use strict';

angular.module('islcClientApp')
  .controller('ImagesCtrl', function ($scope, $q, imagesService, images) {
    var refresh = function () {
      return imagesService.get().then(function (images) {
        var deferred = $q.defer();

        $scope.images = images;
        deferred.resolve(images);

        return deferred.promise;

      });
    };

    $scope.images = images;

    $scope.upload = function (Flow) {
      imagesService.uploadFlow(Flow).then(refresh).then(function () {
        Flow.files = []; // Clear out upload queue
      });
    };

    $scope.deleteImage = function (key) {
      imagesService.remove(key).then(refresh);
    };
  });
