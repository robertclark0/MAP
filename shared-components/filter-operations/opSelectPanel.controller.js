mapApp.controller('SelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', function (mdPanelRef, $scope, filter, operation, appManager) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        mdPanelRef.close();
    }

}]);