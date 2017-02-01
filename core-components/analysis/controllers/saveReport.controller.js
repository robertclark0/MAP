analysis.controller('SaveReport', ['$scope', 'appManager', '$mdDialog', 'current', function ($scope, appManager, $mdDialog, current) {

    //    Controller and Scope variables
    //var DSO = appManager.state.DSO;
    //var DO = appManager.data.DO;
    //var SC = appManager.state.SC;
    //var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    //var SF = appManager.state.SF;

    $scope.current = current;
    $scope.selectedTabIndex = 0;


    $scope.saveReport = function () {

        var reportObject = {
            report: {
                GUID: current.canvas.GUID,
                name: current.canvas.name,
                type: current.canvas.roleType,            
                category: current.canvas.category,
                position: current.canvas.position,
                json: JSON.stringify(current.canvas)
            },
            entityCode: SO.product.Code,
            type: 'create'
        };

        API.report().save(logger.postObject(reportObject)).$promise.then(function (response) {
            console.log(response);
            if (response.result === 'created') {
                logger.toast.success('Report Created Successfully');
                $scope.closeDialog();
            }
        }).catch(function (error) { console.log(error); });
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);