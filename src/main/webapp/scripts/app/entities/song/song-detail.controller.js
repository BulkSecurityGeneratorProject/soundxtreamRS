'use strict';

angular.module('soundxtreamappApp')
    .directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .filter('millSecondsToTimeString', function () {
        return function (millseconds) {
            var oneSecond = 1000;
            var oneMinute = oneSecond * 60;
            var oneHour = oneMinute * 60;
            var oneDay = oneHour * 24;

            var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
            var minutes = Math.floor((millseconds % oneHour) / oneMinute);
            var hours = Math.floor((millseconds % oneDay) / oneHour);
            var days = Math.floor(millseconds / oneDay);

            var timeString = '';

            if (days > 0) {
                timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
            }
            else {
                if (hours > 0) {
                    timeString += (hours !== 1) ? (hours + ' hours ') : (hours + ' hour ');
                } else {
                    if (minutes > 0) {
                        timeString += (minutes !== 1) ? (minutes + ' minutes ') : (minutes + ' minute ');
                    }
                    else {
                        if (seconds !== 0 || millseconds < 1000) {
                            timeString += (seconds !== 1) ? (seconds + ' seconds ') : (seconds + ' second ');
                        }
                    }
                }
            }

            function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
            }

            return timeString;
        };
    }).directive('contenteditable', ['$sce', function ($sce) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                    read(); // initialize
                };

                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$evalAsync(read);
                });

                // Write data to the model
                function read() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    }])
    .controller('SongDetailController', function ($state, $uibModal, toaster, Seguimiento, $window, $modal, $scope, $rootScope, $stateParams, entity, Song, User, Song_user, ParseLinks, Comments, Principal, $timeout) {
        $scope.songDTO = entity;
        $scope.load = function (id) {
            Song.get({id: id}, function (result) {
                $scope.song = result;
            });
        };

        $timeout(function () {
            var textarea = document.querySelector('textarea');
            textarea.addEventListener('keydown', autosize);
        });

        function autosize() {
            var el = this;
            setTimeout(function () {
                el.style.cssText = 'height:auto; padding:0';
                // for box-sizing other than "content-box" use:
                // el.style.cssText = '-moz-box-sizing:content-box';
                el.style.cssText = 'height:' + el.scrollHeight + 'px';
            }, 0);
        }

        $scope.loadedComments = false;

        $scope.getIframeCode = function () {

        }

        $scope.sameUser = false;

        entity.$promise.then(function () {

            // http://172.16.1.124:8080/player/index.html?type=track&theme=light&url=http://172.16.1.124:8080/api/songs/1

            $window.document.title = $scope.songDTO.song.name;

            $scope.songDTO.iframeSrc = "http://" + window.location.hostname + ":" + window.location.port + "/player/index.html?type=track" +
                "&theme=light&mode=full&size=small&url=http://" + window.location.hostname + ":" + window.location.port + "/api/songs/" + $scope.songDTO.song.id;

            User.get({login: $scope.songDTO.song.user.login}, function (res) {
                $scope.songDTO.song.user.totalFollowers = res.totalFollowers;
                $scope.songDTO.song.user.totalFollowings = res.totalFollowings;
                $scope.songDTO.song.user.followedByUser = res.followedByUser;
            });

            Principal.identity().then(function (account) {
                if (account.login == $scope.songDTO.song.user.login) $scope.sameUser = true;
                else $scope.sameUser = false;
            });

            $scope.loadAllComments();
            Song.getPlaylistWithSong({id: $scope.songDTO.song.id}, function (playlists) {
                $scope.playlistWithSong = playlists;
                $scope.loadedPlaylists = true;
            });

        });

        $scope.follow = function (user) {
            $scope.seguimiento = {
                id: null,
                seguidor: null,
                siguiendo: false,
                seguido: null,
                fecha: null
            };
            if ($scope.songDTO.song.user.followedByUser) {
                $scope.seguimiento.siguiendo = false;
            }
            else {
                $scope.seguimiento.siguiendo = true;
            }
            $scope.seguimiento.seguido = user;
            Seguimiento.save($scope.seguimiento, function (res) {
                if (res.siguiendo == true) {
                    $scope.songDTO.song.user.followedByUser = true;
                    $scope.songDTO.song.user.totalFollowers += 1;
                }
                else {
                    $scope.songDTO.song.user.followedByUser = false;
                    $scope.songDTO.song.user.totalFollowers -= 1;
                }
            });
        };

        Principal.identity().then(function (account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.newComment = {
            comment_text: null,
            song: null
        };
        $scope.playlistWithSong = [];
        $scope.comments = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;

        $scope.tags = [];
        $scope.loadedPlaylists = false;

        $timeout(function () {

        },1000);

        $scope.pageComments = 0;

        $scope.loadMoreComments = function (page) {
            $scope.pageComments = page;
            $scope.loadAllComments();
        }

        $scope.loadAllComments = function () {
            Song.getComments({
                id_song: $scope.songDTO.song.id,
                page: $scope.pageComments,
                size: 10,
                sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']
            }, function (result, headers) {
                $scope.linksComments = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {

                    var date = new Date(result[i].date_comment);
                    var currentDate = new Date();
                    var diff = (new Date() - date);

                    result[i].date_comment = diff;

                    $scope.comments.push(result[i]);
                }
                $scope.loadedComments = true;


            });
        };

        $scope.random = function () {
            return 0.5 - Math.random();
        };

        $scope.reset = function () {
            $scope.page = 0;
            $scope.songs = [];
            $scope.loadAllComments();
        };
        $scope.loadPage = function (page) {
            $scope.page = page;
            $scope.loadAllComments();
        };

        $scope.createComment = function () {
            if($scope.newComment.comment_text == ""){
                return;
            }
            $scope.newComment.song = $scope.songDTO.song;
            $scope.newComment.date_comment = new Date();
            $scope.newComment.comment_text = $scope.newComment.comment_text.replace(/\r?\n/g, '<br />');

            Comments.save($scope.newComment, function (result) {
                var date = new Date(result.date_comment);
                var currentDate = new Date();
                var diff = (new Date() - date);
                result.date_comment = diff;

                //ES6
                var arr=$scope.comments;
                arr=[result,...arr];

                $scope.comments = arr;

                $scope.newComment = null;
                toaster.pop('success', $scope.songDTO.song.name, "Your comment was posted");
            });
        };

        var unsubscribe = $rootScope.$on('soundxtreamappApp:songUpdate', function (event, result) {
            $scope.song = result;
        });
        $scope.$on('$destroy', unsubscribe);

        $scope.like = function (id) {
            console.log(id);
            Song_user.addLike({id: id}, {}, successLike);
        };

        $rootScope.$on('soundxtreamappApp:playlistUpdated', function (event, res) {
            console.log(res);
            var exist = false;
            for (var i = 0; i < $scope.playlistWithSong.length; i++) {
                if ($scope.playlistWithSong[i] == res.id) {
                    exist = true;
                }
                if (exist) {
                    return
                }
            }
            if (!exist) {
                $scope.playlistWithSong.push(res);
            }
        });

        var successLike = function (result) {
            $scope.songDTO.liked = result.liked;
            if ($scope.songDTO.liked) {
                $scope.songDTO.totalLikes += 1;
            }
            else {
                $scope.songDTO.totalLikes -= 1;
            }
            if (result.liked == true) {
                toaster.pop('success', "Success", "Track added to your favorites");
            }
            else {
                toaster.pop('success', "Success", "Track removed from your favorites");
            }
        };

        $scope.share = function (id) {
            Song_user.share({id: id}, {}, successShare);
        };

        function successShare(result) {
            $scope.songDTO.shared = result.shared;
            if ($scope.songDTO.shared) {
                $scope.songDTO.totalShares += 1;
            }
            else {
                $scope.songDTO.totalShares -= 1;
            }
            if (result.shared == true) {
                toaster.pop('success', "Success", "Track shared to your followers");
            }
            else {
                toaster.pop('success', "Success", "Track removed from feed");
            }
        }

        //<img style='padding: 10px;' src='"+$scope.songDTO.song.artwork+"' height='100%' width='100%'/>
        $scope.openModal = function () {
            var modalInstance = $modal.open({
                template: "<img style='padding: 10px;' src='" + $scope.songDTO.song.artwork + "' height='100%' width='100%'/><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
                size: "md"
            });
        }

        $scope.showImage = function (image, title) {
            var modalInstance = $modal.open({
                template: '<div><h3 style="padding: 5px;">' + title + '</h3><img src=' + image + ' style="width: 90%; padding: 2.5%;"/></div>',
                size: 'md'
            });
        };

        $scope.addPlaylist = function () {
            $uibModal.open({
                templateUrl: 'scripts/app/entities/song/song-to-playlist.html',
                controller: 'SongToPlaylist',
                size: 'lg',
                resolve: {
                    entity: ['Playlist', function (Playlist) {
                        return Playlist.getPlaylistUserLogged();
                    }],
                    entity_song: ['Song', function (Song) {
                        return $scope.songDTO;
                    }]
                }
            }).result.then(function (result) {
                console.log("then");
                //$state.go('song', null, { reload: true });
            }, function () {
                console.log("nnon");
                //$state.go('song');
            });

            /*$timeout(function(){
             $('.close-modal').click(function(){
             modal.dismiss();
             });
             });*/
        };


    });
