'use strict';
//See http://stackoverflow.com/questions/14561676/angularjs-and-contenteditable-two-way-binding-doesnt-work-as-expected

angular.module('islcClientApp')
  .directive('contenteditable', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var maxLength = parseInt(attrs.ngMaxlength, 10);

        element.on('focus', function () {
          $timeout(function () {
            var selection = window.getSelection(),
              range = document.createRange(),
              el = element[0];

            if (el.firstChild && el.lastChild) {
              range.setStart(el.firstChild, 0);
              range.setEnd(el.lastChild, el.lastChild.length);
              selection.removeAllRanges();
              selection.addRange(range);
            }

          });
        });

        element.on('blur', function () {
          scope.$apply(function () {
            ctrl.$setViewValue(element.html());
          });
        });

        ctrl.$render = function () {
          element.html(ctrl.$viewValue);
        };

        ctrl.$render();

        element.on('keydown', function (e) {
          var esc = e.which === 27,
            ret = e.which === 13,
            del = e.which === 8,
            tab = e.which === 9,
            el = angular.element(e.target);

          if (esc) {
            ctrl.$setViewValue(element.html());
            el.blur();
            e.preventDefault();
          } else if (ret && attrs.oneLine) {
            e.preventDefault();
          } else if (maxLength && el.text().length >= maxLength && !del && !tab) {
            e.preventDefault();
          }

        });

      }
    };
  });
