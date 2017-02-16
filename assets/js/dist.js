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
mapApp.directive('hcChart', ['appManager', '$timeout', function (appManager, $timeout) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            canvasElement: '=element'
        },
        link: function (scope, element) {

            var chart;

            // ---- ---- ---- ---- Scope Variable and Setup ---- ---- ---- ---- //
            scope.chartDataObjects = [];

            var uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
            var axis = buildAxis(uniqueGUIDs);

            var defaultchartOptions = {
                chart: {
                    backgroundColor: 'transparent',
                    animation: true
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    labels: {
                        format: '{value:,.0f}'
                    },
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        events: {
                            click: function (event) {
                                console.log(event);
                            }
                        }
                    }
                }
            };
            scope.canvasElement.chart.options = (typeof scope.canvasElement.chart.options === 'undefined') ? defaultchartOptions : scope.canvasElement.chart.options;


            // ---- ---- ---- ---- Functions ---- ---- ---- ---- //

            function loadChart() {
                chart = Highcharts.chart(element[0], scope.canvasElement.chart.options);

                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);

                $timeout(function () {
                    populateSeries(scope.canvasElement.chart.series);
                }, 1);
                
            };

            // takes the series array and updates the values with new data object results.
            function updateSeries(seriesArray) {
                seriesArray.forEach(function (series, seriesIndex) {
                    var seriesData = createSeriesData(series, false);

                    if (seriesData) {
                        var newLength = seriesData.length;
                        var existingLength = chart.series[seriesIndex].data.length;

                        if (newLength > existingLength) {

                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Change existing points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });

                            //Add new points
                            for (var i = existingLength; i < newLength; i++) {
                                chart.series[seriesIndex].addPoint(seriesData[i], false);
                            }

                        } else if (existingLength > newLength) {
                            var diff = existingLength - newLength;

                            //Remove Points
                            for (var i = existingLength - 1; i > existingLength - 1 - diff; i--) {
                                chart.series[seriesIndex].data[i].remove(false);
                            }

                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });

                        } else {
                            //inject Axis
                            chart.xAxis[0].setCategories(axis, false);

                            //Update Points
                            chart.series[seriesIndex].data.forEach(function (point, pointIndex) {
                                point.update(seriesData[pointIndex], false);
                            });
                        }
                    }
                });
                chart.redraw();
            };

            // takes the array of element series and adds them or updates them in the chart.
            function populateSeries(seriesArray) {
                scope.chartDataObjects.length = 0;
                seriesArray.forEach(function (series) {
                    var seriesData = createSeriesData(series, true);
                    var existingSeries = chart.series.map(function (obj) { return obj.name; });
                    var index = existingSeries.indexOf(series.selection);

                    if (index >= 0) {
                        chart.series[index].setData(seriesData, false);
                        
                    }
                    else {
                        chart.addSeries({ name: series.selection, data: seriesData }, false);
                        index = chart.series.length - 1;
                    }

                    if (series.options) {
                        chart.series[index].update(series.options, false);
                    }



                });

                chart.redraw();
            };

            // takes a single series, populates and formats the data from the data manager.
            function createSeriesData(series, addReferenceBool) {
                var seriesData = [];
                var data = appManager.data.DF.getDataGroup(series.GUID);

                //add data reference to watcher for chart data objects
                if (addReferenceBool) {
                    addDataReference(data);
                }

                if (data && data.result && data.result[0]) {
                    var index = data.result[0].indexOf(series.selection);
                    var titleIndex = 0;
                    if (data.result[0][0] === 'RowNum') {
                        titleIndex = 1;
                    }

                    if (index >= 0) {
                        data.result.forEach(function (row, rowIndex) {
                            if (rowIndex > 0) {
                                var point = {
                                    y: row[index],
                                    x: axis.indexOf(row[titleIndex])
                                };
                                seriesData.push(point);
                            }
                        });
                    }
                }
                return seriesData;
            }

            // takes and array of GUIDs, gets values from the data manager and create an array of unique values for the x-axis.
            function buildAxis(GUIDArray) {
                var axisValues = [];
                GUIDArray.forEach(function (GUID) {
                    var data = appManager.data.DF.getDataGroup(GUID);
                    if (data && data.result && data.result[0]) {
                        if (data.result[0][0] === 'RowNum') {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[1]);
                                }
                            });
                        }
                        else {
                            data.result.forEach(function (row, rowIndex) {
                                if (rowIndex > 0) {
                                    axisValues.push(row[0]);
                                }
                            });
                        }
                    }
                });
                return unique(axisValues);
            };

            // adds data reference to watcher array if it doesn't exist already.
            function addDataReference(data) {
                var existingGUID = scope.chartDataObjects.map(function (obj) { return obj.GUID; });
                var index = existingGUID.indexOf(data.GUID);

                if (index < 0) {
                    scope.chartDataObjects.push(data);
                }
            }

            // takes and array, returns array with only unique values.
            function unique(array) {
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                return array.filter(onlyUnique);
            };


            // ---- ---- ---- ---- Watchers ---- ---- ---- ---- //

            // watch size of parent div to resize chart when needed.
            scope.$watch(function () { return element[0].parentNode.clientHeight * element[0].parentNode.clientWidth }, function () {
                chart.setSize(element[0].parentNode.clientWidth, element[0].parentNode.clientHeight);
            });

            // deep watch for changes in chart series.
            scope.$watch('canvasElement.chart.series', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } }, false);
                    populateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            scope.$watch('chartDataObjects', function (nv, ov) {
                if (nv !== ov) {
                    uniqueGUIDs = unique(scope.canvasElement.chart.series.map(function (obj) { return obj.GUID; }));
                    axis = buildAxis(uniqueGUIDs);
                    chart.update({ xAxis: { categories: axis } }, false);
                    updateSeries(scope.canvasElement.chart.series);
                }
            }, true);

            // ---- ---- ---- ---- Load & Register ---- ---- ---- ---- //

            loadChart();

            // register chart and DOM element in data manager to create expose to other parts of app.
            var index = appManager.data.DO.canvasElements.map(function (obj) { return obj.GUID }).indexOf(scope.canvasElement.GUID);
            if (index >= 0) {
                appManager.data.DO.canvasElements.splice(index, 1);
            } 
            appManager.data.DO.canvasElements.push({ GUID: scope.canvasElement.GUID, ChartDOM: element, chart: chart });
        }
    };
}])
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




        
        //scope.$watch('element.dataGroup', function () {
        //    if (scope.element.dataGroup) {
        //        scope.drillDown = scope.element.dataGroup.drillDown;
        //    }
        //    else {
        //        scope.drillDown = { level: [], selection: [] };
        //    }
        //}, true);


        //scope.autoList = ["one", "two", "three", "four"];

        //scope.querySearch = function(query) {
        //    var results = query ? scope.autoList.filter(createFilterFor(query)) : [];
        //    return results;
        //}
        //function createFilterFor(query) {
        //    var lowercaseQuery = angular.lowercase(query);

        //    return function filterFn(value) {
        //        return (value.indexOf(lowercaseQuery) === 0);
        //    };

        //}
    };
}]);
mapApp.directive('dfoChecklist', ['appManager', 'dataFilterFactory', function (appManager, dataFilterFactory) {
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

        scope.format = function (item) {
            if (scope.filter.advanced.date.convertToMonth) {
                return dataFilterFactory.intToMonth(item);
            }
            else {
                return item;
            }         
        }
        
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
                template: '<md-card><md-virtual-repeat-container style="height: 200px; width: 250px;"><md-list-item md-virtual-repeat="item in filterDataObject" ng-click="selected(item.value)">{{format(item.value)}}</md-list-item></md-virtual-repeat-container></md-card>',
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
mapApp.controller('SelectPanel', ['mdPanelRef', '$scope', 'filter', 'operation', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, operation, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        operation.selectedValues[0] = item;
        operation.formatedModel = $scope.format(item);
        mdPanelRef.close();
    }

    $scope.format = function (item) {
        if ($scope.filter.advanced.date.convertToMonth) {
            return dataFilterFactory.intToMonth(item);
        }
        else {
            return item;
        }
    }

}]);
mapApp.directive('cohortDiagram', [function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
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
            
            scope.filter.operations = [];
        };

        scope.change = function () {
            reset();
            if (scope.method === 'ex' && (scope.poly || scope.hu || scope.pain)) {
				
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
				
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;							
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
					scope.filter.operations[1].selectedValues[0] = 0;					
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
					scope.filter.operations[0].selectedValues[0] = 0;
                } else if (scope.pain) {
                    scope.p = true;
					scope.filter.operations[0].selectedValues[0] = 0;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.poly) {
                    scope.pp = true;
					scope.filter.operations[1].selectedValues[0] = 0;
					scope.filter.operations[2].selectedValues[0] = 0;
                } else if (scope.hu) {
                    scope.h = true;
					scope.filter.operations[0].selectedValues[0] = 0;
					scope.filter.operations[1].selectedValues[0] = 0;
                }
            } else if (scope.method === 'in') {
                if (scope.poly && scope.hu && scope.pain) {
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.poly && scope.hu) {
                    scope.pph = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });	
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.poly && scope.pain) {
                    scope.ppp = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
                } else if (scope.pain && scope.hu) {
                    scope.ph = true;
                    scope.chup = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.pain) {
                    scope.chup = true;
                    scope.ppp = true;
                    scope.ph = true;
                    scope.p = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PainFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });			
                } else if (scope.poly) {
                    scope.chup = true;
                    scope.pp = true;
                    scope.ppp = true;
                    scope.pph = true;
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'PolyFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                } else if (scope.hu) {
                    scope.chup = true;
                    scope.h = true;
                    scope.ph = true;
                    scope.pph = true;		
					scope.filter.operations.push({ dataValue: { COLUMN_NAME: 'HUFlag', DATA_TYPE: 'int' }, operation: "equal", name: "Equal", type: 'dfo-select', selectedValues: [1] });
                }
            }
        };

        var onLoad = function () {
            var flags = scope.filter.operations.map(function (operation) { return operation.dataValue.COLUMN_NAME; });

            if (scope.filter.operations[flags.indexOf('PolyFlag')].selectedValues[0] === 1) {
                scope.poly = true;
            }
            if (scope.filter.operations[flags.indexOf('PainFlag')].selectedValues[0] === 1) {
                scope.pain = true;
            }
            if (scope.filter.operations[flags.indexOf('HUFlag')].selectedValues[0] === 1) {
                scope.hu = true;
            }
            scope.change();
        }();

    };
}]);



