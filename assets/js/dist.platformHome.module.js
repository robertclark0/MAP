var platformHome = angular.module('platformHome', []);
platformHome.controller('PlatformHome', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

    // Dependancies
    var SF = appManager.state.SF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var DO = appManager.data.DO;
    var logger = appManager.logger;

    //Set Session GUID
    SO.sessionID = (typeof SO.sessionID === 'undefined') ? SF.generateGUID() : SO.sessionID;

    // Get user data
    //REMOVE BEFORE FLIGHT
    API.userInfo().save(logger.logPostObject()).$promise.then(function (response) {
    //API.userInfo().get().$promise.then(function (response) {
        if (response.result) {
            DO.user = new DO.User(response.result);
            logger.toast.success('Welcome ' + DO.user.name.first + '!');
        }
        else {
            logger.toast.warning('No User Data Found');
        }
    }).catch(function (error) {
        logger.toast.error('Error Getting User Data', error);
    });


    //Get product lines
    $scope.productLoadFailure = false;
    //REMOVE BEFORE FLIGHT
    API.productLines().save(logger.logPostObject()).$promise.then(function (response) {
    //API.productLines().get().$promise.then(function (response) {
        DO.productLines = new DO.ProductLines(response.result);
        $scope.products = DO.productLines.value;

    }).catch(function (error) {
        logger.toast.error('Error Getting Product Lines', error);
        $scope.productLoadFailure = true;
    });


    // Selecting Product Line
    $scope.productLineSelected = function (product) {
        logger.clientLog("productLineSelected", product);
        if (product.Active === 1) {
            if (product.Restricted === 0 || (product.Restricted === 1 && product.RestrictionLevel === 2)) {
                setProductLine(product);
            }
            else {
                //get user permission
                //REMOVE BEFORE FLIGHT
                API.userActive().save(logger.logPostObject()).$promise.then(function (response) {
                //API.userActive().get().$promise.then(function (response) {
                    if (response.result) {
                        DO.user.productLines.userActive = response.result;
                        if (userActiveInProduct(product)) {
                            setProductLine(product);
                        }
                        else {
                            logger.toast.warning(product.Name + ' Requires Prior Authorization.');
                        }
                    }
                    else {
                        logger.toast.warning(product.Name + ' Requires Prior Authorization.');
                    }
                }).catch(function (error) {
                    logger.toast.error('Error Getting User Authorization', error);
                });
            }
        }
        else {
            logger.toast.warning('Product Line Not Yet Active.');
        }
    };
    function userActiveInProduct(product) {
        var productLines = DO.user.productLines.userActive.map(function (obj) { return obj.productName; });
        if (productLines.indexOf(product.Name) > -1) {
            return true;
        }
        return false;
    }
    function setProductLine(product) {
        SF.setProduct(product);
        //$state.go('analysis.view', { viewName: 'component'});
        $state.go('reporting');
    }


}]);