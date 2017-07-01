/**
 * Created by xavipandis on 28/3/16.
 */
angular.module('soundxtreamappApp')
    .controller('playerPlaylistController', ['$scope','Principal','$rootScope','Song','Auth','$state',
        '$cookies', '$http', '$q', '$cookies', 'Track_count',
        function ($scope,Principal,$rootScope,Song,Auth,$state,$cookies, $http, $q, $cookies, Track_count) {

            $('.mdi').click(function(){
                console.log($scope.mediaPlayer);
                if($scope.mediaPlayer.playing){

                    $scope.mediaPlayer.pause();
                    console.log("playing");
                    //$('div').addClass('class2', 1000);
                }
                else{
                    $scope.mediaPlayer.play();
                    console.log("not playing");
                }
            });



            var audioElemGlob = {};

            var volumeCookie = $cookies.get("volume");

            var myEl = $('.volume-button' );

            var opened = false;

            myEl.click(function (event) {

                if(opened){
                    $('#volume-slider').animate({
                        height: "0px"
                    })
                    opened = false;
                }else{
                    $('#volume-slider').animate({
                        height: "120px"
                    })
                    opened = true;
                }
                event.stopPropagation()
            });

            $('.ui-slider-handle').draggable();

            $(window).click(function(event){
                var target = $(event.target);
                if(target.not('.volume-button') && target.not('.volume-button') && target.not('#volume-slider')){
                    $('#volume-slider').animate({
                        height: "0px"
                    })
                    opened = false;
                }
            })

            $("#volume").slider({
                orientation: "vertical",
                min: 0,
                max: 100,
                value: 0,
                range: "min",
                create: function() {
                    if(volumeCookie == undefined){
                        $( this ).slider( "value", 100 );
                        mediaPlayer.volume = 1;
                    }
                    else{
                        $( this ).slider( "value", volumeCookie );
                        mediaPlayer.volume = volumeCookie / 100;
                    }
                },
                slide: function(event, ui) {
                    mediaPlayer.volume = ui.value / 100;
                    $cookies.put("volume",ui.value);
                }
            });

            this.audioPlaylist = [];

            var playlistCollection = [];

            this.numberPlaylist = 0;

            this.playlistCurrent = null;
            Principal.identity().then(function(account) {
                $rootScope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });

            $scope.logout = function () {
                Auth.logout();
                $rootScope.account = {};
                $state.go('login');
            }

            this.showPlaylist = false;

            this.addSongAll = function (audioElements,mediaPlayer,indexSong,playingFrom) {
                var audioPlaylist = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < audioElements.length;k++){
                    var audioElement = audioElements[k].song;

                    var song = {
                        artist: audioElement.user.nickname,
                        artist_access: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };

                    audioPlaylist.push(angular.copy(song));

                }

                this.audioPlaylist = audioPlaylist;

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);

            };



            $rootScope.$on("next-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            $rootScope.$on("prev-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            $rootScope.$on("play-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            function countPlay(audioElements, index) {
                var id = audioElements[index].song.id;
                Track_count.countPlay({id: id});
            }

            this.addSong = function (audioElement,mediaPlayer) {
                this.audioPlaylist = [];
                var song = {
                    artist: audioElement.user.nickname,
                    artist_access: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id,
                    access_url: audioElement.access_url
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.addSongAndPlay = function(audioElement,mediaPlayer){
                var songWave = audioElement;
                var song = {
                    artist: audioElement.user.nickname,
                    artist_access: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id,
                    access_url: audioElement.access_url
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    settings.media = songWave.url;
                    initializeAudio();

                    var song = {};
                }, 200);
            };

            this.playPauseSong = function(mediaPlayer){
                mediaPlayer.playPause();
            };

            this.addSongs = function(playlist){
                var audioElement = {};
                var songs = {};

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.nickname,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;
            };

            this.addSongsAndPlay = function(playlist,mediaPlayer,playingFrom){
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.nickname,
                        artist_access: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.playTrackFromPlaylist = function(playlist,mediaPlayer,indexSong,playingFrom){
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;
                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.nickname,
                        artist_access: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);
            };

            this.removeSong = function (index) {
                this.audioPlaylist.splice(index, 1);
            };

            this.dropSong = function (audioElement, index) {
                this.audioPlaylist.splice(index, 0, angular.copy(audioElement));
            };

            this.getSongImage = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].image;
                }
            };

            this.getSongAccess = function(currentTrack){
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].access_url;
                }
            };

            this.getSongArtist = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].artist;
                }
            };

            this.getArtistAccess = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].artist_access;
                }
            };

            this.getSongName = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].title;
                }
            };

            this.getSongId = function(currentTrack){
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].id;
                }
            };

            this.seekPercentage = function ($event) {
                var percentage = ($event.offsetX / $event.target.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            this.seek = function(event){
                var percentage = (event.offsetX / event.currentTarget.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            var timeDrag = false; /* Drag status */
            $('.timeline').mousedown(function (e) {
                timeDrag = true;
                if(timeDrag){
                    seekDrag(e);
                }
            });

            $('.timeline').click(function(e){
                seekDrag(e);
            });

            $(document).mouseup(function (e) {
                if (timeDrag) {
                    $scope.mediaPlayer.seek($scope.mediaPlayer.duration * percentage);
                    $scope.mediaPlayer.currentTime = timeSeekedSeconds;
                    timeDrag = false;
                }
            });

            $(document).mousemove(function (e) {
                if (timeDrag) {
                    e.preventDefault();

                    var pointer = $('.timeline-pointer');

                    if(parseInt(pointer.css("left")) <= 0 ){
                        pointer.css("left","0px");
                        return false;
                    }

                    seekDrag(e);
                }
            });
            $('.timeline').mousemove(function (e) {
                if (timeDrag) {
                    //e.preventDefault();
                    seekDrag(e);
                }
            });
            $(document).mouseleave(function(){
                if (timeDrag) {
                    timeDrag = false;
                }
            });

            var percentage = 0;

            function seekDrag(e){
                var offsetTimeline = $('.timeline-current').offset().left;
                var width = $('.timeline-full').width();
                var pointer = $('.timeline-pointer');

                if(parseInt($('.timeline-current').width()) < parseInt(width)){
                    pointer.css("left", (e.pageX - offsetTimeline));
                    $('.timeline-current').css("width", (e.pageX - offsetTimeline));
                }
                else{
                    pointer.css("left", (width));
                    $('.timeline-current').css("width", width);
                }

                if(parseInt($('.timeline-current').width()) < 0 ){
                    $('.timeline-current').css("width","0px");
                }

                percentage = ((e.pageX - offsetTimeline) / width);
                if(percentage > 1.0){
                    percentage = 0;
                }
                if(percentage < 0){
                    percentage = 0;
                }

                var timeSeeked = Math.floor($scope.mediaPlayer.duration * percentage);
                timeSeekedSeconds = $scope.mediaPlayer.duration * percentage;
                $('.current-time span').html($scope.mediaPlayer.$formatTime(timeSeeked));
            }

            var timeSeekedSeconds = 0;

            $scope.$watch("mediaPlayer", function(value){
                var $domEl = $scope.mediaPlayer.$domEl;
                $($domEl).bind("timeupdate",function(){
                    var $currentTimeBar = $('.timeline-current');
                    var $currentPointer = $('.timeline-pointer');
                    var $percentage = $scope.mediaPlayer.currentTime*100/$scope.mediaPlayer.duration + "%";
                    if(!timeDrag){
                        if($percentage <= 0){
                            $percentage = 0;
                        }
                        $currentTimeBar.width($percentage);
                        $currentPointer.css("left",$percentage);
                        $('.current-time span').html($scope.mediaPlayer.$formatTime($scope.mediaPlayer.currentTime));
                    }
                });
            });
    }]);
