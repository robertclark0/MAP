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


        scope.$watch('element.selectionControl.chartElementGUIDs', function (nv, ov) {
            if (nv !== ov) {
                console.log(scope.element.selectionControl.chartElementGUIDs);

                getDataGroups(nv);
            }
        }, true);


        function getDataGroups(chartElementGUIDs) {

            var canvasElementGUIDs = scope.current.canvas.canvasElements.map(function (element) { return element.GUID; });
            
            var uniqueDataGroupGUIDs;

            chartElementGUIDs.forEach(function (GUID) {
                var index = canvasElementGUIDs.indexOf(GUID);
                var chartSeries = scope.current.canvas.canvasElements[index].chart.series;
                var dataGroupGUIDs = chartSeries.map(function (series) { return series.GUID; });
                dataGroupGUIDs.forEach(function (GUID) {
                    uniqueDataGroupGUIDs.push(GUID);
                });
                
            });

            uniqueDataGroupGUIDs = unique(dataGroupGUIDs);
        }

        // takes and array, returns array with only unique values.
        function unique(array) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            return array.filter(onlyUnique);
        };


    };
}]);