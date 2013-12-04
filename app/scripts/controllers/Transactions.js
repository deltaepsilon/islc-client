'use strict';

angular.module('islcClientApp')
  .controller('TransactionsCtrl', function ($scope, transactions, transactionService) {
    console.log('transactions', transactions);
    $scope.transactions = {
      options: transactions.options,
      data: transactions.data
    };
    $scope.transactions.options.filter = {
      column: 'm.username'
    };

    if (transactions.data.then) {
      $scope.transactions.data = [];

      transactions.data.then(function (res) {
        $scope.transactions.data = res;
      });
    }

    $scope.search = {
      sorts :{
        'l.id': 'Transaction ID',
        'm.created': 'User Created',
        'l.created': 'Transaction Created'
      },
      directions: {
        'desc': 'Descending',
        'asc': 'Ascending'
      },
      filters: {
        'l.id': 'Transaction ID',
        'm.username': 'Username',
        'l.processed': 'Processed'
      }
    }

    $scope.searchTransactions = function (append) {
      $scope.searchDisabled = true;

      if (!append) {
        $scope.transactions.options.page = 1;
      }

      transactionService.getTransactions($scope.transactions.options).then(function (data) {
        if (append) {
          if ($scope.transactions.data.then) { // Sometimes the data is still a promise. This is fine for Angular views, but it wrecks this business
            $scope.transactions.data.then(function (originalData) {
              $scope.transactions.data.items = _.union(originalData.items, data.items);
              $scope.searchDisabled = false;
            });

          } else {
            $scope.transactions.data.items = _.union($scope.transactions.data.items, data.items);
            $scope.searchDisabled = false;

          }

        } else {
          $scope.transactions.data = data;
          $scope.searchDisabled = false;
        }

      }, function (data) {
        console.error('error', data);
        alert('No more transactions found.')
        $scope.searchDisabled = false;
      });
    };

    $scope.getMoreTransactions = function () {
      var page = $scope.transactions.options.page || 1;
      $scope.transactions.options.page = page + 1;
      $scope.searchTransactions(true);
    };

    $scope.setUserFilter = function (user) {
      $scope.transactions.options.filter = {
        column: 'm.username',
        text: user.username
      }
      $scope.searchTransactions();

    };

    $scope.updateTransaction = function (transaction) {
      transactionService.updateTransaction(transaction);
    };

  });
