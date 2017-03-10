mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'current', 'appManager', 'dataFilterFactory', 'viewFactory', function (mdPanelRef, $scope, filter, current, appManager, dataFilterFactory, viewFactory) {

    var DF = appManager.data.DF;
    var API = appManager.data.API;

    $scope.filter = filter;
    $scope.current = current;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        
        item.value.forEach(function (value, index) {
            $scope.filter.operations[index].selectedValues[0] = value;
        });
        $scope.filter.formatedModel = $scope.format(item.value)

        var dataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, 0);
        API.query().save({ query: queryObject }).$promise.then(function (response) {
            dataObject.result = response.result;
        });

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