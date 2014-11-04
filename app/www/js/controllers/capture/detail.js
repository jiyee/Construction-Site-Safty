app.controller('CaptureDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, categories, ProjectService, UserService, UnitService, CaptureService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.categories = categories;
    $scope.data.captureId = $stateParams.captureId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    CaptureService.findById($scope.data.captureId).then(function(capture) {
        $scope.data.capture = capture;
    });

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
