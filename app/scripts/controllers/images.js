'use strict';

angular.module('islcClientApp')
  .controller('ImagesCtrl', function ($scope, $q, imagesService, images) {
    var refresh = function () {
      imagesService.get().then(function (images) {
        $scope.image = images;

      });
    };

    $scope.images = images;

    $scope.upload = function (Flow) {
      imagesService.uploadFlow(Flow).then(refresh);
    };

    $scope.deleteImage = function (key) {
      imagesService.remove(key).then(refresh);
    };
  });
