﻿analysis.controller('DataSource', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    $scope.SO = appManager.state.SO;


    $scope.componentProperties = componentViewFactory.componentProperties;


    $scope.setDataSource = function (dataSourceObject) {
        $scope.componentProperties.editObject.source.alias = dataSourceObject.Alias;
        $scope.componentProperties.editObject.source.type = dataSourceObject.SourceType;
        $scope.closeDialog();
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);