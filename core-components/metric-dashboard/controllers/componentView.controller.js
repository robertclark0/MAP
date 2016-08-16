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