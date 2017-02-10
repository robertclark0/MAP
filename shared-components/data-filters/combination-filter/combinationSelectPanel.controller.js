mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', function (mdPanelRef, $scope, filter, operation, appManager) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        mdPanelRef.close();
    }

    $scope.format = function(item){
        return item.value[0] + ", " + intToMonth(item.value[1]);
    }

    function intToMonth(int, useShort) {
        int = parseInt(int);
        switch (int) {
            case 1:
                if (useShort) {
                    return "Jan";
                }
                return "January";
            case 2:
                if (useShort) {
                    return "Feb";
                }
                return "February";
            case 3:
                if (useShort) {
                    return "Mar";
                }
                return "March";
            case 4:
                if (useShort) {
                    return "Apr";
                }
                return "April";
            case 5:
                if (useShort) {
                    return "May";
                }
                return "May";
            case 6:
                if (useShort) {
                    return "Jun";
                }
                return "June";
            case 7:
                if (useShort) {
                    return "Jul";
                }
                return "July";
            case 8:
                if (useShort) {
                    return "Aug";
                }
                return "August";
            case 9:
                if (useShort) {
                    return "Sep";
                }
                return "September";
            case 10:
                if (useShort) {
                    return "Oct";
                }
                return "October";
            case 11:
                if (useShort) {
                    return "Nov";
                }
                return "November";
            case 12:
                if (useShort) {
                    return "Dec";
                }
                return "December";
        }
    }

}]);