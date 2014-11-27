app.controller('CaptureProcessCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, CaptureService, UnitService, UserService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.capture = {};
    $scope.data.user = resolveUser;
    $scope.data.captureId = $stateParams.captureId;
    $scope.data.builder = {};
    $scope.data.builder.unit = {};
    $scope.data.supervisor = {};
    $scope.data.supervisor.unit = {};
    $scope.data.current = {};
    $scope.data.next = {};

    CaptureService.findById($scope.data.captureId).then(function(capture) {
        $scope.data.capture = capture;
        console.log(capture.process);

        if (capture.process.archives && capture.process.archives.length === 0) {
            var segment = ($scope.data.capture.branch || $scope.data.capture.section);
            _.each(segment.units, function(unit) {
                UnitService.findById(unit).then(function(unit) {
                    if (!unit) return;

                    if (unit.type === '监理单位') {
                        $scope.data.supervisor.unit = unit;
                        UserService.findByUnitId(unit._id).then(function(users) {
                            $scope.data.supervisor.users = users;
                        });
                    } else if (unit.type === '施工单位') {
                        $scope.data.builder.unit = unit;
                        UserService.findByUnitId(unit._id).then(function(users) {
                            $scope.data.builder.users = users;
                        });
                    }
                });
            });
        } else {
            _.each(capture.process.archives, function(archive) {
                UserService.findById(archive.user).then(function(user) {
                    archive.user = user;
                });
            });
        }

        UserService.findBySegmentId($scope.data.capture.section._id).then(function(users) {
            $scope.data.next.users = users;
        });
    });

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.forward = function() {
        if (!$scope.data.next.user) {
            alert('请选择整改责任人');
            return;
        }

        if (!$scope.data.current.comment) {
            alert('请填写整改要求');
            return;
        }

        var opts = {
            process: {
                current: {
                    unit: $scope.data.user.unit._id,
                    user: $scope.data.user._id,
                    comment: $scope.data.current.comment,
                    action: 'FORWARD'
                },
                next: {
                    unit: $scope.data.next.user.unit._id,
                    user: $scope.data.next.user._id,
                    comment: "",
                    action: ""
                }
            }
        };

        CaptureService.forward($scope.data.captureId, opts).then(function() {
            alert("下达成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.reverse = function() {
        if (!$scope.data.current.comment) {
            alert('请填写整改情况说明');
            return;
        }

        var opts = {
            process: {
                current: {
                    unit: $scope.data.user.unit._id,
                    user: $scope.data.user._id,
                    comment: $scope.data.current.comment,
                    action: 'REVERSE'
                }
            }
        };

        CaptureService.backward($scope.data.captureId, opts).then(function() {
            alert("提交成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.backward = function() {
        if (!$scope.data.current.comment) {
            alert('请填写整改意见');
            return;
        }

        var opts = {
            process: {
                current: {
                    unit: $scope.data.user.unit._id,
                    user: $scope.data.user._id,
                    comment: $scope.data.current.comment,
                    action: 'BACKWARD'
                }
            }
        };

        CaptureService.backward($scope.data.captureId, opts).then(function() {
            alert("提交成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.revert = function() {
        if (!$scope.data.current.comment) {
            alert('请填写打回意见');
            return;
        }

        var opts = {
            process: {
                current: {
                    unit: $scope.data.user.unit._id,
                    user: $scope.data.user._id,
                    comment: $scope.data.current.comment,
                    action: 'REVERT'
                }
            }
        };

        CaptureService.revert($scope.data.captureId, opts).then(function() {
            alert("提交成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.restore = function() {
        if (!$scope.data.current.comment) {
            alert('请填写整改情况说明');
            return;
        }

        var opts = {
            process: {
                current: {
                    unit: $scope.data.user.unit._id,
                    user: $scope.data.user._id,
                    comment: $scope.data.current.comment,
                    action: 'RESTORE'
                }
            }
        };

        CaptureService.restore($scope.data.captureId, opts).then(function() {
            alert("提交成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };


    $scope.end = function () {
        if (!$scope.data.current.comment) {
            alert('请填写整改意见');
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '整改验收',
            template: '安全整改验收是否通过？',
            buttons: [{
                text: '不通过',
                type: 'button-default'
            }, {
                text: '通过',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if (res) {
                var opts = {
                    process: {
                        current: {
                            unit: $scope.data.user.unit._id,
                            user: $scope.data.user._id,
                            comment: $scope.data.current.comment,
                            action: 'END'
                        }
                    }
                };

                CaptureService.end($scope.data.captureId, opts).then(function(capture) {
                    alert('整改验收完毕，本次安全检查结束。');
                    $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
                        userId: $scope.data.user._id
                    });
                }, function (err) {
                    alert(err);
                });
            }
        });
    };

});