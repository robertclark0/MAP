var reportViewer = angular.module('reportViewer', ['gridster']);
reportViewer.controller('ReportViewer', ['$scope', 'appManager', '$state', '$timeout', '$resource', function ($scope, appManager, $state, $timeout, $resource) {

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
    /// drill functions
    $scope.drillLevel = 0;


    var forAllChup = function () {
        for (var i = 0; i < 4; i++) {
            getChupData(i, query[i]);
        }
    }

    $scope.drillBaby = function (value) {
        if ($scope.drillLevel < 4) {
            query.forEach(function (obj) {
                //obj.region = 'RHC-A';
                if ($scope.drillLevel === 0) {
                    obj.region = value;
                }
                else if ($scope.drillLevel === 1) {
                    obj.DMISID = value;
                }
                else if ($scope.drillLevel === 2) {
                    obj.MEPRSCode = value;
                }
                else if ($scope.drillLevel === 3) {
                    obj.PCMNPI = value;
                }

            });
            $scope.drillLevel++;
            forAllChup();
        }

    };


    /// =================================================================
    // API
    var apiEndpoint = 'http://localhost:51880/api/';
    var userInfoAPI = apiEndpoint + 'chup';
    var userInfo = $resource(userInfoAPI);

    var query = [
        {
            region: null,
            DMISID: null,
            MEPRSCode: null,
            PCMNPI: null,
            ChupFlag: 1,
            HUFlag: 0,
            PainFlag: 0,
            PolyFlag: 0,
            FY: 2016,
            FM: 7,
            RowStart: 1,
            RowEnd: 10
        },
        {
            region: null,
            DMISID: null,
            MEPRSCode: null,
            PCMNPI: null,
            ChupFlag: 0,
            HUFlag: 1,
            PainFlag: 0,
            PolyFlag: 0,
            FY: 2016,
            FM: 7,
            RowStart: 1,
            RowEnd: 10
        },
        {
            region: null,
            DMISID: null,
            MEPRSCode: null,
            PCMNPI: null,
            ChupFlag: 0,
            HUFlag: 0,
            PainFlag: 0,
            PolyFlag: 1,
            FY: 2016,
            FM: 7,
            RowStart: 1,
            RowEnd: 10
        },
        {
            region: null,
            DMISID: null,
            MEPRSCode: null,
            PCMNPI: null,
            ChupFlag: 0,
            HUFlag: 0,
            PainFlag: 1,
            PolyFlag: 0,
            FY: 2016,
            FM: 7,
            RowStart: 1,
            RowEnd: 10
        }
    ];

    $scope.data = {
        chart1: [],
        chart2: [],
        chart3: [],
        chart4: []
    }




    function getChupData(index, query) {
        userInfo.save(query).$promise.then(function (response) {
            $scope.data['chart' + (index + 1)] = response.result;
            console.log(response.result);
        }).catch(function (error) { console.log(error); });
    };



    //// TEMP ELEMENTS ===================================================

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    $scope.element1 = {
        name: 'Chart 1',
        row: 3,
        col: 0,
        sizeX: 17,
        sizeY: 9,
        chartOptions: {

            title: {
                text: 'CHUP Patients'
            },
            chart: {
                type: 'column',
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
            series: [],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            $scope.drillBaby(event.point.category);
                        }
                    }
                }
            }
        }
    };
    $scope.element2 = {
        name: 'Chart 2',
        row: 3,
        col: 18,
        sizeX: 17,
        sizeY: 9,
        chartOptions: {

            title: {
                text: 'High Utilizer Patients'
            },
            chart: {
                type: 'column',
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
            series: [],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            $scope.drillBaby(event.point.category);
                        }
                    }
                }
            }
        }
    };
    $scope.element3 = {
        name: 'Chart 3',
        row: 12,
        col: 0,
        sizeX: 17,
        sizeY: 9,
        chartOptions: {

            title: {
                text: 'Polypharm Patients'
            },
            chart: {
                type: 'column',
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
            series: [],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            $scope.drillBaby(event.point.category);
                        }
                    }
                }
            }
        }
    };
    $scope.element4 = {
        name: 'Chart 4',
        row: 12,
        col: 18,
        sizeX: 17,
        sizeY: 9,
        chartOptions: {

            title: {
                text: 'Pain Patients'
            },
            chart: {
                type: 'column',
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
            series: [],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {

                            $scope.drillBaby(event.point.category);

                        }
                    }
                }
            }
        }
    };


    ///===============================================================
    //TEMP DATA

    $scope.series1 = {
        color: '#AA3939',
        name: 'Patient Count',
        type: 'bar',
        data: [],
        dataLabels: {
            enabled: true
        }
    };
    $scope.series2 = {
        color: '#AA6C39',
        name: 'Patient Count',
        type: 'bar',
        data: [],
        dataLabels: {
            enabled: true
        }
    };
    $scope.series3 = {
        color: '#226666',
        name: 'Patient Count',
        type: 'bar',
        data: [],
        dataLabels: {
            enabled: true
        }
    };
    $scope.series4 = {
        color: '#2D882D',
        name: 'Patient Count',
        type: 'bar',
        data: [],
        dataLabels: {
            enabled: true
        }
    };

    ///===============================================================



    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };


    ///============================= RUN =============================


    forAllChup();


}]);
reportViewer.directive('hcChart', function (appManager, $timeout) {
    return {
        restrict: 'E',
        scope: {
            canvasElement: '=',
            data: '=',
            series: '=',
            drill: '='
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
                console.log(scope.drill);
                if (newValue !== oldValue) {

                    if (scope.drill === 0) {
                        axisData = scope.data.map(function (obj) { return obj.REGION });
                        drillData = scope.data.map(function (obj) { return obj.REGION });
                        plotData = scope.data.map(function (obj) { return obj.CNT });
                    }
                    if (scope.drill === 1) {
                        axisData = scope.data.map(function (obj) { return obj.DMIS_ID });
                        drillData = scope.data.map(function (obj) { return obj.DMIS_ID });
                        plotData = scope.data.map(function (obj) { return obj.CNT });
                    }
                    if (scope.drill === 2) {
                        axisData = scope.data.map(function (obj) { return obj.MED_HOME_MEPRS });
                        drillData = scope.data.map(function (obj) { return obj.MED_HOME_MEPRS });
                        plotData = scope.data.map(function (obj) { return obj.CNT });
                    }
                    if (scope.drill === 3) {
                        axisData = scope.data.map(function (obj) { return obj.PCMNPI });
                        drillData = scope.data.map(function (obj) { return obj.PCMNPI });
                        plotData = scope.data.map(function (obj) { return obj.CNT });
                    }

                    chart.xAxis[0].setCategories(axisData);
                    chart.series[0].setData(plotData);
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