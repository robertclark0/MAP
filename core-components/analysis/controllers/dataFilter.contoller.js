analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    //$scope.SF = appManager.state.SF;
    //$scope.DSO = appManager.state.DSO;
    //$scope.DO = appManager.data.DO;
    var SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();

    $scope.filterName = function (filter) {
        return filter.name + " ..." + filter.GUID.substr(32,4);
    };

    $scope.selectedModel = null;
    $scope.disabled = true;

    $scope.checkSelection = function () {

        console.log($scope.selectedModel);
    };


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);