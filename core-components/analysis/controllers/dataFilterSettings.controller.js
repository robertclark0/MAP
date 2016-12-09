analysis.controller('DataFilterSettings', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', function ($scope, $mdDialog, filter, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var SF = appManager.state.SF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null

    $scope.orderChange = function () {
        var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.orderValue } };
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