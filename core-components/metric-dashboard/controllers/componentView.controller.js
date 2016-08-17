﻿metricDashboard.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', function ($scope, appManager, componentViewFactory) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SC = appManager.state.SC;
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ----
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;
    $scope.dashboardActions = componentViewFactory.dashboardActions;


    // ---- ---- ---- ---- Component List ---- ---- ---- ----
    $scope.componentActions = componentViewFactory.componentActions;
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ----
    $scope.properties = componentViewFactory.properties;
    $scope.cancelEdit = componentViewFactory.cancelEdit;
    

}]);