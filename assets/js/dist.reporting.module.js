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

                $scope.goReport(0);
                $scope.sendQuery();
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

    $scope.months = [{ name: "April", number: 4 }, { name: "May", number: 5 }, { name: "June", number: 6 }, { name: "July", number: 7 }, { name: "August", number: 8 }, { name: "September", number: 9 }];
    $scope.selectedMonth = { name: "September", number: 9 };
    $scope.checkMonth = function () {

        $scope.queryObjects.forEach(function (query) {
            query.filters[query.filters.map(function (obj) { return obj.name }).indexOf("FM")].operators[0].values[0] = $scope.selectedMonth.number;
        });

        $scope.sendQuery();

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

    $scope.chipLevels = [];
    $scope.drillUp = function (index) {
        console.log(index);
        console.log($scope.drillDownIndex);
        console.log($scope.drillDownSelection);

        $scope.drillDownSelection.length = index;
        $scope.chipLevels.length = index;
        $scope.drillDownIndex = index ;

        console.log(index);
        console.log($scope.drillDownIndex);
        console.log($scope.drillDownSelection);

        $scope.sendQuery();

    };

    $scope.$watch('drillDownSelection', function (nv, ov) {

        var index = $scope.drillDownSelection.length - 1;

        if ($scope.drillDownSelection[index] === $scope.drillDownSelection[index - 1]) {
            $scope.chipLevels[index] = $scope.drillDownSelection[index] + " (Child)";
        }
        else {
            $scope.chipLevels[index] = $scope.drillDownSelection[index];
        }

    }, true);


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
                    name: 'NAME',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'DOB',
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
                    name: 'SSN',
                    order: 'asc',
                    aggregate: false
                },
                {
                    name: 'SPONSSN',
                    order: 'asc',
                    aggregate: false
                },
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
        if (DO.user && DO.user.DMIS) {
            if (drill) { $scope.drillDownIndex++; };

            var query = $scope.queryObjects[$scope.drillDownIndex];

            query.filters.push({ name: 'DMISID', operators: [{ type: 'equal', values: [DO.user.DMIS], valueType: 'int' }] });

            API.query().save({ query: query }).$promise.then(function (response) {

                $scope.result = response.result;
                $scope.updatedResult = $scope.updateAggregate(response.result);

                aggregateChart.xAxis[0].setCategories($scope.updatedResult[$scope.drillDownLevels[$scope.drillDownIndex]]);
                aggregateChart.series[0].setData($scope.updatedResult.CNT);



            }).catch(function (error) { console.log(error); });
        }
        else {
            logger.toast.error('Unable To Determine User Location For Query');
        }

    };


    ///============================= GENERATE DOWNLOAD ===========================

    $scope.download = function () {

        if (DO.user && DO.user.DMIS) {
            var query = $scope.queryObjects[$scope.drillDownIndex];

            query.aggregation.enabled = false;
            query.pagination.enabled = false;
            query.filters.push({ name: 'DMISID', operators: [{ type: 'equal', values: [DO.user.DMIS], valueType: 'int' }] });


            API.download().save({ query: query }).$promise.then(function (response) {
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
            .catch(function (response) {
                console.log(response);
            });
        }
        else {
            logger.toast.error('Unable To Determine User Location For Query');
        }

        
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

        { name: 'ACH BASSETT-WAINWRIGHT', data: [687, 705, 701, 648, 599, 980] },
        { name: 'ACH BAYNE-JONES-POLK', data: [1161, 1128, 1157, 1062, 988, 1581] },
        { name: 'ACH BLANCHFIELD-CAMPBELL', data: [2309, 2404, 2402, 2282, 2177, 3264] },
        { name: 'ACH BRIAN ALLGOOD-SEOUL', data: [365, 339, 329, 299, 265, 474] },
        { name: 'ACH EVANS-CARSON', data: [2659, 2731, 2708, 2489, 2308, 4162] },
        { name: 'ACH IRELAND- KNOX', data: [3099, 3172, 3156, 2918, 2773, 4172] },
        { name: 'ACH IRWIN-RILEY', data: [790, 828, 822, 782, 745, 1139] },
        { name: 'ACH KELLER-WEST POINT', data: [344, 382, 373, 347, 333, 678] },
        { name: 'ACH LEONARD WOOD', data: [2129, 2077, 1969, 1779, 1744, 2841] },
        { name: 'ACH MARTIN-BENNING', data: [2946, 2830, 2854, 2750, 2653, 4189] },
        { name: 'ACH MONCRIEF-JACKSON', data: [1641, 1655, 1677, 1592, 1479, 2484] },
        { name: 'ACH REYNOLDS-SILL', data: [3013, 2993, 2949, 2768, 2669, 4217] },
        { name: 'ACH WEED-IRWIN', data: [515, 525, 486, 462, 428, 825] },
        { name: 'ACH WINN-STEWART', data: [1914, 1887, 1926, 1817, 1747, 2765] },
        { name: 'AHC BG CRAWFORD SAMS-CAMP ZAMA', data: [153, 132, 156, 126, 125, 214] },
        { name: 'AHC FOX-REDSTONE ARSENAL', data: [1570, 1727, 1664, 1568, 1449, 2284] },
        { name: 'AHC GUTHRIE-DRUM', data: [1117, 1151, 1132, 1051, 982, 1419] },
        { name: 'AHC KENNER-LEE', data: [2268, 2260, 2206, 2022, 1853, 3045] },
        { name: 'AHC LYSTER-RUCKER', data: [1688, 1674, 1655, 1510, 1430, 2338] },
        { name: 'AHC MCDONALD-EUSTIS', data: [1536, 1680, 1675, 1559, 1451, 2513] },
        { name: 'AHC MUNSON-LEAVENWORTH', data: [1489, 1517, 1497, 1339, 1231, 2019] },
        { name: 'AHC R W BLISS-HUACHUCA', data: [1175, 1207, 1215, 1080, 976, 1612] },
        { name: 'AMC BAMC-FSH', data: [624, 653, 661, 619, 618, 1040] },
        { name: 'AMC DARNALL-HOOD', data: [1391, 1437, 1466, 1422, 1377, 2367] },
        { name: 'AMC EISENHOWER-GORDON', data: [2576, 2588, 2573, 2416, 2367, 4087] },
        { name: 'AMC MADIGAN-LEWIS', data: [2478, 2460, 2404, 2230, 2089, 3731] },
        { name: 'AMC TRIPLER-SHAFTER', data: [1400, 1410, 1430, 1400, 1332, 2632] },
        { name: 'AMC WILLIAM BEAUMONT-BLISS', data: [551, 559, 550, 495, 483, 884] },
        { name: 'AMC WOMACK-BRAGG', data: [1275, 1352, 1327, 1279, 1140, 1939] },
        { name: 'KIMBROUGH AMB CAR CEN-MEADE', data: [1601, 1641, 1646, 1483, 1350, 2531] },
        { name: 'LANDSTUHL REGIONAL MEDCEN', data: [401, 423, 397, 385, 375, 698] }


        ]
    }

    angular.element('#trendingChart').highcharts(trending)


    //ON LOAD

    //$scope.goReport(0);
    //$scope.sendQuery();

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


}]);