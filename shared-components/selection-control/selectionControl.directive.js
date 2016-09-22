mapApp.directive('selectionControl', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        templateUrl: 'shared-components/selection-control/selectionControl.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.myChips = [];
        //console.log(scope.data);
        scope.data = scope.element.dataGroup;

    };
}]);