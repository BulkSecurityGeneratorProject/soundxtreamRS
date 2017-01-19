'use strict';

angular.module('soundxtreamappApp')
	.controller('Track_countDeleteController', function($scope, $uibModalInstance, entity, Track_count) {

        $scope.track_count = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Track_count.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
