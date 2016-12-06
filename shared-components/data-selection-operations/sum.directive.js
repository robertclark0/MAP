mapApp.directive('dsoSum', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selection-operations/sum.html',
        link: link
    };

    function link(scope, elem, attr) {



    };
}]);