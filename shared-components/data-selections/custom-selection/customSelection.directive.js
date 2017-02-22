mapApp.directive('customDataSelection', ['appManager', '$mdDialog', function (appManager, $mdDialog) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            current: '=',
            index: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selections/custom-selection/customSelection.html',
        link: link
    };

    function link(scope, elem, attr) {
        console.log(scope.index);
        scope.SF = appManager.state.SF;

        scope.showOperations = function (ev) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataSelectionSettings.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataSelectionSettings',
                locals: {
                    selection: scope.selection,
                    current: scope.current
                }
            });
        };

    };
}]);