analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;
    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();
    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.operations = ["Range", "Equal", "Toggle", "Between", "Greater", "Less", "Greater or Equal", "Less or Equal"]

    $scope.disabled = true;
    $scope.selectedOperation = null

    $scope.newFilter = {
        model: null,
        allias: null,
        dataValue: null,
        operations: []
    };


    $scope.checkTypeSelection = function () {
        $scope.newFilter.allias = $scope.newFilter.model.name;
    };
    $scope.checkDataSelection = function () {
        $scope.newFilter.allias = $scope.newFilter.dataValue.COLUMN_NAME;
    };
    $scope.addOperation = function () {
        $scope.newFilter.operations.push({ operation: $scope.selectedOperation, useData: true });
        $scope.selectedOperation = null
    }
    $scope.saveFilter = function () {
        if ($scope.newFilter.model.type === 'custom') {
            var newGUID = SF.generateGUID();
            var dataGroupReference = { GUID: newGUID, selectedValues: [] };
            var filter = angular.copy($scope.newFilter);
            filter.GUID = newGUID;

            $scope.componentProperties.parentTemp.push(filter);
            $scope.componentProperties.editObject.filters.push(dataGroupReference);
        }
        else {

        }
    };

    $scope.$watch('newFilter', function (nv) {
        if (nv.model) {
            if (nv.model.type === 'custom') {
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