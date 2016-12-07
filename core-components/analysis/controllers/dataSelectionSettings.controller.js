analysis.controller('DataSelectionSettings', ['$scope', '$mdDialog', 'selection', 'current', 'appManager', function ($scope, $mdDialog, selection, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.selection = selection;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.pivotProgress = false;

    $scope.operations = [
        { name: "Count", type: 'dso-check' },
        { name: "Sum", type: 'dso-check' },
        { name: "Average", type: 'dso-check' },
    ]
    $scope.selectedOperation = null;

    $scope.checkInput = function () {
        if (selection.pivot) {
            loadPivotValues();
            var index = selection.alias.indexOf(':');
            if (index < 0 && selection.pivotValue) {
                selection.alias += " : " + selection.pivotValue;
            }
        }
        else {
            var index = selection.alias.indexOf(':');
            if (index >= 0) {
                selection.alias = selection.alias.substr(0, index - 1);
            }
        }
    };

    $scope.pivotSelected = function () {
        var index = selection.alias.indexOf(':');

        if (index < 0) {
            selection.alias += " : " + selection.pivotValue;
        }
        else {
            selection.alias = selection.alias.substr(0, index - 1) + " : " + selection.pivotValue;
        }
    };

    function loadPivotValues() {
        if (selection.pivot && selection.dataValue && !$scope.pivotValues) {

            $scope.pivotProgress = true;
            var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: selection.dataValue.COLUMN_NAME, order: 'asc' } };

            API.schema().save(postObject).$promise.then(function (response) {
                console.log(response.result);
                $scope.pivotProgress = false;
                $scope.pivotValues = response.result;
            });
        }
    }
    loadPivotValues();


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);