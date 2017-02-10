mapApp.directive('combinationFilter', [function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/combination-filter/combinationFilter.html',
        link: link
    };

    function link(scope, elem, attr) {





        var onLoad = function () {

        }();
    };
}]);


