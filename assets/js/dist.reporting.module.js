var reporting = angular.module('reporting', []);
reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', function ($scope, appManager, $state, $mdDialog, $mdPanel) {

    console.log('Reporting Loaded');
    console.log(appManager.state.SO);

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;

    $scope.name = DSO.name;
    $scope.user = SO.user;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;
    

    $scope.currentReport = 'Summary Report';
    //$scope.reportList = [];

    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showAnalysis = function () {
        //var modules = DSO.modules.map(function (obj) { return obj.Module });
        //if (modules.indexOf('analysis') > -1) {
            return true;
        //}
        //return false;
    };

    //GET REPORT LIST
    API.getReportList().save(logger.postObject({ entityCode: SO.product.Code })).$promise.then(function (response) {
        console.log(JSON.stringify(response.result));
        if (response.result.length > 0) {
            //$scope.reportList = response.result;
        }
    });


    $scope.showReport = function (ev) {
        var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('offset-end', 'align-tops');

        var config = {
            attachTo: angular.element(document.body),
            controller: 'Reporting',
            template: '<md-list class="md-dense" style="padding: 0" ng-repeat="reportList in reports"><md-subheader class="md-primary">{{reportList[0].Category}}</md-subheader><md-list-item ng-click="null" ng-repeat="report in reportList"> <div class="md-list-item-text"><p>{{report.Report_Name}}<p></div>  </md-list-item></me-list>',
            panelClass: 'popout-menu',
            position: position,
            openFrom: ev,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            zIndex: 1001
        };

        $mdPanel.open(config);
    };



    $scope.reports = [

[{ "ReportID": 5, "GUID": "b5abf8d5-b868-42dc-9026-2583fb00ac79", "User": "Robert", "Report_Name": "Health Summary", "Report_Type": "admin", "Position": 100, "Category": "Health Reports", "AuditDate": "2016-10-14T08:00:25.117" }, { "ReportID": 6, "GUID": "1ac762a8-7db1-4ad1-a39c-875200f0b53d", "User": "Robert", "Report_Name": "Health by Region", "Report_Type": "admin", "Position": 10, "Category": "Health Reports", "AuditDate": "2016-10-14T08:02:11.617" }, { "ReportID": 4, "GUID": "f0dac6f1-4eb3-44dd-bfb4-59d1aa185641", "User": "Robert", "Report_Name": "Health by Age", "Report_Type": "admin", "Position": 1, "Category": "Health Reports", "AuditDate": "2016-10-14T07:59:44.093" }],
[{ "ReportID": 6, "GUID": "1ac762a8-7db1-4ad1-a39c-875200f0b53d", "User": "Robert", "Report_Name": "High ED", "Report_Type": "admin", "Position": 200, "Category": "Summary Reports", "AuditDate": "2016-10-14T08:02:11.617" }, { "ReportID": 5, "GUID": "b5abf8d5-b868-42dc-9026-2583fb00ac79", "User": "Robert", "Report_Name": "CHUP Trending", "Report_Type": "admin", "Position": 100, "Category": "Summary Reports", "AuditDate": "2016-10-14T08:00:25.117" }, { "ReportID": 4, "GUID": "f0dac6f1-4eb3-44dd-bfb4-59d1aa185641", "User": "Robert", "Report_Name": "CHUP Aggregate", "Report_Type": "admin", "Position": 10, "Category": "Summary Reports", "AuditDate": "2016-10-14T07:59:44.093" }],
[{ "ReportID": 6, "GUID": "1ac762a8-7db1-4ad1-a39c-875200f0b53d", "User": "Robert", "Report_Name": "Trending Summary", "Report_Type": "admin", "Position": 101, "Category": "Trending Reports", "AuditDate": "2016-10-14T08:02:11.617" }, { "ReportID": 4, "GUID": "f0dac6f1-4eb3-44dd-bfb4-59d1aa185641", "User": "Robert", "Report_Name": "Trending by Region", "Report_Type": "admin", "Position": 100, "Category": "Trending Reports", "AuditDate": "2016-10-14T07:59:44.093" }, { "ReportID": 5, "GUID": "b5abf8d5-b868-42dc-9026-2583fb00ac79", "User": "Robert", "Report_Name": "Trending by Age", "Report_Type": "admin", "Position": 10, "Category": "Trending Reports", "AuditDate": "2016-10-14T08:00:25.117" }]

    ];

}]);