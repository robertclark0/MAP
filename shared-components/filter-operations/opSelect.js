mapApp.directive('opSelect', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/filter-operations/opSelect.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.list = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20];

        
        scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID).dataValues;

        scope.$watch('filterDataObject', function () {
            scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID).dataValues;
        }, true);

    };
}]);