mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, operation, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        mdPanelRef.close();
    }

    $scope.format = function(item){
        return item.value[0] + ", " + dataFilterFactory.intToMonth(item.value[1]);
    }

    

}]);