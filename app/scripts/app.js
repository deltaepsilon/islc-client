'use strict';

angular.module('islcClientApp', ['ngRoute'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/galleries', {
        templateUrl: 'views/galleries.html',
        controller: 'GalleriesCtrl',
        resolve: function () {

        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
