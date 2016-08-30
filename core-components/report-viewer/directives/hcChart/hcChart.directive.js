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

                    //if (scope.drill === 0) {
                    //    axisData = scope.data.map(function (obj) { return obj.REGION });
                    //    drillData = scope.data.map(function (obj) { return obj.REGION });
                    //    plotData = scope.data.map(function (obj) { return obj.CNT });
                    //}
                    //if (scope.drill === 1) {
                    //    axisData = scope.data.map(function (obj) { return obj.DMIS_ID });
                    //    drillData = scope.data.map(function (obj) { return obj.DMIS_ID });
                    //    plotData = scope.data.map(function (obj) { return obj.CNT });
                    //}
                    //if (scope.drill === 2) {
                    //    axisData = scope.data.map(function (obj) { return obj.MED_HOME_MEPRS });
                    //    drillData = scope.data.map(function (obj) { return obj.MED_HOME_MEPRS });
                    //    plotData = scope.data.map(function (obj) { return obj.CNT });
                    //}
                    //if (scope.drill === 3) {
                    //    axisData = scope.data.map(function (obj) { return obj.PCMNPI });
                    //    drillData = scope.data.map(function (obj) { return obj.PCMNPI });
                    //    plotData = scope.data.map(function (obj) { return obj.CNT });
                    //}

                    chart.xAxis[0].setCategories(scope.axisData);
                    chart.series[0].setData(scope.plotData);
                }
            }, true);


            //function asyncMe(func) {
            //    $timeout(func, 500);
            //};
            //asyncMe(function () {
            //    chart.addSeries(scope.data);               
            //});

        }
    };
})