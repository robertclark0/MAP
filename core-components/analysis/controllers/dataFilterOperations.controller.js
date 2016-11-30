analysis.controller('DataFilterOperations', ['$scope', '$mdDialog', 'filter', function ($scope, $mdDialog, filter) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);