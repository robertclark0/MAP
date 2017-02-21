mapApp.directive('selectionControl', [function () {
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

        // Array of DataGroups controlled by this selection control
        var dataGroups = [];

        // Array of selected drill down values by this selection control
        var selections = [];

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

            uniqueDataGroupGUIDs = unique(dataGroupGUIDs);
        }

        // Initiation of DataGroup aquisition when charts are added or removed.
        scope.$watch('element.selectionControl.chartElementGUIDs', function (nv, ov) {
            if (nv !== ov) {
                console.log(scope.element.selectionControl.chartElementGUIDs);

                getDataGroups(nv);
            }
        }, true);

        
        // Support Functions
        // takes and array, returns array with only unique values.
        function unique(array) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            return array.filter(onlyUnique);
        };


        //----> TO DO
        
        // Change or selection is made
            //list for broadcast even
            //check to see if broadcasting chart-directive parent element is an element we are watching 
            //initiate or ignore
            scope.$on('selectionControl', function(event, message){
                console.log("I have recieved the message!");

                if(scope.element.selectionControl.chartElementGUIDs.indexOf(message.GUID) >= 0){
                    console.log("This pertains to me!");
                    console.log(message);
                }               
            })

        // Query all DataGroups with availalbe parameters

    };
}]);