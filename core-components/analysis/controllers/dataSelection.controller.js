analysis.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;

    $scope.selectedLevel = $scope.componentProperties.editObject.selections[0];
    $scope.selectionIndex = 0;

    $scope.newSelection = {
        model: {name: "Custom Data Selection", type: "custom-data-selection"},
        dataValue: null,
        alias: null, 
        operations: []
    };

    $scope.operations = [
        { name: "Order", type: 'dso-order' },
        { name: "Count", type: 'dso-count' },
        { name: "Sum", type: 'dso-sum' },
        { name: "Pivot", type: 'dso-pivot' },
    ]
    $scope.selectedOperation = null;


    // ---- ---- ---- ---- Selection Settings ---- ---- ---- ---- //
    $scope.selectionChange = function () {
        if ($scope.newSelection.dataValue) {
            $scope.newSelection.alias = $scope.newSelection.dataValue.COLUMN_NAME;
        }      
    };
  
    $scope.addOperation = function () {
        $scope.newSelection.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.newSelection.operations.splice(index, 1);
    };

    $scope.createSelection = function () {
        if ($scope.dataSelectionForm.$valid) {

            $scope.componentProperties.editObject.selections[$scope.selectionIndex].push(angular.copy($scope.newSelection));
            $scope.clearSelection();
        }
    };

    $scope.clearSelection = function () {
        $scope.newSelection.dataValue = null;
        $scope.newSelection.alias = null;
        $scope.newSelection.operations.length = 0;
        $scope.selectedOperation = null

        $scope.dataSelectionForm.$setPristine();
        $scope.dataSelectionForm.$setUntouched();
    };


    // ---- ---- ---- ---- Selection Level Navigation ---- ---- ---- ---- //
    $scope.addSelectionLevel = function () {
        $scope.componentProperties.editObject.selections.splice($scope.selectionIndex + 1, 0, []);
        $scope.componentProperties.editObject.filters.splice($scope.selectionIndex + 1, 0, []);

        $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex + 1];
        $scope.selectionIndex = $scope.selectionIndex + 1;
    };

    $scope.deleteSelectionLevel = function () {
        $scope.componentProperties.editObject.selections.splice($scope.selectionIndex, 1);
        $scope.componentProperties.editObject.filters.splice($scope.selectionIndex, 1);

        $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex];
        
        if ($scope.selectionIndex >= $scope.componentProperties.editObject.selections.length) {
            $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex - 1];
            $scope.selectionIndex = $scope.selectionIndex - 1;
        }
    }

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
        $scope.componentProperties.editObject.selections[$scope.selectionIndex].splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);