'use strict';

angular.module('islcClientApp')
  .controller('AnnouncementsCtrl', function ($scope, announcements, announcementsService) {

    $scope.announcements = announcements;

    $scope.addAnnouncement = function (text) {
      $scope.newAnnouncement = "";
      announcementsService.create(text);
    };

    $scope.deleteAnnouncement = announcementsService.remove;

    $scope.updateAnnouncement = announcementsService.update;
  });
