analysis.controller('DataFilterSettings', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', 'dataFilterFactory', function ($scope, $mdDialog, filter, current, appManager, dataFilterFactory) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var SF = appManager.state.SF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null

    $scope.orderChange = function () {

        dataFilterFactory.populateFilterData(filter, current.dataGroup);


        //var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: [filter.dataValue.COLUMN_NAME], order: filter.orderValue } };
        //var filterDataObject = DF.getFilter(filter.GUID);

        //API.schema().save(postObject).$promise.then(function (response) {
        //    filterDataObject.dataValues.length = 0;
        //    response.result.forEach(function (obj) {
        //        filterDataObject.dataValues.push({ value: obj, isChecked: false });
        //    });
        //});
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