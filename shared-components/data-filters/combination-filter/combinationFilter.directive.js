mapApp.directive('combinationFilter', ['appManager', 'dataFilterFactory', '$mdPanel', function (appManager, dataFilterFactory, $mdPanel) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/combination-filter/combinationFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        var DO = appManager.data.DO;
        var DF = appManager.data.DF;
        var API = appManager.data.API;

        var filterDataObject = null;

        checkData();

        scope.filterDataObject = filterDataObject;
        

        scope.showSelect = function (ev) {
            var position = $mdPanel.newPanelPosition()
            .relativeTo(ev.target)
            .addPanelPosition('align-start', 'center');

            var config = {
                attachTo: angular.element(document.body),
                controller: 'CombinationSelectPanel',
                template: '<md-card><md-virtual-repeat-container style="height: 200px; width: 278px;"><md-list-item md-virtual-repeat="item in filterDataObject" ng-click="selected(item)">{{format(item)}}</md-list-item></md-virtual-repeat-container></md-card>',
                //panelClass: 'popout-menu',
                locals: {
                    filter: scope.filter,
                    operation: scope.operation
                },
                position: position,
                openFrom: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                zIndex: 1001
            };

            $mdPanel.open(config);
        };

        function checkData() {

            if (DF.getFilter(scope.filter.GUID) !== null) {
                filterDataObject = DF.getFilter(scope.filter.GUID)
            }
            else {
                //check to see if filter values exist, if not, get them.

                filterDataObject = { GUID: scope.filter.GUID, dataValues: [] };
                DO.filters.push(filterDataObject);

                var postObject = { post: { type: "column", alias: scope.current.dataGroup.source.alias, columnName: scope.filter.operations.map(function (operation) { return operation.dataValue.COLUMN_NAME; }), order: scope.filter.orderValue } };

                API.schema().save(postObject).$promise.then(function (response) {
                    filterDataObject.dataValues.length = 0;
                    response.result.forEach(function (obj) {
                        filterDataObject.dataValues.push({ value: obj, isChecked: false });
                    });
                });

                console.log(filterDataObject);
                console.log(scope.filter);
            }
        };

    };
}]);


