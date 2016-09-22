metricDashboard.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;

    $scope.myChips = [];

    $scope.propertyPanel = DSO.dashboard.propertyPanel;

    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
        resizable: {
            handles: ['s','se', 'sw']
            //start: function (event, $element, widget) {
            //    widget.destroyChart();
            //},
            //stop: function (event, $element, widget) {
            //    widget.createChart();
            //}
        },
        draggable: {
            handle: '.test-drag'
            //start: function (event, $element, widget) {
            //    widget.destroyChart();
            //},
            //stop: function (event, $element, widget) {
            //    widget.createChart();
            //}
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