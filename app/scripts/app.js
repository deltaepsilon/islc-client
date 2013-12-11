'use strict';

angular.module('islcClientApp', ['ui.router', 'ngGrid', 'angular-markdown', 'ngSanitize', 'restangular'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
    var env = window.envVars;

    RestangularProvider.setBaseUrl(env.api);
    RestangularProvider.setDefaultHeaders({authorization: env.authorization});


    if (!env.authorization) {
      alert('Need to auth with server.');
      window.location = env.islc + '/admin/oauth/clients';
    }

    $urlRouterProvider.otherwise('/');


    $stateProvider
      .state('main', {
        url: '/',
        views: {
          body: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('galleries', {
        url: '/galleries',
        views: {
          body: {
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
          }
        }

      })
      .state('comments', {
        url: '/comments',
        views: {
          body: {
            templateUrl: 'views/comments.html',
            controller: 'CommentsCtrl',
            resolve: {
              comments: function (commentService) {
                var options = {
                  page: 1,
                  limit: 10,
                  sort: 'l.id',
                  direction: 'desc'
                }
                return {
                  options: options,
                  data: commentService.getComments(options)
                };

              }
            }
          }
        }

      })
      .state('discounts', {
        url: '/discounts',
        views: {
          body: {
            templateUrl: 'views/discounts.html',
            controller: 'DiscountsCtrl',
            resolve: {
              discounts: function (discountService) {
                return discountService.get();
              }
            }
          }
        }

      })
      .state('transactions', {
        url: '/transactions',
        views: {
          body: {
            templateUrl: 'views/transactions.html',
            controller: 'TransactionsCtrl',
            resolve: {
              transactions: function (transactionService) {
                var options = {
                  page: 1,
                  limit: 10,
                  sort: 'l.id',
                  direction: 'desc'
                }
                return {
                  options: options,
                  data: transactionService.getTransactions(options)
                };
              }
            }
          }
        }

      })
      .state('files', {
        url: '/files',
        views: {
          body: {
            templateUrl: 'views/files.html',
            controller: 'FilesCtrl',
            resolve: {
              files: function (filesService) {
                return filesService.get();
              }
            }
          }
        }

      });

    $locationProvider.html5Mode(true);
  });
