analysis.controller('DataFilterOperations', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', function ($scope, $mdDialog, filter, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = [
        { name: "Range", type: 'op-checklist', selectedValues: [] },
        { name: "Equal", type: 'op-select', selectedValues: [] },
        { name: "Toggle", type: 'op-toggle', selectedValues: [] },
        { name: "Between", type: 'op-between', selectedValues: [] },
        { name: "Greater", type: 'op-select', selectedValues: [] },
        { name: "Less", type: 'op-select', selectedValues: [] },
        { name: "Greater or Equal", type: 'op-select', selectedValues: [] },
        { name: "Less or Equal", type: 'op-select', selectedValues: [] }
    ]
    $scope.selectedOperation = null

    $scope.filterValueOrderOptions = [
        { name: "Default", value: null },
        { name: "Ascending", value: "asc" },
        { name: "Descending", value: "desc" }
    ];

    $scope.orderChange = function () {
        var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.dataValueOrder } };
        var filterDataObject = DF.getFilter(filter.GUID);

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues = response.result;
        });
    };

    
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