app.controller('CheckDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, OfflineService, CheckService, UserService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.checkId) ? true : false;

    var AutoService = $scope.data.isOffline ? OfflineService : CheckService;
    AutoService.findById($scope.data.checkId).then(function(check) {
        console.log(check);
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

        if (!$scope.data.isOffline && $scope.data.check.process.archives.length > 0) {
            _.each($scope.data.check.process.archives, function(archive) {
                UserService.findById(archive.user).then(function(user) {
                    archive.user = user;
                });
            });
        }
    });

    $scope.remove = function() {
        OfflineService.remove($scope.data.checkId);
        alert('删除成功');
        $scope.toBack();
    };

    $scope.save = function() {
        if (!$scope.data.check.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.check.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.check.file) {
            alert('请选择检查用表');
            return;
        }

        if (!$scope.data.check.object) {
            alert('请填写检查对象');
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '保存同步提醒',
            template: '保存同步将结束本次考评，进入流程环节，是否确认保存？',
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
                ActivityIndicator.show('正在提交中...');

                if ($scope.data.isOffline) {
                    var check = {};
                    check.project = $scope.data.check.project._id;
                    check.section = $scope.data.check.section ? $scope.data.check.section._id : null;
                    check.branch = $scope.data.check.branch ? $scope.data.check.branch._id : null;
                    check.unit = $scope.data.check.user.unit._id;
                    check.user = $scope.data.check.user._id;
                    check.file = $scope.data.check.file;
                    check.object = $scope.data.check.object;
                    check.table = _.omit($scope.data.check.table, ['_id', 'uuid', '_type_']);

                    // 真正创建在线数据
                    CheckService.create(check).then(function() {
                        // 清空本地数据
                        OfflineService.remove($scope.data.check._id);
                        ActivityIndicator.hide();
                        alert('保存成功');
                        $scope.toBack();
                    }, function(err) {
                        ActivityIndicator.hide();

                        alert('保存失败');
                    });
                } else {
                    // 实际修改在线数据
                    CheckService.update($scope.data.checkId, $scope.data.check).then(function() {
                        ActivityIndicator.hide();
                        alert('保存成功');
                        $scope.toBack();
                    }, function(err) {
                        ActivityIndicator.hide();
                        alert('保存失败');
                    });
                }
            }
        });
    };

    $scope.docxgen = function() {
        CheckService.docxgen($scope.data.checkId).then(function(files) {
            alert('报告生成成功，下载地址已自动复制到剪贴板');
            $scope.data.files = files;

            var text = "";
            _.each(files, function(file) {
                text += $rootScope.baseUrl + '/docx/' + $scope.data.checkId + '_' + file + '.docx\n';
            });

            if (cordova.plugins && cordova.plugins.clipboard) {
                cordova.plugins.clipboard.copy(text);
            }
        }, function(err) {
            alert(err);
        });
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            tableId: $scope.data.check.table._id
        });
    };

    $scope.toProcess = function() {
        $state.go('^.process', {
            checkId: $scope.data.check._id
        });
    };

    $scope.toBack = function() {
        $state.go('^.list');
    };

});