metricDashboard.factory('componentViewFactory', ['appManager', function (appManager) {
    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var factory = {};


    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ----
    factory.dashboardComponents = {
        selection: null,
        components: [
            { text: 'Canvases', icon: 'assets/icons/md-tab.svg', component: 'canvas', action: select },
            { text: 'Data Groups', icon: 'assets/icons/md-storage.svg', component: 'dataGroup', action: select },
            { text: 'Data Selections', icon: 'assets/icons/md-add-check.svg', component: 'dataSelection', action: select },
            { text: 'Data Filters', icon: 'assets/icons/md-tune.svg', component: 'dataFilter', action: select },
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement', action: select }
        ],
        actions: [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvas', action: newComponent },
            { text: 'Open Save Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
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
        saveEdit: function () {
            if (factory.componentProperties.editType === 'new')
            {
                factory.componentList.components.push(factory.componentProperties.editObject);
            }
            else if (factory.componentProperties.editType === 'existing') {
                var index = factory.componentProperties.editParent.map(function (obj) { return obj.GUID }).indexOf(factory.componentProperties.editObject.GUID);
                console.log(index);
                factory.componentProperties.editParent[index] = factory.componentProperties.editObject;
            }

            factory.componentProperties.editType = null;
            factory.componentProperties.editObject = null;
        }
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
    //editConfig Template - Don't Uncomment
    //{
    //    editType: 'new' | 'existing',
    //    editObject: *reference, If editType is not 'new', then pass object reference
    //    componentType: 'canvases'
    //}

    return factory;
}]);