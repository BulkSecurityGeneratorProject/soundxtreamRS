/**
 * Created by Xavi on 23/01/2017.
 */

angular.module('soundxtreamappApp').factory('Chart', function Chart(){
    return {
        getPsChartConfig: function () {
            return psChartConfig;
        }
    }
});

var today = new Date();
var endDate = new Date().setDate(today.getDate() + 30);

var psChartConfig = {
    chart: {
        type: "stackedAreaChart",
        height: 250,
        margin: {
            top: 30,
            right: 25,
            bottom: 80,
            left: 50
        },
        showControls: false,
        x: function (d) {
            return d.x;
        },
        y: function (d) {
            return d.y;
        },
        dispatch: {},
        xAxis: {
            axisLabel: "Dates",
            showMaxMin: false,
            rotateLabels: -90
            /*tickFormat: function (d) {
                return d3.time.format('%d-%m-%y')(new Date(d))
            },
            tickValues: function(values) {
                var a =  _.map(values[0].values, function(v) {
                    return new Date(v.x);
                });
                return a;
            }*/
        },
        xDomain: [new Date(),today],
        yAxis: {
            axisLabel: "Number of plays",
            axisLabelDistance: -10
        },
        transitionDuration: 250
    },
    title: {
        enable: true
    }
};
