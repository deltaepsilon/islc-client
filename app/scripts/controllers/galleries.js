'use strict';

angular.module('islcClientApp')
  .controller('GalleriesCtrl', function ($scope, galleryService, commentService, _, galleries) {
    $scope.galleries = {
      options: galleries.options,
      data: galleries.data
    };
    $scope.galleries.options.filter = {
      column: 'm.username'
    };

    if (galleries.data.then) {
      $scope.galleries.data = [];

      galleries.data.then(function (res) {
        $scope.galleries.data = res;
      });
    }


    $scope.search = {
      sorts :{
        'l.id': 'Gallery ID',
        'm.created': 'User Created',
        'l.updated': 'Gallery Updated'
      },
      directions: {
        'desc': 'Descending',
        'asc': 'Ascending'
      },
      filters: {
        'l.id': 'Gallery ID',
        'm.username': 'Username',
        'l.marked': 'Done'
      }
    };




    $scope.searchGalleries = function (append) {
      $scope.searchDisabled = true;

      if (!append) {
        $scope.galleries.options.page = 1;
      }

      galleryService.getGalleries($scope.galleries.options).then(function (data) {
        if (append) {
          if ($scope.galleries.data.then) { // Sometimes the data is still a promise. This is fine for Angular views, but it wrecks this business
            $scope.galleries.data.then(function (originalData) {
              $scope.galleries.data = _.union(originalData, data);
              $scope.searchDisabled = false;
            });

          } else {
            $scope.galleries.data = _.union($scope.galleries.data, data);
            $scope.searchDisabled = false;

          }

        } else {
          $scope.galleries.data = data;
          $scope.searchDisabled = false;
        }

      }, function (data) {
        console.error('error', data);
        alert('No more galleries found.')
        $scope.searchDisabled = false;
      });
    };

    $scope.getMoreGalleries = function () {
      var page = $scope.galleries.options.page || 1;
      $scope.galleries.options.page = page + 1;
      $scope.searchGalleries(true);
    };

    $scope.setUserFilter = function (user) {
      $scope.galleries.options.filter = {
        column: 'm.username',
        text: user.username
      }
      $scope.searchGalleries();

    };

    $scope.updateGallery = function (gallery) {

      galleryService.updateGallery(gallery).then(function (data) {
//        data.title = 'adsfjadsdasfjadslkfajskljas';
//        gallery = data;
//        console.log('data is back', gallery);
      });

    };

    $scope.showGallery = function (gallery) {
      $scope.gallery = commentService.scrubGalleryComments(gallery);
      $scope.toggleGallery(true);
    };

  });
