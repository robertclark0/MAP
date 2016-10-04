analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    //$scope.SF = appManager.state.SF;
    //$scope.DSO = appManager.state.DSO;
    //$scope.DO = appManager.data.DO;
    var SF = appManager.state.SF;

    $scope.filters = SF.availableDataFilters();

}]);