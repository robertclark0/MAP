mapApp.directive('customDataFilter', ['appManager', '$mdDialog', function (appManager, $mdDialog) {
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
        scope.SF = appManager.state.SF;

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