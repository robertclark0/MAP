mapApp.directive('cohortSelection', [function () {
    return {
        restrict: 'E',
        scope: {
            query: '=',
            run: '='
        },
        replace: true,
        templateUrl: 'shared-components/filters/cohort-selection/cohortSelection.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.query.filters[0].operators[0].values[0] = 1;
        scope.query.filters[1].operators[0].values[0] = 1;
        scope.query.filters[2].operators[0].values[0] = 1;


        scope.chup = true;
        scope.poly = true;
        scope.hu = true;
        scope.pain = true;

        scope.checkedCHUP = function () {
            if (scope.chup) {
                scope.query.filters[0].operators[0].values[0] = 1;
                scope.query.filters[1].operators[0].values[0] = 1;
                scope.query.filters[2].operators[0].values[0] = 1;

                scope.chup = true;
                scope.poly = true;
                scope.hu = true;
                scope.pain = true;

            }
            else {
                scope.query.filters[0].operators[0].values[0] = 0;
                scope.query.filters[1].operators[0].values[0] = 0;
                scope.query.filters[2].operators[0].values[0] = 0;

                scope.chup = false;
                scope.poly = false;
                scope.hu = false;
                scope.pain = false;

            }
            scope.run();
        };
        scope.checkedHU = function(){
            if (scope.hu) {
                scope.query.filters[0].operators[0].values[0] = 1;
            }
            else {
                scope.query.filters[0].operators[0].values[0] = 0;
            }
            scope.run();
        };
        scope.checkedPain = function(){
            if (scope.pain) {
                scope.query.filters[1].operators[0].values[0] = 1;
            }
            else {
                scope.query.filters[1].operators[0].values[0] = 0;
            }
            scope.run();
        };
        scope.checkedPoly = function(){        
            if (scope.poly) {
                scope.query.filters[2].operators[0].values[0] = 1;
            }
            else {
                scope.query.filters[2].operators[0].values[0] = 0;
            }
            scope.run();
        };


        //scope.checkAll = function () {
        //    if (scope.chup) {
        //        scope.poly = true;
        //        scope.hu = true;
        //        scope.pain = true;
        //    } else {
        //        scope.poly = false;
        //        scope.hu = false;
        //        scope.pain = false;
        //    }
        //};
        //scope.allChecked = function () {
        //    if (scope.poly && scope.hu && scope.pain) {
        //        scope.chup = true;
        //    }
        //    else {
        //        scope.chup = false;
        //    }
        //};
    };
}]);