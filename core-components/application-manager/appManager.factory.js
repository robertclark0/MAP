applicationManager.factory('appManager', ['appStateManager', 'appLogger', 'appDataManager', function (appStateManager, appLogger, appDataManager) {

    return {
        state: appStateManager,
        logger: appLogger,
        data: appDataManager
    };

}]);