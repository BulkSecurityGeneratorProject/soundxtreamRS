'use strict';

describe('Controller Tests', function() {

    describe('Track_count Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockTrack_count, MockUser, MockSong;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockTrack_count = jasmine.createSpy('MockTrack_count');
            MockUser = jasmine.createSpy('MockUser');
            MockSong = jasmine.createSpy('MockSong');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Track_count': MockTrack_count,
                'User': MockUser,
                'Song': MockSong
            };
            createController = function() {
                $injector.get('$controller')("Track_countDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'soundxtreamappApp:track_countUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
