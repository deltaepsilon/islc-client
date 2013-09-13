'use strict';

angular.module('islcClientApp')
  .service('envService', function EnvService($q, $rootScope, $http, $location) {
    var getEnv = function () {
      var deferred = $q.defer();
      if ($rootScope.env) {
        deferred.resolve($rootScope.env);
      } else {
        $http.get('/env').
          success(function (data) {
            $rootScope.env = data;
            deferred.resolve(data);
          }).
          error(function (data) {
            deferred.reject(data);
          });
      }
      return deferred.promise;
    },
    handleError = function (data) {
      var error = data.data.error,
        forward = function () {
          getEnv().then(function (env) {
            window.location = env.islc + '/admin/oauth/clients';
          });
        };
      switch (error) {
        case 'invalid_grant':
          alert(data.data.error_description);
          forward();
          break;
        case 'access_denied':
          alert(data.data.error_description);
          forward();
          break;
        default:
          console.log('Unhandle API error!', data);
          break;
      }
      console.log('error', error);
    };
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      getEnv: getEnv,
      get: function (path, aDeferred) {
        var deferred = $q.defer(),
          aPromise;
        getEnv().then(function (env) {
          aPromise = $http({method: 'GET', headers: {authorization: env.authorization}, url: env.api + path});
          if (aDeferred) { // Resolve the incoming deferred if present
            aPromise.then(function () {
              aDeferred.resolve(arguments[0].data);

            }, function () {
              handleError(arguments[0]);
              aDeferred.reject(arguments);
            })
          }
          deferred.resolve(aPromise); // Resolve anyway... it'll be nice coverage for non-idiomatic cases

        });
        return deferred.promise;
      }
    }
  });
