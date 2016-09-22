mapApp.directive('selectionControl', [function () {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            element: '='
        },
        templateUrl: 'shared-components/selection-control/selectionControl.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.myChips = [];
        console.log(scope.data);
        scope.drillDown = scope.data.drillDown;
    };
}]);