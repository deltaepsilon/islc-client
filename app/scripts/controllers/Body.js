'use strict';

angular.module('islcClientApp')
  .controller('BodyCtrl', function ($scope) {
    $scope.showDrawer = false;
    $scope.hideDrawer = true;

    $scope.toggleGallery = function (show) {
      if (show === false) {
        $scope.showDrawer = false;
      } else if (show || !!$scope.gallery) {
        $scope.showDrawer = true;
      } else {
        $scope.showDrawer = false;
      }
      $scope.hideDrawer = !$scope.showDrawer;
    };

    $scope.closeGallery = function () {
      $scope.toggleGallery(false);
    }
  });