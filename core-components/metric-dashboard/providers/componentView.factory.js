metricDashboard.factory('componentViewFactory', ['appManager', function (appManager) {
    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var factory = {};

    factory.componentList = {list: null}; //NEEDS Updating. Can't pass array directly, need to pass array in object to watcher is on object, not array when array changes references.
    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ----
    factory.dashboardComponents = {
        items: [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvas', action: select },
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroup', action: select },
            { text: 'Data Selections', icon: 'assets/icons/md-add-check.svg', component: 'dataSelection', action: select },
            { text: 'Data Filters', icon: 'assets/icons/md-tune.svg', component: 'dataFilter', action: select },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement', action: select }
        ],
        selection: null
    };
    function select(component, parent) {
        factory.componentList.list = parent;
        console.log(parent);
        console.log(factory.componentList);
        factory.dashboardComponents.selection = component;
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
        newEdit({ editType: 'new', componentType: component, editParent: null });
    };


    // ---- ---- ---- ---- COMPONENT LIST ---- ---- ---- ----

    factory.componentActions =
        [
            { icon: 'assets/icons/md-edit.svg', tooltip: 'Edit', action: editComponent },
            { icon: 'assets/icons/md-copy.svg', tooltip: 'Duplicate', action: duplicateComponent },
            { icon: 'assets/icons/md-delete.svg', tooltip: 'Delete', action: deleteComponent },
        ];
    function editComponent(component) {
        newEdit({ editType: 'existing', editObject: component });
    };
    function duplicateComponent(component, array) {
        var newComponent = angular.copy(component);
        if (newComponent.hasOwnProperty('GUID')) {
            newComponent.GUID = SF.generateGUID();
        }
        array.push(newComponent);
    }
    function deleteComponent(component, parent) {
        var index = parent.indexOf(component);
        parent.splice(index, 1);
    };


    // ---- ---- ---- ---- COMPONENET PROPERTIES ---- ---- ---- ----
    factory.properties = {
        editType: null, 
        editObject: null,
        editParent: null
    }
    factory.cancelEdit = function() {
        factory.properties.editObject = null;
        factory.properties.editType = null;
    };
    factory.saveEdit = function () {


        factory.properties.editObject = null;
        factory.properties.editType = null;
    };
    function newEdit(editConfig) {
        factory.properties.editType = editConfig.editType;
        factory.properties.editParent = editConfig.editParent;
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