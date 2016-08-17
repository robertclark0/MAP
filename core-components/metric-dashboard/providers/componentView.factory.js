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