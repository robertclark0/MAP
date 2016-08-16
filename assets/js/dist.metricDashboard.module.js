var metricDashboard = angular.module('metricDashboard', ['gridster']);
metricDashboard.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var SF = appManager.state.SF;
    var DSO = appManager.state.DSO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36
    };
    $scope.standardItems = [
        { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        { sizeX: 2, sizeY: 2, row: 0, col: 2 },
        { sizeX: 1, sizeY: 1, row: 0, col: 4 },
        { sizeX: 1, sizeY: 1, row: 0, col: 5 },
    ];

}]);
metricDashboard.controller('ComponentView', ['$scope', 'appManager', function ($scope, appManager) {

    //    Controller and Scope variables   
    var SC = appManager.state.SC;
    $scope.SF = appManager.state.SF;

    $scope.canvasToEdit = $scope.SF.state.canvases({ returns: 'current' });
    $scope.components =
        [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvases', action: function () { $scope.componentMenuSelection = 'canvases'; } },
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroups', action: function () { $scope.componentMenuSelection = 'dataGroups'; } },
            { text: 'Data Selections', icon: 'assets/icons/md-add-check.svg', component: 'dataSelections', action: function () { $scope.componentMenuSelection = 'dataSelections'; } },
            { text: 'Data Filters', icon: 'assets/icons/md-tune.svg', component: 'dataFilters', action: function () { $scope.componentMenuSelection = 'dataFilters'; } },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElements', action: function () { $scope.componentMenuSelection = 'canvasElements'; } }
        ]
    $scope.componentMenuSelection = 'canvases';
    $scope.componentActions =
        [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvases', action: function () { $scope.SF.state.canvases({ method: 'add' }, new SC.Canvas('New Canvas')); } },
            { text: 'Open Save Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvases', action: '' },
            { text: 'Add New Data Group', icon: 'assets/icons/md-add-circle.svg', component: 'dataGroups', action: '' },
            { text: 'Select New Data', icon: 'assets/icons/md-done.svg', component: 'dataSelections', action: '' },
            { text: 'Add New Data Filter', icon: 'assets/icons/md-add-circle.svg', component: 'dataFilters', action: '' },
            { text: 'Add New Canvas Element', icon: 'assets/icons/md-add-circle.svg', component: 'canvasElements', action: '' }
        ];

}]);
metricDashboard.controller('MetricDashboard', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;

    $scope.name = DSO.name;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1)
    $scope.newState = function (state, stateObject) {       
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    }


}]);
metricDashboard.controller('DashboardComponents', ['$scope', '$mdDialog', '$mdBottomSheet', function ($scope, $mdDialog, $mdBottomSheet) {

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.openBottomSheet = function () {
        $mdBottomSheet.show({
            templateUrl: '<md-bottom-sheet><div style="height: 400px;">Hello!</div></md-bottom-sheet>'
        });
    }

    $scope.showConfirm = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to delete your debt?')
              .textContent('All of the banks have agreed to forgive you your debts.')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Please do it!')
              .cancel('Sounds like a scam');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'You decided to get rid of your debt.';
        }, function () {
            $scope.status = 'You decided to keep your debt.';
        });
    };
}]);
metricDashboard.controller('DataView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var SF = appManager.state.SF;
    var SO = appManager.state.SO;
    var DSO = appManager.state.DSO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    $scope.canvases = DSO.canvases;
    //

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.dataViewOptions = {
        columns: 1,
        rowHeight: 25,
        minSizeY: 6,
        margins: [1, 10],
        resizable: {
            enabled: true,
            handles: ['s'],
        },
    };
    $scope.dataViewItems = [
        { sizeX: 1, sizeY: 1, row: 0, col: 0 },
        { sizeX: 1, sizeY: 1, row: 2, col: 0 },
    ];

}]);