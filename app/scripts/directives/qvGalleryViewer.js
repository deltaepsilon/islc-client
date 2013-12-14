'use strict';

angular.module('islcClientApp')
  .directive('qvGalleryViewer', function () {
    return {
      templateUrl: '/views/directives/qv-gallery-viewer.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.toggler = function(){};
        if (attrs.close && typeof scope[attrs.close] === 'function') {
          scope.toggler = scope[attrs.close];
        }

      },
      controller: function ($scope, galleryService, commentService, $sanitize) {
        var rotations = ['rotate-90', 'rotate-180', 'rotate-270', 'rotate-0'];

        $scope.addComment = function (gallery, newComment) {
          if (!$scope.newComment || !$scope.newComment.length) {
            return;
          }
          $scope.commentDisabled = true;
          commentService.addComment(gallery.id, newComment).then(function (comment) {
            $scope.commentDisabled = false;
            $scope.newComment = null;
            $scope.gallery.comments.push(comment);
            $scope.gallery = commentService.scrubGalleryComments($scope.gallery);
          });

        };

        $scope.updateComment = function (comment) {
          commentService.updateComment(comment).then(function (updatedComment) {
          });
        };

        $scope.deleteComment = function (galleryID, comment) {
          commentService.deleteComment(galleryID, comment).then(function (data) {
            if (data && data.id && parseInt(data.id, 10) === comment.id) {
              galleryService.get($scope.gallery.id).then(function (gallery) {
                $scope.gallery = $scope.gallery = commentService.scrubGalleryComments(gallery);
              });
            } else {
              alert('delete failed for comment #' + id);
            }
          });
        };

        $scope.zoomImage = function () {
          if ($scope.zoomed) {
            $scope.zoomed = false;
          } else {
            $scope.zoomed = true;
          }

        };

        $scope.rotateImage = function () {
          $scope.rotation = rotations.shift();
          rotations.push($scope.rotation);
        };
      }
    };
  });
