'use strict';

angular.module('islcClientApp')
  .controller('GalleriesCtrl', function ($scope, $route) {
    $scope.galleries = $route.current.locals.galleries;
    console.log('galleries', $scope.galleries);

  });
