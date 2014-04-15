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

    $scope.showHidden = false;

    $scope.toggleHidden = function () {
      $scope.showHidden = !$scope.showHidden;
    };

    $scope.filterImages = function (images) {
      var showHidden = $scope.showHidden.toString(),
        result = [],
        i = images.length;

      while (i--) {
        if (images[i].Metadata.archive === showHidden || (showHidden === "false" && !images[i].Metadata.archive) ) {
          result.unshift(images[i]);
        }
      }

      return result;
    };

    $scope.upload = function (Flow) {
      imagesService.uploadFlow(Flow).then(refresh).then(function () {
        Flow.files = []; // Clear out upload queue
      });
    };

    $scope.deleteImage = function (key) {
      imagesService.remove(key).then(refresh);
    };

    $scope.archiveImage = function (key, value) {
      value = value ? "true" : "false";
      imagesService.setMetadata(key, {"archive": value}).then(refresh);
    };
  });
