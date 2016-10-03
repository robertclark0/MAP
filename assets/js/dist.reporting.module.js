var reporting = angular.module('reporting', []);
reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', function ($scope, appManager, $state, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;

    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    //

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

}]);