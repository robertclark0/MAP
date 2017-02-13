mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, operation, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        console.log(item);
        console.log($scope.format(item.value));
        mdPanelRef.close();
    }

    $scope.format = function (values) {
        if ($scope.filter.advanced.date.convertToMonth) {
            var formatedValue = [];
            values.forEach(function (value) {
                formatedValue.push(dataFilterFactory.intToMonth(value));
            });
            return formatedValue.join(', ');
        }
        else {
            return values.join(', ');
        }
    }

    

}]);