'use strict';

angular.module('islcClientApp')
  .controller('AnnouncementsCtrl', function ($scope, announcements, announcementsService) {

    $scope.announcements = announcements;

    $scope.addAnnouncement = announcementsService.create;

    $scope.deleteAnnouncement = announcementsService.remove;

    $scope.updateAnnouncement = announcementsService.update;
  });
