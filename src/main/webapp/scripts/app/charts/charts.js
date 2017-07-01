/**
 * Created by xavi on 01/10/2016.
 */

'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('charts-top', {
                parent: 'site',
                url: '/charts/top',
                data: {
                    authorities: [],
                    pageTitle: 'Song charts'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/charts/charts-song.html',
                        controller: 'ChartsSongController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    top50AllTracks: ['Song',function(Song){
                        return Song.top50AllTracks({});
                    }]
                }
            });
    });
