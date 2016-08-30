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
    $scope.reportValue = 1;
    $scope.goReport1 - function () {
        $scope.reportValue = 1;
    };
    $scope.goReport2 - function () {
        $scope.reportValue = 2;
    };

    /// drill functions
    $scope.drillLevel = 0;


    var forAllChup = function () {

        getChupData(query[0]);

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

    $scope.chup = true;
    $scope.poly = true;
    $scope.hu = true;
    $scope.pain = true;
    $scope.checkAll = function () {
        if ($scope.chup) {
            $scope.poly = true;
            $scope.hu = true;
            $scope.pain = true;
        } else {
            $scope.poly = false;
            $scope.hu = false;
            $scope.pain = false;
        }
        cohortQuery();
    };
    $scope.allChecked = function () {
        if ($scope.poly && $scope.hu && $scope.pain) {
            $scope.chup = true;
        }
        else {
            $scope.chup = false;
        }
        cohortQuery();
    };
    function cohortQuery() {
        query[0].ChupFlag = $scope.chup ? 1 : 0;
        query[0].HUFlag = $scope.hu ? 1 : 0;
        query[0].PainFlag = $scope.pain ? 1 : 0;
        query[0].PolyFlag = $scope.poly ? 1 : 0;

        forAllChup();
    };

    var query = [
        {
            region: null,
            DMISID: null,
            MEPRSCode: null,
            PCMNPI: null,
            ChupFlag: 1,
            HUFlag: 1,
            PainFlag: 1,
            PolyFlag: 1,
            FY: 2016,
            FM: 7,
            RowStart: 1,
            RowEnd: 10
        }
    ];

    $scope.data = {
        chart1: []
    }






    function getChupData(query) {


            if (DO.canvasElements[0]) {
                var chart = DO.canvasElements[0].ChartDOM.highcharts();
                chart.showLoading();
            }

            userInfo.save(query).$promise.then(function (response) {
                $scope.data.chart1 = response.result;

                if (chart) { chart.hideLoading(); }

                updateChartArrays();

            }).catch(function (error) { console.log(error); if (chart) { chart.hideLoading(); } });
        
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
        sizeX: 36,
        sizeY: 19,
        chartOptions: {

            title: {
                text: 'Aggregate Patient Cohorts'
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
            series: [{
                color: '#AA3939',
                name: 'Patient Count',
                type: 'column',
                data: [],
                dataLabels: {
                    enabled: true
                }
            }],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            //console.log(event);
                            //var drillIndex = $scope.axisData.indexOf(event.point.index);
                            //console.log($scope.drillDatadrillIndex);
                            $scope.drillBaby($scope.drillData[event.point.index]);
                        }
                    }
                }
            }
        }
    };

    ///===============================================================
    //TEMP DATA

    $scope.axisData;
    $scope.drillData;
    $scope.plotData;

    function updateChartArrays() {
        if ($scope.drillLevel === 0) {
            $scope.axisData = $scope.data.chart1.map(function (obj) { return obj.REGION });
            $scope.drillData = $scope.data.chart1.map(function (obj) { return obj.REGION });
            $scope.plotData = $scope.data.chart1.map(function (obj) { return obj.CNT });
        }
        if ($scope.drillLevel === 1) {
            $scope.axisData = $scope.data.chart1.map(function (obj) { return obj.DMIS_NAME });
            $scope.drillData = $scope.data.chart1.map(function (obj) { return obj.DMIS_ID });
            $scope.plotData = $scope.data.chart1.map(function (obj) { return obj.CNT });
        }
        if ($scope.drillLevel === 2) {
            $scope.axisData = $scope.data.chart1.map(function (obj) { return obj.MED_HOME_MEPRS });
            $scope.drillData = $scope.data.chart1.map(function (obj) { return obj.MED_HOME_MEPRS });
            $scope.plotData = $scope.data.chart1.map(function (obj) { return obj.CNT });
        }
        if ($scope.drillLevel === 3) {
            $scope.axisData = $scope.data.chart1.map(function (obj) { return obj.PCM_NAME });
            $scope.drillData = $scope.data.chart1.map(function (obj) { return obj.PCMNPI });
            $scope.plotData = $scope.data.chart1.map(function (obj) { return obj.CNT });
        }
    }



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