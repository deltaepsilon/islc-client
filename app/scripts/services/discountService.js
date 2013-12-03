'use strict';

angular.module('islcClientApp')
  .service('discountService', function discountService(envService, Restangular) {

    return {
      get: function (id) {
        if (id) {
          return Restangular.one('discount', id).get();
        } else {
          return Restangular.all('discount').getList();
        }

      },

      update: function (discount) {
        if (discount.value) {
          discount.percentage = null;
        }
        if (typeof discount.value === 'string') {
          discount.value = parseFloat(discount.value);
          if (isNaN(discount.value)) {
            discount.value = null;
          }
        }
        if (typeof discount.percentage === 'string') {
          discount.percentage= parseFloat(discount.percentage);
          if (isNaN(discount.percentage)) {
            discount.percentage = null;
          }
        }
        if (discount.percentage) {
          discount.percentage = Math.min(discount.percentage, 1);
          discount.percentage = Math.max(discount.percentage, 0);
        }

        discount.put();
      }
    }
  });
