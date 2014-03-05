'use strict';

angular.module('islcClientApp')
  .service('announcementsService', function announcementsService(envService, $firebase, moment) {
    var getAnnouncementsRef = function () {
      var env = envService.getEnv();

      return $firebase(new Firebase(env.firebase + '/islc/announcements'));
    };

    return {
      get: getAnnouncementsRef,

      create: function (text) {
        return getAnnouncementsRef().$add({ text: text, date: moment().format('YYYY-MM-DD') });
      },

      remove: function (id) {
        return getAnnouncementsRef().$remove(id);
      }
    }
  });
