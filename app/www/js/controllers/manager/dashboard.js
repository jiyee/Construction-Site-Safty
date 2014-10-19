app.controller('ManagerDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user || $stateParams.userId !== $scope.data.user._id) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    // 加载用户待办列表
    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.checks = checks;
    });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    UserService.findBySegmentId($scope.data.user.segment._id).then(function (users) {
        $scope.data.segmentUsers = users;
    });

    $scope.toCheckCreate = function () {
        $state.go('check.create', {
        });
    };

    $scope.toCheckDetail = function (item) {
        $state.go('check.detail', {
            checkId: item._id
        });
    };

    $scope.toEvaluationList = function (item) {
        $state.go('evaluation.list', {

        });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    };
});