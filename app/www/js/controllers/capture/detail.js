app.controller('CaptureDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, CaptureService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captureId = $stateParams.captureId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.captureId) ? true : false;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    var AutoService = $scope.data.isOffline ? OfflineService : CaptureService;
    AutoService.findById($scope.data.captureId).then(function(capture) {
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
