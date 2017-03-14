platformHome.controller('PlatformHome', ['$scope', 'appManager', '$state', '$mdDialog', function ($scope, appManager, $state, $mdDialog) {

    // Dependancies
    var SF = appManager.state.SF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var DO = appManager.data.DO;
    var logger = appManager.logger;
    

    //Set Session GUID
    SO.sessionID = (typeof SO.sessionID === 'undefined') ? SF.generateGUID() : SO.sessionID;

    //Get User Data, then Get Products
    API.user().get().$promise.then(function (userResponse) {

        SO.user = userResponse.result;
        $scope.user = SO.user;
        logger.toast.success('Welcome ' + SO.user.fName + '!');

        return API.products().get().$promise;

    }).then(function (productResponse) {

        DO.products = productResponse.result;
        $scope.products = productResponse.result;

    }).catch(function (error) {
        logger.toast.error('Error Getting User Product Data', error);
    });


    //Click on product
    $scope.productSelected = function (product) {
        if (product.Active !== 1) {
            logger.toast.warning("Product Not Yet Active!");
        }
        else {
            if (product.FeatureProfile.DataQuery === "res") {
                var authorizedProducts = SO.user.AuthorizedProducts.map(function (obj) { return obj.productName; });

                if (authorizedProducts.indexOf(product.Code) >= 0) {
                    SF.setProduct(product, "reporting");
                }
                else {
                    logger.toast.warning("Not Authorized for CHUP!");
                }
            }
            else {
                SF.setProduct(product, "reporting");
            }
        }
    };

    $scope.goCHUP = function () {

        $state.go("chup-reporting");
    };


    //Show User Info
    $scope.showUserInfo = function (ev) {
        $mdDialog.show({
            templateUrl: 'shared-components/user/user.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'User'
        });
    };

}]);