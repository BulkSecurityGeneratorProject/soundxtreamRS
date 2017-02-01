'use strict';

angular.module('soundxtreamappApp')
    .factory('Track_count', function ($resource, DateUtils) {
        return $resource('api/track_counts/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.date_played = DateUtils.convertDateTimeFromServer(data.date_played);
                    data.date_expire = DateUtils.convertDateTimeFromServer(data.date_expire);
                    return data;
                }
            },
            'update': { method:'PUT' },
            'countPlay': {
                method: 'GET',
                isArray: false,
                url: 'api/playCount/:id'
            },
            'getStatsSong': {
                method: 'GET',
                isArray: true,
                url: 'api/statsPlay/:id'
            },
            'getPlayStatsTracks': {
                method: 'GET',
                isArray: true,
                url: 'api/ps-all-tracks/:id'
            }
        });
    });
