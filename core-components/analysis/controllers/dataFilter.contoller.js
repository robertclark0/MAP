analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    //$scope.SF = appManager.state.SF;
    //$scope.DSO = appManager.state.DSO;
    //$scope.DO = appManager.data.DO;
    var SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();

    $scope.operations = ["Range", "Equal", "Toggle", "Between", "Greater", "Less", "Greater or Equal", "Less or Equal" ]

    $scope.filterName = function (filter) {
        return filter.name + " ..." + filter.GUID.substr(32,4);
    };

    $scope.selectedModel = null;
    $scope.disabled = true;
    $scope.allias = null;
    $scope.selectedData = null;
    $scope.selectedOperation = null
    $scope.selectedOperations = [];


    $scope.checkTypeSelection = function () {
        $scope.allias = $scope.selectedModel.name;
    };
    $scope.checkDataSelection = function () {
        $scope.allias = $scope.selectedData.COLUMN_NAME;
    };
    $scope.addOperation = function () {
        $scope.selectedOperations.push({ operation: $scope.selectedOperation, useData: true });
        $scope.selectedOperation = null
    }


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);