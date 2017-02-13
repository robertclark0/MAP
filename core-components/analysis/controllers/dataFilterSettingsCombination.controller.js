analysis.controller('DataFilterSettingsCombination', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', 'dataFilterFactory', function ($scope, $mdDialog, filter, current, appManager, dataFilterFactory) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var SF = appManager.state.SF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = { value: null };

    $scope.orderChange = function () {

        //dataFilterFactory.populateFilterData(filter, current.dataGroup);

        filterDataObject = DF.getFilter($scope.filter.GUID)

        var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: $scope.filter.operations.map(function (operation) { return operation.dataValue.COLUMN_NAME; }), order: $scope.filter.orderValue } };

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues.length = 0;
            response.result.forEach(function (obj) {
                filterDataObject.dataValues.push({ value: obj, isChecked: false });
            });
        });


        //var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: [filter.dataValue.COLUMN_NAME], order: filter.orderValue } };
        //var filterDataObject = DF.getFilter(filter.GUID);

        //API.schema().save(postObject).$promise.then(function (response) {
        //    filterDataObject.dataValues.length = 0;
        //    response.result.forEach(function (obj) {
        //        filterDataObject.dataValues.push({ value: obj, isChecked: false });
        //    });
        //});
    };

    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);