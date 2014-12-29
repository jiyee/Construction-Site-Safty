app.controller('EvaluationDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, EvaluationService, UserService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.evaluationId) ? true : false;

    var AutoService = $scope.data.isOffline ? OfflineService : EvaluationService;
    AutoService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        console.log(evaluation);

        $scope.data.fails = [];

        if ($scope.data.isOffline) {
            _.each($scope.data.evaluation.tables, function(table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            if (level3.status != 'UNCHECK' && level3.score > 0) {
                                level3.full_index = [table.file, level1.index, level2.index, level3.index].join('-');
                                $scope.data.fails.push(level3);
                            }
                        });
                    });
                });
            });
        } else { // 走流程时只显示非关联的
            $scope.data.fails = _.filter($scope.data.evaluation.archives, {linked: false});

            if (!$scope.data.isOffline && $scope.data.evaluation.process.archives.length > 0) {
                _.each($scope.data.evaluation.process.archives, function(archive) {
                    UserService.findById(archive.user).then(function(user) {
                        archive.user = user;
                    });
                });
            }
        }
    });

    $scope.remove = function() {
        OfflineService.remove($scope.data.evaluation._id);
        _.each($scope.data.evaluation.tables, function(table) {
            OfflineService.remove(table._id);
        });
        alert('删除成功');
        $scope.toBack();
    };

    $scope.save = function() {
        if (!$scope.data.evaluation.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.evaluation.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.evaluation.progress) {
            alert('请选择项目进度');
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
                if ($scope.data.isOffline) {
                    var evaluation = {};
                    evaluation.project = $scope.data.evaluation.project._id;
                    evaluation.section = $scope.data.evaluation.section._id;
                    evaluation.progress = $scope.data.evaluation.progress;
                    evaluation.unit = $scope.data.evaluation.user.unit._id;
                    evaluation.user = $scope.data.evaluation.user._id;
                    evaluation.tables = [];
                    _.each($scope.data.evaluation.tables, function(table) {
                        evaluation.tables.push(_.omit(table, ['_id', 'uuid', '_type_']));
                    });

                    evaluation.archives = [];
                    _.each($scope.data.fails, function(item) {
                        evaluation.archives.push(_.pick(item, ['index', 'name', 'comment', 'linked', 'images']));
                    });

                    // 真正创建在线数据
                    EvaluationService.create(evaluation).then(function(evaluation) {
                        alert('保存成功');

                        // 清空本地数据
                        OfflineService.remove($scope.data.evaluation._id);
                        _.each($scope.data.evaluation.tables, function(table) {
                            OfflineService.remove(table._id);
                        });
                        $scope.toBack();
                    }, function(err) {
                        alert('保存失败');
                    });
                } else {
                    // 实际修改在线数据
                    EvaluationService.update($scope.data.evaluationId, $scope.data.evaluation).then(function(evaluation) {
                        alert('保存成功');
                        $scope.toBack();
                    }, function(err) {
                        alert('保存失败');
                    });
                }
            }
        });
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            evaluationId: $scope.data.evaluationId
        });
    };

    $scope.toProcess = function() {
        $state.go('^.process', {
            evaluationId: $scope.data.evaluationId
        });
    };

    $scope.toBack = function () {
        $state.go('^.list');
    };

});