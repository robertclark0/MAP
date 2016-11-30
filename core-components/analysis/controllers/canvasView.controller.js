analysis.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', '$mdDialog', function ($scope, appManager, $mdSidenav, $mdDialog) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var DO = appManager.data.DO;
    var SC = appManager.state.SC;
    var DF = appManager.data.DF;
    $scope.SF = appManager.state.SF;

    DF.populateAppData();

    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    
    $scope.toggleSideNav = function (navID) {
        $mdSidenav(navID).toggle();
    };

    $scope.gridsterOpts = {
        columns: 36,
    };
   
    $scope.changeOptions = function (element) {
        
        var options = element.chartOptions;
        options.title.text = 'Chart #' + Math.floor(Math.random() * 100);
        element.chartOptions = options;

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
    
    $scope.setSelectionLevel = function (selectionLevel, index) {
        $scope.current.selectionLevel = selectionLevel;
        $scope.current.selectionIndex = index;
    }
    $scope.setDataGroup = function (dataGroup) {
        $scope.current.dataGroup = dataGroup;
        $scope.setSelectionLevel(dataGroup.selections[0], 0);
    };
    $scope.setCanvas = function (canvas) {
        $scope.current.canvas = canvas;
        $scope.setDataGroup(canvas.dataGroups[0]);
    }(DSO.canvases[0]);
    

    // ---- ---- ---- ---- Side Nav Functions ---- ---- ---- ---- //



    //DATA CONTROLL - AGGREGATE FUNCTIONS
    $scope.showAggregateFunctions = function (ev, selection) {
        $scope.current.selectionValue = selection;
        console.log($scope.current.selectionValue);
        $mdDialog.show({
            templateUrl: 'core-components/analysis/templates/aggregateFunctions.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'CanvasView'
        });
    };
    $scope.selectedOperation = null;
    $scope.operations = [
        { name: "Count", type: 'count' },
        { name: "Sum", type: 'sum' },
        { name: "Pivot Count", type: 'case-count' },
        { name: "Pivot Sum", type: 'case-sum' }
    ];
    $scope.addOperation = function () {
        $scope.current.selectionValue.aggregation.operators.push($scope.selectedOperation);
    };

}]);