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

        if (scope.element.dataGroup) {
            scope.drillDown = scope.element.dataGroup.drillDown;
        }
        else {
            scope.drillDown = { level: [], selection: [] };
        }    

        scope.autoList = ["one", "two", "three", "four"];

        scope.querySearch = function(query) {
            var results = query ? scope.autoList.filter(createFilterFor(query)) : [];
            return results;
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(vegetable) {
                return (vegetable.indexOf(lowercaseQuery) === 0);
            };

        }
    };
}]);