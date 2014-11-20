app.controller('AdministratorDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, ProjectService, UserService, CaptureService, CheckService, EvaluationService, AuthService, OfflineService, GeolocationService, SyncService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.position = [0, 0];

    // 根据定位获取所在项目、标段和分部
    GeolocationService.getGeolocation().then(function(position) {
        $scope.data.position = position;
        $rootScope.data.position = position;
    }, function(error) {
        $scope.data.position = [0, 0];
        $rootScope.data.position = [0, 0];
    });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    if ($scope.data.user.unit) {
        $scope.data.group = $scope.data.user.unit;
        UserService.findByUnitId($scope.data.user.unit._id).then(function (users) {
            $scope.data.usersAtSameGroup = users;
        });
    }

    // 加载用户待办列表
    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;
    });

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
    });

    $scope.toDetail = function(item) {
        // 在detail里兼容处理离线和在线状态判断
        if (item.type === 'capture') {
            $state.go('capture.detail', {
                captureId: item._id
            });
        } else if (item.type === 'check') {
            $state.go('check.detail', {
                checkId: item._id
            });
        } else if (item.type === 'evaluation') {
            $state.go('evaluation.detail', {
                evaluationId: item._id
            });
        }
    };

    $scope.fullUpgrade = function() {
        SyncService.fullUpgrade().then(function() {
            alert('离线包下载成功');
        }, function() {
            alert('离线包下载失败');
        });
    };

    // 底部按钮
    $scope.toStandard = function() {

    };

    $scope.toCaptureMap = function() {
        $state.go('capture.map');
    };

    $scope.toEvaluationList = function() {
        $state.go('evaluation.list');
    };

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    };
});
