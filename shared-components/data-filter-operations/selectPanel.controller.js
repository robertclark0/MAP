mapApp.controller('SelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, operation, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        operation.formatedModel = $scope.format(item);
        mdPanelRef.close();
    }

    $scope.format = function (item) {
        if ($scope.filter.advanced.date.convertToMonth) {
            return dataFilterFactory.intToMonth(item);
        }
        else {
            return item;
        }
    }

}]);