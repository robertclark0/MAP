analysis.controller('DataFilterOperations', ['$scope', '$mdDialog', 'filter', function ($scope, $mdDialog, filter) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;

    $scope.operations = [
    { name: "Range", type: 'op-checklist' },
    { name: "Equal", type: 'op-select' },
    { name: "Toggle", type: 'op-toggle' },
    { name: "Between", type: 'op-between' },
    { name: "Greater", type: 'op-select' },
    { name: "Less", type: 'op-select' },
    { name: "Greater or Equal", type: 'op-select' },
    { name: "Less or Equal", type: 'op-select' }
    ]
    $scope.selectedOperation = null

    // ---- ---- ---- ---- Filter Settings ---- ---- ---- ---- //
    $scope.addOperation = function () {
        $scope.filter.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.filter.operations.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);