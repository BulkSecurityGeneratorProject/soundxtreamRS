'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/',
                data: {
                    authorities: [],
                    pageTitle: 'global.pageTitles.home'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/main/main.html',
                        controller: 'MainController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    tracksApp: ['Song',function(Song){
                        return Song.fifthMostPlayedTracks({});
                    }]
                }
            })
            .state('feed', {
                parent: 'site',
                url: '/feed',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.pageTitles.stream-following'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/main/stream.html',
                        controller: 'StreamController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            });
    });
