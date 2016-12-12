analysis.controller('Analysis', ['$scope', 'appManager', '$state', '$interval', '$mdDialog', function ($scope, appManager, $state, $interval, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;

    $scope.name = DSO.name;
    $scope.user = SO.user;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1);
    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    };

    $scope.showAnalysis = function () {
        //var modules = DSO.modules.map(function (obj) { return obj.Module });

        //if (modules.indexOf('analysis') > -1) {
            return true;
        //}
        //return false;
    };

    $scope.sendTestQuery = function () {

        API.query().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (error) { console.log(error); });

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