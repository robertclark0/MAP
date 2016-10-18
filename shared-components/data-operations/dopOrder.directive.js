mapApp.directive('dopOrder', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-operations/dopOrder.html',
        link: link
    };

    function link(scope, elem, attr) {

        

    };
}]);