'use strict';

angular.module('islcClientApp')
  .service('envService', function EnvService($window, $q, $rootScope, $http, Restangular) {



    var getEnv = function () {
      return $window.envVars;
    },
    setRestangular = function (restangular) {
      var env = getEnv();

      restangular = restangular || Restangular;

      console.log('env', env);
      restangular.setBaseUrl(env.api);
      restangular.setDefaultHeaders({authorization: env.authorization});
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
    },
    query = function (method, path, params, aDeferred) {
      var deferred = $q.defer(),
        aPromise,
        env = getEnv();

      aPromise = $http({method: method, params: params || {}, headers: {authorization: env.authorization}, url: env.api + path});
      if (aDeferred) { // Resolve the incoming deferred if present
        aPromise.then(function () {
          aDeferred.resolve(arguments[0].data);

        }, function () {
          handleError(arguments[0]);
          aDeferred.reject(arguments);
        })
      }
      deferred.resolve(aPromise); // Resolve anyway... it'll be nice coverage for non-idiomatic cases

      return deferred.promise;
    };
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      getEnv: getEnv,
      setRestangular: setRestangular,
      get: function (path, params, aDeferred) {
        return query('GET', path, params, aDeferred);
      },
      post: function (path, params, aDeferred) {
        return query('POST', path, params, aDeferred);
      }
    }
  });
