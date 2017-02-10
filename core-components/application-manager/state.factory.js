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
            //{ type: 'cohort-selection', name: "Cohort Selection", productLine: 'CHUP' },
            { type: 'cohort-diagram', name: "Cohort Diagram", productLine: 'CHUP' },
            { type: 'progressive-filter', name: "Progressive Filter", productLine: null },
            { type: 'combination-filter', name: "Combination Filter", productLine: null }
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