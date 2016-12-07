var mapApp = angular.module('mapApp', [
    'ngMaterial',
    'angular-loading-bar',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngStorage',
    'angularCSS',
    'oc.lazyLoad',   
    'applicationManager'
]);
var applicationManager = angular.module('applicationManager', []);
mapApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/platform-home/product-lines");

    $stateProvider
        //  Module
        //  Platform Home
        .state("platformHome", {
            url: "/platform-home",
            templateUrl: "core-components/platform-home/templates/view.html",
            controller: "PlatformHome",
            css: "assets/css/dist.platformHome.css",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "platformHome");
                }],
                module: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('assets/js/dist.platformHome.module.js');
                }]
            }
        })
        .state("platformHome.productLines", {
            url: "/product-lines",
            templateUrl: "core-components/platform-home/templates/product-lines.html",
            css: "assets/css/dist.platformHome.css",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "platformHome.productLines");
                }],
                waitOnParent: ['module', function () { }]
            }
        })
        .state("platformHome.about", {
            url: "/about",
            templateUrl: "core-components/platform-home/templates/about-map.html",
            css: "assets/css/dist.platformHome.css",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "platformHome.about");
                }],
                waitOnParent: ['module', function () { }]
            }
        })


        //  Module
        //  Reporting
        .state("reporting", {
            url: "/reporting",
            templateUrl: "core-components/reporting/templates/view.html",
            controller: "Reporting",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "reporting");
                }],
                module: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('assets/js/dist.reporting.module.js');
                }]
            }
        })


        //  Module
        //  Analysis
        .state("analysis", {
            url: "/analysis",
            templateUrl: "core-components/analysis/templates/view.html",
            css: "assets/css/dist.analysis.css",
            controller: 'Analysis',
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "analysis");
                }],
                module: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('assets/js/dist.analysis.module.js');
                }]
            }
        })
        .state("analysis.view", {
            url: "/:viewName",
            params: {
                viewName: null
            },
            templateUrl: function ($stateParams) { return "core-components/analysis/templates/" + $stateParams.viewName + ".view.html"; },
            controllerProvider: function($stateParams) { return $stateParams.viewName.charAt(0).toUpperCase() + $stateParams.viewName.slice(1) + "View"; },
            css: "assets/css/dist.analysis.css",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "analysis");
                }],
                waitOnParent: ['module', function () { }]
            }
        });
});

