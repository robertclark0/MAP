analysis.directive('hcChart', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element'
        },
        link: function (scope, element) {

            var chart;

            // ---- ---- ---- ---- Scope Variable and Setup ---- ---- ---- ---- //
            
            var uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: false
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    labels: {
                        format: '{value:,.0f}'
                    },
                }
            };
            scope.canvasElement.chart.options = (typeof scope.canvasElement.chart.options === 'undefined') ? defaultchartOptions : scope.canvasElement.chart.options;
            

            // ---- ---- ---- ---- Functions ---- ---- ---- ---- //

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chart.options);

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            // takes the array of element series and adds them or updates them in the chart.
            function populateSeries(seriesArray) {
                seriesArray.forEach(function (series) {

                    var seriesData = createSeriesData(series);
                    var existingSeries = chart.series.map(function (obj) { return obj.name; });
                    var index = existingSeries.indexOf(series.selection);

                    if (index >= 0) {
                        chart.series[index].setData(seriesData);
                    }
                    else {
                        chart.addSeries({ name: series.selection, data: seriesData });
                    }

                });
            };

            // takes a single series, populates and formats the data from the data manager.
            function createSeriesData(series) {
                var seriesData = [];
                var data = appManager.data.DF.getDataGroup(series.GUID);
                if (data && data.result[0]) {
                    var index = data.result[0].indexOf(series.selection);
                    if (index >= 0) {
                        data.result.forEach(function (row, rowIndex) {
                            if (rowIndex > 0) {
                                seriesData.push(row[index]);
                            }
                        });
                    }
                }
                return seriesData;
            }

            // takes and array of GUIDs, gets values from the data manager and create an array of unique values for the x-axis.
            function buildAxis(GUIDArray) {
                var axisValues = [];
                GUIDArray.forEach(function (GUID) {
                    var data = appManager.data.DF.getDataGroup(GUID);
                    if (data) {
                        console.log(data);
                        if (data.result[0][0] === 'RowNum') {
                            data.result.forEach(function (row) {
                                axisValues.push(row[1]);
                            });
                        }
                        else {
                            data.result.forEach(function (row) {
                                axisValues.push(row[0]);
                            });
                        }
                    }
                });
                return unique(axisValues);
            };

            // takes and array, returns array with only unique values.
            function unique(array) {
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                return array.filter(onlyUnique);
            };


            // ---- ---- ---- ---- Watchers ---- ---- ---- ---- //

            // watch size of parent div to resize chart when needed.
            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            // deep watch for changes in chart series.
            scope.$watch('canvasElement.chart.series', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    var axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } });
                    populateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            // watch for changes in data.
            scope.$watch('appManager.data.DO.dataGroups', function (nv, ov) {
                if (nv !== ov) {

                }
            }, true);


            // ---- ---- ---- ---- Load & Register ---- ---- ---- ---- //

            loadChart();

            // register chart and DOM element in data manager to create expose to other parts of app.
            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });

        }
    };
}])