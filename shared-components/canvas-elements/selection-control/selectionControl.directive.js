mapApp.directive('selectionControl', ['appManager', 'viewFactory', function (appManager, viewFactory) {
    return {
        restrict: 'E',
        scope: {
            element: '=',
            current: '='
        },
        templateUrl: 'shared-components/canvas-elements/selection-control/selectionControl.html',
        link: link
    };

    function link(scope, elem, attr) {

        var DF = appManager.data.DF;
        var API = appManager.data.API;

        // Array of DataGroups controlled by this selection control
        var dataGroups = [];

        // Array of selected drill down values by this selection control
        scope.selections = [];

        // Aquisition of DataGroups based on chart element GUIDS provided.
        function getDataGroups(chartElementGUIDs) {

            var canvasElementGUIDs = scope.current.canvas.canvasElements.map(function (element) { return element.GUID; });
            
            var uniqueDataGroupGUIDs = [];
            var dataGroupGUIDs;

            chartElementGUIDs.forEach(function (GUID) {
                var index = canvasElementGUIDs.indexOf(GUID);
                var chartSeries = scope.current.canvas.canvasElements[index].chart.series;
                dataGroupGUIDs = chartSeries.map(function (series) { return series.GUID; });
                dataGroupGUIDs.forEach(function (GUID) {
                    uniqueDataGroupGUIDs.push(GUID);
                });
                
            });

            if (dataGroupGUIDs && dataGroupGUIDs.length > 0) {
                uniqueDataGroupGUIDs = unique(dataGroupGUIDs);
                dataGroups.length = 0;

                uniqueDataGroupGUIDs.forEach(function (GUID) {
                    var index = scope.current.canvas.dataGroups.map(function (obj) { return obj.GUID; }).indexOf(GUID);
                    dataGroups.push(scope.current.canvas.dataGroups[index]);                   
                });
                console.log(dataGroups);
            }

        }

        // Initiation of DataGroup aquisition when charts are added or removed.
        scope.$watch('element.selectionControl.chartElementGUIDs', function (nv, ov) {
            if (nv !== ov) {
                console.log(scope.element.selectionControl.chartElementGUIDs);

                getDataGroups(nv);
            }
        }, true);

        //Drill Up
        scope.drillUp = function (index) {
            scope.selections.length = index;

            scope.current.selectionIndex = scope.selections.length;

            // Query all DataGroups with availalbe parameters
            dataGroups.forEach(function (dataGroup) {
                if (dataGroup.selections.length >= scope.selections.length) {
                    var dataObject = DF.getDataGroup(dataGroup.GUID);

                    var queryObject = viewFactory.buildQueryObject(scope.current.dataGroup, scope.current.selectionIndex, scope.selections);
                    API.query().save({ query: queryObject }).$promise.then(function (response) {
                        dataObject.result = response.result;
                    });
                }
            });
        };

        
        // Support Functions
        // takes and array, returns array with only unique values.
        function unique(array) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            return array.filter(onlyUnique);
        };

        
        // Change or selection is made
            //list for broadcast even
            //check to see if broadcasting chart-directive parent element is an element we are watching 
            //initiate or ignore
        scope.$on('selectionControl', function (event, message) {
            if (scope.element.selectionControl.chartElementGUIDs.indexOf(message.GUID) >= 0) {

                var drillDownValue = createDrillDownValues(event, message);
                scope.selections.push(drillDownValue);

                scope.current.selectionIndex = scope.selections.length;

                // Query all DataGroups with availalbe parameters
                dataGroups.forEach(function (dataGroup) {
                    if (dataGroup.selections.length >= scope.selections.length) {
                        var dataObject = DF.getDataGroup(dataGroup.GUID);

                        var queryObject = viewFactory.buildQueryObject(scope.current.dataGroup, scope.current.selectionIndex, scope.selections);
                        API.query().save({ query: queryObject }).$promise.then(function (response) {
                            dataObject.result = response.result;
                        });
                    }
                });
            }

        });

        function createDrillDownValues(event, message) {
            var category = message.event.point.category;
            var seriesName = message.event.point.series.name
            var element = DF.getCanvasElement(message.GUID);
            var allSelections = [];
            dataGroups.forEach(function (dataGroup) {
                dataGroup.selections[scope.current.selectionIndex].forEach(function (selection) {
                    allSelections.push({ selection: selection, dataGroup: dataGroup });
                });
            });
            var allAlias = allSelections.map(function (obj) { return obj.selection.alias; });
            var index = allAlias.indexOf(seriesName);
            var selection = allSelections[index];
            var drillDown = { selection: null, value: null, alias: null };

            if (selection.selection.pivot) {
                drillDown.alias = selection.alias;
                drillDown.selection = selection.selection.dataValue;
                drillDown.value = seriesName;
            }
            else {
                drillDown.alias = selection.dataGroup.selections[scope.current.selectionIndex][0].alias;
                drillDown.selection = selection.dataGroup.selections[scope.current.selectionIndex][0].dataValue;
                drillDown.value = category;
            }

            console.log(drillDown);
            return drillDown;
        };


        //ON LOAD
        getDataGroups(scope.element.selectionControl.chartElementGUIDs);

    };
}]);