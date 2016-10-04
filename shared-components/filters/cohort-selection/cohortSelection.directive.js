mapApp.directive('cohortSelection', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        replace: true,
        templateUrl: 'shared-components/filters/cohort-selection/cohortSelection.html',
        link: link
    };

    function link(scope, elem, attr) {


    };
}]);