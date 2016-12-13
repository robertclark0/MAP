analysis.controller('DataView', ['$scope', 'appManager', '$mdSidenav', function ($scope, appManager, $mdSidenav) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;

    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    $scope.canvases = DSO.canvases;

    DF.populateAppData();
    //

    $scope.dataGroupData = DO.dataGroups;

    $scope.$watch('dataGroupData', function (nv) {
        $scope.dataGroupData = nv;
        console.log(nv);
    }, true);

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
    $scope.item = { sizeX: 1, sizeY: 1, row: 0, col: 0 };


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
    $scope.setCanvas = function (canvas) {
        $scope.current.canvas = canvas;
        $scope.setDataGroup(canvas.dataGroups[0]);
    }(DSO.canvases[0]);


    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //

    function buildQueryObject(dataGroup, selectionIndex) {
        return {
            source: dataGroup.source,
            pagination: dataGroup.pagination,
            aggregation: dataGroup.aggregation,
            selections: dataGroup.selections[selectionIndex],
            filters: dataGroup.filters[selectionIndex]
        }
    };

    $scope.build = function () {
        var queryObject = buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);

        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);
        console.log(dataGroupDataObject);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response.result);
            dataGroupDataObject.result = response.result;
            console.log(dataGroupDataObject);

        }).catch(function (error) { console.log(error); });

    };


}]);