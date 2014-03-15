'use strict';

angular.module('islcClientApp')
  .controller('NavCtrl', function ($scope, $window) {
    $scope.env = $window.envVars;
});
