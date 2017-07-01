/**
 * Created by xavi on 01/10/2016.
 */

'use strict';

angular.module('soundxtreamappApp')
    .controller('ChartsSongController', function ($timeout,$scope,$state, Song, SongSearch, ParseLinks,toaster,Song_user,top50AllTracks,Style) {

        $scope.tracks = top50AllTracks;
        $scope.styles = [];
        $scope.predicateStyle = 'id';
        $scope.reverseStyle = true;

        $scope.loadStyles = function(){
            Style.query({page: $scope.page, size: 20, sort: [$scope.predicateStyle + ',' + ($scope.reverseStyle ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.linksStyle = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.styles.push(result[i]);
                }

                $timeout(function () {
                    //DOM has finished rendering
                    $("select.selectStyles").each(function() {
                        var $this = $(this),
                            numberOfOptions = $(this).children("option").length;

                        $this.addClass("select-hidden");
                        $this.wrap('<div class="select"></div>');
                        $this.after('<div class="select-styled"></div>');

                        var $styledSelect = $this.next("div.select-styled");
                        $styledSelect.text($this.children("option").eq(0).text());
                        $styledSelect.attr("id",$this.children("option").eq(0).val());

                        var $list = $("<ul />", {
                            class: "select-options"
                        }).insertAfter($styledSelect);

                        for (var i = 0; i < numberOfOptions; i++) {
                            $("<li />", {
                                text: $this.children("option").eq(i).text(),
                                rel: $this.children("option").eq(i).val()
                            }).appendTo($list);
                        }

                        var $listItems = $list.children("li");

                        $styledSelect.click(function(e) {
                            e.stopPropagation();
                            $("div.select-styled.active").not(this).each(function() {
                                $(this).removeClass("active").next("ul.select-options").hide();
                            });
                            $(this).toggleClass("active").next("ul.select-options").toggle();
                        });

                        $listItems.click(function(e) {
                            e.stopPropagation();
                            $styledSelect.text($(this).text()).removeClass("active");
                            $this.val($(this).attr("rel"));
                            $(".select-styled").attr("id",$(this).attr("rel"));
                            $list.hide();
                            //console.log($this.val());
                        });

                        $(document).click(function() {
                            $styledSelect.removeClass("active");
                            $list.hide();
                        });
                    });
                });
            });
        }
        $scope.loadStyles();



    });

