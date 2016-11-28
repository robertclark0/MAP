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
                    templateUrl: 'core-components/analysis/templates/filter.sideNav.html'
                },
                {
                    side: 'left',
                    lock: false,
                    templateUrl: 'core-components/analysis/templates/dataValue.sideNav.html'
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
            { type: 'cohort-selection', name: "Cohort Selection", productLine: 'CHUP' },
            { type: 'custom-filter', name: 'Custom Filter', productLine: null }
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