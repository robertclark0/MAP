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

        scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID).dataValues;

    };
}]);