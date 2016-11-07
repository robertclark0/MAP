analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;
    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();
    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.operations = [
        { name: "Range", type: 'op-checklist' },
        { name: "Equal", type: 'op-select' },
        { name: "Toggle", type: 'op-toggle' },
        { name: "Between", type: 'op-between' },
        { name: "Greater", type: 'op-select' },
        { name: "Less", type: 'op-select' },
        { name: "Greater or Equal", type: 'op-select' },
        { name: "Less or Equal", type: 'op-select' }
    ]

    $scope.disabled = true;
    $scope.selectedOperation = null

    $scope.newFilter = {
        model: null,
        alias: null,
        dataValue: null,
        operations: [],
        selectedValues: []
    };


    $scope.checkTypeSelection = function () {
        $scope.newFilter.alias = $scope.newFilter.model.name;
    };
    $scope.checkDataSelection = function () {
        $scope.newFilter.alias = $scope.newFilter.dataValue.COLUMN_NAME;
    };
    $scope.addOperation = function () {
        $scope.newFilter.operations.push({ operation: $scope.selectedOperation, useData: true });
        $scope.selectedOperation = null
    }
    $scope.saveFilter = function () {
        if ($scope.newFilter.model.type === 'custom-filter') { 

            var filter = angular.copy($scope.newFilter);
            filter.GUID = SF.generateGUID();

            $scope.componentProperties.editObject.filters.push(filter);
        }
        else {
            var filter = angular.copy($scope.newFilter);
            filter.alias = filter.model.name;
            filter.GUID = SF.generateGUID();

            $scope.componentProperties.editObject.filters.push(filter);
        }
        $scope.clearFilter();
    };
    $scope.clearFilter = function (clearTypeBool) {
        if (clearTypeBool) {
            $scope.newFilter.model = null;
        }       
        $scope.newFilter.alias = null;
        $scope.newFilter.dataValue = null;
        $scope.newFilter.operations.length = 0;
        $scope.newFilter.selectedValues.length = 0;
        $scope.selectedOperation = null
    };

    $scope.$watch('newFilter', function (nv) {
        if (nv.model) {
            if (nv.model.type === 'custom-filter') {
                if (nv.dataValue !== null && nv.operations.length > 0) {
                    $scope.disabled = false;
                }
                else {
                    $scope.disabled = true;
                }
            }
            else{
                $scope.disabled = false;
            }
        }
    }, true);


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);