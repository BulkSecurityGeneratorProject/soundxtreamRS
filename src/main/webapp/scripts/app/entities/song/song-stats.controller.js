/**
 * Created by Xavi on 18/01/2017.
 */
angular.module('soundxtreamappApp')
    .controller('statsSongController', function ($modal,$scope, $rootScope,$stateParams, entity, Track_count) {

        $scope.song = entity;
        $scope.playbackStats = [];

        entity.$promise.then(function(){
            var song = $scope.song.song;
            Track_count.getStatsSong({id: song.id}, function(res){
                console.log(res);
                $scope.playbackStats = res;
            });
        });

    });