mapApp.directive('combinationFilter', ['appManager', 'dataFilterFactory', '$mdPanel', '$mdDialog', function (appManager, dataFilterFactory, $mdPanel, $mdDialog) {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/combination-filter/combinationFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        var DO = appManager.data.DO;
        var DF = appManager.data.DF;
        var API = appManager.data.API;

        var filterDataObject = null;

        checkData();

        scope.filterDataObject = filterDataObject;
        
        scope.showOperations = function (ev) {
            $mdDialog.show({
                templateUrl: 'core-components/analysis/templates/dataFilterSettings.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: 'DataFilterSettingsCombination',
                locals: {
                    filter: scope.filter,
                    current: scope.current
                }
            });
        };

        scope.showSelect = function (ev) {
            var position = $mdPanel.newPanelPosition()
            .relativeTo(ev.target)
            .addPanelPosition('align-start', 'center');

            var config = {
                attachTo: angular.element(document.body),
                controller: 'CombinationSelectPanel',
                template: '<md-card><md-virtual-repeat-container style="height: 200px; width: 278px;"><md-list-item md-virtual-repeat="item in filterDataObject" ng-click="selected(item)">{{format(item.value)}}</md-list-item></md-virtual-repeat-container></md-card>',
                //panelClass: 'popout-menu',
                locals: {
                    filter: scope.filter
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

        function checkData() {

            if (DF.getFilter(scope.filter.GUID) !== null) {
                filterDataObject = DF.getFilter(scope.filter.GUID)
            }
            else {
                //check to see if filter values exist, if not, get them.

                filterDataObject = { GUID: scope.filter.GUID, dataValues: [] };
                DO.filters.push(filterDataObject);

                var postObject = { post: { type: "column", alias: scope.current.dataGroup.source.alias, columnName: scope.filter.operations.map(function (operation) { return operation.dataValue.COLUMN_NAME; }), order: scope.filter.orderValue } };

                API.schema().save(postObject).$promise.then(function (response) {
                    filterDataObject.dataValues.length = 0;
                    response.result.forEach(function (obj) {
                        filterDataObject.dataValues.push({ value: obj, isChecked: false });
                    });
                });

                console.log(filterDataObject);
                console.log(scope.filter);
            }
        };

    };
}]);



mapApp.controller('CombinationSelectPanel', ['mdPanelRef', '$scope', 'filter', 'appManager', 'dataFilterFactory', function (mdPanelRef, $scope, filter, appManager, dataFilterFactory) {

    $scope.filter = filter;

    $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;

    $scope.$watch('filterDataObject', function () {
        $scope.filterDataObject = appManager.data.DF.getFilter(filter.GUID).dataValues;
    }, true);

    $scope.selected = function (item) {
        item.value.forEach(function (value, index) {
            $scope.filter.operations[index].selectedValues[0] = value;
        });
        $scope.filter.formatedModel = $scope.format(item.value)
        mdPanelRef.close();
    }


    $scope.format = function (values) {
        if ($scope.filter.advanced.date.convertToMonth) {
            var formatedValue = [];
            values.forEach(function (value) {
                formatedValue.push(dataFilterFactory.intToMonth(value));
            });
            return formatedValue.join(', ');
        }
        else {
            return values.join(', ');
        }
    }

    

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
mapApp.directive('progressiveFilter', [function () {
    return {
        restrict: 'E',
        scope: {
            filter: '=',
            current: '='
        },
        replace: true,
        templateUrl: 'shared-components/data-filters/progressive-filter/progressiveFilter.html',
        link: link
    };

    function link(scope, elem, attr) {
        




        var onLoad = function () {
          
        }();
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

            var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: [newFilter.dataValue.COLUMN_NAME], order: newFilter.orderValue } };

            API.schema().save(postObject).$promise.then(function (response) {
                response.result.forEach(function (obj) {
                    newFilterDataObject.dataValues.push({ value: obj[0], isChecked: false });
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

        var filterDataObject;

        if (DF.getFilter(filter.GUID) !== null) {
            filterDataObject = DF.getFilter(filter.GUID)
        }
        else {
            filterDataObject = { GUID: filter.GUID, dataValues: [] };
            DO.filters.push(filterDataObject);
        }
        

        var postObject = { post: { type: "column", alias: dataGroup.source.alias, columnName: [filter.dataValue.COLUMN_NAME], order: filter.orderValue } };

        API.schema().save(postObject).$promise.then(function (response) {
            filterDataObject.dataValues.length = 0;

            response.result.forEach(function (obj) {
                
                filter.operations.forEach(function (operation) {
                    if (operation.type === 'dfo-checklist') {
                        if (operation.selectedValues.indexOf(obj[0]) > -1) {
                            filterDataObject.dataValues.push({ value: obj[0], isChecked: true });
                        }
                        else {
                            filterDataObject.dataValues.push({ value: obj[0], isChecked: false });
                        }                             
                    }
                    else {
                        filterDataObject.dataValues.push({ value: obj[0], isChecked: false });
                    }
                });


            });
        });
    };

    factory.intToMonth = function(value, useShort) {
        tempInt = parseInt(value);
        switch (tempInt) {
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
            default:
                return value;
        }
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
                var newDataObject = { GUID: dataGroup.GUID, result: null, drillDown: [] };
                DO.dataGroups.push(newDataObject);

                var queryObject = factory.buildQueryObject(dataGroup, 0);
                API.query().save({ query: queryObject }).$promise.then(function (response) {
                    newDataObject.result = response.result;
                });
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

        canvas.dataGroups.forEach(function (dataGroup) {
            if (DO.dataGroups.map(function (obj) { return obj.GUID; }).indexOf(dataGroup.GUID) < 0) {
                var newDataObject = { GUID: dataGroup.GUID, result: null, drillDown: [] };
                DO.dataGroups.push(newDataObject);

                var queryObject = factory.buildQueryObject(dataGroup, 0);
                API.query().save({ query: queryObject }).$promise.then(function (response) {
                    newDataObject.result = response.result;
                });
            }
        });
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
        this.orderValue = 'asc';
        this.operations = [];
        this.GUID = null;
        this.visibleInReport = false;
        this.advanced = {
            date: {
                convertToMonth: false,
                useShortMonth: false //long | short
            }
        };

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