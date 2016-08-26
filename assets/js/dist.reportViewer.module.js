var reportViewer = angular.module('reportViewer', ['gridster']);
reportViewer.controller('ReportViewer', ['$scope', 'appManager', '$state', '$timeout', function ($scope, appManager, $state, $timeout) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    $scope.DO = appManager.data.DO;

    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    //

    $scope.gridsterOpts = {
        columns: 36,
        resizable: {
            enabled: false
        },
        draggable: {
            enabled: false
        }
    };

    //ALL TEMP VALUES
    //// TEMP DATA ===================================================

    function asyncMe(func) {
        $timeout(func, 0);
    };
    function addSeriesIndex(index) {
        var chart = DO.canvasElements[index].ChartDOM.highcharts();
        chart.addSeries(series1);
    }
    function addEach() {
        for (var i = 0; i < 4; i++) {
            asyncMe(addSeriesIndex(i));
        }
    };

    $scope.addSeries =function(){
        addEach();
    };


    var series1 = {
        color: '#AA3939',
        name: 'Patient Count',
        type: 'bar',
        data: [4687, 3416, 1612, 450],
        dataLabels: {
            enabled: true
        }
    };
    var series2 = {
        color: '#AA6C39',
        name: 'Patient Count',
        type: 'bar',
        data: [3687, 2416, 3612, 1450],
        dataLabels: {
            enabled: true
        }
    };
    var series3 = {
        color: '#226666',
        name: 'Patient Count',
        type: 'bar',
        data: [1687, 2416, 612, 1450],
        dataLabels: {
            enabled: true
        }
    };
    var series4 = {
        color: '#2D882D',
        name: 'Patient Count',
        type: 'bar',
        data: [2687, 3016, 1012, 2450],
        dataLabels: {
            enabled: true
        }
    };

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    var report1 = {
        name: 'CHUP Aggregate',
        GUID: 'temp-1000',
        roleType: 'admin',
        dataGroups: [],
        canvasElements: [
            {
                name: 'Chart 1',
                row: 0,
                col: 0,
                sizeX: 17,
                sizeY: 10,
                chartOptions: {
                    
                    title: {
                        text: 'CHUP Patients'
                    },
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
                            align: 'high'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: []
                }
            },
            {
                name: 'Chart 2',
                row: 0,
                col: 18,
                sizeX: 17,
                sizeY: 10,
                chartOptions: {
                    
                    title: {
                        text: 'High Utilizer Patients'
                    },
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
                            align: 'high'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: []
                }
            },
            {
                name: 'Chart 3',
                row: 12,
                col: 0,
                sizeX: 17,
                sizeY: 10,
                chartOptions: {
                    
                    title: {
                        text: 'Polypharm Patients'
                    },
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
                            align: 'high'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: []
                }
            },
            {
                name: 'Chart 4',
                row: 12,
                col: 18,
                sizeX: 17,
                sizeY: 10,
                chartOptions: {
                    
                    title: {
                        text: 'Pain Patients'
                    },
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
                            align: 'high'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: []
                }
            }
        ]

    };
    var report2 = {
        name: 'CHUP Patient',
        GUID: 'temp-1001',
        roleType: 'admin',
        dataGroups: [],
        canvasElements: []

    };

    ///===============================================================

    $scope.reports = [report1, report2];

    $scope.currentReport = $scope.reports[0];


    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };



}]);
reportViewer.directive('hcChart', function (appManager, $timeout) {
    return {
        restrict: 'E',
        scope: {
            canvasElement: '=',
            data: '='
        },
        link: function (scope, element) {

            var register = function() {
                appManager.data.DO.canvasElements.push({element: scope.canvasElement, ChartDOM: element});
            }();

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

            scope.canvasElement.chartOptions = (typeof scope.canvasElement.chartOptions === 'undefined') ? defaultchartOptions : scope.canvasElement.chartOptions;

            loadChart();
            

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
                
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            scope.canvasElement.destroyChart = function () {
                chart.destroy();
            };
            scope.canvasElement.createChart = function () {
                loadChart();
            };


            function asyncMe(func) {
                $timeout(func, 500);
            };
            asyncMe(function () {
                chart.addSeries({
                    color: '#AA3939',
                    name: 'Patient Count',
                    type: 'bar',
                    data: [4687, 3416, 1612, 450],
                    dataLabels: {
                        enabled: true
                    }
                });
            });

        }
    };
})