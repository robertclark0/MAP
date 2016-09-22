mapApp.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            element: '=',
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
                series: []
            };

            scope.element.chartOptions = (typeof scope.element.chartOptions === 'undefined') ? defaultchartOptions : scope.element.chartOptions;

            loadChart();
            

            //scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
            //    chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            //});

            //scope.$watch('canvasElement.chartOptions', function (newValue, oldValue) {
            //    if (newValue !== oldValue)
            //    {
            //        loadChart();
            //    }
            //}, true);

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.element.chartOptions);
                

                scope.data.forEach(function (d) {
                    chart.addSeries(d);
                });

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            scope.element.destroyChart = function () {
                chart.destroy();
            };
            scope.element.createChart = function () {
                loadChart();
            };

        }
    };
})