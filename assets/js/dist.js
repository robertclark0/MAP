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


        //  Module
        //  Report Viewer
        .state("reporting", {
            url: "/reporting",
            templateUrl: "core-components/reporting/templates/view.html",
            controller: "ReportViewer",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "reportViewer");
                }],
                module: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('assets/js/dist.reportViewer.module.js');
                }]
            }
        })


        //  Module
        //  Metric Dashboard
        .state("analysis", {
            url: "/analysis",
            templateUrl: "core-components/analysis/templates/view.html",
            css: "assets/css/dist.metricDashboard.css",
            controller: 'MetricDashboard',
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "metricDashboard");
                }],
                module: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('assets/js/dist.metricDashboard.module.js');
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
            css: "assets/css/dist.metricDashboard.css",
            resolve: {
                log: ['appManager', function (appManager) {
                    appManager.logger.clientLog("route", "metricDashboard");
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
applicationManager.factory('appDataManager', ['$rootScope', '$resource', function ($rootScope, $resource) {

    var apiEndpoint = 'http://localhost:51880/api/';
    //var apiEndpoint = 'https://pasbadevweb/MAP/lily/api/';

    //    DATA OBJECT
    //
    var dataObject = {};

    dataObject.user = null;
    dataObject.User = function (userInfoAPIResponse) {
        this.id = {
            PACT: userInfoAPIResponse.UID,
            EDIPI: userInfoAPIResponse.EDIPN,
            AKO: userInfoAPIResponse.akoUserID
        };
        this.productLines = {
            userActive: []
        };
        this.name = {
            first: userInfoAPIResponse.fName,
            last: userInfoAPIResponse.lName
        };
        this.DMIS = userInfoAPIResponse.dmisID;
        this.region = userInfoAPIResponse.RHCName;
        this.email = userInfoAPIResponse.userEmail;
    };

    dataObject.productLines = null;
    dataObject.ProductLines = function (productLinesAPIResponse) {
        this.value = productLinesAPIResponse;
    };

    dataObject.canvasElements = [];



    //    DATA FUNCTIONS
    //
    var dataFunctions = {};



    //    API RESOURCE
    //
    var apiResource = {};

    var userInfoAPI = apiEndpoint + 'user-info';
    apiResource.userInfo = function () { return $resource(userInfoAPI); };

    var userActiveAPI = apiEndpoint + 'user-active';
    apiResource.userActive = function () { return $resource(userActiveAPI); };

    var productLinesAPI = apiEndpoint + 'product-lines';
    apiResource.productLines = function () { return $resource(productLinesAPI); };

    var dataSourcesAPI = apiEndpoint + 'data-sources';
    apiResource.dataSources = function () { return $resource(dataSourcesAPI); };

    var dataSourceParametersAPI = apiEndpoint + 'data-source-parameters';
    apiResource.dataSourceParameters = function () { return $resource(dataSourceParametersAPI); };

    var queryAPI = apiEndpoint + 'query';
    apiResource.query = function () { return $resource(queryAPI); };

    var downloadAPI = apiEndpoint + 'download';
    apiResource.download = function () { return $resource(downloadAPI); };

    var downloadUpdateAPI = apiEndpoint + 'download-update';
    apiResource.downloadUpdate = function () { return $resource(downloadUpdateAPI); };


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
            clientSessionID: SO.sessionID,            user: DO.user,            clientLog: angular.copy(clientLog)
        };        clientLog.length = 0;        return log;
    };    logger.clientLog = function (type, value) {
        clientLog.push({ recordType: type, recordValue: value, clientTime: new Date() });
    };    logger.logPostObject = function (object) {
        return {
            post: object,            log: logger.serverLog()
        };
    };    return logger;
}]);
applicationManager.factory('appStateManager', ['$rootScope', '$sessionStorage', '$state', function ($rootScope, $sessionStorage, $state) {

    //    STATE OBJECT CLASSES
    //
    var stateClasses = {};

    stateClasses.StateObject = function () {
        this.productLine = {
            current: "none", //product line name
            role: 0 //feature restiction based on role. May need to be expanded into more detailed security object.
        };
    };
    stateClasses.ProductLine = function (name) {
        this.name = name;
        this.dashboard = {
            //viewName: 'component', //canvas, data, component ---- This can be added later to help maintain which view you are on when swithching between reporting and analysis
            index: {
                adminReport: 0,
                userReport: 0,
                canvas: 0,
                dataGroup: 0,
                canvasElement: 0,
                dataFilter: 0,
            },
            controlPanels: [
                {
                    side: 'right', // left, right | this sets the default value
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/filter.sideNav.html'
                },
                {
                    side: 'left',
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/dataValue.sideNav.html'
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

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataGroup = function (name) {
        this.name = name || 'New Data Group';
        this.GUID = null;
        this.dataSource = '';
        this.dataFilters = [];
        this.dataSelections = [];

        //this.data = {
        //    results: [],
        //    tableColumns: [],
        //    query: {}, //ToChange - need way to include query for stored proc
        //    calc: {} //ToChange - expand calculation cababilities
        //};
        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataFilter = function (name) {
        this.name = name || 'New Data Filter';
        this.GUID = GUID;
        this.visibleInReport = true;
        //this.selectedValue = []; this should probably be extracted out to the data side.

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.CanvasElement = function (name) {
        this.name = name || 'New Canvas Element';
        this.GUID = null;
        this.type = '';
        this.width = 3;
        this.height = 3;
        this.posX = 0;
        this.posY = 0;

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
        session.StateObject.productLine.current = product.Code;
        session.StateObject[product.Code] = (typeof session.StateObject[product.Code] === 'undefined') ? new stateClasses.ProductLine(product.Name) : session.StateObject[product.Code];

        session.DynamicStateObject = session.StateObject[product.Code];
        stateScope.DSO = session.DynamicStateObject;

        if (state) {
            $state.go(state);
        }
    };


    //    DATA STUCTURES
    //
    var stateScope = $rootScope.$new(true);

    var session = $sessionStorage;
    session.StateObject = (typeof session.StateObject === 'undefined') ? new stateClasses.StateObject() : session.StateObject;
    session.DynamicStateObject = (typeof session.DynamicStateObject === 'undefined') ? {} : session.DynamicStateObject;

    stateScope.DSO = session.DynamicStateObject;
    stateScope.SO = session.StateObject;
    stateScope.SF = stateFunctions;
    stateScope.SC = stateClasses;

    return stateScope;

}]);