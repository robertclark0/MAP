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
    $scope.start = 1;
    $scope.end = 10;

    $scope.add = function () {
        query[0].RowStart += 10;
        query[0].RowEnd += 10;
        console.log(query);
        forAllChup();
    }
    $scope.subtract = function () {
        query[0].RowStart -= 10;
        query[0].RowEnd -= 10;
        forAllChup();
    }

    $scope.reportValue = 1;
    $scope.goReport1 = function () {
        $scope.reportValue = 1;
        $timeout(function () {
            DO.canvasElements[0].ChartDOM.highcharts().redraw();
        }, 0);
    };
    $scope.goReport2 = function () {
        $scope.reportValue = 2;
        $timeout(function () {
            DO.canvasElements[1].ChartDOM.highcharts().redraw();
        }, 100);
    };
    $scope.goReport3 = function () {
        $scope.reportValue = 3;
    };

    /// drill functions
    $scope.chipModel = [];
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
            RowStart: $scope.start,
            RowEnd: $scope.end
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

                if ($scope.drillLevel === 4) {
                    $scope.reportValue = 2;
                }

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

    $scope.month = function(monthValue) {
        query[0].FM = monthValue;
        forAllChup();
    };

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

    ///============================= TRENDING CHART ===========================

    var trending = {
        title: {
            text: 'RHC-A Trending CHUP Patients',
            x: -20 //center
        },
        xAxis: {
            categories: ['May', 'Jun',
                'Jul']
        },
        yAxis: {
            labels: {
                format: '{value:,.0f}'
            },
            title: {
                text: 'Pateint Count'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Patients'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions: {
            series: {
                //marker: {
                //    states: {
                //        hover: {
                //            radiusPlus: 5,
                //            lineWidthPlus: 2
                //        }
                //    }
                //},
                states: {
                    hover: {
                        lineWidthPlus: 3
                    }
                }
            }
        },
        series: [
        { name: 'AHC FOX-REDSTONE ARSENAL', data: [1305, 1360, 1421] },
{ name: 'AHC LYSTER-RUCKER', data: [1170, 1267, 1265] },
{ name: 'AMC EISENHOWER-GORDON', data: [1899, 2017, 2008] },
{ name: 'ACH MARTIN-BENNING', data: [2263, 2358, 2305] },
{ name: 'ACH WINN-STEWART', data: [1383, 1462, 1438] },
{ name: 'ACH BLANCHFIELD-CAMPBELL', data: [1673, 1747, 1741] },
{ name: 'ACH IRELAND- KNOX', data: [2330, 2468, 2466] },
{ name: 'KIMBROUGH AMB CAR CEN-MEADE', data: [1139, 1246, 1247] },
{ name: 'ACH KELLER-WEST POINT', data: [228, 249, 260] },
{ name: 'AMC WOMACK-BRAGG', data: [1049, 1084, 1084] },
{ name: 'ACH MONCRIEF-JACKSON', data: [1292, 1334, 1296] },
{ name: 'AHC MCDONALD-EUSTIS', data: [1209, 1308, 1302] },
{ name: 'AHC KENNER-LEE', data: [1635, 1771, 1799] },
{ name: 'AHC MCNAIR-MYER-HENDERSON HALL', data: [19, 24, 26] },
{ name: 'AHC TUTTLE-HUNTER ARMY AIRFLD', data: [762, 812, 785] },
{ name: 'AHC ROCK ISLAND ARSENAL', data: [149, 163, 168] },
{ name: 'AHC KIRK-ABERDEEN PRVNG GD', data: [581, 626, 631] },
{ name: 'AHC BARQUIST-DETRICK', data: [385, 404, 425] },
{ name: 'AHC GUTHRIE-DRUM', data: [753, 781, 793] },
{ name: 'AHC DUNHAM-CARLISLE BARRACKS', data: [360, 393, 379] },
{ name: 'AHC ANDREW RADER-MYER-HENDERSN', data: [261, 277, 291] },
{ name: 'AHC FILLMORE-NEW CUMBERLAND', data: [119, 129, 134] },
{ name: 'AHC-STORY', data: [70, 77, 81] },
{ name: 'OHC EDGEWOOD ARS', data: [39, 42, 46] },
{ name: 'TMC-1-EUSTIS', data: [7, 11, 17] },
{ name: 'TMC-2-EUSTIS', data: [370, 395, 411] },
{ name: 'CTMC-BENNING', data: [392, 402, 389] },
{ name: 'CTMC 2-HARMONY CHURCH-BENNING', data: [353, 353, 357] },
{ name: 'TMC 9-7TH SPECIAL FORCES-EGLIN', data: [152, 178, 188] },
{ name: 'AVIATION MEDICINE C-CAMPBELL', data: [414, 442, 435] },
{ name: 'TMC-4-GORDON', data: [809, 873, 855] },
{ name: 'CTMC SLEDGEHAMMER-BENNING', data: [128, 172, 228] },
{ name: 'TMC-5-BENNING', data: [163, 167, 160] },
{ name: 'TMC MOLOGNE-WEST POINT', data: [54, 62, 74] },
{ name: 'TROOP & FAMILY MED CL-BRAGG', data: [865, 931, 923] },
{ name: 'CBMH FAYETTEVILLE-BRAGG', data: [308, 305, 313] },
{ name: 'CBMH HOPE MILLS-BRAGG', data: [459, 466, 461] },
{ name: 'CBMH LINDEN OAKS-BRAGG', data: [299, 307, 299] },
{ name: 'CBMH SCREAMING EAGLE-CAMPBELL', data: [660, 678, 663] },
{ name: 'CBMH MONCRIEF-JACKSON', data: [562, 595, 585] },
{ name: 'CBMH RICHMOND HILL-STEWART', data: [517, 554, 547] },
{ name: 'CBMH NORTH COLUMBUS-BENNING', data: [427, 449, 446] },
{ name: 'CTMC CONNER-DRUM', data: [690, 733, 738] },
{ name: 'ROBINSON CLINIC-BRAGG', data: [1355, 1391, 1358] },
{ name: 'CONNELLY HLTH CLIN-GORDON', data: [12, 12, 11] },
{ name: 'SOUTHCOM CLINIC-GORDON', data: [317, 345, 341] },
{ name: 'JOEL CLINIC-BRAGG', data: [1037, 1136, 1105] },
{ name: 'CLARK CLINIC-BRAGG', data: [1219, 1286, 1276] },
{ name: 'LA POINTE HLTH CLINIC-CAMPBELL', data: [560, 579, 585] },
{ name: 'BYRD HEALTH CLINIC-CAMPBELL', data: [871, 919, 937] },
{ name: 'TMC-STEWART', data: [220, 256, 263] },
{ name: 'TMC LLOYD C HAWKS-STEWART', data: [963, 1039, 1068] },
{ name: 'AHC RODRIGUEZ-BUCHANAN', data: [145, 155, 157] },

        ]
    }

    angular.element('#trendingChart').highcharts(trending)

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

                    chart.xAxis[0].setCategories(scope.axisData);
                    chart.series[0].setData(scope.plotData);
                }
            }, true);


        }
    };
})