platformHome.controller('PlatformHome', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

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

        DO.user = userResponse.result;
        $scope.user = DO.user;

        logger.toast.success('Welcome ' + DO.user.fName + '!');

        return API.products().get();

    }).then(function (productResponse) {


    }).catch(function (error) {
        logger.toast.error('Error Getting User Product Data', error);
    });


}]);