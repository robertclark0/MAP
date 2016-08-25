mapApp.directive('directiveGenerator', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            attributes: '='
        },
        link: link
    };

    function link(scope, elem, attr) {

        var attributes = '';
        Object.keys(scope.attributes).forEach(function (key, index) {
            attributes = attributes + key + "='" + scope.attributes[key] + "' ";
        });

        elem.replaceWith($compile('<' + scope.name + ' ' + attributes + "></" + scope.name + '>')(scope));
    };
}]);