mapApp.directive('selectionControl', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        templateUrl: 'shared-components/canvas-elements/selection-control/selectionControl.html',
        link: link
    };

    function link(scope, elem, attr) {




        
        //scope.$watch('element.dataGroup', function () {
        //    if (scope.element.dataGroup) {
        //        scope.drillDown = scope.element.dataGroup.drillDown;
        //    }
        //    else {
        //        scope.drillDown = { level: [], selection: [] };
        //    }
        //}, true);


        //scope.autoList = ["one", "two", "three", "four"];

        //scope.querySearch = function(query) {
        //    var results = query ? scope.autoList.filter(createFilterFor(query)) : [];
        //    return results;
        //}
        //function createFilterFor(query) {
        //    var lowercaseQuery = angular.lowercase(query);

        //    return function filterFn(value) {
        //        return (value.indexOf(lowercaseQuery) === 0);
        //    };

        //}
    };
}]);