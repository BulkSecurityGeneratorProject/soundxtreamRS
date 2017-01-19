'use strict';

angular.module('soundxtreamappApp')
    .factory('Track_countSearch', function ($resource) {
        return $resource('api/_search/track_counts/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
