reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', function ($scope, appManager, $state, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;

    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    //
    $scope.currentReport = 'Summary Report';
    $scope.reportList = [];

    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showAnalysis = function () {
        var modules =  DSO.modules.map(function (obj) { return obj.Module });
        if (modules.indexOf('analysis') > -1) {
            return true;
        }
        return false;
    };

    //GET REPORT LIST
    API.getReportList().save(logger.postObject({ entityCode: SO.productLine.current })).$promise.then(function (response) {
        console.log(response);
        if (response.result.length > 0) {
            $scope.reportList = response.result;
        }
    });

    $scope.showReportMenu = function (ev) {


        var config = {
            attachTo: angular.element(document.body),
            template: '<p>TESTING</p>',
            position: position,
            clickOutsideToClose: true
        }
    };

    $scope.showReport = function (ev) {
        var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('align-start', 'below');

        $mdDialog.show({
            template: '<div><p>Testing</p></div>',
            parent: angular.element(document.body),
            targetEvent: ev,
            position: position,
            clickOutsideToClose: true
        });//.then(function () { }, function () { });
    };

}]);