mapApp.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-green')
      .accentPalette('blue');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    $mdThemingProvider.theme('warning-toast');
});
applicationManager.factory('appManager', ['appStateManager', 'appLogger', 'appDataManager', function (appStateManager, appLogger, appDataManager) {

    return {
        state: appStateManager,
        logger: appLogger,
        data: appDataManager
    };

}]);
mapApp.directive('selectionControl', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        templateUrl: 'shared-components/canvas-elements/selection-control/selectionControl.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.$watch('element.dataGroup', function () {
            if (scope.element.dataGroup) {
                scope.drillDown = scope.element.dataGroup.drillDown;
            }
            else {
                scope.drillDown = { level: [], selection: [] };
            }
        }, true);


        scope.autoList = ["one", "two", "three", "four"];

        scope.querySearch = function(query) {
            var results = query ? scope.autoList.filter(createFilterFor(query)) : [];
            return results;
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(value) {
                return (value.indexOf(lowercaseQuery) === 0);
            };

        }
    };
}]);
mapApp.directive('dfoChecklist', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filter-operations/checklist.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.filterDataObject = appManager.data.DF.getFilter(scope.filter.GUID);

        scope.$watch('filterDataObject', function (nv) {
            scope.filterDataObject.dataValues = nv.dataValues;
        }, true);
        
    };
}]);
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
mapApp.controller('SelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', function (mdPanelRef, $scope, filter, operation, appManager) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        mdPanelRef.close();
    }

}]);
mapApp.directive('cohortSelection', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/cohort-selection/cohortSelection.html',
        link: link
    };

    function link(scope, elem, attr) {


    };
}]);
mapApp.directive('customDataFilter', ['appManager', '$mdDialog', function (appManager, $mdDialog) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/custom-filter/customFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        scope.SF = appManager.state.SF;

        scope.showOperations = function (ev) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataFilterSettings.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataFilterSettings',
                locals: {
                    filter: scope.filter,
                    current: scope.current
                }
            });
        };

    };
}]);
mapApp.directive('dsoCheck', ['appManager', function (appManager) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            operation: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selection-operations/check.html',
        link: link
    };

    function link(scope, elem, attr) {



    };
}]);
mapApp.directive('customDataSelection', ['appManager', '$mdDialog', function (appManager, $mdDialog) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-selections/custom-selection/customSelection.html',
        link: link
    };

    function link(scope, elem, attr) {
        scope.SF = appManager.state.SF;

        scope.showOperations = function (ev) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataSelectionSettings.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataSelectionSettings',
                locals: {
                    selection: scope.selection,
                    current: scope.current
                }
            });
        };

    };
}]);
applicationManager.factory('appDataManager', ['$rootScope', '$resource', 'appStateManager', function ($rootScope, $resource, appStateManager) {

    var apiEndpoint = 'http://localhost:51880/api/';
    //var apiEndpoint = 'https://pasbadevweb/MAP/lily/api/';
    //var apiEndpoint = 'http://localhost:3000/';

    //    DATA OBJECT
    //
    var dataObject = {};

    dataObject.user = null;
    dataObject.products = null;

    dataObject.dataSource = [];
    dataObject.tableSchema = [];

    dataObject.canvasElements = [];
    // {element: , ChartDOM: }

    dataObject.dataGroups = [];
    // { GUID: , result: , drillDown: [] }

    dataObject.filters = [];
    // { GUID: , dataValues: [] }



    //    DATA FUNCTIONS
    //
    var dataFunctions = {};

    dataFunctions.getDataGroup = function (GUID) {
        var GUIDList = dataObject.dataGroups.map(function (obj) { return obj.GUID; });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.dataGroups[index];
        }
        return null;
    };
    dataFunctions.getFilter = function (GUID) {
        var GUIDList = dataObject.filters.map(function (obj) { return obj.GUID; });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.filters[index];
        }
        return null;
    };

    dataFunctions.populateAppData = function () {
        appStateManager.DSO.canvases.forEach(function (canvas) {
            canvas.dataGroups.forEach(function (dataGroup) {
                if (dataObject.dataGroups.map(function(obj){ return obj.GUID;}).indexOf(dataGroup.GUID) < 0){
                    dataObject.dataGroups.push({ GUID: dataGroup.GUID, result: null, drillDown: [] });
                    //dataGroup.query.execute();
                }

                dataGroup.filters.forEach(function (filterLevel) {
                    filterLevel.forEach(function (filter) {
                        if (dataObject.filters.map(function (obj) { return obj.GUID }).indexOf(filter.GUID) < 0) {
                            var newFilterDataObject = { GUID: filter.GUID, dataValues: [] };
                            dataObject.filters.push(newFilterDataObject);
                            dataFunctions.getDistinctFilterValues(dataGroup, filter, newFilterDataObject);
                        }
                    })
                });
            });
        });
    };

    dataFunctions.getDistinctFilterValues = function (dataGroup, filter, filterDataObject) {
        apiResource.schema().save({ post: { type: "column", alias: dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.dataValueOrder } }).$promise.then(function (response) {
            filterDataObject.dataValues = response.result;
            console.log(response.result);
        });
    };


    //    API RESOURCE
    //
    var apiResource = {};

    apiResource.endpoint = apiEndpoint;

    var userAPI = apiEndpoint + 'user';
    apiResource.user = function () { return $resource(userAPI); };

    var productAPI = apiEndpoint + 'products';
    apiResource.products = function () { return $resource(productAPI); };

    var schemaAPI = apiEndpoint + 'schema';
    apiResource.schema = function () { return $resource(schemaAPI); };

    //==================

    var queryAPI = apiEndpoint + 'query';
    apiResource.query = function () { return $resource(queryAPI); };

    var downloadAPI = apiEndpoint + 'download';
    apiResource.download = function () { return $resource(downloadAPI); };

    var downloadUpdateAPI = apiEndpoint + 'download-update';
    apiResource.downloadUpdate = function () { return $resource(downloadUpdateAPI); };

    var getReportAPI = apiEndpoint + 'report';
    apiResource.getReport = function () { return $resource(getReportAPI); };

    var updateReportAPI = apiEndpoint + 'report/update';
    apiResource.updateReport = function () { return $resource(updateReportAPI); };

    var createReportAPI = apiEndpoint + 'report/create';
    apiResource.createReport = function () { return $resource(createReportAPI); };

    var deleteReportAPI = apiEndpoint + 'deport/delete';
    apiResource.deleteReport = function () { return $resource(deleteReportAPI); };

    var getReportListAPI = apiEndpoint + 'report/list';
    apiResource.getReportList = function () { return $resource(getReportListAPI); };


    //    STRUCTURE
    //
    var dataScope = $rootScope.$new(true);
    dataScope.API = apiResource;
    dataScope.DO = dataObject;
    dataScope.DF = dataFunctions;

    return dataScope;


}]);
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
//applicationManager.factory('$exceptionHandler', function () {
//    return function (exception, cause) {
//        console.log("Here comes the sun:")
//        console.log(exception, cause);
//    }
//})
applicationManager.factory('appLogger', ['$mdToast', 'appStateManager', 'appDataManager', function ($mdToast, appStateManager, appDataManager) {
    var SO = appStateManager.SO;    var DO = appDataManager.DO;    var clientLog = [];    var logger = {};    logger.toast = {
        success: function (message) {
            $mdToast.show($mdToast.simple().textContent(message).position('bottom right').theme('success-toast'));
        },        error: function (message, error) {
            $mdToast.show($mdToast.simple().textContent(message).position('bottom right').theme('error-toast'));            if (error) {
                console.log(error);                logger.clientLog("error", error);
            }
        },        warning: function (message) {
            $mdToast.show($mdToast.simple().textContent(message).position('bottom right').theme('warning-toast'));
        },        primary: function (message) {
            $mdToast.show($mdToast.simple().textContent(message).position('bottom right'));
        }
    };    logger.serverLog = function () {
        var log = {
            clientSessionID: SO.sessionID,            user: SO.user,            clientLog: angular.copy(clientLog)
        };        clientLog.length = 0;        return log;
    };    logger.clientLog = function (type, value) {
        clientLog.push({ recordType: type, recordValue: value, clientTime: new Date() });
    };    logger.postObject = function (object) {
        return {
            post: object,            log: logger.serverLog()
        };
    };    return logger;
}]);
applicationManager.factory('appStateManager', ['$rootScope', '$sessionStorage', '$state', function ($rootScope, $sessionStorage, $state) {

    //    STATE OBJECT CLASSES
    //
    var stateClasses = {};

    stateClasses.Product = function (name, modules) {
        this.name = name;
        this.modules = modules;
        this.dashboard = {
            //viewName: 'component', //canvas, data, component ---- This can be added later to help maintain which view you are on when swithching between reporting and analysis
            controlPanels: [
                {
                    side: 'left', // left, right | this sets the default value
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/dataFilter.sideNav.html'
                },
                {
                    side: 'left',
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/dataSelection.sideNav.html'
                },
                {
                    side: 'right',
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/canvasElement.sideNav.html'
                }
            ]
        };
        this.reports = []; // does this need to by splint into user report and admin reports? 
        this.canvases = [new stateClasses.Canvas('New Canvas')];
    };
    stateClasses.Canvas = function (name) {
        this.name = name || 'New Canvas';
        this.GUID = null;
        this.roleType = 'user'; //user, admin
        this.dataGroups = [];
        this.canvasElements = [];
        this.availableFilters = [];

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataGroup = function (name) {
        this.name = name || 'New Data Group';
        this.GUID = null;
        this.source = {
            type: null,
            alias: null
        };
        this.pagination = {
            enabled: true,
            page: 1,
            range: 10
        };
        this.aggregation = {
            enabled: true
        };
        this.selections = [[]];
        this.drillDown = { level: [], selection: [] };
        this.filters = [[]];

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataSelection = function (name) {
        this.name = name || null;
        this.order = 'asc'; // asc | desc
        this.aggregate = false;
        this.aggregation = {
            type: null, // count | sum | case-count | case-sum
            round: 2,
            alias: null,
            operators: []
        };
    };
    stateClasses.DataOperator = function () {
        this.type = null; // greater | less | greaterEqual | lessEqual | equal | in | between
        this.values = [];
        this.valueType = null; // string | int
    };

    stateClasses.DataFilter = function (name, type, GUID) {
        this.name = name || 'New Data Filter';
        this.type = type,
        this.GUID = null;
        this.visibleInReport = true;
        this.selectedValue = []; //this should probably be extracted out to the data side.

        var _constructor = function (obj) {
            if (GUID) {
                obj.GUID = GUID;
            }
            else {
                obj.GUID = stateFunctions.generateGUID();
            }
        }(this);
    };
    stateClasses.CanvasElement = function (name, type) {
        this.name = name || 'New Canvas Element';
        this.GUID = null;
        this.type = type;
        this.width = 3;
        this.height = 3;
        this.posX = 0;
        this.posY = 0;
        this.dataGroup = null;

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.ColumnProperty = function () {
        this.column = '';
        this.aggregate = 'none';
        this.partition = false;
        this.grouped = false;
    };


    //    STATE DATA FUNCTIONS
    //
    var stateFunctions = {};

    stateFunctions.state = {
        canvases: function (options, object) {
            switch (options) {
                case null:
                case undefined:
                    return session.DynamicStateObject.canvases;
                default:
                    switch (options.method) {
                        case 'add':
                            session.DynamicStateObject.canvases.push(object);
                            return session.DynamicStateObject.canvases.length - 1; //returns index of new object
                        case 'delete':
                            session.DynamicStateObject.canvases.splice(object, 1);
                            break;
                        case 'return':
                        default:
                            switch (options.returns) {
                                case 'index':
                                    return session.DynamicStateObject.canvases[object];
                                case 'current':
                                    return session.DynamicStateObject.canvases[session.DynamicStateObject.dashboard.index.canvas];
                                case 'all':
                                default:
                                    return session.DynamicStateObject.canvases;
                            }
                    }
            }
        }
    };
    stateFunctions.generateGUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var GUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return GUID;
    };
    stateFunctions.setProduct = function (product, state) {
        stateScope.SO.product = product;
        stateScope.SO[product.Code] = (typeof stateScope.SO[product.Code] === 'undefined') ? new stateClasses.Product(product.Name) : stateScope.SO[product.Code];

        session.DynamicStateObject = stateScope.SO[product.Code];
        stateScope.DSO = session.DynamicStateObject;

        if (state) {
            $state.go(state);
        }
    };
    stateFunctions.availableDataFilters = function () {
        var availableFilters = [
            { type: 'custom-data-filter', name: 'Custom Filter', productLine: null },
            { type: 'cohort-selection', name: "Cohort Selection", productLine: 'CHUP' }            
        ];
        return availableFilters; //.filter(function (obj) { return obj.productLine === null || obj.productLine === session.StateObject.product.Code });
    };
    stateFunctions.canvasDataFilters = function () {
        var rawFilterArray = [];
        session.DynamicStateObject.canvases.forEach(function (canvas) {
            canvas.availableFilters.forEach(function (filter) {
                if (rawFilterArray.map(function (obj) { return obj.GUID }).indexOf(filter.GUID) < 0) {
                    rawFilterArray.push(filter);
                }
            });
        });
    };


    // ---- ---- ---- ---- Generic Prototypal Functions ---- ---- ---- ---- //
    stateFunctions.moveUp = function (source, target, targetIndex) {
        if (!targetIndex) {
            targetIndex = source.indexOf(target);
        }
        if (targetIndex > 0) {
            var desitationIndex = targetIndex - 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };
    stateFunctions.moveDown = function (source, target, targetIndex) {
        if (!targetIndex) {
            targetIndex = source.indexOf(target);
        }
        if (targetIndex < source.length - 1) {
            var desitationIndex = targetIndex + 1;
            var oldSelection = source[desitationIndex];
            source[desitationIndex] = target;
            source[targetIndex] = oldSelection;
        }
    };
    stateFunctions.deleteElement = function (source, target, targetIndex) {
        if (!targetIndex) {
            targetIndex = source.indexOf(target);
        }
        if (targetIndex >= 0) {
            source.splice(targetIndex, 1);
        }
    };


    //    DATA STUCTURES
    //
    var stateScope = $rootScope.$new(true);

    var session = $sessionStorage;
    session.StateObject = (typeof session.StateObject === 'undefined') ? {} : session.StateObject;
    session.DynamicStateObject = (typeof session.DynamicStateObject === 'undefined') ? {} : session.DynamicStateObject;

    stateScope.DSO = session.DynamicStateObject;
    stateScope.SO = session.StateObject;
    stateScope.SF = stateFunctions;
    stateScope.SC = stateClasses;

    console.log("State Loaded");
    console.log(stateScope.SO);

    return stateScope;

}]);
mapApp.controller('User', ['$scope', 'appManager', '$mdDialog', function ($scope, appManager, $mdDialog) {

    // ---- ---- ---- ---- Controller and Scope variables ---- ---- ---- ----   
    var SO = appManager.state.SO;

    $scope.user = SO.user;

    $scope.authorizations = [];

    if (SO.user.UID >= 0) {
        $scope.authorizations.push({ title: "Assigned DMIS", value: SO.user.dmisID });
        SO.user.AuthorizedProducts.forEach(function (authProduct) {
            authProduct.Authorizations.forEach(function (authorization) {
                $scope.authorizations.push({ title: authProduct.productName, value: authorization.roleName});
            });
        });
    }
    else {
        $scope.authorizations.push({title: "No Authorizations", value: ""});
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

}]);