analysis.directive('hcChart', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element',
            data: '='
        },
        link: function (scope, element) {


            

            var chart;

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: false
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: ['RHC-A', 'RHC-C', 'RHC-P', 'RHC-E'],
                },
                yAxis: {
                    labels: {
                        format: '{value:,.0f}'
                    },
                    title: {
                        text: 'Patients',
                        align: 'low'
                    }
                },
                series: [{name: 'test', data: [17,34,22,27]}]
            };

            scope.canvasElement.chartOptions = (typeof scope.canvasElement.chartOptions === 'undefined') ? defaultchartOptions : scope.canvasElement.chartOptions;

            loadChart();

            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });
            

            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            //scope.$watch('canvasElement.chartOptions', function (newValue, oldValue) {
            //    if (newValue !== oldValue)
            //    {
            //        loadChart();
            //    }
            //}, true);

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chartOptions);
                
                console.log(chart);
                //scope.data.forEach(function (d) {
                //    chart.addSeries(d);
                //});

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            scope.canvasElement.destroyChart = function () {
                chart.destroy();
            };
            scope.canvasElement.createChart = function () {
                loadChart();
            };

        }
    };
}])