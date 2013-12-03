'use strict';

angular.module('islcClientApp')
  .controller('DiscountsCtrl', function ($scope, discounts, discountService) {
    $scope.filter = {};

    $scope.discounts = discounts;

    $scope.create = function (discount, multiples) {

    };

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
