metricDashboard.controller('DashboardComponents', ['$scope', '$mdDialog', '$mdBottomSheet', function ($scope, $mdDialog, $mdBottomSheet) {

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.openBottomSheet = function () {
        $mdBottomSheet.show({
            templateUrl: '<md-bottom-sheet><div style="height: 400px;">Hello!</div></md-bottom-sheet>'
        });
    }

    $scope.showConfirm = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to delete your debt?')
              .textContent('All of the banks have agreed to forgive you your debts.')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Please do it!')
              .cancel('Sounds like a scam');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'You decided to get rid of your debt.';
        }, function () {
            $scope.status = 'You decided to keep your debt.';
        });
    };
}]);