'use strict';

angular.module('islcClientApp')
  .controller('DiscountsCtrl', function ($scope, env, discounts) {
    $scope.discounts = discounts;

  });
