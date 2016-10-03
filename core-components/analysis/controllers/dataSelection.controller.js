analysis.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----      
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SO = appManager.state.SO;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;


    $scope.selected = [];
    $scope.selectionKey = { value: null };
    $scope.saveMode = false;
    $scope.saveIndex = null;

    $scope.$watch('DO.tableSchema | filter: { selected : true }', function (newValue) {
        $scope.selected = newValue.map(function (column) {
            return column.COLUMN_NAME;
        });
    }, true);

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    //SAVE
    $scope.saveSelection = function () {
        var selectionLevel = [];

        $scope.selected.forEach(function (entry) {
            var selected = new SC.DataSelection(entry);
            selectionLevel.push(selected);
        });

        $scope.componentProperties.editObject.selections.push(selectionLevel);
        $scope.componentProperties.editObject.drillDown.level.push($scope.selectionKey.value)

        clearSelections();
    };
    var clearSelections = function () {
        $scope.selected.length = 0;
        $scope.selectionKey.value = null;
        $scope.DO.tableSchema.forEach(function (entry) {
            entry.selected = false;
        });
    };


    //UPDATE
    $scope.updateSelection = function () {
        var selectionLevel = [];

        $scope.selected.forEach(function (entry) {
            var selected = new SC.DataSelection(entry);
            selectionLevel.push(selected);
        });

        $scope.componentProperties.editObject.selections[$scope.saveIndex] = selectionLevel;
        $scope.componentProperties.editObject.drillDown.level[$scope.saveIndex] = $scope.selectionKey.value;

        clearSelections();
        $scope.saveMode = false;
    };

    //DELETE
    $scope.deleteSelectionLevel = function (index) {
        $scope.componentProperties.editObject.selections.splice(index, 1);
        $scope.componentProperties.editObject.drillDown.level.splice(index, 1);
    };

    //MOVE
    $scope.moveSelectionLevelUp = function (index) {
        if (index > 0) {
            var desitationIndex = index - 1;

            var tempSelection = $scope.componentProperties.editObject.selections[desitationIndex];
            $scope.componentProperties.editObject.selections[desitationIndex] = $scope.componentProperties.editObject.selections[index];
            $scope.componentProperties.editObject.selections[index] = tempSelection;

            var tempDrilldown = $scope.componentProperties.editObject.drillDown.level[desitationIndex];
            $scope.componentProperties.editObject.drillDown.level[desitationIndex] = $scope.componentProperties.editObject.drillDown.level[index];
            $scope.componentProperties.editObject.drillDown.level[index] = tempDrilldown;
        }
    };

    //EDIT
    $scope.editSelection = function (index) {

        clearSelections();
        $scope.saveMode = true;
        $scope.saveIndex = index;

        $scope.componentProperties.editObject.selections[index].forEach(function (selectionEntry) {
            $scope.DO.tableSchema.forEach(function (schemaEntry) {
                if (schemaEntry.COLUMN_NAME === selectionEntry.name) {
                    schemaEntry.selected = true;
                }
            });
        });
        $scope.selectionKey.value = $scope.componentProperties.editObject.drillDown.level[index];
    };

    //PREVIEW
    $scope.selectionPreview = function (selectionLevel) {

        var returnValue = "";
        selectionLevel.forEach(function (entry) {
            returnValue += entry.name + ", ";
        });
        if (returnValue.length > 30) {
            return returnValue.substr(0, 27) + "...";
        }
        return returnValue.substr(0, returnValue.length - 2);
    };

}]);