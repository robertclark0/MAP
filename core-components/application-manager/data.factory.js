applicationManager.factory('appDataManager', ['$rootScope', '$resource', function ($rootScope, $resource) {

    var apiEndpoint = 'http://localhost:51880/api/';
    //var apiEndpoint = 'https://pasbadevweb/MAP/lily/api/';
    //var apiEndpoint = 'http://localhost:3000/';

    //    DATA OBJECT
    //
    var dataObject = {};

    dataObject.user = null;
    dataObject.User = function (userInfoAPIResponse) {
        this.id = {
            PACT: userInfoAPIResponse.UID,
            EDIPI: userInfoAPIResponse.EDIPN,
            AKO: userInfoAPIResponse.akoUserID
        };
        this.productLines = {
            userActive: []
        };
        this.name = {
            first: userInfoAPIResponse.fName,
            last: userInfoAPIResponse.lName
        };
        this.DMIS = userInfoAPIResponse.dmisID;
        this.region = userInfoAPIResponse.RHCName;
        this.email = userInfoAPIResponse.userEmail;
    };

    dataObject.productLines = null;
    dataObject.ProductLines = function (productLinesAPIResponse) {
        this.value = productLinesAPIResponse;
    };

    dataObject.dataSource = [];
    dataObject.tableSchema = [];

    dataObject.canvasElements = [];
    // {element: , ChartDOM: }

    dataObject.dataGroups = [];
    // {GUID: , result: }



    //    DATA FUNCTIONS
    //
    var dataFunctions = {};

    dataFunctions.getDataGroup = function (GUID) {
        var GUIDList = dataObject.dataGroups.map(function (obj) { return obj.GUID });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.dataGroups[index];
        }
        return null;
    };



    //    API RESOURCE
    //
    var apiResource = {};

    apiResource.endpoint =  apiEndpoint;

    var userInfoAPI = apiEndpoint + 'user-info';
    apiResource.userInfo = function () { return $resource(userInfoAPI); };

    var userActiveAPI = apiEndpoint + 'user-active';
    apiResource.userActive = function () { return $resource(userActiveAPI); };

    var productLinesAPI = apiEndpoint + 'product-lines';
    apiResource.productLines = function () { return $resource(productLinesAPI); };

    var dataSourcesAPI = apiEndpoint + 'data-sources';
    apiResource.dataSources = function () { return $resource(dataSourcesAPI); };

    var dataSourceParametersAPI = apiEndpoint + 'data-source-parameters';
    apiResource.dataSourceParameters = function () { return $resource(dataSourceParametersAPI); };

    var queryAPI = apiEndpoint + 'query';
    apiResource.query = function () { return $resource(queryAPI); };

    var downloadAPI = apiEndpoint + 'download';
    apiResource.download = function () { return $resource(downloadAPI); };

    var downloadUpdateAPI = apiEndpoint + 'download-update';
    apiResource.downloadUpdate = function () { return $resource(downloadUpdateAPI); };

    var tableSchemaAPI = apiEndpoint + 'schema/table';
    apiResource.tableSchema = function () { return $resource(tableSchemaAPI); };

    var columnSchemaAPI = apiEndpoint + 'schema/column';
    apiResource.columnSchema = function () { return $resource(columnSchemaAPI); };

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