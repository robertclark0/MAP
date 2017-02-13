mapApp.directive('dfoChecklist', ['appManager', 'dataFilterFactory', function (appManager, dataFilterFactory) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filter-operations/checklist.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID);

        scope.$watch('filterDataObject', function (nv, ov) {
            if (nv !== ov) {
                scope.filterDataObject.dataValues = nv.dataValues;
            }
        }, true);

        scope.checkChanged = function () {
            scope.operation.selectedValues = scope.filterDataObject.dataValues.filter(function (obj) {
                return obj.isChecked;
            }).map(function (obj) {
                return obj.value;
            });
        };

        scope.format = function (item) {
            if (scope.filter.advanced.date.convertToMonth) {
                return dataFilterFactory.intToMonth(item);
            }
            else {
                return item;
            }         
        }
        
    };
}]);