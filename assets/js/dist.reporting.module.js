var reporting = angular.module('reporting', []);
reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', function ($scope, appManager, $state, $mdDialog, $mdPanel) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var DO = appManager.data.DO;

    $scope.result = null;
    $scope.updatedResult = null;

    if (DO.user === null) {
        API.userInfo().save(logger.postObject()).$promise.then(function (response) {
            //API.userInfo().get().$promise.then(function (response) {
            if (response.result) {
                DO.user = new DO.User(response.result);
                $scope.user = appManager.data.DO.user;
            }
        }).catch(function (error) {
            logger.toast.error('Error Getting User Data', error);
        });
    }


    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;


    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showAnalysis = function () {
        var modules = DSO.modules.map(function (obj) { return obj.Module });
        if (modules.indexOf('analysis') > -1) {
            return true;
        }
        return false;
    };

    $scope.reports = [
        [
            {
                "ReportID": 5, "GUID": "b5abf8d5-b868-42dc-9026-2583fb00ac79", "User": "Robert", "Report_Name": "CHUP Aggregate", "Report_Type": "admin", "Position": 100, "Category": "CHUP Reports", "AuditDate": "2016-10-14T08:00:25.117", report:
                    {

                    }
            },
            {
                "ReportID": 6, "GUID": "1ac762a8-7db1-4ad1-a39c-875200f0b53d", "User": "Robert", "Report_Name": "CHUP Trending", "Report_Type": "admin", "Position": 10, "Category": "CHUP Reports", "AuditDate": "2016-10-14T08:02:11.617", report:
                    {

                    }
            }],
    ];
    $scope.currentReport = null;
    $scope.goReport = function (index) {
        $scope.currentReport = $scope.reports[0][index];
    }

    ///============================ FILTER SETUP =========================

    $scope.months = [{ name: "April", number: 4 }, { name: "May", number: 5 }, { name: "June", number: 6 }, { name: "July", number: 7 }, { name: "August", number: 8 }];
    $scope.selectedMonth = { name: "August", number: 8 };
    $scope.checkMonth = function () {

        $scope.queryObjects.forEach(function (query) {
            query.filters[query.filters.map(function (obj) { return obj.name }).indexOf("FM")].operators[0].values[0] = $scope.selectedMonth.number;
        });

    };

    $scope.commaToCR = function (value, index) {

        if ($scope.result[0][index] === 'PRODNAME') {
            console.log(value);

            if (value !== null) {
                return value.split(',');
            }
            return [];
        }

    };

    ///============================= DRILL DOWN ===========================

    $scope.drillDownLevels = ["Region", "PARENT_DMISID", "DMISID", "MED_HOME_MEPRS", "PCMNPI"];
    $scope.drillDownSelection = [];
    $scope.drillDownIndex = 0;

    $scope.updateQueryObject = function () {
        $scope.queryObjects.forEach(function (query) {
            var index = query.filters.map(function (obj) { return obj.name }).indexOf($scope.drillDownLevels[$scope.drillDownIndex - 1]);
            if (index > -1) {
                query.filters[index].operators[0].values[0] = $scope.drillDownSelection[$scope.drillDownIndex - 1];
            }
        });
    };


    ///============================= GENERATE QUERY ===========================


    $scope.queryObjects = [
        //LEVEL 1
        {
            source: {
                product: "CHUP",
                type: 'table',
                name: 'CHUP_FACT'
            },
            pagination:
            {
                enabled: false,
                page: 1,
                range: 10
            },
            aggregation:
            {
                enabled: true
            },
            selections:
            [

                    {
                        name: 'Region',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'EDIPN',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'CNT'
                        }
                    }

            ],
            filters:
            [
                {
                    name: 'HUFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PainFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PolyFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'FY',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: ['2016'],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'FM',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [4],
                            valueType: 'int'
                        }
                    ]
                }
                //{
                //    name: 'DMISID',
                //    operators:
                //    [
                //        {
                //            type: 'equal',
                //            values: ['0109'],
                //            valueType: 'string'
                //        }
                //    ]
                //}
            ]
        },
        //LEVEL2
        {
            source: {
                product: "CHUP",
                type: 'table',
                name: 'CHUP_FACT'
            },
            pagination:
            {
                enabled: false,
                page: 1,
                range: 10
            },
            aggregation:
            {
                enabled: true
            },
            selections:
            [

                    {
                        name: 'Region',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'PARENT_DMISID',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'EDIPN',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'CNT'
                        }
                    }

            ],
            filters:
            [
                {
                    name: 'HUFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PainFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PolyFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'FY',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: ['2016'],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'FM',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [4],
                            valueType: 'int'
                        }
                    ]
                },
                //DRILLDOWNS
                {
                    name: 'Region',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                },
            ]
        },
        //LEVEL3
        {
            source: {
                product: "CHUP",
                type: 'table',
                name: 'CHUP_FACT'
            },
            pagination:
            {
                enabled: false,
                page: 1,
                range: 10
            },
            aggregation:
            {
                enabled: true
            },
            selections:
            [
                    {
                        name: 'DMISID',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'DMISName',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'EDIPN',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'CNT'
                        }
                    }

            ],
            filters:
            [
                {
                    name: 'HUFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PainFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PolyFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'FY',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: ['2016'],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'FM',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [4],
                            valueType: 'int'
                        }
                    ]
                },
                //DRILLDOWNS
                {
                    name: 'Region',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'PARENT_DMISID',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                }
            ]
        },
        //LEVEL4
        {
            source: {
                product: "CHUP",
                type: 'table',
                name: 'CHUP_FACT'
            },
            pagination:
            {
                enabled: false,
                page: 1,
                range: 10
            },
            aggregation:
            {
                enabled: true
            },
            selections:
            [
                    {
                        name: 'DMISID',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'DMISName',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'MED_HOME_MEPRS',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'EDIPN',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'CNT'
                        }
                    }

            ],
            filters:
            [
                {
                    name: 'HUFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PainFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'PolyFlag',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [1],
                            valueType: 'int'
                        }
                    ]
                },
                {
                    name: 'FY',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: ['2016'],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'FM',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [4],
                            valueType: 'int'
                        }
                    ]
                },
                //DRILLDOWNS
                {
                    name: 'Region',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'PARENT_DMISID',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                },
                {
                    name: 'DMISID',
                    operators:
                    [
                        {
                            type: 'equal',
                            values: [],
                            valueType: 'string'
                        }
                    ]
                }
            ]
        },
    //LEVEL5
    {
        source: {
            product: "CHUP",
            type: 'table',
            name: 'CHUP_FACT'
        },
        pagination:
        {
            enabled: false,
            page: 1,
            range: 10
        },
        aggregation:
        {
            enabled: true
        },
        selections:
        [
                {
                    name: 'DMISID',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'PCMNPI',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'PCMNAME',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'EDIPN',
                    order: 'asc',
                    aggregate: true,
                    aggregation: {
                        type: 'count',
                        allias: 'CNT'
                    }
                }

        ],
        filters:
        [
            {
                name: 'HUFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'PainFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'PolyFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'FY',
                operators:
                [
                    {
                        type: 'equal',
                        values: ['2016'],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'FM',
                operators:
                [
                    {
                        type: 'equal',
                        values: [4],
                        valueType: 'int'
                    }
                ]
            },
            //DRILLDOWNS
            {
                name: 'Region',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'PARENT_DMISID',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'DMISID',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'MED_HOME_MEPRS',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            }
        ]
    },
    //LEVEL 6
    {
        source: {
            product: "CHUP",
            type: 'table',
            name: 'CHUP_FACT'
        },
        pagination:
        {
            enabled: true,
            page: 1,
            range: 10
        },
        aggregation:
        {
            enabled: false
        },
        selections:
        [
                {
                    name: 'PCMNAME',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'PCMNPI',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'SPONSSN',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'SSN',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'GENDER',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'EDIPN',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'NAME',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'TotalEnc',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'PRODNAME',
                    order: 'asc',
                    aggregate: false
                }

        ],
        filters:
        [
            {
                name: 'HUFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'PainFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'PolyFlag',
                operators:
                [
                    {
                        type: 'equal',
                        values: [1],
                        valueType: 'int'
                    }
                ]
            },
            {
                name: 'FY',
                operators:
                [
                    {
                        type: 'equal',
                        values: ['2016'],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'FM',
                operators:
                [
                    {
                        type: 'equal',
                        values: [4],
                        valueType: 'int'
                    }
                ]
            },
            //DRILLDOWNS
            {
                name: 'Region',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'PARENT_DMISID',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'DMISID',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'MED_HOME_MEPRS',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            },
            {
                name: 'PCMNPI',
                operators:
                [
                    {
                        type: 'equal',
                        values: [],
                        valueType: 'string'
                    }
                ]
            }
        ]
    }

    ];

    $scope.sendQuery = function () {




        API.query().save({ query: $scope.queryObjects[$scope.drillDownIndex] }).$promise.then(function (response) {
            console.log(response.result);
            $scope.result = response.result;
            $scope.updatedResult = $scope.updateAggregate(response.result);

            aggregateChart.xAxis[0].setCategories($scope.updatedResult[$scope.drillDownLevels[$scope.drillDownIndex]]);
            aggregateChart.series[0].setData($scope.updatedResult.CNT);

            $scope.drillDownIndex++;
        }).catch(function (error) { console.log(error); });

    };


    ///============================= GENERATE DOWNLOAD ===========================

    //API.download().save({ query: queryObject }).$promise
    //    .then(function (response)
    //    {
    //        if (response.GUID) {
    //            var downloadGUID = response.GUID;
    //            var check;

    //            check = $interval(function () {
    //                API.downloadUpdate().get({ GUID: downloadGUID }).$promise.then(function (response) {
    //                    if (response.Status === 'complete') {
    //                        $interval.cancel(check);
    //                        window.location(API.endpoint + "download?GUID=" + downloadGUID);
    //                    }
    //                    else if (response.Status === 'started') {

    //                    }
    //                    else {
    //                        $interval.cancel(check);
    //                    }
    //                }).catch(function (response) {
    //                    console.log(response);
    //                });
    //            }, 3000, 600);
    //        }
    //    })
    //    .catch(function (response)
    //    {
    //        console.log(response);
    //    });


    ///============================= AGGREGATE CHART ===========================

    $scope.aggregate = {

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
            categories: [],
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
                        $scope.drillDownSelection[$scope.drillDownIndex - 1] = event.point.category;
                        $scope.updateQueryObject();
                        console.log($scope.queryObjects);

                    }
                }
            }
        }
    };


    var aggregateChart = Highcharts.chart('aggregateChart', $scope.aggregate);

    $scope.updateAggregate = function (results) {


        var newObject = {}

        results.forEach(function (row, index) {
            if (index === 0) {
                row.forEach(function (cell) {
                    newObject[cell] = [];
                });
            }
            if (index > 0) {
                row.forEach(function (cell, index) {
                    newObject[results[0][index]].push(cell);
                });
            }
        });

        return newObject;
    };

    ///============================= TRENDING CHART ===========================

    var trending = {
        title: {
            text: 'Trending CHUP Patients',
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


    //ON LOAD

    $scope.goReport(0);
    $scope.sendQuery();


}]);