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
metricDashboard.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', function ($scope, appManager, componentViewFactory) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SC = appManager.state.SC;
    $scope.SF = appManager.state.SF;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ----
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;
    $scope.dashboardActions = componentViewFactory.dashboardActions;


    // ---- ---- ---- ---- Component List ---- ---- ---- ----
    $scope.componentActions = componentViewFactory.componentActions;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ----
    $scope.properties = componentViewFactory.properties;
    $scope.cancelEdit = componentViewFactory.cancelEdit;

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
metricDashboard.factory('componentViewFactory', ['appManager', function (appManager) {
    var SC = appManager.state.SC;
    var factory = {};

    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ----
    factory.dashboardComponents = {
        items: [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvas'},
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroup' },
            { text: 'Data Selections', icon: 'assets/icons/md-add-check.svg', component: 'dataSelection' },
            { text: 'Data Filters', icon: 'assets/icons/md-tune.svg', component: 'dataFilter' },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement'}
        ],
        selection: 'canvases',
        select: function (component) {
            this.selection = component;
            console.log(this.selection);
        }
    };
    factory.dashboardActions =
        [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvas', action: newComponent },
            { text: 'Open Save Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Add New Data Group', icon: 'assets/icons/md-add-circle.svg', component: 'dataGroup', action: newComponent },
            { text: 'Select New Data', icon: 'assets/icons/md-done.svg', component: 'dataSelection', action: '' },
            { text: 'Add New Data Filter', icon: 'assets/icons/md-add-circle.svg', component: 'dataFilter', action: newComponent },
            { text: 'Add New Canvas Element', icon: 'assets/icons/md-add-circle.svg', component: 'canvasElement', action: newComponent }
        ];
    function newComponent(component) {
        newEdit({ editType: 'new', componentType: component });
    };

    // ---- ---- ---- ---- COMPONENT LIST ---- ---- ---- ----
    factory.componentActions =
        [
            { icon: 'assets/icons/md-edit.svg', tooltip: 'Edit', action: editComponent },
            { icon: 'assets/icons/md-copy.svg', tooltip: 'Duplicate', action: '' },
            { icon: 'assets/icons/md-delete.svg', tooltip: 'Delete', action: '' },
        ];
    function editComponent(component) {
        newEdit({ editType: 'existing', editObject: component });
    };

    // ---- ---- ---- ---- COMPONENET PROPERTIES ---- ---- ---- ----
    factory.properties = {
        editType: null, 
        editObject: null
    }
    factory.cancelEdit = function() {
        factory.properties.editObject = null;
        factory.properties.editType = null;
    };
    function newEdit(editConfig) {
        factory.properties.editType = editConfig.editType;
        if (editConfig.editType === 'new') {
            var editObject;
            switch (editConfig.componentType) {
                case 'canvas':
                    editObject = new SC.Canvas('New Canvas');
            }
            factory.properties.editObject = editObject;
        }
        else {
            factory.properties.editObject = angular.copy(editConfig.editObject);
        }
    }
    //editConfig Template - Don't Uncomment
    //{
    //    editType: 'new' | 'existing',
    //    editObject: *reference, If editType is not 'new', then pass object reference
    //    componentType: 'canvases'
    //}

    return factory;
}]);