/**
 * Created by Xavi on 21/06/2017.
 */
'use strict';

angular.module("soundxtreamPlayer", ['ngAnimate', 'ngResource']).controller('PlayerEmbedded', function ($http, $scope, $rootScope, $window) {
        var content;

        $scope.playerPlaying = false;

        $scope.template = "templateTrack.html";

        var host = window.location.host;
        $scope.host = host;

        var audio = document.createElement("audio");

        $scope.playAudio = function () {

            audio.play();
            $scope.playerPlaying = true;

        };

        $scope.pauseAudio = function () {
            audio.pause();
            $scope.playerPlaying = false;
        };

        $scope.track = [];
        $scope.playlist = [];

        //var content = $("#iframe_content");
        content = $("#iframe_content");

        var type = getUrlParameter("type");

        var id = getUrlParameter("id");
        var theme = getUrlParameter("theme");
        var size = getUrlParameter("size");
        var mode = getUrlParameter("mode");

        if (theme != "dark" && theme != "light") {
            theme = "dark";
        }



        var cssLink = document.createElement("link");
        cssLink.href = "theme-" + theme + "-"+ size +".css";
        cssLink.rel = "stylesheet";
        cssLink.type = "text/css";
        document.body.appendChild(cssLink);

        var urlContent = getUrlParameter("url");

        //var baseApi = "http://" + host + "/api";
        var baseApi = urlContent;

        /*switch (type) {
         case "track":
         baseApi = "http://" + host + "/api/songs/"+id;
         break;
         case "playlist":
         baseApi = "http://" + host + "/api/playlists"+id;
         break;
         }*/

        /*var request = $.ajax({
            url: baseApi,
            type: "GET",
            dataType: "json"
        });*/

        $http({
            method: 'GET',
            url: urlContent
        }).then(function successCallback(response) {
            if (type == "playlist") {
                $window.document.title = "Soundxtream: " + response.data.playlist.name;
                $scope.playlist = response.data;
                $scope.template = "templatePlaylist.html";
            }
            else if(type == "track") {
                response.data.song.url = "http://" + host + "/" + response.data.song.url;
                response.data.song.artwork = "http://" + host + "/" + response.data.song.artwork;
                $window.document.title = "Soundxtream: " + response.data.song.name;
                $scope.track = response.data;
                audio.src = $scope.track.song.url;
                bindAudioPlayer();
                if(mode == "artwork"){
                    $scope.template = "templateTrackArtwork.html";
                } else{
                    $scope.template = "templateTrack.html";
                }
            }
            console.log(response.data);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        /*request.done(function (data) {
            if (type == "playlist") {
                $window.document.title = "Soundxtream: " + data.playlist.name;
                $scope.playlist = data;
            }
            else {
                data.song.url = "http://" + host + "/" + data.song.url;
                data.song.artwork = "http://" + host + "/" + data.song.artwork;
                $window.document.title = "Soundxtream: " + data.song.name;
                $scope.track = data;
                audio.src = $scope.track.song.url;
                bindAudioPlayer();
            }
        });

        request.fail(function (jqXHR, textStatus) {
            console.log(jqXHR);
            console.log(textStatus);
        });*/


        function bindAudioPlayer() {
            audio.oncanplay = function () {
                //audio.play();
            }
        }

        function displayTrack(track) {
            console.log(track);

        }

        function displayPlaylist(playlist) {
            console.log(playlist);

        }

        function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }


    function setIframeHeight(iframe) {
        if (iframe) {
            var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
            if (iframeWin.document.body) {
                iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
            }
        }
    };

    });
