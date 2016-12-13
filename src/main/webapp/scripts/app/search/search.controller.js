/**
 * Created by Xavi on 12/12/2016.
 */
/**
 * Created by Javi on 27/03/2016.
 */
'use strict';

angular.module('soundxtreamappApp')
    .controller('SearchController', function ($scope, $rootScope, $http, $stateParams, $state) {

        $scope.query = $stateParams.q;
        $scope.queryLast = $stateParams.q;
        $scope.results = {};

        if($scope.query != undefined){
            $http({
                method: 'GET',
                url: 'api/_search/'+$scope.query
            }).then(function successCallback(response) {
                $scope.results = response.data;
            }, function errorCallback(response) {});
        }

        $scope.search = function(query){
            $state.go('search',{q: query});
            /*$http({
                method: 'GET',
                url: 'api/_search/'+query
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.results = response.data;
            }, function errorCallback(response) {
            });*/
        }
    });
