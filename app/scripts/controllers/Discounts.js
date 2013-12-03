'use strict';

angular.module('islcClientApp')
  .controller('DiscountsCtrl', function ($scope, discounts, discountService) {
    $scope.discounts = discounts;

    $scope.updateDiscount = function (discount) {
      discountService.update(discount).then(function (res) {
        var i = $scope.discounts.length;
        while (i--) {
          if ($scope.discounts[i].id === res.id) {
            $scope.discounts[i] = res;
          }
        }
      });
    };
  });
