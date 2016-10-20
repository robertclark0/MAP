var reporting = angular.module('reporting', []);
reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', '$interval', function ($scope, appManager, $state, $mdDialog, $mdPanel, $interval) {

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

            if (value !== null) {
                return value.split(',');
            }
            return [];
        }

    };

    $scope.next = function () {
        $scope.queryObjects[$scope.drillDownIndex].pagination.page += 10;
        $scope.queryObjects[$scope.drillDownIndex].pagination.range += 10;
        console.log($scope.queryObjects[$scope.drillDownIndex].pagination)
        $scope.sendQuery();

    };
    $scope.prev = function () {
        $scope.queryObjects[$scope.drillDownIndex].pagination.page -= 10;
        $scope.queryObjects[$scope.drillDownIndex].pagination.range -= 10;
        $scope.sendQuery();
    };

    ///============================= DRILL DOWN ===========================

    $scope.drillDownLevels = ["Region", "PARENT_DMISID", "DMISID", "MED_HOME_MEPRS", "PCMNAME"];
    $scope.drillDownSelection = [];
    $scope.drillDownIndex = 0;

    $scope.updateQueryObject = function () {
        $scope.queryObjects.forEach(function (query) {

            var index = query.filters.map(function (obj) { return obj.name }).indexOf($scope.drillDownLevels[$scope.drillDownIndex]);
            if (index > -1) {
                query.filters[index].operators[0].values[0] = $scope.drillDownSelection[$scope.drillDownIndex];
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
                    name: 'EDIPN',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'GENDER',
                    order: 'asc',
                    aggregate: false
                },
                //{
                //    name: 'DOB',
                //    order: 'asc',
                //    aggregate: false
                //},
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
                name: 'PCMNAME',
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

    $scope.sendQuery = function (drill) {
        if (drill) { $scope.drillDownIndex++; };

        API.query().save({ query: $scope.queryObjects[$scope.drillDownIndex] }).$promise.then(function (response) {

            $scope.result = response.result;
            $scope.updatedResult = $scope.updateAggregate(response.result);

            aggregateChart.xAxis[0].setCategories($scope.updatedResult[$scope.drillDownLevels[$scope.drillDownIndex]]);
            aggregateChart.series[0].setData($scope.updatedResult.CNT);



        }).catch(function (error) { console.log(error); });

    };


    ///============================= GENERATE DOWNLOAD ===========================

    $scope.download = function () {

        var query = $scope.queryObjects[$scope.drillDownIndex];
        query.aggregation.enabled = false;
        query.pagination.enabled = false;


        API.download().save({ query: query }).$promise.then(function (response)
        {
            if (response.GUID) {
                var downloadGUID = response.GUID;
                var check;

                check = $interval(function () {
                    API.downloadUpdate().get({ GUID: downloadGUID }).$promise.then(function (response) {
                        if (response.Status === 'complete') {
                            $interval.cancel(check);
                            window.location(API.endpoint + "download?GUID=" + downloadGUID);
                        }
                        else if (response.Status === 'started') {

                        }
                        else {
                            $interval.cancel(check);
                        }
                    }).catch(function (response) {
                        console.log(response);
                    });
                }, 3000, 600);
            }
        })
        .catch(function (response)
        {
            console.log(response);
        });
    };




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
                        $scope.drillDownSelection[$scope.drillDownIndex] = event.point.category;
                        console.log($scope.drillDownSelection);
                        $scope.updateQueryObject();
                        console.log($scope.queryObjects);
                        $scope.sendQuery(true);

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
            categories: ['April','May','June', 'July',
                'August', 'September']
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
            { name: 'ACH BASSETT-WAINWRIGHT', data: [599, 648, 701, 705, 687] },
{ name: 'ACH BAYNE-JONES-POLK', data: [988, 1062, 1157, 1128, 1161] },
{ name: 'ACH BLANCHFIELD-CAMPBELL', data: [2177, 2282, 2402, 2404, 2309] },
{ name: 'ACH BRIAN ALLGOOD-SEOUL', data: [265, 299, 329, 339, 365] },
{ name: 'ACH EVANS-CARSON', data: [2308, 2489, 2708, 2731, 2659] },
{ name: 'ACH IRELAND- KNOX', data: [2773, 2918, 3156, 3172, 3099] },
{ name: 'ACH IRWIN-RILEY', data: [745, 782, 822, 828, 790] },
{ name: 'ACH KELLER-WEST POINT', data: [333, 347, 373, 382, 344] },
{ name: 'ACH LEONARD WOOD', data: [1744, 1779, 1969, 2077, 2129] },
{ name: 'ACH MARTIN-BENNING', data: [2653, 2750, 2854, 2830, 2946] },
{ name: 'ACH MONCRIEF-JACKSON', data: [1479, 1592, 1677, 1655, 1641] },
{ name: 'ACH REYNOLDS-SILL', data: [2669, 2768, 2949, 2993, 3013] },
{ name: 'ACH WEED-IRWIN', data: [428, 462, 486, 525, 515] },
{ name: 'ACH WINN-STEWART', data: [1747, 1817, 1926, 1887, 1914] },
{ name: 'AHC ANDREW RADER-MYER-HENDERSN', data: [382, 383, 403, 404, 380] },
{ name: 'AHC ANSBACH', data: [126, 138, 161, 162, 178] },
{ name: 'AHC BARQUIST-DETRICK', data: [499, 504, 543, 567, 521] },
{ name: 'AHC BAUMHOLDER', data: [314, 318, 342, 364, 387] },
{ name: 'AHC BG CRAWFORD SAMS-CAMP ZAMA', data: [125, 126, 156, 132, 153] },
{ name: 'AHC BRUSSELS', data: [27, 28, 29, 38, 29] },
{ name: 'AHC CAMP CASEY-TONGDUCHON', data: [148, 180, 204, 212, 326] },
{ name: 'AHC CAMP HUMPHREYS-PYONGTAEK', data: [488, 507, 530, 520, 642] },
{ name: 'AHC CAMP STANLEY', data: [75, 74, 68, 70, 70] },
{ name: 'AHC DUNHAM-CARLISLE BARRACKS', data: [467, 506, 551, 534, 498] },
{ name: 'AHC FILLMORE-NEW CUMBERLAND', data: [157, 149, 162, 171, 160] },
{ name: 'AHC FOX-REDSTONE ARSENAL', data: [1449, 1568, 1664, 1727, 1570] },
{ name: 'AHC GRAFENWOEHR', data: [474, 422, 429, 470, 483] },
{ name: 'AHC GUTHRIE-DRUM', data: [982, 1051, 1132, 1151, 1117] },
{ name: 'AHC HOHENFELS', data: [119, 134, 143, 148, 139] },
{ name: 'AHC KAISERSLAUTERN', data: [262, 268, 301, 299, 311] },
{ name: 'AHC KENNER-LEE', data: [1853, 2022, 2206, 2260, 2268] },
{ name: 'AHC KIRK-ABERDEEN PRVNG GD', data: [681, 745, 826, 817, 807] },
{ name: 'AHC LYSTER-RUCKER', data: [1430, 1510, 1655, 1674, 1688] },
{ name: 'AHC MCAFEE-WHITE SANDS MSL RAN', data: [108, 116, 118, 121, 116] },
{ name: 'AHC MCDONALD-EUSTIS', data: [1451, 1559, 1675, 1680, 1536] },
{ name: 'AHC MCNAIR-MYER-HENDERSON HALL', data: [18, 30, 34, 34, 33] },
{ name: 'AHC MONTEREY', data: [442, 478, 531, 528, 574] },
{ name: 'AHC MUNSON-LEAVENWORTH', data: [1231, 1339, 1497, 1517, 1489] },
{ name: 'AHC PATCH BKS-STUTTGART', data: [349, 379, 409, 416, 416] },
{ name: 'AHC R W BLISS-HUACHUCA', data: [976, 1080, 1215, 1207, 1175] },
{ name: 'AHC ROCK ISLAND ARSENAL', data: [195, 199, 230, 242, 212] },
{ name: 'AHC RODRIGUEZ-BUCHANAN', data: [164, 159, 174, 181, 192] },
{ name: 'AHC SCHOFIELD BARRACKS', data: [823, 849, 934, 932, 950] },
{ name: 'AHC SHAPE', data: [133, 132, 149, 135, 140] },
{ name: 'AHC TUTTLE-HUNTER ARMY AIRFLD', data: [883, 914, 991, 968, 1007] },
{ name: 'AHC VILSECK', data: [395, 411, 434, 402, 397] },
{ name: 'AHC WIESBADEN', data: [377, 381, 395, 418, 452] },
{ name: 'AHC YUMA PROVING GROUND', data: [20, 22, 18, 17, 17] },
{ name: 'AHC-CAMP CARROLL-KOREA', data: [171, 177, 182, 193, 242] },


        ]
    }

    angular.element('#trendingChart').highcharts(trending)


    //ON LOAD

    $scope.goReport(0);
    $scope.sendQuery();

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


}]);