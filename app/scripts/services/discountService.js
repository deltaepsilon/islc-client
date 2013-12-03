'use strict';

angular.module('islcClientApp')
  .service('discountService', function discountService(envService, Restangular, _) {

    return {
      get: function (id) {
        if (id) {
          return Restangular.one('discount', id).get();
        } else {
          return Restangular.all('discount').getList();
        }

      },

      update: function (discount) {
        _.map(['expires', 'uses', 'max_uses', 'value', 'percentage'], function (key) {
          if (discount[key] && typeof discount[key] === 'string') {
            discount[key] = parseFloat(discount[key]);
            if (isNaN(discount[key])) {
              discount[key] = 0;
            }
          }
        });

        if (discount.value) {
          discount.percentage = null;
        }

        if (discount.percentage) {
          discount.percentage = Math.min(discount.percentage, 1);
          discount.percentage = Math.max(discount.percentage, 0);
        }

        return discount.put();
      }
    }
  });
