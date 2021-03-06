﻿mapApp.directive('hcChart', ['appManager', '$timeout', '$rootScope', function (appManager, $timeout, $rootScope) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element'
        },
        link: function (scope, element) {

            var chart;

            // ---- ---- ---- ---- Scope Variable and Setup ---- ---- ---- ---- //
            scope.chartDataObjects = [];

            var uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
            var axis = buildAxis(uniqueGUIDs);

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: true
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
                chart.update({plotOptions: {
                    series: {
                        cursor: 'pointer',
                        events: {
                            click: function (event) {
                                $rootScope.$broadcast('selectionControl', {GUID: scope.canvasElement.GUID, event: event });
                            }
                        }
                    }
                }});

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);

                $timeout(function () {
                    populateSeries(scope.canvasElement.chart.series);
                }, 1);
                
            };

            // takes the series array and updates the values with new data object results.
            function updateSeries(seriesArray) {
                seriesArray.forEach(function (series, seriesIndex) {
                    var seriesData = createSeriesData(series, false);

                    if (seriesData) {
                        var newLength = seriesData.length;
                        var existingLength = chart.series[seriesIndex].data.length;

                        if (newLength > existingLength) {

                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Change existing points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });

                            //Add new points
                            for (var i = existingLength; i < newLength; i++) {
                                chart.series[seriesIndex].addPoint(seriesData[i], false);
                            }

                        } else if (existingLength > newLength) {
                            var diff = existingLength - newLength;

                            //Remove Points
                            for (var i = existingLength - 1; i > existingLength - 1 - diff; i--) {
                                chart.series[seriesIndex].data[i].remove(false);
                            }

                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });

                        } else {
                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });
                        }
                    }
                });
                chart.redraw();
            };

            // takes the array of element series and adds them or updates them in the chart.
            function populateSeries(seriesArray) {
                scope.chartDataObjects.length = 0;
                seriesArray.forEach(function (series) {
                    var seriesData = createSeriesData(series, true);
                    var existingSeries = chart.series.map(function (obj) { return obj.name; });
                    var index = existingSeries.indexOf(series.selection);

                    if (index >= 0) {
                        chart.series[index].setData(seriesData, false);
                        
                    }
                    else {
                        chart.addSeries({ name: series.selection, data: seriesData }, false);
                        index = chart.series.length - 1;
                    }

                    if (series.options) {
                        chart.series[index].update(series.options, false);
                    }



                });

                chart.redraw();
            };

            // takes a single series, populates and formats the data from the data manager.
            function createSeriesData(series, addReferenceBool) {
                var seriesData = [];
                var data = appManager.data.DF.getDataGroup(series.GUID);

                //add data reference to watcher for chart data objects
                if (addReferenceBool) {
                    addDataReference(data);
                }

                if (data && data.result && data.result[0]) {
                    var index = data.result[0].indexOf(series.selection);
                    var titleIndex = 0;
                    if (data.result[0][0] === 'RowNum') {
                        titleIndex = 1;
                    }

                    if (index >= 0) {
                        data.result.forEach(function (row, rowIndex) {
                            if (rowIndex > 0) {
                                var point = {
                                    y: row[index],
                                    x: axis.indexOf(row[titleIndex])
                                };
                                seriesData.push(point);
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
                    if (data && data.result && data.result[0]) {
                        if (data.result[0][0] === 'RowNum') {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[1]);
                                }
                            });
                        }
                        else {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[0]);
                                }
                            });
                        }
                    }
                });
                return unique(axisValues);
            };

            // adds data reference to watcher array if it doesn't exist already.
            function addDataReference(data) {
                var existingGUID = scope.chartDataObjects.map(function (obj) { return obj.GUID; });
                var index = existingGUID.indexOf(data.GUID);

                if (index < 0) {
                    scope.chartDataObjects.push(data);
                }
            }

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
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } }, false);
                    populateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            scope.$watch('chartDataObjects', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } }, false);
                    updateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            // ---- ---- ---- ---- Load & Register ---- ---- ---- ---- //

            loadChart();

            // register chart and DOM element in data manager to create expose to other parts of app.
            var index = appManager.data.DO.canvasElements.map(function (obj) { return obj.GUID }).indexOf(scope.canvasElement.GUID);
            if (index >= 0) {
                appManager.data.DO.canvasElements.splice(index, 1);
            } 
            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });
        }
    };
}])