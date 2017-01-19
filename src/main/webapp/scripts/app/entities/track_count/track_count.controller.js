'use strict';

angular.module('soundxtreamappApp')
    .controller('Track_countController', function ($scope, $state, Track_count, Track_countSearch, ParseLinks) {

        $scope.track_counts = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 1;
        $scope.loadAll = function() {
            Track_count.query({page: $scope.page - 1, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.totalItems = headers('X-Total-Count');
                $scope.track_counts = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


        $scope.search = function () {
            Track_countSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.track_counts = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.track_count = {
                ip_client: null,
                date_played: null,
                date_expire: null,
                id: null
            };
        };
    });
