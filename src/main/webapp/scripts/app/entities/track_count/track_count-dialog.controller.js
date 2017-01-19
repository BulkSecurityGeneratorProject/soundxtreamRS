'use strict';

angular.module('soundxtreamappApp').controller('Track_countDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Track_count', 'User', 'Song',
        function($scope, $stateParams, $uibModalInstance, entity, Track_count, User, Song) {

        $scope.track_count = entity;
        $scope.users = User.query();
        $scope.songs = Song.query();
        $scope.load = function(id) {
            Track_count.get({id : id}, function(result) {
                $scope.track_count = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:track_countUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.track_count.id != null) {
                Track_count.update($scope.track_count, onSaveSuccess, onSaveError);
            } else {
                Track_count.save($scope.track_count, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForDate_played = {};

        $scope.datePickerForDate_played.status = {
            opened: false
        };

        $scope.datePickerForDate_playedOpen = function($event) {
            $scope.datePickerForDate_played.status.opened = true;
        };
        $scope.datePickerForDate_expire = {};

        $scope.datePickerForDate_expire.status = {
            opened: false
        };

        $scope.datePickerForDate_expireOpen = function($event) {
            $scope.datePickerForDate_expire.status.opened = true;
        };
}]);
