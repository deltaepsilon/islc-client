'use strict';

angular.module('islcClientApp')
  .service('imagesService', function imagesService($q, ExpressRestangular) {
    var service = {
      get: function () {
        return ExpressRestangular.one('image').get();
      },

      create: function (file, fileReader, size) {
        var formData = new FormData();

        formData.append('file', fileReader.result);
        formData.append('name', file.name);
        formData.append('type', file.type);
        formData.append('size', size);


        return ExpressRestangular.all('image').withHttpConfig({transformRequest: angular.identity}).customPOST(formData, file.name, undefined, {'Content-Type': undefined});
      },

      remove: function (key) {
        return ExpressRestangular.one('image', key).remove();
      },

      setMetadata: function (key, metadata) {
        return ExpressRestangular.one('image', key).post('metadata', metadata);
      },

      uploadFlow: function (Flow) {
        var files = Flow.files,
          i = files.length,
          fileReader,
          deferreds = [],
          deferred,
          handler = function (file, deferred) {
            fileReader.onloadend = function (e) {
              service.create(file, e.target, e.total).then(deferred.resolve, deferred.reject);
            };
          };

        while (i--) {
          deferred = $q.defer();
          deferreds.push(deferred.promise);
          fileReader = new FileReader();
          handler(files[i].file, deferred);
          fileReader.readAsDataURL(files[i].file);

        }

        return $q.all(deferreds);
      }
    }

    return service;

  });
