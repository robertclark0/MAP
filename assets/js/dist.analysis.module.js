var analysis = angular.module('analysis', ['gridster']);
analysis.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', '$mdDialog', 'dataFilterFactory', 'dataSelectionFactory', 'viewFactory', function ($scope, appManager, $mdSidenav, $mdDialog, dataFilterFactory, dataSelectionFactory, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SF = appManager.state.SF;
    $scope.SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    DF.populateAppData();
    //

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
    };

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


    //MENU FUNCTIONS
    $scope.addCanvasElement = function (name, type) {
        $scope.current.canvas.canvasElements.push(new SC.CanvasElement(name, type));
    };


    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    $scope.current = {
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };

    $scope.setSelectionLevel = viewFactory.setSelectionLevel;
    $scope.setDataGroup = viewFactory.setDataGroup;
    $scope.setCanvas = viewFactory.setCanvas;

    viewFactory.setCanvas(DSO.canvases[0], $scope.current);
    
    
    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    $scope.filterResults = dataFilterFactory.filterResults;


    // ---- ---- ---- ---- Filter Side Nav Functions ---- ---- ---- ---- //
    $scope.tempCards = [];
    $scope.filterAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.filterAutoChanged = function (value) {
        dataFilterFactory.quickAddFilter(value, $scope.current.dataGroup, $scope.current.selectionIndex, $scope.tempCards);
        $scope.filterAuto.searchText = null;
    };
    

    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.dataAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.selectionAutoChanged = function (value) {
        dataSelectionFactory.quickAddDataSelection(value, $scope.current.dataGroup, $scope.current.selectionIndex);
        $scope.dataAuto.searchText = null;
    };


    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.tempChart = {options: null};
    $scope.currentChart = null;
    $scope.$watch('current.canvasElement', function (element) {
        if (element && element.type === 'hc-Chart') {
            var chart = DF.getCanvasElement(element.GUID).chart;
            $scope.currentChart = chart;
            $scope.tempChart.options = JSON.stringify(chart.userOptions, null, 4);
        }
        else {
            $scope.tempChart = { options: null };
            $scope.currentChart = null;
        }
    }, true);

    $scope.updateChart = function () {
        try{
            $scope.currentChart.update(JSON.parse($scope.tempChart.options));
        }
        catch (e) {
            logger.toast.error("Invalid options object.", e);
        }

    };


    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    $scope.build = function () {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response);
            dataGroupDataObject.result = response.result;
        }).catch(function (error) { console.log(error); });

    };

}]);
analysis.controller('ComponentView', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var API = appManager.data.API;
    $scope.SF = appManager.state.SF;
    $scope.DSO = appManager.state.DSO;
    $scope.DO = appManager.data.DO;
    $scope.SO = appManager.state.SO;


    // ---- ---- ---- ---- Dashboard Components ---- ---- ---- ---- //
    $scope.dashboardComponents = componentViewFactory.dashboardComponents;

    $scope.dashboardComponents.components[0].action("canvas", $scope.DSO);

    // ---- ---- ---- ---- Component List ---- ---- ---- ---- //
    $scope.componentList = componentViewFactory.componentList;


    // ---- ---- ---- ---- Component Properties ---- ---- ---- ---- //
    $scope.componentProperties = componentViewFactory.componentProperties;
    

    $scope.showConfigureDataSource = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/dataSource.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'DataSource'
        }).then(function () { $scope.componentProperties.getSchema(); }, function () { });
    };
    $scope.showConfigureDataSelections = function (ev) {
        if ($scope.componentProperties.editObject.source.alias !== null) {
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
    $scope.showConfigureFilters = function (ev) {
        if ($scope.componentProperties.editObject.selections[0].length > 0) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataFilter.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataFilter'
            });
        }
        else {
            logger.toast.warning('Please Create Data Selections First.');
        }
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }


}]);
analysis.controller('Analysis', ['$scope', 'appManager', '$state', '$interval', '$mdDialog', function ($scope, appManager, $state, $interval, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;

    $scope.name = DSO.name;
    $scope.user = SO.user;
    $scope.controlPanels = DSO.dashboard.controlPanels;
    $scope.canvases = DSO.canvases; //used in children scopes

    $scope.viewName = $state.params.viewName.charAt(0).toUpperCase() + $state.params.viewName.slice(1);
    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
        if (stateObject && stateObject.viewName) {
            $scope.viewName = stateObject.viewName.charAt(0).toUpperCase() + stateObject.viewName.slice(1);
        }
    };

    $scope.showAnalysis = function () {
        //var modules = DSO.modules.map(function (obj) { return obj.Module });

        //if (modules.indexOf('analysis') > -1) {
            return true;
        //}
        //return false;
    };

    $scope.sendTestQuery = function () {

        API.query().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (error) { console.log(error); });

    };

    //Show User Info
    $scope.showUserInfo = function (ev) {
        $mdDialog.show({
            templateUrl: 'shared-components/user/user.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'User'
        });
    };

}]);
analysis.controller('DataFilter', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SF = appManager.state.SF;
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.filters = SF.availableDataFilters();
    $scope.canvasFilters = SF.canvasDataFilters();
    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.selectedLevel = $scope.componentProperties.editObject.selections[0];
    $scope.selectionIndex = 0;

    $scope.newFilter = new SC.DataFilter($scope.filters[0]);

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null


    // ---- ---- ---- ---- Filter Settings ---- ---- ---- ---- //
    $scope.selectionChange = function () {
        if ($scope.newFilter.dataValue) {
            $scope.newFilter.alias = $scope.newFilter.dataValue.COLUMN_NAME;
        }
    };

    $scope.addOperation = function () {
        $scope.newFilter.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.newFilter.operations.splice(index, 1);
    };

    $scope.createFilter = function () {
        if ($scope.dataFilterForm.$valid) {

            var filter = angular.copy($scope.newFilter);
            filter.GUID = SF.generateGUID();

            $scope.componentProperties.editObject.filters[$scope.selectionIndex].push(filter);
            $scope.clearFilter();
        }
    };

    $scope.clearFilter = function () {
        $scope.newFilter = new SC.DataFilter($scope.filters[0]);

        $scope.dataFilterForm.$setPristine();
        $scope.dataFilterForm.$setUntouched();
    };


    // ---- ---- ---- ---- Selection Level Navigation ---- ---- ---- ---- //
    $scope.changeSelectionLevel = function () {
        $scope.selectionIndex = $scope.componentProperties.editObject.selections.indexOf($scope.selectedLevel);
    }


    // ---- ---- ---- ---- Selection Levels ---- ---- ---- ---- //
    $scope.moveSelectionUp = function (source, target, targetIndex) {
        if (targetIndex > 0) {
            var desitationIndex = targetIndex - 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };

    $scope.deleteSelection = function (index) {
        $scope.componentProperties.editObject.filters[$scope.selectionIndex].splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataFilterSettings', ['$scope', '$mdDialog', 'filter', 'current', 'appManager', function ($scope, $mdDialog, filter, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.filter = filter;
    var SF = appManager.state.SF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;

    $scope.operations = SF.availableDataFilterOperations();
    $scope.selectedOperation = null

    $scope.orderChange = function () {
        var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.orderValue } };
        var filterDataObject = DF.getFilter(filter.GUID);

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues.length = 0;
            response.result.forEach(function (obj) {
                filterDataObject.dataValues.push({ value: obj, isChecked: false });
            });
        });
    };

    
    // ---- ---- ---- ---- Filter Settings ---- ---- ---- ---- //
    $scope.addOperation = function () {
        $scope.filter.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.filter.operations.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataSelection', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    var SC = appManager.state.SC;
    $scope.DO = appManager.data.DO;
    $scope.componentProperties = componentViewFactory.componentProperties;
    $scope.componentList = componentViewFactory.componentList;

    $scope.selectedLevel = $scope.componentProperties.editObject.selections[0];
    $scope.selectionIndex = 0;

    $scope.newSelection = new SC.DataSelection({name: "Custom Data Selection", type: "custom-data-selection"});


    // ---- ---- ---- ---- Selection Settings ---- ---- ---- ---- //
    $scope.selectionChange = function () {
        if ($scope.newSelection.dataValue) {
            $scope.newSelection.alias = $scope.newSelection.dataValue.COLUMN_NAME;
        }      
    };
  
    $scope.addOperation = function () {
        $scope.newSelection.operations.push($scope.selectedOperation);
        $scope.selectedOperation = null
    }

    $scope.removeOperation = function (index) {
        $scope.newSelection.operations.splice(index, 1);
    };

    $scope.createSelection = function () {
        if ($scope.dataSelectionForm.$valid) {

            $scope.componentProperties.editObject.selections[$scope.selectionIndex].push(angular.copy($scope.newSelection));
            $scope.clearSelection();
        }
    };

    $scope.clearSelection = function () {
        $scope.newSelection = new SC.DataSelection();

        $scope.dataSelectionForm.$setPristine();
        $scope.dataSelectionForm.$setUntouched();
    };


    // ---- ---- ---- ---- Selection Level Navigation ---- ---- ---- ---- //
    $scope.addSelectionLevel = function () {
        $scope.componentProperties.editObject.selections.splice($scope.selectionIndex + 1, 0, []);
        $scope.componentProperties.editObject.filters.splice($scope.selectionIndex + 1, 0, []);

        $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex + 1];
        $scope.selectionIndex = $scope.selectionIndex + 1;
    };

    $scope.deleteSelectionLevel = function () {
        $scope.componentProperties.editObject.selections.splice($scope.selectionIndex, 1);
        $scope.componentProperties.editObject.filters.splice($scope.selectionIndex, 1);

        $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex];
        
        if ($scope.selectionIndex >= $scope.componentProperties.editObject.selections.length) {
            $scope.selectedLevel = $scope.componentProperties.editObject.selections[$scope.selectionIndex - 1];
            $scope.selectionIndex = $scope.selectionIndex - 1;
        }
    }

    $scope.changeSelectionLevel = function () {
        $scope.selectionIndex = $scope.componentProperties.editObject.selections.indexOf($scope.selectedLevel);
    }


    // ---- ---- ---- ---- Selection Levels ---- ---- ---- ---- //
    $scope.moveSelectionUp = function (source, target, targetIndex) {
        if (targetIndex > 0) {
            var desitationIndex = targetIndex - 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };

    $scope.deleteSelection = function (index) {
        $scope.componentProperties.editObject.selections[$scope.selectionIndex].splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataSelectionSettings', ['$scope', '$mdDialog', 'selection', 'current', 'appManager', function ($scope, $mdDialog, selection, current, appManager) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ---- //
    $scope.selection = selection;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DF = appManager.data.DF;
    var SF = appManager.state.SF;

    $scope.pivotProgress = false;

    $scope.pivotChcked = function () {
        if (selection.pivot) {
            loadPivotValues();
            selection.aggregateFunction = true;
        }
    };
    $scope.aggregateFunctionChecked = function () {
        if (!selection.aggregateFunction) {
            selection.pivot = false;
        }
    };


    function loadPivotValues() {
        if (selection.pivot && selection.dataValue && !$scope.pivotValues) {

            $scope.pivotProgress = true;
            var postObject = { post: { type: "column", alias: current.dataGroup.source.alias, columnName: selection.dataValue.COLUMN_NAME, order: 'asc' } };

            API.schema().save(postObject).$promise.then(function (response) {
                $scope.pivotProgress = false;
                $scope.pivotValues = response.result;
            });
        }
    }
    loadPivotValues();

    $scope.pivotOperations = [
        { operation: "equal", name: "Equal", selectedValues: [] },
        { operation: "greater", name: "Greater", selectedValues: [] },
        { operation: "less", name: "Less", selectedValues: [] },
        { operation: "greaterE", name: "Greater or Equal", selectedValues: [] },
        { operation: "lessE", name: "Less or Equal", selectedValues: [] }

    ];
    $scope.pivotOperation = null;
    $scope.addOperation = function () {
        selection.pivotValues.push($scope.pivotOperation);
        $scope.pivotOperation = null;
    }
    $scope.removeOperation = function (index) {
        selection.pivotValues.splice(index, 1);
    };


    // ---- ---- ---- ---- Dialog ---- ---- ---- ---- //

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataSource', ['$scope', 'appManager', 'componentViewFactory', '$mdDialog', function ($scope, appManager, componentViewFactory, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    $scope.SO = appManager.state.SO;


    $scope.componentProperties = componentViewFactory.componentProperties;

    $scope.dataSets = $scope.SO.product.DataSources.filter(function (obj) {
        return obj.SourceType === 'T';
    });

    $scope.procedures = $scope.SO.product.DataSources.filter(function (obj) {
        return obj.SourceType === 'P';
    })

    $scope.setDataSource = function (dataSourceObject) {
        $scope.componentProperties.editObject.source.alias = dataSourceObject.Alias;
        $scope.componentProperties.editObject.source.type = dataSourceObject.SourceType;
        $scope.closeDialog();
    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);
analysis.controller('DataView', ['$scope', 'appManager', '$mdSidenav', 'dataFilterFactory', 'dataSelectionFactory', 'viewFactory', function ($scope, appManager, $mdSidenav, dataFilterFactory, dataSelectionFactory, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SF = appManager.state.SF;
    $scope.SF = appManager.state.SF;
    $scope.DO = appManager.data.DO;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    DF.populateAppData();
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
    $scope.item = { sizeX: 1, sizeY: 1 };


    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    $scope.current = {
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };

    $scope.setSelectionLevel = viewFactory.setSelectionLevel;
    $scope.setDataGroup = viewFactory.setDataGroup;
    $scope.setCanvas = viewFactory.setCanvas;

    viewFactory.setCanvas(DSO.canvases[0], $scope.current);


    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    $scope.filterResults = dataFilterFactory.filterResults;


    // ---- ---- ---- ---- Filter Side Nav Functions ---- ---- ---- ---- //
    $scope.tempCards = [];
    $scope.filterAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.filterAutoChanged = function (value) {
        dataFilterFactory.quickAddFilter(value, $scope.current.dataGroup, $scope.current.selectionIndex, $scope.tempCards);
        $scope.filterAuto.searchText = null;
    };


    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.dataAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.selectionAutoChanged = function (value) {
        dataSelectionFactory.quickAddDataSelection(value, $scope.current.dataGroup, $scope.current.selectionIndex);
        $scope.dataAuto.searchText = null;
    };


    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    $scope.build = function () {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response.result);
            dataGroupDataObject.result = response.result;
        }).catch(function (error) { console.log(error); });

    };

}]);
analysis.directive('hcChart', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element',
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
                series: [{name: 'test', data: [17,34,22,27]}]
            };

            scope.canvasElement.chartOptions = (typeof scope.canvasElement.chartOptions === 'undefined') ? defaultchartOptions : scope.canvasElement.chartOptions;

            loadChart();

            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });
            

            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            //scope.$watch('canvasElement.chartOptions', function (newValue, oldValue) {
            //    if (newValue !== oldValue)
            //    {
            //        loadChart();
            //    }
            //}, true);

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chartOptions);
                
                console.log(chart);
                //scope.data.forEach(function (d) {
                //    chart.addSeries(d);
                //});

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
}])
analysis.factory('componentViewFactory', ['appManager', '$mdDialog', function (appManager, $mdDialog) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var SO = appManager.state.SO;
    var factory = {};


    // ---- ---- ---- ---- DASHBOARD COMPONENTS ---- ---- ---- ---- //
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
                children: canvas.dataGroups,
                parentObject: canvas
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
        newEdit({ editType: 'new', componentType: component, editParent: null, parentObject: null });
    }


    // ---- ---- ---- ---- COMPONENT LIST ---- ---- ---- ---- //
    factory.componentList = {
        components: null,
        actions: [
            { icon: 'assets/icons/md-edit.svg', tooltip: 'Edit', action: editComponent },
            { icon: 'assets/icons/md-copy.svg', tooltip: 'Duplicate', action: duplicateComponent },
            { icon: 'assets/icons/md-delete.svg', tooltip: 'Delete', action: deleteComponent },
        ]
    };
    function editComponent(component, parent, parentObject) {
        newEdit({ editType: 'existing', editObject: component, editParent: parent, parentObject: parentObject });
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
        if (component instanceof SC.DataGroup) {
            var GUIDIndex = parent.map(function (obj) { return obj.GUID }).indexOf(component.GUID);
            DO.dataGroups.splice(GUIDIndex, 1);
        }
    }


    // ---- ---- ---- ---- COMPONENET PROPERTIES ---- ---- ---- ---- //
    factory.componentProperties = {
        editType: null,
        editObject: null,
        editParent: null,
        parentObject: null,
        parentTemp: [],
        closeEdit: closeEdit,
        saveEdit: saveEdit,
        getSchema: getSchema
    };
    function newEdit(editConfig) {
        factory.componentProperties.editType = editConfig.editType;
        factory.componentProperties.editParent = editConfig.editParent;
        factory.componentProperties.parentObject = editConfig.parentObject;
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

            if (factory.componentProperties.editObject.source) {
                getSchema();
            }

        }

    }
    function saveEdit() {
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
                //push new DO.dataGroup registry
                if (factory.componentProperties.editObject instanceof SC.DataGroup) {

                    // var newDataObject = { GUID: factory.componentProperties.editObject.GUID, result: null, drillDown: [] }
                    // DO.dataGroups.push(newDataObject);

                    //GET DISTINCT FOR SELECTION LEVELS
                    //factory.componentProperties.editObject.drillDown.level.forEach(function (level, levelIndex) {
                    //    //newDataObject.drillDown[levelIndex] =  getColumnDistinct(factory.componentProperties.editObject.source.product, factory.componentProperties.editObject.source.alias, level);
                    //    //THIS is actually not the right place for this functionality
                    //    //When the user selections a region, the next chip autocomplete needs to only show
                    //    //options availalbe in that region, or in otherwords, WHERE Region = .. etc.
                    //});
                }
            }
            else if (factory.componentProperties.editType === 'existing') {
                var index = factory.componentProperties.editParent.map(function (obj) { return obj.GUID }).indexOf(factory.componentProperties.editObject.GUID);
                factory.componentProperties.editParent[index] = factory.componentProperties.editObject;
            }
            closeEdit();
        }
        DF.populateAppData();
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
    function getSchema() {
        if (factory.componentProperties.editObject.source.type === 'T') {
            //REMOVE BEFORE FLIGHT
            API.schema().save(logger.postObject({ type: "table", alias: factory.componentProperties.editObject.source.alias })).$promise.then(function (response) {
                //API.tableSchema().get().$promise.then(function (response) {
                DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }
    }


    return factory;
}]);
analysis.factory('dataFilterFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    factory.filterResults = function (query) {
        if (query) {
            var results = DO.tableSchema.filter(function (tableValue) {
                return angular.lowercase(tableValue.COLUMN_NAME).indexOf(angular.lowercase(query)) >= 0;
            });
            return results ? results : [];
        }
        else { return DO.tableSchema; }
    };

    factory.quickAddFilter = function(dataValue, dataGroup, selectionIndex, tempCards) {
        if (dataValue) {

            var newFilter = new SC.DataFilter(SF.availableDataFilters()[0], dataValue);
            newFilter.alias = dataValue.COLUMN_NAME;
            newFilter.operations.push({ operation: "in", name: "Range", type: 'dfo-checklist', selectedValues: [] });

            var newFilterDataObject = { GUID: newFilter.GUID, dataValues: [] };

            var tempGUID = SF.generateGUID();
            createTempCard(dataValue, tempGUID, tempCards);

            var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: newFilter.dataValue.COLUMN_NAME, order: newFilter.dataValueOrder } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj, isChecked: false });
                });
                DO.filters.push(newFilterDataObject);
                deleteTempCard(tempGUID, tempCards);
                dataGroup.filters[selectionIndex].push(newFilter);
            });
        }
    };

    function createTempCard(dataValue, GUID, tempCards) {
        tempCards.push({ alias: dataValue.COLUMN_NAME, GUID: GUID });
    }
    function deleteTempCard(GUID, tempCards) {
        var index = tempCards.map(function (obj) { return obj.GUID }).indexOf(GUID);
        if (index >= 0) {
            tempCards.splice(index, 1);
        }
    }

    return factory;
}]);
analysis.factory('dataSelectionFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //

    factory.quickAddDataSelection = function(dataValue, dataGroup, selectionIndex) {
        if (dataValue) {

            var newSelection = new SC.DataSelection({ name: "Custom Data Selection", type: "custom-data-selection" }, dataValue);
            newSelection.alias = dataValue.COLUMN_NAME;

            dataGroup.selections[selectionIndex].push(newSelection);
        }
    };


    return factory;
}]);
analysis.factory('viewFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var factory = {};

    // ---- ---- ---- ---- Query Functions ---- ---- ---- ---- //
    factory.buildQueryObject = function(dataGroup, selectionIndex) {
        return {
            source: dataGroup.source,
            pagination: dataGroup.pagination,
            aggregation: dataGroup.aggregation,
            selections: dataGroup.selections[selectionIndex],
            filters: dataGroup.filters[selectionIndex]
        }
    };

    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    factory.setSelectionLevel = function(selectionLevel, index, current) {
        current.selectionLevel = selectionLevel;
        current.selectionIndex = index;
    }

    factory.setDataGroup = function (dataGroup, current) {
        console.log(dataGroup);
        console.log(current);

        current.dataGroup = dataGroup;
        factory.setSelectionLevel(dataGroup.selections[0], 0, current);

        if (dataGroup.source.type === 'T') {
            //REMOVE BEFORE FLIGHT
            API.schema().save(logger.postObject({ type: "table", alias: dataGroup.source.alias })).$promise.then(function (response) {
                //API.tableSchema().get().$promise.then(function (response) {
                DO.tableSchema = response.result;
            }).catch(function (error) {
                logger.toast.error('Error Getting Table Schema', error);
            });
        }
    };

    factory.setCanvas = function (canvas, current) {
        current.canvas = canvas;
        factory.setDataGroup(canvas.dataGroups[0], current);
    };

    return factory;
}]);