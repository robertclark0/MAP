analysis.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //

    var SO = appManager.state.SO;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;

    $scope.selectedOperation = null;

    $scope.selectionLevels = ["Level 1"];
    $scope.selectedLevel = "Level 1";
    $scope.selectionIndex = 0;

    $scope.newSelection = {
        dataValue: null,
        alias: null, 
        operations: []
    };

    $scope.selectionChange = function () {
        $scope.newSelection.alias = $scope.newSelection.dataValue.COLUMN_NAME;
    };

    $scope.operations = [
        { name: "Order", type: 'op-order' },
        { name: "Count", type: 'op-count' },
        { name: "Sum", type: 'op-sum' },
        { name: "Pivot", type: 'op-pivot' },
    ]

    $scope.addOperation = function () {
        $scope.newSelection.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }
    $scope.removeOperation = function (operation) {
        var index = $scope.newSelection.operations.indexOf(operation);
        $scope.newSelection.operations.splice(index, 1);
    };


    $scope.createSelection = function () {
        if ($scope.dataSelectionForm.$valid) {
            console.log($scope.selectionIndex);
            $scope.componentProperties.editObject.selections[$scope.selectionIndex].push(angular.copy($scope.newSelection));
        }
    };

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


    $scope.addSelectionLevel = function (index) {
        var label = "Level " + (index + 1);
        $scope.selectionLevels.push(label);
        $scope.componentProperties.editObject.selections.push([]);
        $scope.selectedLevel = $scope.selectionLevels[index];
        $scope.selectionIndex = index;
    };

    $scope.deleteSelectionLevel = function () {
        var index = $scope.componentProperties.editObject.selections.length - 1;
        $scope.selectionLevels.splice(index, 1);
        $scope.componentProperties.editObject.selections.splice(index, 1);
        $scope.selectedLevel = $scope.selectionLevels[index - 1];
        $scope.selectionIndex = index - 1;
    }

    $scope.changeSelectionLevel = function () {
        $scope.selectionIndex = $scope.selectionLevels.indexOf($scope.selectedLevel);
    }


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);