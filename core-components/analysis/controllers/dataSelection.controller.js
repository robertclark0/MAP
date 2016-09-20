metricDashboard.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----      
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SO = appManager.state.SO;
    $scope.DO = appManager.data.DO;

    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    //$scope.getTableSchema = function () {

    if ($scope.componentProperties.editObject.source.type === 'T') {
            API.tableSchema().save(logger.logPostObject({ entityCode: SO.productLine.current, tableName: $scope.componentProperties.editObject.source.name })).$promise.then(function (response) {
                $scope.DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }

    $scope.selected = [];

    $scope.$watch('DO.tableSchema | filter: { selected : true }', function (nv) {
        $scope.selected = nv.map(function (column) {
            return column.COLUMN_NAME;
        });

        console.log($scope.selected);
    }, true);

    //}




}]);