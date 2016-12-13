/**
 * Created by Xavi on 12/12/2016.
 */
'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('search', {
                parent: 'site',
                url: '/search?q={query}',
                data: {
                    authorities: [],
                    pageTitle: "Search"
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/search/search.html',
                        controller: 'SearchController'
                    }
                }
            })
    });
