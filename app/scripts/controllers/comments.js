'use strict';

angular.module('islcClientApp')
  .controller('CommentsCtrl', function ($scope, $route, commentService, galleryService) {
    $scope.comments = $route.current.locals.comments;
    $scope.comments.options.filter = {
      column: 'm.username'
    };

    $scope.search = {
      sorts :{
        'l.id': 'Gallery ID',
        'm.created': 'User Created',
        'l.updated': 'Comment Updated'
      },
      directions: {
        'desc': 'Descending',
        'asc': 'Ascending'
      },
      filters: {
        'l.id': 'Comment ID',
        'm.username': 'Username',
        'l.marked': 'Done'
      }
    }

    $scope.searchComments = function (append) {
      $scope.searchDisabled = true;

      if (!append) {
        $scope.comments.options.page = 1;
      }

      commentService.getComments($scope.comments.options).then(function (data) {
        if (append) {
          if ($scope.comments.data.then) { // Sometimes the data is still a promise. This is fine for Angular views, but it wrecks this business
            $scope.comments.data.then(function (originalData) {
              $scope.comments.data = _.union(originalData, data);
              $scope.searchDisabled = false;
            });

          } else {
            $scope.comments.data = _.union($scope.comments.data, data);
            $scope.searchDisabled = false;

          }

        } else {
          $scope.comments.data = data;
          $scope.searchDisabled = false;
        }

      });
    };

    $scope.getMoreComments = function () {
      var page = $scope.comments.options.page || 1;
      $scope.comments.options.page = page + 1;
      $scope.searchComments(true);
    };

    $scope.setUserFilter = function (user) {
      $scope.comments.options.filter = {
        column: 'm.username',
        text: user.username
      }
      $scope.searchComments();

    };

    $scope.updateComment = function (comment) {

      commentService.updateComment(comment).then(function (data) {
//        data.title = 'adsfjadsdasfjadslkfajskljas';
//        gallery = data;
//        console.log('data is back', gallery);
      });

    };

    $scope.showGallery = function (id) {
      galleryService.getGallery(id).then(function (gallery) {
        $scope.gallery = commentService.scrubGalleryComments(gallery);
        $scope.toggleGallery(true);
      });


    };

  });
