mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        item.value.forEach(function (value, index) {
            $scope.filter.operations[index].selectedValues[0] = value;
        });
        $scope.filter.formatedModel = $scope.format(item.value)
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