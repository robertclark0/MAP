﻿mapApp.directive('dsoOrder', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selection-operations/order.html',
        link: link
    };

    function link(scope, elem, attr) {

        

    };
}]);