'use strict';

angular.module('islcClientApp', ['ngRoute', 'ngGrid'])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/galleries', {
        templateUrl: 'views/galleries.html',
        controller: 'GalleriesCtrl',
        resolve: {
          galleries: function (galleryService) {
            var options = {
              page: 1,
              limit: 10,
              sort: 'l.id',
              direction: 'desc'
            }
            return {
              options: options,
              data: galleryService.getGalleries(options)
            };

          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
