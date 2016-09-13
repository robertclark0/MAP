metricDashboard.controller('MetricDashboard', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;

    $scope.name = DSO.name;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1);
    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    };

    API.dataSources().save(logger.logPostObject({ entityCode: SO.productLine.current })).$promise.then(function (response) {

        console.log(response);

        ////FOREACH respone.result array objecy -->
        //var tasks = [];

        //tasks = response.result.map(function (res) {
        //    return function () {
        //        return API.dataSourceParameters().save({ dataSourceID: res.DataSourceID }).$promise.then(function (data) {
        //            return data;
        //        });
        //    };
        //});

        //var p = tasks[0]();
        //for (var i = 1; i < tasks.length; i++) {
        //    p = p.then(tasks[i]);
        //}

        //p.then(function (big) {
        //    console.log(big);
        //});

    }).catch(function (error) {
        logger.toast.error('Error Getting Data Sources', error);
    });


    $scope.sendTestQuery = function () {

        var queryObject = {
            source: {
                product: "TELE360",
                type: 'table',
                name: 'TeleHealth_360_CAPER'
            },
            pagination:
            {
                enabled: true,
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
                        name: 'Gender',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'case-count',
                            allias: 'Gender_F',
                            operators: [
                                {
                                    type: 'equal',
                                    values: ['F'],
                                    valueType: 'string'
                                }
                            ]
                        }
                    },
                    {
                        name: 'Gender',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'case-count',
                            allias: 'Gender_M',
                            operators: [
                                {
                                    type: 'equal',
                                    values: ['M'],
                                    valueType: 'string'
                                }
                            ]
                        }
                    },
                    {
                        name: 'PA_Work_RVU',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'case-sum',
                            round: 2,
                            allias: 'Sum',
                            operators:
                            [
                                {
                                    type: 'greater',
                                    values: [0],
                                    valueType: null
                                },
                                {
                                    type: 'lessEqual',
                                    values: [1],
                                    valueType: null
                                }
                            ]
                        }
                    },
            ],
            filters:
            [
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
                }
            ]
        };
        //API.download().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (response) { console.log(response); });
        API.download().get().$promise.then(function (response) { console.log(response); }).catch(function (response) { console.log(response); });
        //window.location = "http://localhost:51880/api/download"
    };

}]);