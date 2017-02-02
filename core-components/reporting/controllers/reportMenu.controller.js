reporting.controller('ReportMenu', ['$scope', 'appManager', 'reports', 'current', 'mdPanelRef', 'viewFactory', function ($scope, appManager, reports, current, mdPanelRef, viewFactory) {

    API = appManager.data.API;
    logger = appManager.logger;
    SO = appManager.state.SO;

    $scope.reports = reports;

    $scope.selectReport = function (report) {
        current.report = report;

        API.report().save(logger.postObject({ report: { GUID: report.GUID }, type: 'get' })).$promise.then(function (response) {
            var canvas = JSON.parse(response.result.JSON);
            viewFactory.setCanvas(canvas, current);
            
            mdPanelRef.close();
        });       
    };

}]);