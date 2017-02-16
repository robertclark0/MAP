mapApp.factory('viewFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var factory = {};

    // ---- ---- ---- ---- Query Functions ---- ---- ---- ---- //
    factory.buildQueryObject = function (dataGroup, selectionIndex) {
        return {
            source: dataGroup.source,
            pagination: dataGroup.pagination,
            aggregation: dataGroup.aggregation,
            selections: dataGroup.selections[selectionIndex],
            filters: dataGroup.filters[selectionIndex]
        }
    };

    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    factory.setSelectionLevel = function (selectionLevel, index, current) {
        current.selectionLevel = selectionLevel;
        current.selectionIndex = index;
    }

    factory.setDataGroup = function (dataGroup, current) {

        current.dataGroup = dataGroup;

        if (dataGroup) {
            factory.setSelectionLevel(dataGroup.selections[0], 0, current);


            if (DO.dataGroups.map(function (obj) { return obj.GUID; }).indexOf(dataGroup.GUID) < 0) {
                var newDataObject = { GUID: dataGroup.GUID, result: null, drillDown: [] };
                DO.dataGroups.push(newDataObject);

                var queryObject = factory.buildQueryObject(dataGroup, 0);
                API.query().save({ query: queryObject }).$promise.then(function (response) {
                    newDataObject.result = response.result;
                });
            }

            if (dataGroup.source.type === 'T') {
                //REMOVE BEFORE FLIGHT
                API.schema().save(logger.postObject({ type: "table", alias: dataGroup.source.alias })).$promise.then(function (response) {
                    DO.tableSchema = response.result;
                }).catch(function (error) {
                    logger.toast.error('Error Getting Table Schema', error);
                });
            }
        }
    };

    factory.setCanvas = function (canvas, current) {
        current.canvas = canvas;

        canvas.dataGroups.forEach(function (dataGroup) {
            if (DO.dataGroups.map(function (obj) { return obj.GUID; }).indexOf(dataGroup.GUID) < 0) {
                var newDataObject = { GUID: dataGroup.GUID, result: null, drillDown: [] };
                DO.dataGroups.push(newDataObject);

                var queryObject = factory.buildQueryObject(dataGroup, 0);
                API.query().save({ query: queryObject }).$promise.then(function (response) {
                    newDataObject.result = response.result;
                });
            }
        });
        factory.setDataGroup(canvas.dataGroups[0], current);
    };

    return factory;
}]);