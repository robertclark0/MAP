reportViewer.directive('hcChart', function (appManager, $timeout) {
    return {
        restrict: 'E',
        scope: {
            canvasElement: '=',
            data: '=',
            series: '=',
            drill: '=',
            axisData: '=',
            drillData: '=',
            plotData:'='
        },
        link: function (scope, element) {

            var register = function() {
                appManager.data.DO.canvasElements.push({element: scope.canvasElement, ChartDOM: element});
            }();

            

            var chart;
            var plotData;
            var axisData;
            var drillData;

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

            scope.canvasElement.chartOptions = (typeof scope.canvasElement.chartOptions === 'undefined') ? defaultchartOptions : scope.canvasElement.chartOptions;

            loadChart();
            chart.addSeries(scope.series);
            

            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chartOptions);
                
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            scope.$watch('data', function (newValue, oldValue) {

                if (newValue !== oldValue) {

                    chart.xAxis[0].setCategories(scope.axisData);
                    chart.series[0].setData(scope.plotData);
                }
            }, true);


        }
    };
})