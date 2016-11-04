analysis.controller('DataSource', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;
    $scope.DO = appManager.data.DO;


    $scope.componentProperties = componentViewFactory.componentProperties;


    $scope.setDataSource = function (dataSourceObject) {
        $scope.componentProperties.editObject.source.product = SO.product.Code;
        $scope.componentProperties.editObject.source.type = dataSourceObject.SourceType;
        $scope.componentProperties.editObject.source.name = dataSourceObject.SourceName;
        $scope.closeDialog();
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);