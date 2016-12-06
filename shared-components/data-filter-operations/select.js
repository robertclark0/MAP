mapApp.directive('dfoSelect', ['appManager', '$mdPanel', function (appManager, $mdPanel) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filter-operations/select.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.showSelect = function (ev) {
            var position = $mdPanel.newPanelPosition()
            .relativeTo(ev.target)
            .addPanelPosition('align-start', 'center');

            var config = {
                attachTo: angular.element(document.body),
                controller: 'SelectPanel',
                template: '<md-card><md-virtual-repeat-container style="height: 200px; width: 250px;"><md-list-item md-virtual-repeat="item in filterDataObject" ng-click="selected(item)">{{item}}</md-list-item></md-virtual-repeat-container></md-card',
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

    };
}]);