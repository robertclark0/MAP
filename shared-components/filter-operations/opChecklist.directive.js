mapApp.directive('opChecklist', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/filter-operations/opChecklist.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID).dataValues;
        
    };
}]);