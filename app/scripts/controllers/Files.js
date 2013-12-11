'use strict';

angular.module('islcClientApp')
  .controller('FilesCtrl', function ($scope, files, filesService) {
    $scope.files = files;

    $scope.secureFile = function (file) {
      filesService.secure(file);
    };

  });
