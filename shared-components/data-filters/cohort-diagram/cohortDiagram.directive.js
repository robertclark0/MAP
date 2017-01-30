mapApp.directive('cohortDiagram', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/cohort-selection/cohortDiagram.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.poly = false;
        scope.hu = false;
        scope.pain = false;
        scope.method = 'ex';

        scope.pp = false;
        scope.p = false;
        scope.h = false;
        scope.ppp = false;
        scope.pph = false;
        scope.ph = false;
        scope.chup = false;

        function reset() {
            scope.pp = false;
            scope.p = false;
            scope.h = false;
            scope.ppp = false;
            scope.pph = false;
            scope.ph = false;
            scope.chup = false;
        };

        scope.change = function () {
            reset();
            if (scope.method === 'ex') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                } else if (scope.pain) {
                    scope.p = true;
                } else if (scope.poly) {
                    scope.pp = true;
                } else if (scope.hu) {
                    scope.h = true;
                }
            } else if (scope.method === 'in') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                    scope.chup = true;
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                    scope.chup = true;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                    scope.chup = true;
                } else if (scope.pain) {
                    scope.chup = true;
                    scope.ppp = true;
                    scope.ph = true;
                    scope.p = true;
                } else if (scope.poly) {
                    scope.chup = true;
                    scope.pp = true;
                    scope.ppp = true;
                    scope.pph = true;
                } else if (scope.hu) {
                    scope.chup = true;
                    scope.h = true;
                    scope.ph = true;
                    scope.pph = true;
                }
            }
        };

    };
}]);


