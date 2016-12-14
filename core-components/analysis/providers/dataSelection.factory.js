analysis.factory('dataSelectionFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //

    factory.quickAddDataSelection = function(dataValue, dataGroup, selectionIndex) {
        if (dataValue) {

            var newSelection = new SC.DataSelection({ name: "Custom Data Selection", type: "custom-data-selection" }, dataValue);
            newSelection.alias = dataValue.COLUMN_NAME;

            dataGroup.selections[selectionIndex].push(newSelection);
        }
    };


    return factory;
}]);