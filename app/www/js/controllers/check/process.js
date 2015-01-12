app.controller('CheckProcessCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicModal, settings, CheckService, UnitService, UserService, AuthService, UploadService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.builder = {};
    $scope.data.builder.unit = {};
    $scope.data.supervisor = {};
    $scope.data.supervisor.unit = {};
    $scope.data.current = {};
    $scope.data.next = {};
    $scope.data.images = [];

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        if (check.process.archives) {
            _.each(check.process.archives, function(archive) {
                UserService.findById(archive.user).then(function(user) {
                    archive.user = user;
                });
            });
        }

        UserService.findByUnitId($scope.data.user.unit._id).then(function(users) {
            $scope.data.otherUsers = users;
        });

        // 行业主管部门，则显示指挥部安全管理人员
        if ($scope.data.user.role === 'administrator') {
            UserService.find().then(function(users) {
                $scope.data.next.users = _.filter(users, function(user) {
                    return user.project &&
                        user.project._id === check.project._id &&
                        user.section &&
                        user.section._id === check.section._id;
                });
            });
        } else if ($scope.data.user.role === 'manager') {
            UserService.find().then(function(users) {
                $scope.data.next.users = _.filter(users, function(user) {
                    return user.project &&
                        user.project._id === check.project._id &&
                        user.section &&
                        user.section._id === check.section._id;
                });
            });
        } else {
            UserService.findByUnitId($scope.data.user.unit._id).then(function(users) {
                $scope.data.next.users = users;
            });
        }
    });

    $ionicModal.fromTemplateUrl('others-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.others = [];
        _.each($scope.data.otherUsers, function (item) {
            if (item.checked) $scope.data.others.push(item);
        });
    };

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.capture = function() {
        function onSuccess(imageURI) {
            var image = {
                uri: imageURI,
                date: Date.now()
            };
            $scope.data.images.push(image);
            $scope.$apply();

            UploadService.upload(image.uri).then(function(res) {
                image.url = res.url;
            }, function(err) {
                console.log(err);
            });
        }

        function onFail(message) {
            alert(message);
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true
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
                    images: $scope.data.images,
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

        CheckService.forward($scope.data.checkId, opts).then(function() {
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
                    images: $scope.data.images,
                    action: 'REVERSE'
                }
            }
        };

        CheckService.backward($scope.data.checkId, opts).then(function() {
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
                    images: $scope.data.images,
                    action: 'BACKWARD'
                }
            }
        };

        CheckService.backward($scope.data.checkId, opts).then(function() {
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
                    images: $scope.data.images,
                    action: 'REVERT'
                }
            }
        };

        CheckService.revert($scope.data.checkId, opts).then(function() {
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
                    images: $scope.data.images,
                    action: 'RESTORE'
                }
            }
        };

        CheckService.restore($scope.data.checkId, opts).then(function() {
            alert("提交成功");
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };


    $scope.end = function () {
        if (!$scope.data.current.comment) {
            alert('请填写意见');
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '整改验收',
            template: '安全整改验收是否确认通过？',
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
                var opts = {
                    process: {
                        current: {
                            unit: $scope.data.user.unit._id,
                            user: $scope.data.user._id,
                            comment: $scope.data.current.comment,
                            images: $scope.data.images,
                            action: 'END'
                        }
                    }
                };

                CheckService.end($scope.data.checkId, opts).then(function(check) {
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