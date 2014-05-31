'use strict';

angular.module('islcClientApp')
  .controller('NavCtrl', function ($scope, $window, $location) {
    $scope.env = $window.envVars;
    $scope.tokenRedirect = $scope.env.islc + '/admin/oauth/forward?redirect=' + $location.protocol() + '://' + $location.host();
});
