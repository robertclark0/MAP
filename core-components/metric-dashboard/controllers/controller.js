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

}]);