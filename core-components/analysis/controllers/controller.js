analysis.controller('Analysis', ['$scope', 'appManager', '$state', '$interval', function ($scope, appManager, $state, $interval) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;


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

    $scope.showAnalysis = function () {
        var modules = DSO.modules.map(function (obj) { return obj.Module });

        if (modules.indexOf('analysis') > -1) {
            return true;
        }
        return false;
    };

    $scope.sendTestQuery = function () {

        var queryObject = {
            source: {
                product: "TELE360",
                type: 'table',
                name: 'TeleHealth_360_CAPER'
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
                        name: 'Month',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'Month_Count'
                        }
                    },
                    {
                        name: 'Month',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'case-count',
                            allias: 'Month_Jan',
                            operators:
                            [
                                {
                                    type: 'equal',
                                    values: ['Jan'],
                                    valueType: 'string'
                                }
                            ]
                        }
                    }
                    
            ],
            filters:
            [
            //    {
            //        name: 'FY',
            //        operators:
            //        [
            //            {
            //                type: 'equal',
            //                values: ['2016'],
            //                valueType: 'string'
            //            }
            //        ]
            //    },
            //    {
            //        name: 'FM',
            //        operators:
            //        [
            //            {
            //                type: 'equal',
            //                values: ['1'],
            //                valueType: 'string'
            //            }
            //        ]
            //    }
            ]
        };
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
        API.query().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (error) { console.log(error); });

    };

}]);