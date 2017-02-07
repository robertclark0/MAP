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

        scope.$watch('filterDataObject', function (nv, ov) {
            if (nv !== ov) {
                scope.filterDataObject.dataValues = nv.dataValues;
            }
        }, true);


        scope.checkChanged = function () {
            scope.operation.selectedValues = scope.filterDataObject.dataValues.filter(function (obj) {
                return obj.isChecked;
            }).map(function (obj) {
                return obj.value;
            });
        };
        
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
                template: '<md-card><md-virtual-repeat-container style="height: 200px; width: 250px;"><md-list-item md-virtual-repeat="item in filterDataObject" ng-click="selected(item.value)">{{item.value}}</md-list-item></md-virtual-repeat-container></md-card>',
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
mapApp.directive('cohortDiagram', [function () {
    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/cohort-diagram/cohortDiagram.html',
        link: link
    };

    function link(scope, elem, attr) {

        scope.poly = false;
        scope.hu = false;
        scope.pain = false;
        scope.method = 'ex';

        scope.pp = false;
        scope.p = false;
        scope.h = false;
        scope.ppp = false;
        scope.pph = false;
        scope.ph = false;
        scope.chup = false;

        function reset() {
            scope.pp = false;
            scope.p = false;
            scope.h = false;
            scope.ppp = false;
            scope.pph = false;
            scope.ph = false;
            scope.chup = false;
        };

        scope.change = function () {
            reset();
            if (scope.method === 'ex') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                } else if (scope.pain) {
                    scope.p = true;
                } else if (scope.poly) {
                    scope.pp = true;
                } else if (scope.hu) {
                    scope.h = true;
                }
            } else if (scope.method === 'in') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                    scope.chup = true;
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                    scope.chup = true;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                    scope.chup = true;
                } else if (scope.pain) {
                    scope.chup = true;
                    scope.ppp = true;
                    scope.ph = true;
                    scope.p = true;
                } else if (scope.poly) {
                    scope.chup = true;
                    scope.pp = true;
                    scope.ppp = true;
                    scope.pph = true;
                } else if (scope.hu) {
                    scope.chup = true;
                    scope.h = true;
                    scope.ph = true;
                    scope.pph = true;
                }
            }
        };

    };
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
mapApp.directive('customDataFilter', ['appManager', '$mdDialog', 'dataFilterFactory', function (appManager, $mdDialog, dataFilterFactory) {
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
        var DO = appManager.data.DO;
        scope.SF = appManager.state.SF;
        
        //check to see if filter values exist, if not, get them.
        if (DO.filters.map(function (obj) { return obj.GUID }).indexOf(scope.filter.GUID) < 0) {
            dataFilterFactory.populateFilterData(scope.filter, scope.current.dataGroup);
        }

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
    //var apiEndpoint = 'https://pasbadevweb/MAP/api/';
    //var apiEndpoint = 'http://localhost:3000/';

    //    DATA OBJECT
    //
    var dataObject = {};

    dataObject.user = null;
    dataObject.products = null;

    dataObject.dataSource = [];
    dataObject.tableSchema = [];

    dataObject.canvasElements = [];
    // {GUID: , ChartDOM: }

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
    dataFunctions.getCanvasElement = function (GUID) {
        var GUIDList = dataObject.canvasElements.map(function (obj) { return obj.GUID; });
        var index = GUIDList.indexOf(GUID);
        if (index > -1) {
            return dataObject.canvasElements[index];
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
            response.result.forEach(function (obj) {
                filterDataObject.dataValues.push({ value: obj, isChecked: false });
            });
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

    var queryAPI = apiEndpoint + 'query';
    apiResource.query = function () { return $resource(queryAPI); };

    var downloadAPI = apiEndpoint + 'download';
    apiResource.download = function () { return $resource(downloadAPI); };

    var downloadUpdateAPI = apiEndpoint + 'download-update';
    apiResource.downloadUpdate = function () { return $resource(downloadUpdateAPI); };

    var getReportAPI = apiEndpoint + 'report';
    apiResource.report = function () { return $resource(getReportAPI); };



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
mapApp.factory('dataFilterFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var factory = {};

    // ---- ---- ---- ---- side Nav Functions ---- ---- ---- ---- //
    factory.filterResults = function (query) {
        if (query) {
            var results = DO.tableSchema.filter(function (tableValue) {
                return angular.lowercase(tableValue.COLUMN_NAME).indexOf(angular.lowercase(query)) >= 0;
            });
            return results ? results : [];
        }
        else { return DO.tableSchema; }
    };

    factory.quickAddFilter = function (dataValue, dataGroup, selectionIndex, tempCards) {
        if (dataValue) {

            var newFilter = new SC.DataFilter(SF.availableDataFilters()[0], dataValue);
            newFilter.alias = dataValue.COLUMN_NAME;
            newFilter.operations.push({ operation: "in", name: "Range", type: 'dfo-checklist', selectedValues: [] });

            var newFilterDataObject = { GUID: newFilter.GUID, dataValues: [] };

            var tempGUID = SF.generateGUID();
            createTempCard(dataValue, tempGUID, tempCards);

            var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: newFilter.dataValue.COLUMN_NAME, order: newFilter.dataValueOrder } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj, isChecked: false });
                });
                DO.filters.push(newFilterDataObject);
                deleteTempCard(tempGUID, tempCards);
                dataGroup.filters[selectionIndex].push(newFilter);
            });
        }
    };

    function createTempCard(dataValue, GUID, tempCards) {
        tempCards.push({ alias: dataValue.COLUMN_NAME, GUID: GUID });
    }
    function deleteTempCard(GUID, tempCards) {
        var index = tempCards.map(function (obj) { return obj.GUID }).indexOf(GUID);
        if (index >= 0) {
            tempCards.splice(index, 1);
        }
    }

    factory.populateFilterData = function (filter, dataGroup) {

        var newFilterDataObject = { GUID: filter.GUID, dataValues: [] };
        DO.filters.push(newFilterDataObject);

        var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: filter.dataValue.COLUMN_NAME, order: filter.dataValueOrder } };

        API.schema().save(postObject).$promise.then(function (response) {
            response.result.forEach(function (obj) {
                newFilterDataObject.dataValues.push({ value: obj, isChecked: false });
            });
        });
    };

    return factory;
}]);
mapApp.factory('viewFactory', ['appManager', function (appManager) {

    var SC = appManager.state.SC;
    var SF = appManager.state.SF;
    var DO = appManager.data.DO;
    var DF = appManager.data.DF;
    var SO = appManager.state.SO;
    var API = appManager.data.API;
    var logger = appManager.logger;
    var factory = {};

    // ---- ---- ---- ---- Query Functions ---- ---- ---- ---- //
    factory.buildQueryObject = function (dataGroup, selectionIndex) {
        return {
            source: dataGroup.source,
            pagination: dataGroup.pagination,
            aggregation: dataGroup.aggregation,
            selections: dataGroup.selections[selectionIndex],
            filters: dataGroup.filters[selectionIndex]
        }
    };

    // ---- ---- ---- ---- Current Objects and Control Functions ---- ---- ---- ---- //
    factory.setSelectionLevel = function (selectionLevel, index, current) {
        current.selectionLevel = selectionLevel;
        current.selectionIndex = index;
    }

    factory.setDataGroup = function (dataGroup, current) {

        current.dataGroup = dataGroup;

        if (dataGroup) {
            factory.setSelectionLevel(dataGroup.selections[0], 0, current);


            if (DO.dataGroups.map(function (obj) { return obj.GUID; }).indexOf(dataGroup.GUID) < 0) {
                DO.dataGroups.push({ GUID: dataGroup.GUID, result: null, drillDown: [] });
                //dataGroup.query.execute();
            }

            if (dataGroup.source.type === 'T') {
                //REMOVE BEFORE FLIGHT
                API.schema().save(logger.postObject({ type: "table", alias: dataGroup.source.alias })).$promise.then(function (response) {
                    DO.tableSchema = response.result;
                }).catch(function (error) {
                    logger.toast.error('Error Getting Table Schema', error);
                });
            }
        }
    };

    factory.setCanvas = function (canvas, current) {
        current.canvas = canvas;
        factory.setDataGroup(canvas.dataGroups[0], current);
    };

    return factory;
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
                    lock: true,
                    templateUrl: 'core-components/analysis/templates/dataFilter.sideNav.html'
                },
                {
                    side: 'right',
                    lock: true,
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
        this.category = null;
        this.position = null;
        this.fromDB = false;

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
        this.filters = [[]];
        this.drillDownSelections = [];

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataSelection = function (model, dataValue) {
        this.model = model || null;
        this.dataValue = dataValue || null;
        this.alias = null;
        this.pivot = false;
        this.pivotValues = [];
        this.order = false;
        this.orderValue = null;
        this.aggregateFunction = false;
        this.aggregateFunctionValue = null;
    };

    stateClasses.DataFilter = function (model, dataValue, GUID) {
        this.model = model || null;
        this.dataValue = dataValue || null;
        this.alias = null;
        this.orderValue = null;
        this.operations = [];
        this.GUID = null;
        this.visibleInReport = false;

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
        this.chart = {
            series: [],  //{ GUID: , selection: , options: {}}
            options: undefined
        }; 

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };


    //    STATE DATA FUNCTIONS
    //
    var stateFunctions = {};

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



    stateFunctions.availableDataFilters = function () {
        var availableFilters = [
            { type: 'custom-data-filter', name: 'Custom Filter', productLine: null },
            { type: 'cohort-selection', name: "Cohort Selection", productLine: 'CHUP' },
            { type: 'cohort-diagram', name: "Cohort Diagram", productLine: 'CHUP' }
        ];
        return availableFilters; //.filter(function (obj) { return obj.productLine === null || obj.productLine === session.StateObject.product.Code });
    };
    stateFunctions.availableDataFilterOperations = function () {
        var availableOperations = [
            { operation: "in", name: "Range", type: 'dfo-checklist', selectedValues: [] },
            { operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [] },
            { operation: "equal", name: "Toggle", type: 'dfo-toggle', selectedValues: [] },
            { operation: "equal", name: "Between", type: 'dfo-between', selectedValues: [] },
            { operation: "greater", name: "Greater", type: 'dfo-select', selectedValues: [] },
            { operation: "less", name: "Less", type: 'dfo-select', selectedValues: [] },
            { operation: "greaterE", name: "Greater or Equal", type: 'dfo-select', selectedValues: [] },
            { operation: "lessE", name: "Less or Equal", type: 'dfo-select', selectedValues: [] }
        ];
        return availableOperations;
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