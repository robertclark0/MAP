analysis.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----      
    var SO = appManager.state.SO;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;


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



    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);