'use strict';

angular.module('islcClientApp')
  .service('discountService', function discountService(envService, Restangular, _) {

    var cleanDiscount = function (discount) {
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
    };

    return {
      get: function (id) {
        if (id) {
          return Restangular.one('discount', id).get();
        } else {
          return Restangular.all('discount').getList();
        }

      },

      create: function (discount, multiple) {
        if (multiple) {
          discount.multiple = multiple;
        }

        cleanDiscount(discount);
        return Restangular.all('discount').post(discount);
      },

      update: function (discount) {
        cleanDiscount(discount);
        return discount.put();
      },

      remove: function (discount) {
        return discount.remove();
      }
    }
  });
