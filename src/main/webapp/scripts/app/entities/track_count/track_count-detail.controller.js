'use strict';

angular.module('soundxtreamappApp')
    .controller('Track_countDetailController', function ($scope, $rootScope, $stateParams, entity, Track_count, User, Song) {
        $scope.track_count = entity;
        $scope.load = function (id) {
            Track_count.get({id: id}, function(result) {
                $scope.track_count = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:track_countUpdate', function(event, result) {
            $scope.track_count = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
