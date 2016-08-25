metricDashboard.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36
    };
    $scope.currentCanvas = DSO.canvases[0];
    $scope.changeCanvas = function (canvas) {
        $scope.currentCanvas = canvas;
    };

    $scope.chartOptions = {
        xAxis: {
            categories: ['RHC-A', 'RHC-C', 'RHC-P', 'RHC-E']
        },

        series: [{
            name: 'Aggregate Count',
            type: 'bar',
            data: [4687,3416,1612,450]
        }]
    };

}]);