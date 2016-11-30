mapApp.directive('customFilter', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/filters/custom-filter/customFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        scope.SF = appManager.state.SF;
    };
}]);