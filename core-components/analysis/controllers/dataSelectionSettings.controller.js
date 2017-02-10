analysis.controller('DataSelectionSettings', ['$scope', '$mdDialog', 'selection', 'current', 'appManager', function ($scope, $mdDialog, selection, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.selection = selection;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;
    var SF = appManager.state.SF;

    $scope.pivotProgress = false;

    $scope.pivotChcked = function () {
        if (selection.pivot) {
            loadPivotValues();
            selection.aggregateFunction = true;
        }
    };
    $scope.aggregateFunctionChecked = function () {
        if (!selection.aggregateFunction) {
            selection.pivot = false;
        }
    };


    function loadPivotValues() {
        if (selection.pivot && selection.dataValue && !$scope.pivotValues) {

            $scope.pivotProgress = true;
            var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: [selection.dataValue.COLUMN_NAME], order: 'asc' } };

            API.schema().save(postObject).$promise.then(function (response) {
                $scope.pivotProgress = false;
                $scope.pivotValues = response.result;
            });
        }
    }
    loadPivotValues();

    $scope.pivotOperations = [
        { operation: "equal", name: "Equal", selectedValues: [] },
        { operation: "greater", name: "Greater", selectedValues: [] },
        { operation: "less", name: "Less", selectedValues: [] },
        { operation: "greaterE", name: "Greater or Equal", selectedValues: [] },
        { operation: "lessE", name: "Less or Equal", selectedValues: [] }

    ];
    $scope.pivotOperation = null;
    $scope.addOperation = function () {
        selection.pivotValues.push($scope.pivotOperation);
        $scope.pivotOperation = null;
    }
    $scope.removeOperation = function (index) {
        selection.pivotValues.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);