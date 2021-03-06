app.controller('ManagerDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicModal,settings, UserService, CaptureService, CheckService, EvaluationService, AuthService, OfflineService, SyncService, resolveUser) {
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

    ActivityIndicator.show('正在加载中...');
    var length = 3, counter = 0;

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
    CaptureService.findByProcessCurrentUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;
        if (++counter >= length) ActivityIndicator.hide();
    });

    CheckService.findByProcessCurrentUserId($scope.data.user._id).then(function(checks) {
        $scope.data.checks = checks;
        if (++counter >= length) ActivityIndicator.hide();
    });

    EvaluationService.findByProcessCurrentUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
        if (++counter >= length) ActivityIndicator.hide();
    });

    $scope.toDetail = function(item) {
        // 在detail里兼容处理离线和在线状态判断
        if (item.type === 'capture') {
            $state.go('capture.process', {
                captureId: item._id
            });
        } else if (item.type === 'check') {
            $state.go('check.process', {
                checkId: item._id
            });
        } else if (item.type === 'evaluation') {
            $state.go('evaluation.process', {
                evaluationId: item._id
            });
        }
    };

    $ionicModal.fromTemplateUrl('password-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.submit = function() {
        AuthService.changePassword($scope.data.user.name, $scope.data.old_password, $scope.data.new_password).then(function(user) {
            alert('密码修改成功！');
            $scope.closeModal();
        }, function(err) {
            alert(err);
        });
    };

    // 底部按钮
    $scope.toRuleIndex = function() {
        $state.go('rule.index');
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
        var confirmPopup = $ionicPopup.confirm({
            title: '退出提醒',
            template: '是否确认退出，再次登录需要联网？',
            buttons: [{
                text: '取消',
                type: 'button-default'
            }, {
                text: '确定',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if (res) {
                AuthService.logout().then(function() {
                    $state.go('welcome');
                });
            }
        });
    };
});