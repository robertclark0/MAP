var reporting = angular.module('reporting', []);
reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', 'viewFactory', function ($scope, appManager, $state, $mdDialog, $mdPanel, viewFactory) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;

    $scope.name = DSO.name;
    $scope.user = SO.user;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;


    $scope.current = {
        report: null,
        canvas: null,
        dataGroup: null,
        selectionLevel: null,
        selectionIndex: null,
        canvasElement: null
    };
    $scope.$watch('current', function (nv) {
        console.log( nv, 'fired');
        $scope.currentReport = nv;
    }, true);
    $scope.reports = null;
    //$scope.reportList = [];

    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showAnalysis = function () {
        return true;
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

    //GET REPORT LIST
    API.report().save(logger.postObject({ entityCode: SO.product.Code, type: 'list' })).$promise.then(function (response) {

        if (response.result.length > 0) {
            $scope.reports = catAndOrderReports(response.result);
            console.log(catAndOrderReports(response.result));
        }
        return API.report().save(logger.postObject({ report: { GUID: $scope.reports[0][0].GUID }, type: 'get' })).$promise;

    }).then(function (response) {
        console.log(response.result);
        $scope.current.report = $scope.reports[0][0];
        var canvas = JSON.parse(response.result.JSON);
        viewFactory.setCanvas(canvas, $scope.current);
    });


    function catAndOrderReports(reports) {

        var orderedReports = [];
        var categories = [];

        reports.forEach(function (report) {
            var category = report.Category;
            var catIndex = categories.indexOf(category);
            if (catIndex > -1) {
                orderedReports[catIndex].push(report);
            }
            else {
                var reportGroup = [];
                reportGroup.push(report);
                orderedReports.push(reportGroup);
                categories.push(category);
            }
        });

        orderedReports.forEach(function (reportGroup) {
            reportGroup.sort(function (a, b) {
                return b.Position - a.Position;
            });
        });

        return orderedReports;
    };

}]);
reporting.controller('ReportMenu', ['$scope', 'appManager', 'reports', 'current', 'mdPanelRef', 'viewFactory', function ($scope, appManager, reports, current, mdPanelRef, viewFactory) {

    API = appManager.data.API;
    logger = appManager.logger;
    SO = appManager.state.SO;

    $scope.reports = reports;

    $scope.selectReport = function (report) {
        current.report = report;

        API.report().save(logger.postObject({ report: { GUID: report.GUID }, type: 'get' })).$promise.then(function (response) {
            var canvas = JSON.parse(response.result.JSON);
            viewFactory.setCanvas(canvas, current);
            
            mdPanelRef.close();
        });       
    };

}]);