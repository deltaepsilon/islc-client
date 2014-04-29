'use strict';

angular.module('islcClientApp')
  .service('EmailService', function EmailService(envService, $firebase, moment, ExpressRestangular) {
    var getEmailRef = function () {
      var env = envService.getEnv();

      return $firebase(new Firebase(env.firebase + '/islc/email'));
    };

    return {
      get: getEmailRef,

      create: function (email) {
        email.created = moment().format('YYYY-MM-DD');
        email.sent = false;
        return getEmailRef().$child('queue').$add(email);
      },

      remove: function (id) {
        return getEmailRef().$child('queue').$child(id).$remove();
      },

      send: function (id) {
        return ExpressRestangular.one('email', id).post();
      }
    }
  });
