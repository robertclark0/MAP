applicationManager.factory('appDataManager', ['$rootScope', '$resource', 'appStateManager', function ($rootScope, $resource, appStateManager) {

    var apiEndpoint = 'http://localhost:51880/api/';
    //var apiEndpoint = 'https://pasbadevweb/MAP/lily/api/';
    //var apiEndpoint = 'http://localhost:3000/';

    //    DATA OBJECT
    //
    var dataObject = {};

    dataObject.user = null;
    dataObject.products = null;

    dataObject.dataSource = [];
    dataObject.tableSchema = [];

    dataObject.canvasElements = [];
    // {element: , ChartDOM: }

    dataObject.dataGroups = [];
    // { GUID: , result: , drillDown: [] }

    dataObject.filters = [];
    // { GUID: , dataValues: [] }



    //    DATA FUNCTIONS
    //
    var dataFunctions = {};

    dataFunctions.getDataGroup = function (GUID) {
        var GUIDList = dataObject.dataGroups.map(function (obj) { return obj.GUID; });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.dataGroups[index];
        }
        return null;
    };
    dataFunctions.getFilter = function (GUID) {
        var GUIDList = dataObject.filters.map(function (obj) { return obj.GUID; });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.filters[index];
        }
        return null;
    };

    dataFunctions.populateAppData = function () {
        appStateManager.DSO.canvases.forEach(function (canvas) {
            canvas.dataGroups.forEach(function (dataGroup) {
                if (dataObject.dataGroups.map(function(obj){ return obj.GUID;}).indexOf(dataGroup.GUID) < 0){
                    dataObject.dataGroups.push({ GUID: dataGroup.GUID, result: null, drillDown: [] });
                    //dataGroup.query.execute();
                }

                dataGroup.filters.forEach(function (filterLevel) {
                    filterLevel.forEach(function (filter) {
                        if (dataObject.filters.map(function (obj) { return obj.GUID }).indexOf(filter.GUID) < 0) {
                            var newFilterDataObject = { GUID: filter.GUID, dataValues: [] };
                            dataObject.filters.push(newFilterDataObject);
                            dataFunctions.getDistinctFilterValues(dataGroup, filter, newFilterDataObject);
                        }
                    })
                });
            });
        });
    };

    dataFunctions.getDistinctFilterValues = function (dataGroup, filter, filterDataObject) {
        apiResource.schema().save({ post: { type: "column", alias: dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.dataValueOrder } }).$promise.then(function (response) {
            filterDataObject.dataValues = response.result;
            console.log(response.result);
        });
    };


    //    API RESOURCE
    //
    var apiResource = {};

    apiResource.endpoint = apiEndpoint;

    var userAPI = apiEndpoint + 'user';
    apiResource.user = function () { return $resource(userAPI); };

    var productAPI = apiEndpoint + 'products';
    apiResource.products = function () { return $resource(productAPI); };

    var schemaAPI = apiEndpoint + 'schema';
    apiResource.schema = function () { return $resource(schemaAPI); };

    //==================

    var queryAPI = apiEndpoint + 'query';
    apiResource.query = function () { return $resource(queryAPI); };

    var downloadAPI = apiEndpoint + 'download';
    apiResource.download = function () { return $resource(downloadAPI); };

    var downloadUpdateAPI = apiEndpoint + 'download-update';
    apiResource.downloadUpdate = function () { return $resource(downloadUpdateAPI); };

    var getReportAPI = apiEndpoint + 'report';
    apiResource.getReport = function () { return $resource(getReportAPI); };

    var updateReportAPI = apiEndpoint + 'report/update';
    apiResource.updateReport = function () { return $resource(updateReportAPI); };

    var createReportAPI = apiEndpoint + 'report/create';
    apiResource.createReport = function () { return $resource(createReportAPI); };

    var deleteReportAPI = apiEndpoint + 'deport/delete';
    apiResource.deleteReport = function () { return $resource(deleteReportAPI); };

    var getReportListAPI = apiEndpoint + 'report/list';
    apiResource.getReportList = function () { return $resource(getReportListAPI); };


    //    STRUCTURE
    //
    var dataScope = $rootScope.$new(true);
    dataScope.API = apiResource;
    dataScope.DO = dataObject;
    dataScope.DF = dataFunctions;

    return dataScope;


}]);