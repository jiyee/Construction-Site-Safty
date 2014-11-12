app.controller('ManagerDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, UserService, CaptureService, CheckService, EvaluationService, AuthService, OfflineService, GeolocationService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.group = {};
    $scope.data.position = [0, 0];

    // 用户登录状态异常控制
    if (!$scope.data.user || $stateParams.userId !== $scope.data.user._id) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    // 根据定位获取所在项目、标段和分部
    GeolocationService.getGeolocation().then(function(position) {
        $scope.data.position = position;
        $rootScope.data.position = position;
    }, function(error) {
        $scope.data.position = [0, 0];
        $rootScope.data.position = [0, 0];
    });

    OfflineService.list().then(function (list) {
        // 全部导入
        list = _.filter(list, function(item) {
            return item._type_ === 'capture' ||
                item._type_ === 'check' ||
                item._type_ === 'evaluation';
        });

        if (list.length === 0) return;

        var popup = $ionicPopup.show({
            template: '',
            title: '您有' + list.length + '条离线记录，是否导入？',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }, ]
        });

        popup.then(function(bool) {
            if (!bool) return;

            $state.go("sync.dashboard");
        });
    });

    // 加载用户待办列表
    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;
    });

    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.checks = checks;
    });

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
    });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    if ($scope.data.user.segment) {
        $scope.data.group = $scope.data.user.segment;
        UserService.findBySegmentId($scope.data.user.segment._id).then(function (users) {
            $scope.data.groupUsers = users;
        });
    } else if ($scope.data.user.unit) {
        $scope.data.group = $scope.data.user.unit;
        UserService.findByUnitId($scope.data.user.unit._id).then(function (users) {
            $scope.data.groupUsers = users;
        });
    }

    $scope.toDetail = function(item) {
        if (item.type === 'capture') {
            $state.go('capture.detail', {
                captureId: item._id
            });
        } else if (item.type === 'check') {
            $state.go('check.detail', {
                checkId: item._id
            });
        } else if (item.type === 'evaluation') {
            $state.go('evaluation.summary', {
                evaluationId: item._id
            });
        }
    };


    $scope.toCaptureMap = function () {
        $state.go('capture.map', {});
    };

    $scope.toCheckCreate = function () {
        $state.go('check.create', {});
    };

    $scope.toCheckDetail = function (item) {
        $state.go('check.detail', {
            checkId: item._id
        });
    };

    $scope.toEvaluationList = function (item) {
        $state.go('evaluation.list', {});
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    };
});