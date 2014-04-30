'use strict';

angular.module('islcClientApp')
  .controller('EmailCtrl', function ($scope, email, EmailService, _) {
    $scope.email = email;

    $scope.email.$bind($scope, 'email', function () {
      return {
        days: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false
        },
        queue: {}
      }
    });

    $scope.handleDaysChange = function () {
      $scope.email.$save();
    };

    $scope.createEmail = function (email) {
      EmailService.create(email);
    };

    $scope.resetEmail = function () {
      $scope.newEmail = {};
    };

    $scope.deleteEmail = function (id) {
      EmailService.remove(id);
    };

    $scope.copyEmail = function (email) {
      $scope.newEmail = _.clone(email);
    };

    $scope.sendEmail = function (id) {
      EmailService.send(id).then(function (res) {
        console.log('email result', res);
      });
    };

    $scope.calculateSendDate = function (date) {
      var today = moment(),
        date = moment(date),
        i,
        candidate;

      if (date.unix() < today.unix()) {
        return today._d;
      } else if (date.unix() === today.unix()) {
        candidate = today;
        for (i = 1; i <= 7; i += 1) {
          candidate.add('days', 1);
          if (email.days[candidate.isoWeekday()]) {
            return candidate._d;
          }
        }
      }

      return date._d; // Output the raw date object
    };

  });
