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

    //DF.populateAppData();
    //

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
        mobileBreakPoint: 1024,
        defaultSizeX: 8, 
        defaultSizeY: 6,
    };

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


    // ---- ---- ---- ---- Menu Functions ---- ---- ---- ---- //
    //CANVAS
    $scope.addCanvasElement = function (name, type) {
        $scope.current.canvas.canvasElements.push(new SC.CanvasElement(name, type));
    };

    //REPORT
    $scope.showSaveReport = function (ev) {
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/saveReport.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            controller: 'SaveReport',
            locals: {
                current: $scope.current
            }
        });
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


    // ---- ---- ---- ---- Canvas Element Side Nav Functions : CHARTS---- ---- ---- ---- //
    $scope.addSeries = function (GUID, selection) {
        $scope.current.canvasElement.chart.series.push({ GUID: GUID, selection: selection, options: null });
    };
    $scope.removeSeries = function (seriesArray, series, index) {

        var element = DF.getCanvasElement($scope.current.canvasElement.GUID);
        if (element.chart) {
            var seriesIndex = element.chart.series.map(function (obj) { return obj.name }).indexOf(series.selection);
            if (seriesIndex >= 0) {
                element.chart.series[seriesIndex].remove(true);
            }
            SF.deleteElement(seriesArray, series, index);
        }
        else {
            console.log("No chart property on element object.");
        }
    };


    $scope.tempChart = { options: {}};
    $scope.currentChart = null;
    $scope.$watch('current.canvasElement', function (element) {
        if (element && element.type === 'hc-Chart') {

            var elementObject = DF.getCanvasElement(element.GUID);
            console.log(elementObject.chart);
            if (elementObject.chart) {
                $scope.currentChart = elementObject.chart;
                $scope.tempChart.options = element.chart.userOptions;
            }
        }
        else {
            $scope.tempChart = { options: {} };
            $scope.currentChart = null;
        }
    }, true);

    $scope.updateChart = function () {
        try {
            var elementObject = DF.getCanvasElement($scope.current.canvasElement.GUID);
            if (elementObject.chart) {
                $scope.currentChart = elementObject.chart;
            }

            $scope.currentChart.update($scope.tempChart.options);
            $scope.tempChart = { options: {} };
            $scope.current.canvasElement.chart.options = angular.copy($scope.currentChart.options);
        }
        catch (e) {
            logger.toast.error("Invalid options object.", e);
        }
    };
    $scope.updateSeries = function (index) {
        try {
            var elementObject = DF.getCanvasElement($scope.current.canvasElement.GUID);
            if (elementObject.chart) {
                $scope.currentChart = elementObject.chart;
            }

            $scope.currentChart.series[index].update($scope.tempChart.options);
            $scope.tempChart = { options: {} };
            
            var seriesOptions = angular.copy($scope.currentChart.series[index].options);
            
            delete seriesOptions.data;
            $scope.current.canvasElement.chart.series[index].options = seriesOptions
        }
        catch (e) {
            logger.toast.error("Invalid options object.", e);
        }
    };

    $scope.editorOptions = { mode: 'code' };


    // ---- ---- ---- ---- Canvas Element Side Nav Functions : SELECTION CONTROL ---- ---- ---- ---- //

    $scope.addChart = function (GUID) {
        if ($scope.current.canvasElement.selectionControl.chartElementGUIDs.indexOf(GUID) < 0) {
            $scope.current.canvasElement.selectionControl.chartElementGUIDs.push(GUID);
        }


    };

    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    $scope.build = function () {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);
        console.log(JSON.stringify(queryObject));

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response);
            dataGroupDataObject.result = response.result;
        }).catch(function (error) { console.log(error); });

    };

}]);