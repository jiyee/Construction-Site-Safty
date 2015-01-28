app.controller('CaptureListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicModal, settings, CaptureService, OfflineService, AuthService, UploadService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    $scope.load = function() {
        CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
            // 只显示已经处理完的
            $scope.data.captures = _.map(captures, function(capture) {
                if (capture.process && capture.process.status === 'END') {
                    capture.isCompleted = true;
                } else {
                    capture.isCompleted = false;
                }
                return capture;
            });
        });

        OfflineService.list('capture').then(function(captures) {
            $scope.data.offlineCaptures = captures;
            $scope.data.captures_divided_by_segment = {};

            var key;
            _.each(captures, function(capture) {
                key = capture.project.name + " / " + capture.section.name;
                if (!$scope.data.captures_divided_by_segment[key]) {
                    $scope.data.captures_divided_by_segment[key] = [];
                }

                $scope.data.captures_divided_by_segment[key].push(capture);
            });
        });
    };

    $scope.load();

    $ionicModal.fromTemplateUrl('arrange-modal.html', {
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

    // 分类整理，多条数据汇总成一条数据
    $scope.save = function() {
        var selected = _.filter($scope.data.offlineCaptures, {
            checked: true
        });

        if (selected.length === 0) {
            alert('请选择要汇总的数据');
            return;
        }

        var projectAt = _.countBy(selected, function(capture) {
            return capture.project._id;
        });
        if (_.keys(projectAt).length > 1) {
            alert('汇总数据必须在同一项目');
            return;
        }

        var sectionAt = _.countBy(selected, function(capture) {
            return capture.section._id;
        });
        if (_.keys(sectionAt).length > 1) {
            alert('汇总数据必须在同一标段');
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '汇总保存提醒',
            template: '汇总保存将结束本次安全检查，进入流程环节，是否确认保存？',
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
                var capture = {};
                capture.project = _.first(_.keys(projectAt));
                capture.section = _.first(_.keys(sectionAt));
                capture.user = $scope.data.user._id;
                capture.archives = [];
                _.each(selected, function(item) {
                    capture.archives.push(_.pick(item, ['date', 'object', 'level1', 'level3', 'comment', 'images']));
                });

                // 处理未上传的图片
                _.each(capture.archives, function(item) {
                    if (_.isEmpty(item.images)) return;

                    _.each(item.images, function(image) {
                        if (!image.url && image.uri) {
                            // 设定预设值, 避免出现同步完成数据仍在上传的情况
                            image.url = '/upload/' + image.uri.substr(image.uri.lastIndexOf('/') + 1);

                            UploadService.upload(image.uri).then(function(res) {
                                image.url = res.url;
                            }, function(err) {
                                console.log(err);
                            });
                        }
                    });
                });

                // 真正创建在线数据
                CaptureService.create(capture).then(function(capture) {
                    alert('保存成功');

                    // 清空本地数据
                    _.each(selected, function(item) {
                        OfflineService.remove(item._id);
                    });
                    // 重新加载服务器数据
                    $scope.load();
                    // 关闭弹窗
                    $scope.closeModal();
                }, function(err) {
                    alert('保存失败');
                });
            }
        });
    };

    $scope.toDetail = function(item) {
        $state.go('^.detail', {
            captureId: item._id
        });
    };

    $scope.toBack = function() {
        $state.go('^.map', {
            userId: $scope.data.user._id
        });
    };
});
