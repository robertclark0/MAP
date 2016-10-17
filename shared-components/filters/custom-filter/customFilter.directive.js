mapApp.directive('customFilter', [ function () {
    return {
        restrict: 'E',
        scope: {
            filter: '='
        },
        replace: true,
        templateUrl: 'shared-components/filters/custom-filter/customFilter.html',
        link: link
    };

    function link(scope, elem, attr) {


    };
}]);