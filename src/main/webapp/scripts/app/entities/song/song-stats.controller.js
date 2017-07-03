/**
 * Created by Xavi on 18/01/2017.
 */
angular.module('soundxtreamappApp')
    .directive('soundxtreamSingleChart', function () {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: function (scope, element) {
                scope.$watch('options', function(newVal) {
                    if (newVal) {
                        Highcharts.chart(element[0], scope.options);

                        Highcharts.theme = {
                            colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                                '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                            chart: {
                                backgroundColor: {
                                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                    stops: [
                                        [0, '#2a2a2b'],
                                        [1, '#3e3e40']
                                    ]
                                },
                                style: {
                                    fontFamily: '\'Unica One\', sans-serif'
                                },
                                plotBorderColor: '#606063'
                            },
                            title: {
                                style: {
                                    color: '#E0E0E3',
                                    textTransform: 'uppercase',
                                    fontSize: '20px'
                                }
                            },
                            subtitle: {
                                style: {
                                    color: '#E0E0E3',
                                    textTransform: 'uppercase'
                                }
                            },
                            xAxis: {
                                gridLineColor: '#707073',
                                labels: {
                                    style: {
                                        color: '#E0E0E3'
                                    }
                                },
                                lineColor: '#707073',
                                minorGridLineColor: '#505053',
                                tickColor: '#707073',
                                title: {
                                    style: {
                                        color: '#A0A0A3'

                                    }
                                }
                            },
                            yAxis: {
                                gridLineColor: '#707073',
                                labels: {
                                    style: {
                                        color: '#E0E0E3'
                                    }
                                },
                                lineColor: '#707073',
                                minorGridLineColor: '#505053',
                                tickColor: '#707073',
                                tickWidth: 1,
                                title: {
                                    style: {
                                        color: '#A0A0A3'
                                    }
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                style: {
                                    color: '#F0F0F0'
                                }
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        color: '#B0B0B3'
                                    },
                                    marker: {
                                        lineColor: '#333'
                                    }
                                },
                                boxplot: {
                                    fillColor: '#505053'
                                },
                                candlestick: {
                                    lineColor: 'white'
                                },
                                errorbar: {
                                    color: 'white'
                                }
                            },
                            legend: {
                                itemStyle: {
                                    color: '#E0E0E3'
                                },
                                itemHoverStyle: {
                                    color: '#FFF'
                                },
                                itemHiddenStyle: {
                                    color: '#606063'
                                }
                            },
                            credits: {
                                style: {
                                    color: '#666'
                                }
                            },
                            labels: {
                                style: {
                                    color: '#707073'
                                }
                            },

                            drilldown: {
                                activeAxisLabelStyle: {
                                    color: '#F0F0F3'
                                },
                                activeDataLabelStyle: {
                                    color: '#F0F0F3'
                                }
                            },

                            navigation: {
                                buttonOptions: {
                                    symbolStroke: '#DDDDDD',
                                    theme: {
                                        fill: '#505053'
                                    }
                                }
                            },

                            // scroll charts
                            rangeSelector: {
                                buttonTheme: {
                                    fill: '#505053',
                                    stroke: '#000000',
                                    style: {
                                        color: '#CCC'
                                    },
                                    states: {
                                        hover: {
                                            fill: '#707073',
                                            stroke: '#000000',
                                            style: {
                                                color: 'white'
                                            }
                                        },
                                        select: {
                                            fill: '#000003',
                                            stroke: '#000000',
                                            style: {
                                                color: 'white'
                                            }
                                        }
                                    }
                                },
                                inputBoxBorderColor: '#505053',
                                inputStyle: {
                                    backgroundColor: '#333',
                                    color: 'silver'
                                },
                                labelStyle: {
                                    color: 'silver'
                                }
                            },

                            navigator: {
                                handles: {
                                    backgroundColor: '#666',
                                    borderColor: '#AAA'
                                },
                                outlineColor: '#CCC',
                                maskFill: 'rgba(255,255,255,0.1)',
                                series: {
                                    color: '#7798BF',
                                    lineColor: '#A6C7ED'
                                },
                                xAxis: {
                                    gridLineColor: '#505053'
                                }
                            },

                            scrollbar: {
                                barBackgroundColor: '#808083',
                                barBorderColor: '#808083',
                                buttonArrowColor: '#CCC',
                                buttonBackgroundColor: '#606063',
                                buttonBorderColor: '#606063',
                                rifleColor: '#FFF',
                                trackBackgroundColor: '#404043',
                                trackBorderColor: '#404043'
                            },

                            // special colors for some of the
                            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                            background2: '#505053',
                            dataLabelsColor: '#B0B0B3',
                            textColor: '#C0C0C0',
                            contrastTextColor: '#F0F0F3',
                            maskColor: 'rgba(255,255,255,0.3)'
                        };

                        Highcharts.setOptions(Highcharts.theme);
                    }
                }, true);


            }
        };
    })
    .directive('soundxtreamMultipleChart', function () {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: function (scope, element) {
                scope.$watch('options', function(newVal) {
                    if (newVal) {
                        Highcharts.chart(element[0], scope.options);
                    }
                }, true);
            }
        };
    })
    .controller('statsSongController', function ($timeout, NgMap, $http, $modal, $window, $state, $scope, $rootScope, $stateParams, entity, Track_count, Chart, Song_user, Principal, $injector) {

        /*MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_
         = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';*/

        var dataTrack = [];
        var dataAllTracks = [];

        $scope.chartOptions = {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: document.ontouchstart === undefined ? 'Click and drag in the area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Plays'
                },
                showLastLabel:false
            },
            legend: {
                enabled: false
            },

            plotOptions: {

            },

            series: [{
                name: 'Number of plays',
                data: dataTrack
            }]

        };

        $scope.chartOptions2 = {
            title: {
                text: 'This track vs all your tracks'
            },

            yAxis: {
                title: {
                    text: 'Plays'
                },
                showLastLabel:false
            },
            xAxis: {
                type: 'datetime'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    pointStart: 2010
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            series: [{
                name: "",
                data: dataTrack
            }, {
                name: 'Rest of all your tracks',
                data: dataAllTracks
            }]
        }

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

        function loadHighCharts(){
            Track_count.getStatsSong({id: $scope.song.song.id}, function (trackStats) {
                trackStats.forEach(function(stat){
                    var data = [];
                    data.push(Date.parse(stat.playedDate));
                    data.push(stat.countPlays);
                    dataTrack.push(data);
                });
                $scope.chartOptions.title.text = "Play stats since upload of " + $scope.song.song.name;
            });



            Track_count.getPlayStatsTracks({id: $scope.song.song.id}, function (psAllTracks) {
                psAllTracks.forEach(function(stat){
                    var data = [];
                    data.push(Date.parse(stat.playedDate));
                    data.push(stat.countPlays);
                    dataAllTracks.push(data);
                    $scope.chartOptions2.series[0].name = $scope.song.song.name;
                });
            });
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
                    $scope.psOptions.chart.xDomain[1] = max;
                    $scope.psOptions.chart.xDomain[0] = min;
                    var psStats;
                    psStats = [];
                    dest.forEach(function (item) {
                        psStats.push({
                            x: item.playedDate,
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
                            x: item.playedDate,
                            y: item.countPlays
                        });
                    });
                    $scope.playbackStats.forEach(function (item) {
                        songStats.push({
                            x: item.playedDate,
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

        $scope.chartUpload = {
            dates: [],
            data: []
        };

        /*function loadCharts() {
            Track_count.getStatsSong({id: $scope.song.song.id}, function (trackStats) {
                var dest = [];
                var datestr = '';
                if (trackStats.length > 0) {
                    var first = new Date($scope.song.song.date_posted);
                    var last = new Date();

                    var index = getIndex(trackStats, 'playedDate');

                    for (var d = first; d.getTime() <= last.getTime(); d.setDate(d.getDate() + 1)) {
                        datestr = dateToYMD(d);
                        if (index[datestr]) {
                            dest.push(index[datestr]);
                        } else {
                            dest.push(createDefault(datestr));
                        }
                    }

                    dest.forEach(function (item) {
                        $scope.chartUpload.dates.push(item.playedDate);
                        $scope.chartUpload.data.push(item.countPlays);
                    });

                }
            });
        }*/

        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];

        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        scaleLabel: '<%=Math.abs(value).toFixed(1)%>'
                    }
                ]
            }
        };

        entity.$promise.then(function (res) {
            $window.document.title = "Stats " + res.name;

            Principal.identity().then(function (account) {
                if (account.login != res.song.user.login) {
                    $state.go('accessdenied');
                }
                else {
                    //loadCharts();
                    loadHighCharts();
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
