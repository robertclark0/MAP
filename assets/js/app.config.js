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
        .state("reportViewer", {
            url: "/report-viewer",
            templateUrl: "core-components/report-viewer/templates/view.html",
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
        .state("metricDashboard", {
            url: "/metric-dashboard",
            templateUrl: "core-components/metric-dashboard/templates/view.html",
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
        .state("metricDashboard.view", {
            url: "/:viewName",
            params: {
                viewName: null
            },
            templateUrl: function ($stateParams) { return "core-components/metric-dashboard/templates/" + $stateParams.viewName + ".view.html"; },
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