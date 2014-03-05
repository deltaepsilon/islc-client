'use strict';

angular.module('islcClientApp')
  .controller('AnnouncementsCtrl', function ($scope, announcements, announcementsService) {

    $scope.announcements = announcements;

    $scope.addAnnouncement = function (announcement) {
      announcementsService.create(announcement);
    };

    $scope.deleteAnnouncement = function (id) {
      announcementsService.remove(id);
    };
  });
