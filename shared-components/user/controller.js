mapApp.controller('User', ['$scope', 'appManager', '$mdDialog', function ($scope, appManager, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;

    $scope.user = SO.user;

    $scope.authorizations = [];

    if (SO.user.UID >= 0) {
        $scope.authorizations.push({ title: "Assigned DMIS", value: SO.user.dmisID });
        SO.user.AuthorizedProducts.forEach(function (authProduct) {
            authProduct.Authorizations.forEach(function (authorization) {
                $scope.authorizations.push({ title: authProduct.productName, value: authorization.roleName});
            });
        });
    }
    else {
        $scope.authorizations.push({title: "No Authorizations", value: ""});
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);