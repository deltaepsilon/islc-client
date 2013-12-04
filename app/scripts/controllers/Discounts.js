'use strict';

angular.module('islcClientApp')
  .controller('DiscountsCtrl', function ($scope, discounts, discountService) {
    $scope.filter = {};
    $scope.multiple = null;

    $scope.discounts = discounts;

    var updateDiscount = function (discount) {
      var i = $scope.discounts.length;
      while (i--) {
        if ($scope.discounts[i].id === discount.id) {
          $scope.discounts[i] = discount;

        }
      }
    };

    $scope.createDiscount = function (discount, multiple) {
      discountService.create(discount, multiple).then(function () {
        discountService.get().then(function (discounts) {
          $scope.discounts = discounts;
        });
      });
    };

    $scope.deleteDiscount = function (discount) {
      discountService.remove(discount).then(function () {
        discountService.get().then(function (discounts) {
          $scope.discounts = discounts;
        });
      });
    }

    $scope.updateDiscount = function (discount) {
      discountService.update(discount).then(updateDiscount);
    };

    $scope.discountFilter = function (row) {
      if (!$scope.filter) {
        return true;
      } else {

        var filter = $scope.filter,
          keys = Object.keys($scope.filter || {}),
          i = keys.length,
          key,
          value;

        while (i--) {
          key = keys[i];
          value = filter[key] ? filter[key].toString().toLowerCase() : null;
          if (value && (!row[key] || !row[key].toString().toLowerCase().match(value))) {
            return false;
          }
        }

      }

      return true;
    }
  });
