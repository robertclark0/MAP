﻿mapApp.factory('dataFilterFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    factory.filterResults = function (query) {
        if (query) {
            var results = DO.tableSchema.filter(function (tableValue) {
                return angular.lowercase(tableValue.COLUMN_NAME).indexOf(angular.lowercase(query)) >= 0;
            });
            return results ? results : [];
        }
        else { return DO.tableSchema; }
    };

    factory.quickAddFilter = function (dataValue, dataGroup, selectionIndex, tempCards) {
        if (dataValue) {

            var newFilter = new SC.DataFilter(SF.availableDataFilters()[0], dataValue);
            newFilter.alias = dataValue.COLUMN_NAME;
            newFilter.operations.push({ operation: "in", name: "Range", type: 'dfo-checklist', selectedValues: [] });

            var newFilterDataObject = { GUID: newFilter.GUID, dataValues: [] };

            var tempGUID = SF.generateGUID();
            createTempCard(dataValue, tempGUID, tempCards);

            var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: [newFilter.dataValue.COLUMN_NAME], order: newFilter.orderValue } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj[0], isChecked: false });
                });
                DO.filters.push(newFilterDataObject);
                deleteTempCard(tempGUID, tempCards);
                dataGroup.filters[selectionIndex].push(newFilter);
            });
        }
    };

    function createTempCard(dataValue, GUID, tempCards) {
        tempCards.push({ alias: dataValue.COLUMN_NAME, GUID: GUID });
    }
    function deleteTempCard(GUID, tempCards) {
        var index = tempCards.map(function (obj) { return obj.GUID }).indexOf(GUID);
        if (index >= 0) {
            tempCards.splice(index, 1);
        }
    }

    factory.populateFilterData = function (filter, dataGroup) {

        var filterDataObject;

        if (DF.getFilter(filter.GUID) !== null) {
            filterDataObject = DF.getFilter(filter.GUID)
        }
        else {
            filterDataObject = { GUID: filter.GUID, dataValues: [] };
            DO.filters.push(filterDataObject);
        }
        

        var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: [filter.dataValue.COLUMN_NAME], order: filter.orderValue } };

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues.length = 0;
            console.log(JSON.stringify(filterDataObject.dataValues));

            response.result.forEach(function (obj) {
                
                filter.operations.forEach(function (operation) {
                    if (operation.type === 'dfo-checklist') {
                        if (operation.selectedValues.indexOf(obj[0]) > -1) {
                            filterDataObject.dataValues.push({ value: obj[0], isChecked: true });
                        }
                        else {
                            filterDataObject.dataValues.push({ value: obj[0], isChecked: false });
                        }                             
                    }
                    else {
                        filterDataObject.dataValues.push({ value: obj[0], isChecked: false });
                    }
                });


            });
        });
    };

    return factory;
}]);