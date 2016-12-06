mapApp.directive('dsoCount', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selection-operations/count.html',
        link: link
    };

    function link(scope, elem, attr) {



    };
}]);