app.controller('WelcomeCtrl', function($scope, $ionicPopup, $state, $stateParams, $ionicPlatform, settings, user, SyncService) {
    $scope.data = {};
    $scope.data.server = settings.baseUrl;

    // 用户session判断，自动跳转
    if (user && user.role) {
        $state.go([user.role, 'dashboard'].join('.'), {
            userId: user._id
        });
    }

    $scope.setServerAddr = function() {
        SyncService.fullUpgrade().then(function() {
            alert('离线包下载成功');
        }, function() {
            alert('离线包下载失败');
        });
    };

    function exitApp() {
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    }

    $ionicPlatform.onHardwareBackButton(exitApp);

    $scope.$on('$destroy', function() {
        $ionicPlatform.offHardwareBackButton(exitApp);
    });

});