'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('track_count', {
                parent: 'entity',
                url: '/track_counts',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.track_count.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/track_count/track_counts.html',
                        controller: 'Track_countController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('track_count');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('track_count.detail', {
                parent: 'entity',
                url: '/track_count/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.track_count.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/track_count/track_count-detail.html',
                        controller: 'Track_countDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('track_count');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Track_count', function($stateParams, Track_count) {
                        return Track_count.get({id : $stateParams.id});
                    }]
                }
            })
            .state('track_count.new', {
                parent: 'track_count',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/track_count/track_count-dialog.html',
                        controller: 'Track_countDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    ip_client: null,
                                    date_played: null,
                                    date_expire: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('track_count', null, { reload: true });
                    }, function() {
                        $state.go('track_count');
                    })
                }]
            })
            .state('track_count.edit', {
                parent: 'track_count',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/track_count/track_count-dialog.html',
                        controller: 'Track_countDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Track_count', function(Track_count) {
                                return Track_count.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('track_count', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('track_count.delete', {
                parent: 'track_count',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/track_count/track_count-delete-dialog.html',
                        controller: 'Track_countDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Track_count', function(Track_count) {
                                return Track_count.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('track_count', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
