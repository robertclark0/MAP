mapApp.directive('customDataFilter', ['appManager', '$mdDialog', 'dataFilterFactory', function (appManager, $mdDialog, dataFilterFactory) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/custom-filter/customFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        var DO = appManager.data.DO;
        scope.SF = appManager.state.SF;
        
        //check to see if filter values exist, if not, get them.
        if (DO.filters.map(function (obj) { return obj.GUID }).indexOf(scope.filter.GUID) < 0) {
            dataFilterFactory.populateFilterData(scope.filter, scope.current.dataGroup);
        }

        scope.showOperations = function (ev) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataFilterSettings.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataFilterSettings',
                locals: {
                    filter: scope.filter,
                    current: scope.current
                }
            });
        };

    };
}]);