var reportViewer = angular.module('reportViewer', []);
reportViewer.controller('ReportViewer', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

    //    Controller and Scope variables
    var SF = appManager.state.SF;
    var SO = appManager.state.SO;
    var DSO = appManager.state.DSO;

    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    //

    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    }

}]);