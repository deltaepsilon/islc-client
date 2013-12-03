'use strict';

angular.module('islcClientApp')
  .controller('DiscountsCtrl', function ($scope, discounts, discountService) {
    $scope.discounts = discounts;

    $scope.updateDiscount = function (discount) {
      discountService.update(discount);
    };
  });
