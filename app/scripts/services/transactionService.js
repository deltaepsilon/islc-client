'use strict';

angular.module('islcClientApp')
  .service('transactionService', function transactionService(Restangular) {
    return {
      getTransactions: function (options) {
        var newOptions = _.clone(options) || {};

        if (options.filter ) {
          if (options.filter.column && options.filter.text && options.filter.text.length) {
            newOptions['filter:' + options.filter.column] = options.filter.text;
          }

          delete newOptions.filter;

        }

        return Restangular.one('page', options.page || 1).one('limit', options.limit || 50).one('transaction').get(newOptions)
      },

      get: function (id) {
        return Restangular.one('transaction', id).get();
      },

      updateTransaction: function (transaction) {
        return Restangular.one('transaction', transaction.id).put(transaction);
      }
    };
  });
