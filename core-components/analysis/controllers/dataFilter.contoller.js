analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SF = appManager.state.SF;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();
    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.selectedLevel = $scope.componentProperties.editObject.selections[0];
    $scope.selectionIndex = 0;

    $scope.newFilter = new SC.DataFilter($scope.filters[0]);

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = { value: null };


    // ---- ---- ---- ---- Filter Settings - custom ---- ---- ---- ---- //
    $scope.selectionChange = function () {
        if ($scope.newFilter.dataValue) {
            $scope.newFilter.alias = $scope.newFilter.dataValue.COLUMN_NAME;
        }
    };

    $scope.addOperation = function () {
        $scope.newFilter.operations.push($scope.selectedOperation.value);
        $scope.selectedOperation.value = null
    }

    $scope.removeOperation = function (index) {
        $scope.newFilter.operations.splice(index, 1);
    };

    $scope.createFilter = function () {
        if ($scope.dataFilterForm.$valid) {

            var filter = angular.copy($scope.newFilter);
            filter.GUID = SF.generateGUID();

            $scope.componentProperties.editObject.filters[$scope.selectionIndex].push(filter);
            $scope.clearFilter();
        }
    };

    $scope.clearFilter = function () {
        $scope.newFilter = new SC.DataFilter($scope.filters[0]);

        $scope.dataFilterForm.$setPristine();
        $scope.dataFilterForm.$setUntouched();
    };


    // ---- ---- ---- ---- Filter Settings - combination\progressive ---- ---- ---- ---- //

    $scope.customOperation = {
        dataValue: null
    };
    $scope.addCustomOperation = function () {
        $scope.newFilter.operations.push(
            {   
                dataValue: $scope.customOperation.dataValue,
                operation: "equal",
                name: "Equal",
                type: "dfo-select",
                selectedValues: []
            });
        $scope.customOperation.dataValue = null;
    };


    // ---- ---- ---- ---- Selection Level Navigation ---- ---- ---- ---- //
    $scope.changeSelectionLevel = function () {
        $scope.selectionIndex = $scope.componentProperties.editObject.selections.indexOf($scope.selectedLevel);
    }


    // ---- ---- ---- ---- Selection Levels ---- ---- ---- ---- //
    $scope.moveSelectionUp = function (source, target, targetIndex) {
        if (targetIndex > 0) {
            var desitationIndex = targetIndex - 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };

    $scope.deleteSelection = function (index) {
        $scope.componentProperties.editObject.filters[$scope.selectionIndex].splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);