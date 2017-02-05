/**
 * Created by Xavi on 18/01/2017.
 */
angular.module('soundxtreamappApp')
    .controller('statsSongController', function ($timeout, NgMap, $http, $modal, $window, $state, $scope, $rootScope, $stateParams, entity, Track_count, Chart, Song_user, Principal, $injector) {

        /*MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_
         = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';*/

        $scope.song = entity;
        $scope.playbackStats = [];
        var user;

        $scope.mapStyle = [{"featureType":"water","elementType":"all","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#83cead"},{"saturation":1},{"lightness":-15},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#f3f4f4"},{"saturation":-84},{"lightness":59},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-35},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-22},{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"hue":"#d7e4e4"},{"saturation":-60},{"lightness":23},{"visibility":"on"}]}];

        $scope.statsForMap = [];
        $scope.statsForMapCountry = [];
        $scope.statsMapCity = [];
        $scope.map = null;
        $scope.mapCountry;

        /*var heatmap;
         heatmap = $scope.map.heatmapLayers.foo;
         heatmap.set('radius', heatmap.get('radius') ? null : 10);*/



        NgMap.getMap('citymap').then(function (map) {
        });


        $scope.customIcon = {
            "scaledSize": [32, 32],
            "url": "assets/images/icon-play.png"
        };

        var markerIcons = [{
            url: 'assets/images/icon-play.png',
            width: 36,
            height: 36,
            textColor: '#ffffff',
            anchorText: [5, 0],
            backgroundPosition: "3px 0px",
            textSize: 13
        }, {
            url: 'assets/images/icon-play-plus.png',
            width: 36,
            height: 36,
            textColor: '#ffffff',
            anchorText: [5, 0],
            backgroundPosition: "3px 0px",
            textSize: 13
        }, {
            url: 'assets/images/icon-play-plus-2x.png',
            width: 36,
            height: 36,
            textColor: '#ffffff',
            anchorText: [5, 0],
            backgroundPosition: "3px 0px",
            textSize: 13
        }];

        $scope.dataTracks = [];
        $scope.countryMarkers = [];

        $scope.changeGradient = function () {
            var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        }

        var today = new Date();
        var pastDaysTimestamp = new Date().setDate(today.getDate() - 30);
        var pastDays = new Date(pastDaysTimestamp);
        $scope.dynMarkers = [];

        function loadCharts() {
            // GET STATS SONG CURRENTLY
            Track_count.getStatsSong({id: $scope.song.song.id}, function (trackStats) {
                $scope.playbackStats = trackStats;
                var dest = [];
                var datestr = '';

                var index = getIndex(trackStats, 'playedDate');

                if (trackStats.length) {
                    $scope.psOptions = angular.copy(Chart.getPsChartConfig());
                    $scope.psOptions.chart.type = "lineChart";
                    $scope.psOptions.title.text = "Number of plays since upload";

                    var first = new Date($scope.song.song.date_posted);
                    var last = new Date();

                    for (var d = first; d.getTime() <= last.getTime(); d.setDate(d.getDate() + 1)) {
                        datestr = dateToYMD(d);
                        if (index[datestr]) {
                            dest.push(index[datestr]);
                        } else {
                            dest.push(createDefault(datestr));
                        }
                    }

                    var min = trackStats[0].playedDate;
                    var max = trackStats[trackStats.length - 1].playedDate;

                    $scope.psOptions.chart.xDomain = [];
                    $scope.psOptions.chart.xDomain[1] = new Date(max);
                    $scope.psOptions.chart.xDomain[0] = new Date(min);
                    var psStats;
                    psStats = [];
                    dest.forEach(function (item) {
                        psStats.push({
                            x: new Date(item.playedDate),
                            y: item.countPlays
                        });
                    });
                    $scope.psData = [{
                        values: psStats,
                        key: "Stats",
                        color: "#f50"
                    }];
                }
            });

            // GET STATS W/O SONG AND COMPARE WITH
            Track_count.getPlayStatsTracks({id: $scope.song.song.id}, function (psAllTracks) {
                var dest = [];
                var datestr = '';
                if (psAllTracks.length) {

                    $scope.likesOptions = angular.copy(Chart.getPsChartConfig());
                    $scope.likesOptions.title.text = "Comparison all tracks w/ this track past 30 days"
                    $scope.likesOptions.chart.type = "lineChart";

                    var min = psAllTracks[0].playedDate;
                    var max = psAllTracks[psAllTracks.length - 1].playedDate;

                    var first = new Date(min);
                    var last = new Date();

                    var index = getIndex(psAllTracks, 'playedDate');

                    for (var d = pastDays; d.getTime() <= last.getTime(); d.setDate(d.getDate() + 1)) {
                        datestr = dateToYMD(d);
                        if (index[datestr]) {
                            dest.push(index[datestr]);
                        } else {
                            dest.push(createDefault(datestr));
                        }
                    }

                    min = psAllTracks[0].playedDate;
                    max = psAllTracks[psAllTracks.length - 1].playedDate;

                    $scope.likesOptions.chart.xDomain = [];
                    $scope.likesOptions.chart.xDomain[0] = new Date(pastDaysTimestamp);
                    $scope.likesOptions.chart.xDomain[1] = new Date(max);

                    var stats, songStats;
                    stats = [], songStats = [];
                    dest.forEach(function (item) {
                        stats.push({
                            x: new Date(item.playedDate),
                            y: item.countPlays
                        });
                    });
                    $scope.playbackStats.forEach(function (item) {
                        songStats.push({
                            x: new Date(item.playedDate),
                            y: item.countPlays
                        });
                    });
                    $scope.playTracksData = [{
                        values: stats,
                        key: "All your tracks",
                        color: "#0084ff"
                    }, {
                        values: songStats,
                        key: $scope.song.song.name,
                        color: "#f50"
                    }];
                }
            });
        }

        entity.$promise.then(function (res) {
            $window.document.title = "Stats " + res.name;

            Principal.identity().then(function (account) {
                if (account.login != res.song.user.login) {
                    $state.go('accessdenied');
                }
                else {
                    loadCharts();
                }
            });

            $http({
                method: 'GET',
                url: 'api/stats/song/' + res.song.id
            }).then(function successCallback(response) {
                $scope.statsForMap = response.data;
                NgMap.getMap('playmap').then(function (map) {
                    $scope.map = map;
                    $scope.statsForMap.forEach(function (item) {
                        var latLng = new google.maps.LatLng(item.latitude, item.longitude);
                        $scope.dynMarkers.push(new google.maps.Marker({position: latLng}));
                    });
                    var markers = $scope.dynMarkers.map(function (location, i) {
                        return new google.maps.Marker({
                            position: location.position
                        });
                    });
                    $scope.markerClusterer = new MarkerClusterer(map, markers, {
                        styles: markerIcons
                    });
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < markers.length; i++) {
                        bounds.extend(markers[i].getPosition());
                    }
                    map.fitBounds(bounds);
                });
            });

            $http({
                method: 'GET',
                url: 'api/stats/song/country/' + res.song.id
            }).then(function successCallback(response) {
                $scope.statsForMapCountry = response.data;

                NgMap.getMap('countrymap').then(function (map) {
                    $scope.mapCountry = map;

                    $scope.statsForMapCountry.forEach(function (item) {
                        setCountryToSelect(item[1], item[0]);
                    });

                });

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http({
                method: 'GET',
                url: 'api/stats/song/city/' + res.song.id
            }).then(function successCallback(response) {
                $scope.statsMapCity = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        });

        function createDefault(datestr) {
            return {playedDate: datestr, countPlays: 0};
        }

        function getIndex(srcArray, field) {
            var i, l, index;
            index = {};
            for (i = 0, l = srcArray.length; i < l; i++) {
                index[srcArray[i][field]] = srcArray[i];
            }
            return index;
        }

        var geocoder = new google.maps.Geocoder();

        function setCountryToSelect(countryToSelect, numPlays) {
            geocoder.geocode( { 'address': countryToSelect}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.mapCountry.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: $scope.mapCountry,
                        position: results[0].geometry.location,
                        label: ""+numPlays
                    });
                } else {
                    alert("Error: " + status);
                }
            });
        }

        function dateToYMD(date) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
        }

    });
