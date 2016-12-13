analysis.controller('CanvasView', ['$scope', 'appManager', '$mdSidenav', '$mdDialog', function ($scope, appManager, $mdSidenav, $mdDialog) {

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


    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    $scope.filterResults = function (query) {
        if (query) {
            var results = DO.tableSchema.filter(function (tableValue) {
                return angular.lowercase(tableValue.COLUMN_NAME).indexOf(angular.lowercase(query)) >= 0;
            });
            return results ? results : [];
        }
        else { return DO.tableSchema; }
    };


    // ---- ---- ---- ---- Filter Side Nav Functions ---- ---- ---- ---- //
    $scope.tempCards = [];
    $scope.filterAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.filterAutoChanged = function (value) {
        quickAddFilter(value);
        $scope.filterAuto.searchText = null;
    };
    function quickAddFilter(dataValue) {
        if (dataValue) {

            var newFilter = new SC.DataFilter(SF.availableDataFilters()[0], dataValue);
            newFilter.alias = dataValue.COLUMN_NAME;
            newFilter.operations.push({ name: "Equal", type: 'dfo-select', selectedValues: [] });

            var newFilterDataObject = { GUID: newFilter.GUID, dataValues: [] };
         
            var tempGUID = SF.generateGUID();
            createTempCard(dataValue, tempGUID);

            var postObject = { post: { type: "column", alias: $scope.current.dataGroup.source.alias, columnName: newFilter.dataValue.COLUMN_NAME, order: newFilter.dataValueOrder } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj, isChecked: false });
                });
                DO.filters.push(newFilterDataObject);
                deleteTempCard(tempGUID);
                $scope.current.dataGroup.filters[$scope.current.selectionIndex].push(newFilter);
            });
        }
    };
    function createTempCard(dataValue, GUID) {
        $scope.tempCards.push({alias: dataValue.COLUMN_NAME, GUID: GUID });
    }
    function deleteTempCard(GUID) {
        var index = $scope.tempCards.map(function (obj) { return obj.GUID }).indexOf(GUID);
        if (index >= 0) {
            $scope.tempCards.splice(index, 1);
        }
    }

    
    // ---- ---- ---- ---- Data Side Nav Functions ---- ---- ---- ---- //
    $scope.dataAuto = {
        selectedValue: null,
        searchText: null,
    };
    $scope.selectionAutoChanged = function (value) {
        quickAddDataSelection(value);
        $scope.dataAuto.searchText = null;
    };
    function quickAddDataSelection(dataValue) {
        if (dataValue) {

            var newSelection = new SC.DataSelection({ name: "Custom Data Selection", type: "custom-data-selection" }, dataValue);
            newSelection.alias = dataValue.COLUMN_NAME;

            $scope.current.dataGroup.selections[$scope.current.selectionIndex].push(newSelection);
        }
    };


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

        console.log(JSON.stringify(queryObject))

        API.query().save({ query: queryObject }).$promise.then(function (response) { console.log(response); }).catch(function (error) { console.log(error); });

    };

}]);