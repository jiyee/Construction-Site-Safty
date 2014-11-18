app.controller('CaptureDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captureId = $stateParams.captureId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    // TODO 同时处理离线数据和在线数据
    OfflineService.findById($scope.data.captureId).then(function(capture) {
        $scope.data.capture = capture;
    });

    $scope.toBack = function() {
        $state.go('^.list', {
            userId: $scope.data.user._id
        });
    };

    $scope.remove = function() {
        OfflineService.remove($scope.data.captureId);
        alert('删除成功');
        $scope.toBack();
    };
});
