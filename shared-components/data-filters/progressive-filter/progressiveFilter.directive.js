mapApp.directive('progressive-filter', [function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/progressive-filter/progressiveFilter.html',
        link: link
    };

    function link(scope, elem, attr) {





        var onLoad = function () {
          
        }();
    };
}]);


