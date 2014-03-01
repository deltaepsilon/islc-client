'use strict';

angular.module('islcClientApp')
  .service('announcementsService', function announcementsService(envService, $firebase) {
    return {
      get: function () {
        var env = envService.getEnv();

        return $firebase(new Firebase(env.firebase + '/islc/announcements'));
      }
    }
  });
