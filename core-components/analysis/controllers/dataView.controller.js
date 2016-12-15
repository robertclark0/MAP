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