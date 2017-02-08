mapApp.directive('cohortDiagram', [function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/cohort-diagram/cohortDiagram.html',
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
            
            scope.filter.operations = [];
        };

        scope.change = function () {
            reset();
            if (scope.method === 'ex') {
				
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
				
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;							
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
					scope.filter.operations[1].selectedValues[0] = 0;					
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
					scope.filter.operations[0].selectedValues[0] = 0;
                } else if (scope.pain) {
                    scope.p = true;
					scope.filter.operations[0].selectedValues[0] = 0;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.poly) {
                    scope.pp = true;
					scope.filter.operations[1].selectedValues[0] = 0;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.hu) {
                    scope.h = true;
					scope.filter.operations[0].selectedValues[0] = 0;
					scope.filter.operations[1].selectedValues[0] = 0;
                }
            } else if (scope.method === 'in') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });	
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.pain) {
                    scope.chup = true;
                    scope.ppp = true;
                    scope.ph = true;
                    scope.p = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
                } else if (scope.poly) {
                    scope.chup = true;
                    scope.pp = true;
                    scope.ppp = true;
                    scope.pph = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.hu) {
                    scope.chup = true;
                    scope.h = true;
                    scope.ph = true;
                    scope.pph = true;		
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                }
            }
        };

    };
}]);


