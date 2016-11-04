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