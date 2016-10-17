analysis.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;

    DF.populateAppData();

    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    
    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
        resizable: {
            //start: function (event, $element, widget) {
            //    widget.destroyChart();
            //},
            //stop: function (event, $element, widget) {
            //    widget.createChart();
            //}
        },
        draggable: {
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

       $scope.current.canvas.canvasElements.push(new SC.CanvasElement(name, type));
    };


    //CURRENT OBJECT CONTROLS
    $scope.current = {
        canvas: DSO.canvases[0],
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };
    $scope.changeCurrent = function(enterIndex)
    {
        if(enterIndex < 1)
        {
            $scope.current.dataGroup = null;
            if($scope.current.canvas.dataGroups[0]){ $scope.current.dataGroup = $scope.current.canvas.dataGroups[0]; }

            $scope.current.canvasElement = null;
            if($scope.current.canvas.canvasElements[0]){ $scope.current.canvasElement = $scope.current.canvas.canvasElements[0]; }
        }
        if(enterIndex < 2)
        {
            $scope.current.selectionLevel = null;
            if ($scope.current.dataGroup) {
                $scope.current.selectionLevel = $scope.current.dataGroup.selections[0];
                $scope.current.selectionIndex = 0;
            }
        }			
    };
    $scope.changeCurrent(0);


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