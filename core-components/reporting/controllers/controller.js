reporting.controller('Reporting', ['$scope', 'appManager', '$state', '$mdDialog', '$mdPanel', function ($scope, appManager, $state, $mdDialog, $mdPanel) {

    //    Controller and Scope variables
    var DSO = appManager.state.DSO;
    var API = appManager.data.API;
    var SO = appManager.state.SO;
    var logger = appManager.logger;
    var DO = appManager.data.DO;


    API.userInfo().save(logger.postObject()).$promise.then(function (response) {
        //API.userInfo().get().$promise.then(function (response) {
        if (response.result) {
            DO.user = new DO.User(response.result);
            $scope.user = appManager.data.DO.user;
        }
    }).catch(function (error) {
        logger.toast.error('Error Getting User Data', error);
    });

    $scope.name = DSO.name;
    $scope.propertyPanel = DSO.dashboard.propertyPanel;


    $scope.newState = function (state, stateObject) {
        $state.go(state, stateObject);
    };

    $scope.showAnalysis = function () {
        var modules = DSO.modules.map(function (obj) { return obj.Module });
        if (modules.indexOf('analysis') > -1) {
            return true;
        }
        return false;
    };

    $scope.showReport = function (ev) {
        var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.target)
        .addPanelPosition('offset-end', 'align-tops');

        var config = {
            attachTo: angular.element(document.body),
            controller: 'Reporting',
            template: '<md-list class="md-dense" style="padding: 0" ng-repeat="reportList in reports"><md-subheader class="md-primary">{{reportList[0].Category}}</md-subheader><md-list-item ng-click="null" ng-repeat="report in reportList" ng-click="currentReport = report"> <div class="md-list-item-text"><p>{{report.Report_Name}}<p></div>  </md-list-item></me-list>',
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
        [
            {
                "ReportID": 5, "GUID": "b5abf8d5-b868-42dc-9026-2583fb00ac79", "User": "Robert", "Report_Name": "CHUP Aggregate", "Report_Type": "admin", "Position": 100, "Category": "CHUP Reports", "AuditDate": "2016-10-14T08:00:25.117", report:
                    {

                    }
            },
            {
                "ReportID": 6, "GUID": "1ac762a8-7db1-4ad1-a39c-875200f0b53d", "User": "Robert", "Report_Name": "CHUP Trending", "Report_Type": "admin", "Position": 10, "Category": "CHUP Reports", "AuditDate": "2016-10-14T08:02:11.617", report: 
                    {

                    }
            }],
    ];
    $scope.currentReport = $scope.reports[0][0];
}]);