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

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataGroup = function (name) {
        this.name = name || 'New Data Group';
        this.GUID = null;
        this.source = {
            product: null,
            type: null,
            name: null
        };
        this.pagination = {
            enabled: true,
            page: 1,
            range: 10
        };
        this.aggregation = {
            enabled: true
        };
        this.selections = [];
        this.drillDown = { level: [], selection: [] };
        this.filters = [];

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
    };
    stateClasses.DataSelection = function (name) {
        this.name = name || null;
        this.order = 'asc'; // asc | desc
        this.aggregate = false;
        this.aggregation = {
            type: null, // count | sum | case-count | case-sum
            round: 2,
            allias: null,
            operators: []
        };
    };
    stateClasses.DataOperator = function () {
        this.type = null; // greater | less | greaterEqual | lessEqual | equal | in | between
        this.values = [];
        this.valueType = null; // string | int
    };

    stateClasses.DataFilter = function (name) {
        this.name = name || 'New Data Filter';
        this.GUID = GUID;
        this.visibleInReport = true;
        //this.selectedValue = []; this should probably be extracted out to the data side.

        var _constructor = function (obj) { obj.GUID = stateFunctions.generateGUID(); }(this);
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