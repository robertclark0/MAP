var metricDashboard = angular.module('metricDashboard', ['gridster']);
metricDashboard.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
        resizable: {
            start: function (event, $element, widget) {
                widget.destroyChart();
            },
            stop: function (event, $element, widget) {
                widget.createChart();
            }
        },
        draggable: {
            start: function (event, $element, widget) {
                widget.destroyChart();
            },
            stop: function (event, $element, widget) {
                widget.createChart();
            }
        }
    };
   

    $scope.changeOptions = function (element) {
        
        var options = element.chartOptions;
        options.title.text = 'Chart #' + Math.floor(Math.random() * 100);
        element.chartOptions = options;

    };

    //$scope.addChart = function (chartObject) {
    //    if (DO.charts.map(function (obj) { return obj.GUID }).indexOf(chartObject.GUID) === -1) {
    //        DO.charts.push(chartObject);
    //    }
    //    console.log(DO.charts);
    //};



    //temp
    $scope.chartData = [{
        name: 'CHUP',
        type: 'column',
        color: 'red',
        data: [4687, 3416, 1612, 450],
        dataLabels: {
            enabled: true
        }
    },
    {
        name: 'POLY',
        type: 'column',
        color: 'blue',
        data: [2687, 1416, 2612, 1450],
        dataLabels: {
            enabled: true
        }
    }];




    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    //MENU FUNCTIONS
    $scope.addCanvasElement = function (name, type) {

       $scope.currentCanvas.canvasElements.push(new SC.CanvasElement(name, type));

    };


    //CURRENT OBJECT CONTROLS
    $scope.currentCanvas = DSO.canvases[0];
    $scope.changeCanvas = function (canvas) {
        $scope.currentCanvas = canvas;
        $scope.changeDataGroup(canvas.dataGroups[0]);
        $scope.changeCanvasElement(canvas.canvasElements[0]);
        
    };
    $scope.currentDataGroup = $scope.currentCanvas.dataGroups[0];
    $scope.changeDataGroup = function (dataGroup) {
        $scope.currentDataGroup = dataGroup;
        if (dataGroup) {
            $scope.changeSelectionLevel(dataGroup.selections[0], 0);
        }
        else {
            $scope.currentSelectionLevel = undefined;
        }
    }
    $scope.currentSelectionLevel = $scope.currentDataGroup.selections[0];
    $scope.currentSelectionIndex = 0;
    $scope.changeSelectionLevel = function (selection, index) {
        $scope.currentSelectionLevel = selection;
        $scope.currentSelectionIndex = index;
    }
    $scope.currentCanvasElement = $scope.currentCanvas.canvasElements[0];
    $scope.changeCanvasElement = function (canvasElement) {
        $scope.currentCanvasElement = canvasElement;
    };

    //DATA CONTROLL SIDE NAVE FUNCTIONS
    $scope.moveDataSelectionUp = function (index) {
        if (index > 0) {
            var desitationIndex = index - 1;

            var tempSelection = $scope.currentSelectionLevel[desitationIndex];
            $scope.currentSelectionLevel[desitationIndex] = $scope.currentSelectionLevel[index];
            $scope.currentSelectionLevel[index] = tempSelection;
        }
    };
    $scope.moveDataSelectionDown = function (index) {
        if ($scope.currentSelectionLevel[index + 1]) {
            var desitationIndex = index + 1;

            var tempSelection = $scope.currentSelectionLevel[desitationIndex];
            $scope.currentSelectionLevel[desitationIndex] = $scope.currentSelectionLevel[index];
            $scope.currentSelectionLevel[index] = tempSelection;
        }
    };

}]);
metricDashboard.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;
    $scope.DO = appManager.data.DO;



    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ----
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;

    $scope.dashboardComponents.components[0].action("canvas", $scope.DSO);

    // ---- ---- ---- ---- Component List ---- ---- ---- ----
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ----
    $scope.componentProperties = componentViewFactory.componentProperties;
    
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    $scope.showConfigureDataSelections = function (ev) {

        if ($scope.componentProperties.editObject.source.name !== null) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataSelection.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataSelection'
            });
        }
        else {
            logger.toast.warning('Please Select A Data Source First.');
        }


    };

    $scope.showConfigureDataSource = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/dataSource.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'DataSource'
        });
    };


}]);
metricDashboard.controller('MetricDashboard', ['$scope', 'appManager', '$state', '$interval', function ($scope, appManager, $state, $interval) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;

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



    $scope.sendTestQuery = function () {

        var queryObject = {
            source: {
                product: "TELE360",
                type: 'table',
                name: 'TeleHealth_360_CAPER'
            },
            pagination:
            {
                enabled: false,
                page: 1,
                range: 10
            },
            aggregation:
            {
                enabled: true
            },
            selections:
            [

                    {
                        name: 'Region',
                        order: 'asc',
                        aggregate: false
                    },
                    {
                        name: 'Month',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'count',
                            allias: 'Month_Count'
                        }
                    },
                    {
                        name: 'Month',
                        order: 'asc',
                        aggregate: true,
                        aggregation: {
                            type: 'case-count',
                            allias: 'Month_Jan',
                            operators:
                            [
                                {
                                    type: 'equal',
                                    values: ['Jan'],
                                    valueType: 'string'
                                }
                            ]
                        }
                    }
                    
            ],
            filters:
            [
            //    {
            //        name: 'FY',
            //        operators:
            //        [
            //            {
            //                type: 'equal',
            //                values: ['2016'],
            //                valueType: 'string'
            //            }
            //        ]
            //    },
            //    {
            //        name: 'FM',
            //        operators:
            //        [
            //            {
            //                type: 'equal',
            //                values: ['1'],
            //                valueType: 'string'
            //            }
            //        ]
            //    }
            ]
        };
        //API.download().save({ query: queryObject }).$promise
        //    .then(function (response)
        //    {
        //        if (response.GUID) {
        //            var downloadGUID = response.GUID;
        //            var check;

        //            check = $interval(function () {
        //                API.downloadUpdate().get({ GUID: downloadGUID }).$promise.then(function (response) {
        //                    if (response.Status === 'complete') {
        //                        $interval.cancel(check);
        //                        window.location(API.endpoint + "download?GUID=" + downloadGUID);
        //                    }
        //                    else if (response.Status === 'started') {

        //                    }
        //                    else {
        //                        $interval.cancel(check);
        //                    }
        //                }).catch(function (response) {
        //                    console.log(response);
        //                });
        //            }, 3000, 600);
        //        }
        //    })
        //    .catch(function (response)
        //    {
        //        console.log(response);
        //    });
        API.query().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (error) { console.log(error); });

    };

}]);
metricDashboard.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    //$scope.SF = appManager.state.SF;
    //$scope.DSO = appManager.state.DSO;
    //$scope.DO = appManager.data.DO;
    //var SO = appManager.state.SO;




}]);
metricDashboard.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----      
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SO = appManager.state.SO;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;

    if ($scope.componentProperties.editObject.source.type === 'T') {
        //REMOVE BEFORE FLIGHT
        API.tableSchema().save(logger.logPostObject({ entityCode: SO.productLine.current, tableName: $scope.componentProperties.editObject.source.name })).$promise.then(function (response) {
        //API.tableSchema().get().$promise.then(function (response) {
            $scope.DO.tableSchema = response.result;
        }).catch(function (error) {
            logger.toast.error('Error Getting Table Schema', error);
        });
    }

    $scope.selected = [];
    $scope.selectionKey = { value: null };
    $scope.saveMode = false;
    $scope.saveIndex = null;

    $scope.$watch('DO.tableSchema | filter: { selected : true }', function (nv) {
        $scope.selected = nv.map(function (column) {
            return column.COLUMN_NAME;
        });
    }, true);

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    //SAVE
    $scope.saveSelection = function () {
        var selectionLevel = [];

        $scope.selected.forEach(function (entry) {
            var selected = new SC.DataSelection(entry);
            selectionLevel.push(selected);
        });

        $scope.componentProperties.editObject.selections.push(selectionLevel);
        $scope.componentProperties.editObject.drillDown.push($scope.selectionKey.value)

        clearSelections();
    };
    var clearSelections = function () {
        $scope.selected.length = 0;
        $scope.selectionKey.value = null;
        $scope.DO.tableSchema.forEach(function (entry) {
            entry.selected = false;
        });
    };

    //UPDATE
    $scope.updateSelection = function () {
        var selectionLevel = [];

        $scope.selected.forEach(function (entry) {
            var selected = new SC.DataSelection(entry);
            selectionLevel.push(selected);
        });

        $scope.componentProperties.editObject.selections[$scope.saveIndex] = selectionLevel;
        $scope.componentProperties.editObject.drillDown[$scope.saveIndex] = $scope.selectionKey.value;

        clearSelections();
        $scope.saveMode = false;
    };

    //DELETE
    $scope.deleteSelectionLevel = function (index) {
        $scope.componentProperties.editObject.selections.splice(index, 1);
        $scope.componentProperties.editObject.drillDown.splice(index, 1);
    };

    //MOVE
    $scope.moveSelectionLevelUp = function (index) {
        if (index > 0) {
            var desitationIndex = index - 1;

            var tempSelection = $scope.componentProperties.editObject.selections[desitationIndex];
            $scope.componentProperties.editObject.selections[desitationIndex] = $scope.componentProperties.editObject.selections[index];
            $scope.componentProperties.editObject.selections[index] = tempSelection;

            var tempDrilldown = $scope.componentProperties.editObject.drillDown[desitationIndex];
            $scope.componentProperties.editObject.drillDown[desitationIndex] = $scope.componentProperties.editObject.drillDown[index];
            $scope.componentProperties.editObject.drillDown[index] = tempDrilldown;
        }
    };

    //EDIT
    $scope.editSelection = function (index) {

        clearSelections();
        $scope.saveMode = true;
        $scope.saveIndex = index;

        $scope.componentProperties.editObject.selections[index].forEach(function (selectionEntry) {
            $scope.DO.tableSchema.forEach(function (schemaEntry) {
                if (schemaEntry.COLUMN_NAME === selectionEntry.name) {
                    schemaEntry.selected = true;
                }
            });
        });
        $scope.selectionKey.value = $scope.componentProperties.editObject.drillDown[index];
    };

    //PREVIEW
    $scope.selectionPreview = function (selectionLevel) {

        var returnValue = "";
        selectionLevel.forEach(function (entry) {
            returnValue += entry.name + ", ";
        });
        if (returnValue.length > 30) {
            return returnValue.substr(0, 27) + "...";
        }
        return returnValue.substr(0, returnValue.length - 2);
    };

}]);
metricDashboard.controller('DataSource', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;
    $scope.DO = appManager.data.DO;


    $scope.componentProperties = componentViewFactory.componentProperties;

    //REMOVE BEFORE FLIGHT
    API.dataSources().save(logger.logPostObject({ entityCode: SO.productLine.current })).$promise.then(function (response) {
    //API.dataSources().get().$promise.then(function (response) {
        DO.dataSource = response.result;
    }).catch(function (error) {
        logger.toast.error('Error Getting Data Sources', error);
    });


    $scope.setDataSource = function (dataSourceObject) {
        $scope.componentProperties.editObject.source.product = SO.productLine.current;
        $scope.componentProperties.editObject.source.type = dataSourceObject.SourceType;
        $scope.componentProperties.editObject.source.name = dataSourceObject.SourceName;
        $scope.closeDialog();
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

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
metricDashboard.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=',
            data: '='
        },
        link: function (scope, element) {
            var chart;

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: false
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: ['RHC-A', 'RHC-C', 'RHC-P', 'RHC-E'],
                },
                yAxis: {
                    labels: {
                        format: '{value:,.0f}'
                    },
                    title: {
                        text: 'Patients',
                        align: 'low'
                    }
                },
                series: []
            };

            scope.canvasElement.chartOptions = (typeof scope.canvasElement.chartOptions === 'undefined') ? defaultchartOptions : scope.canvasElement.chartOptions;

            loadChart();
            

            //scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
            //    chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            //});

            //scope.$watch('canvasElement.chartOptions', function (newValue, oldValue) {
            //    if (newValue !== oldValue)
            //    {
            //        loadChart();
            //    }
            //}, true);

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chartOptions);
                

                scope.data.forEach(function (d) {
                    chart.addSeries(d);
                });

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            };

            scope.canvasElement.destroyChart = function () {
                chart.destroy();
            };
            scope.canvasElement.createChart = function () {
                loadChart();
            };

        }
    };
})
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
            { text: 'Canvas Elements', icon: 'assets/icons/md-quilt.svg', component: 'canvasElement', action: selectCanvasElement }
        ],
        actions: [
            { text: 'Add New Canvas', icon: 'assets/icons/md-add-circle.svg', component: 'canvas', action: newComponent },
            { text: 'Open Saved Canvas', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Open Report', icon: 'assets/icons/md-cloud.svg', component: 'canvas', action: '' },
            { text: 'Add New Data Group', icon: 'assets/icons/md-add-circle.svg', component: 'dataGroup', action: newComponent },
            { text: 'Select New Data', icon: 'assets/icons/md-done.svg', component: 'dataSelection', action: newComponent },
            { text: 'Add New Data Filter', icon: 'assets/icons/md-add-circle.svg', component: 'dataFilter', action: newComponent },
            { text: 'Add New Canvas Element', icon: 'assets/icons/md-add-circle.svg', component: 'canvasElement', action: newComponent }
        ]
    };
    function selectCanvas(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [{
            header: productLine.name,
            parent: productLine.canvases,
            children: productLine.canvases
        }];
        factory.componentList.components = list;
    };
    function selectDataGroup(component, productLine) {
        closeEdit();
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
    function selectDataSelection(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var header = 'Canvas: ' + canvas.name;
            canvas.dataGroups.forEach(function (dataGroup) {
                var endHeader = header + ' | Data Group: ' + dataGroup.name;
                var listItem = {
                    header: endHeader,
                    parent: dataGroup.dataSelections,
                    children: dataGroup.dataSelections
                };
                list.push(listItem);
            });
            
        });
        factory.componentList.components = list;
    }
    function selectDataFilter(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var header = 'Canvas: ' + canvas.name;
            canvas.dataGroups.forEach(function (dataGroup) {
                var endHeader = header + ' | Data Group: ' + dataGroup.name;
                var listItem = {
                    header: endHeader,
                    parent: dataGroup.dataFilters,
                    children: dataGroup.dataFilters
                };
                list.push(listItem);
            });

        });
        factory.componentList.components = list;
    }
    function selectCanvasElement(component, productLine) {
        closeEdit();
        factory.dashboardComponents.selection = component;
        var list = [];
        productLine.canvases.forEach(function (canvas) {
            var listItem = {
                header: 'Canvas: ' + canvas.name,
                parent: canvas.canvasElements,
                children: canvas.canvasElements
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
        closeEdit: closeEdit,
        saveEdit: saveEdit,
    };
    function newEdit(editConfig) {
        factory.componentProperties.editType = editConfig.editType;
        factory.componentProperties.editParent = editConfig.editParent;
        if (editConfig.editType === 'new') {
            var editObject;

            switch (editConfig.componentType) {
                case 'canvas':
                    editObject = new SC.Canvas('New Canvas');
                    break;
                case 'dataGroup':
                    editObject = new SC.DataGroup('New Data Group');
                    break;
                case 'canvasElement':
                    editObject = new SC.CanvasElement('New Canvas Element');
                    break;
            }
            factory.componentProperties.editObject = editObject;
        }
        else {
            factory.componentProperties.editObject = angular.copy(editConfig.editObject);
        }
    }
    function saveEdit() {
        //console.log(factory.componentProperties);
        if (factory.componentProperties.editParent === null) {
            if (factory.componentList.components.length === 1) {
                factory.componentProperties.editParent = factory.componentList.components[0].parent;
                factory.componentProperties.saveEdit();
            }
            else { validateParentDialog(); }
        }
        else {
            if (factory.componentProperties.editType === 'new') {
                factory.componentProperties.editParent.push(factory.componentProperties.editObject);
            }
            else if (factory.componentProperties.editType === 'existing') {
                var index = factory.componentProperties.editParent.map(function (obj) { return obj.GUID }).indexOf(factory.componentProperties.editObject.GUID);
                factory.componentProperties.editParent[index] = factory.componentProperties.editObject;
            }
            closeEdit();
        }
    }
    function closeEdit() {
        factory.componentProperties.editObject = null;
        factory.componentProperties.editType = null;
    }
    function validateParentDialog() {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'core-components/analysis/templates/validateParent.dialog.html',
            controller: 'DataSelection'
        });
    };


    return factory;
}]);