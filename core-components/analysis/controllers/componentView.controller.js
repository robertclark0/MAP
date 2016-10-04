analysis.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var API = appManager.data.API;
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;
    $scope.DO = appManager.data.DO;
    $scope.SO = appManager.state.SO;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ----
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;

    $scope.dashboardComponents.components[0].action("canvas", $scope.DSO);

    // ---- ---- ---- ---- Component List ---- ---- ---- ----
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ----
    $scope.componentProperties = componentViewFactory.componentProperties;
    
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    $scope.showConfigureDataSelections = function (ev) {

        if ($scope.componentProperties.editObject.source.name !== null) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataSelection.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataSelection'
            });
        }
        else {
            logger.toast.warning('Please Select A Data Source First.');
        }


    };

    $scope.showConfigureDataSource = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/dataSource.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'DataSource'
        }).then(function () { getTableSchema(); }, function () {  });
    };

    $scope.showConfigureFilters = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/filter.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'DataFilter'
        });
    };

    function getTableSchema() {
        if ($scope.componentProperties.editObject.source.type === 'T') {
            //REMOVE BEFORE FLIGHT
            API.tableSchema().save(logger.logPostObject({ entityCode: SO.productLine.current, tableName: $scope.componentProperties.editObject.source.name })).$promise.then(function (response) {
                //API.tableSchema().get().$promise.then(function (response) {
                $scope.DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }
    }


}]);