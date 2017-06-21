'use strict';

angular.module('soundxtreamappApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope, $injector) {
        return {
            'responseError': function (response) {
                if (!(response.status == 401 && response.data.path.indexOf("/api/account") == 0 )){
	                $rootScope.$emit('soundxtreamappApp.httpError', response);
	            }
                if(response.status == 404){
                    var $state = $injector.get('$state');
                    var to = $rootScope.toState;
                    console.log("ERROR 404");
                    if(to.name == "playlist.detail"){
                        $state.go("error404",{type: "Not found playlist"});
                    }
                }

                return $q.reject(response);
            }
        };
    });
