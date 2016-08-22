var metricDashboard = angular.module('metricDashboard', ['gridster']);
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
    $scope.standardItems = [
        { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        { sizeX: 2, sizeY: 2, row: 0, col: 2 },
        { sizeX: 1, sizeY: 1, row: 0, col: 4 },
        { sizeX: 1, sizeY: 1, row: 0, col: 5 },
    ];

}]);
metricDashboard.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ----
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;


    // ---- ---- ---- ---- Component List ---- ---- ---- ----
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ----
    $scope.componentProperties = componentViewFactory.componentProperties;
    
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}]);
metricDashboard.controller('MetricDashboard', ['$scope', 'appManager', '$state', function ($scope, appManager, $state) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;

    $scope.name = DSO.name;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1);
    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    };


}]);
metricDashboard.controller('DataView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
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
metricDashboard.factory('componentViewFactory', ['appManager', '$mdDialog', function (appManager, $mdDialog) {
    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var factory = {};


    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ----
    factory.dashboardComponents = {
        selection: null,
        components: [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvas', action: selectCanvas },
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroup', action: selectDataGroup },
            { text: 'Data Selections', icon: 'assets/icons/md-add-check.svg', component: 'dataSelection', action: select },
            { text: 'Data Filters', icon: 'assets/icons/md-tune.svg', component: 'dataFilter', action: select },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement', action: select }
        ],
        actions: [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvas', action: newComponent },
            { text: 'Open Saved Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Open Report', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Add New Data Group', icon: 'assets/icons/md-add-circle.svg', component: 'dataGroup', action: newComponent },
            { text: 'Select New Data', icon: 'assets/icons/md-done.svg', component: 'dataSelection', action: '' },
            { text: 'Add New Data Filter', icon: 'assets/icons/md-add-circle.svg', component: 'dataFilter', action: newComponent },
            { text: 'Add New Canvas Element', icon: 'assets/icons/md-add-circle.svg', component: 'canvasElement', action: newComponent }
        ]
    };
    function select(component, parent) {
        factory.componentList.components = parent;
        factory.dashboardComponents.selection = component; 
    }
    function selectCanvas(component, productLine) {
        factory.dashboardComponents.selection = component;
        var list = [{
            header: productLine.name,
            parent: productLine.canvases,
            children: productLine.canvases
        }];       
        factory.componentList.components = list;
    };
    function selectDataGroup(component, productLine) {
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var listItem = {
                header: 'Canvas: ' + canvas.name,
                parent: canvas.dataGroups,
                children: canvas.dataGroups
            };
            list.push(listItem);
        });
        factory.componentList.components = list;
    }
    function newComponent(component) {
        newEdit({ editType: 'new', componentType: component, editParent: null });
    }


    // ---- ---- ---- ---- COMPONENT LIST ---- ---- ---- ----
    factory.componentList = {
        components: null,
        actions: [
            { icon: 'assets/icons/md-edit.svg', tooltip: 'Edit', action: editComponent },
            { icon: 'assets/icons/md-copy.svg', tooltip: 'Duplicate', action: duplicateComponent },
            { icon: 'assets/icons/md-delete.svg', tooltip: 'Delete', action: deleteComponent },
        ]
    };
    function editComponent(component, parent) {
        newEdit({ editType: 'existing', editObject: component, editParent: parent });
    }
    function duplicateComponent(component, parent) {
        var newComponent = angular.copy(component);
        if (newComponent.hasOwnProperty('GUID')) {
            newComponent.GUID = SF.generateGUID();
        }
        parent.push(newComponent);
    }
    function deleteComponent(component, parent) {
        var index = parent.indexOf(component);
        parent.splice(index, 1);
    }


    // ---- ---- ---- ---- COMPONENET PROPERTIES ---- ---- ---- ----
    factory.componentProperties = {
        editType: null,
        editObject: null,
        editParent: null,
        cancelEdit: function () {
            factory.componentProperties.editObject = null;
            factory.componentProperties.editType = null;
        },
        saveEdit: function ($event) {           
            if (factory.componentProperties.editParent === null) {
                if (factory.componentList.components.length === 1) {
                    factory.componentProperties.editParent = factory.componentList.components[0].parent;
                    factory.componentProperties.saveEdit();
                }
                else {
                    showDialog($event);
                }                
            }
            else {
                if (factory.componentProperties.editType === 'new') {
                    factory.componentProperties.editParent.push(factory.componentProperties.editObject);
                }
                else if (factory.componentProperties.editType === 'existing') {
                    var index = factory.componentProperties.editParent.map(function (obj) { return obj.GUID }).indexOf(factory.componentProperties.editObject.GUID);
                    factory.componentProperties.editParent[index] = factory.componentProperties.editObject;
                }
                factory.componentProperties.editType = null;
                factory.componentProperties.editObject = null;
            }
        }
    };
    function showDialog($event) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            template:
              '<md-dialog aria-label="List dialog">' +
              '  <div layout="row">' +
              '    <md-input-container class="md-block md-accent" flex>' +
              '      <md-select ng-model="componentProperties.editParent" >' +
              '        <md-option ng-value="opt.parent" ng-repeat="opt in componentList.components">{{ opt.header }}</md-option>' +
              '      </md-select>' + 
              '    </md-input-container>' + 
              '  </div>' +
              '  <md-dialog-actions>' +
              '    <md-button ng-click="closeDialog()" class="md-primary">' +
              '      Cancel' +
              '    </md-button>' +
              '    <md-button ng-click="closeDialog(); componentProperties.saveEdit()" class="md-primary">' +
              '      Save' +
              '    </md-button>' +
              '  </md-dialog-actions>' +
              '</md-dialog>',
            controller: 'ComponentView'
        });
    };
    function newEdit(editConfig) {
        factory.componentProperties.editType = editConfig.editType;
        factory.componentProperties.editParent = editConfig.editParent;
        if (editConfig.editType === 'new') {
            var editObject;
            switch (editConfig.componentType) {
                case 'canvas':
                    editObject = new SC.Canvas('New Canvas');
            }
            factory.componentProperties.editObject = editObject;
        }
        else {
            factory.componentProperties.editObject = angular.copy(editConfig.editObject);
        }
    }

    return factory;
}]);