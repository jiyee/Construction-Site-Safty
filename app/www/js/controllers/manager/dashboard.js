app.controller('ManagerDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, UserService, CaptureService, CheckService, EvaluationService, AuthService, OfflineService, GeolocationService, SyncService, resolveUser) {
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

    // OfflineService.list().then(function (list) {
    //     // 全部导入
    //     list = _.filter(list, function(item) {
    //         return item._type_ === 'capture' ||
    //             item._type_ === 'check' ||
    //             item._type_ === 'evaluation';
    //     });

    //     if (list.length === 0) return;

    //     var popup = $ionicPopup.show({
    //         template: '',
    //         title: '您有' + list.length + '条离线记录，是否导入？',
    //         scope: $scope,
    //         buttons: [{
    //             text: '取消'
    //         }, {
    //             text: '<b>确定</b>',
    //             type: 'button-positive',
    //             onTap: function(e) {
    //                 return true;
    //             }
    //         }, ]
    //     });

    //     popup.then(function(bool) {
    //         if (!bool) return;

    //         $state.go("sync.dashboard");
    //     });
    // });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    var segment = $scope.data.user.branch || $scope.data.user.section;
    if (segment) {
        $scope.data.group = segment;
        UserService.findBySegmentId(segment._id).then(function (users) {
            $scope.data.usersAtSameGroup = users;
        });
    } else if ($scope.data.user.unit) {
        $scope.data.group = $scope.data.user.unit;
        UserService.findByUnitId($scope.data.user.unit._id).then(function (users) {
            $scope.data.usersAtSameGroup = users;
        });
    }

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

    $scope.toDetail = function(item) {
        // TODO 离线和在线状态转换
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

    $scope.toCaptureMap = function () {
        $state.go('capture.map');
    };

    $scope.toCheckList = function () {
        $state.go('check.list');
    };

    $scope.toEvaluationList = function (item) {
        $state.go('evaluation.list');
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    };
});