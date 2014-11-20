app.controller('CheckStartCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.check = {};
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.users = [];
    $scope.data.current = {};
    $scope.data.next = {};

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    UserService.find().then(function(users) {
        $scope.data.users = $scope.data.users = users;
    });

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        $scope.data.checked_items = [];

        if ($scope.data.check.table) {
            _.each($scope.data.check.table.items, function(level1) {
                _.each(level1.items, function(level2) {
                    _.each(level2.items, function(level3) {
                        if (level3.status != 'UNCHECK' && level3.score > 0) {
                            level3.full_index = [level1.index, level2.index, level3.index].join('-');
                            $scope.data.checked_items.push(level3);
                        }
                    });
                });
            });
        }
    });

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.start = function() {
        if (!$scope.data.builder.user) {
            alert('请选择现场责任人');
            return;
        }

        if (!$scope.data.supervisor.user) {
            alert('请选择监理责任人');
            return;
        }

        if (!$scope.data.next.user) {
            alert('请选择整改责任人');
            return;
        }

        if (!$scope.data.current.comment) {
            alert('请填写整改要求');
            return;
        }

        var opts = {
            comment: $scope.data.checked_items,
            builder: {
                unit: $scope.data.builder.user.unit._id,
                user: $scope.data.builder.user._id,
                qrcode: $scope.data.builder.qrcode
            },
            supervisor: {
                unit: $scope.data.supervisor.user.unit._id,
                user: $scope.data.supervisor.user._id,
                qrcode: $scope.data.supervisor.qrcode
            },
            current: {
                unit: $scope.data.user.unit._id,
                user: $scope.data.user._id,
                comment: $scope.data.current.comment
            },
            next: {
                unit: $scope.data.next.user.unit._id,
                user: $scope.data.next.user._id,
                comment: ""
            }
        };

        CheckService.start($scope.data.checkId, opts).then(function() {
            alert("整改通知书下达成功");
            $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err);
        });
    };

});
