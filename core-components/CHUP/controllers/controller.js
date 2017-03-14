reporting.controller('CHUPController', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', 'viewFactory', function ($scope, appManager, $state, $mdDialog, $mdPanel, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var DF = appManager.data.DF;
    var DO = appManager.data.DO;

    $scope.user = SO.user;

    $scope.current = {
        report: null,
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };
    $scope.$watch('current', function (nv) {
        console.log(nv, 'fired');
        $scope.currentReport = nv;
    }, true);
    $scope.reports = null;

    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showReport = function (ev) {
        var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('offset-end', 'align-tops');

        var config = {
            attachTo: angular.element(document.body),
            controller: 'ReportMenu',
            templateUrl: 'core-components/reporting/templates/reportMenu.html',
            panelClass: 'popout-menu',
            position: position,
            openFrom: ev,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            zIndex: 1001,
            locals: {
                reports: $scope.reports,
                current: $scope.current
            }
        };

        $mdPanel.open(config);
    };

    //Show User Info
    $scope.showUserInfo = function (ev) {
        $mdDialog.show({
            templateUrl: 'shared-components/user/user.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            controller: 'User'
        });
    };

    //==========================


    $scope.gridsterOpts = {
        columns: 36,
        mobileBreakPoint: 1024,
        resizable: { enabled: false },
        draggable: { enabled: false }
    };

    //Chart Globals
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    //GET REPORT LIST
 
    //viewFactory.setCanvas(canvas, $scope.current);
            
    // ---- ---- ---- ---- Build Query ---- ---- ---- ---- //
    function build() {
        var queryObject = viewFactory.buildQueryObject($scope.current.dataGroup, $scope.current.selectionIndex);
        var dataGroupDataObject = DF.getDataGroup($scope.current.dataGroup.GUID);

        API.query().save({ query: queryObject }).$promise.then(function (response) {
            console.log(response);
            dataGroupDataObject.result = response.result;
            if (response.result.length === 0) {
                logger.toast.warning('The query produced no results.');
            }
        }).catch(function (error) { console.log(error); });

    };
    $scope.build = build;
}]);