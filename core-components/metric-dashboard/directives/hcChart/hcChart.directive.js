metricDashboard.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '=',
            canvasElement: '='
        },
        link: function (scope, element) {

            scope.options.title = { text: scope.canvasElement.name };
            var chart = Highcharts.chart(element[0], scope.options);

            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });
        }
    };
})