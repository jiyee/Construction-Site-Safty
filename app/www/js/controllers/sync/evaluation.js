app.controller('SyncEvaluationCtrl', function($scope, $rootScope, $state, $stateParams, settings, wbs, OfflineService, SegmentService, UnitService, EvaluationService, TableService, resolveProjects, resolveUser) {
    $scope.data = {};
    $scope.wbs = wbs;
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.project = $rootScope.data.project ? $rootScope.data.project : null;

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.wbs = evaluation.wbs;
        $scope.data.evaluation_date = evaluation.evaluation_date;
        $scope.data.createAt = evaluation.createAt;

        _.each(evaluation.tables, function(tableId) {
            $scope.data.tables = [];
            OfflineService.findById(tableId).then(function(table) {
                $scope.data.tables.push(table);
            });
        });
    });

    $scope.$watch('data.project', function() {
        if (!$scope.data.project) return;

        $scope.data.sections = [];
        SegmentService.findByProjectId($scope.data.project._id).then(function(segments) {
            $scope.data.sections = $scope.data.sections.concat(segments);
        });

        if ($scope.data.user.unit && $scope.data.user.unit.type === '施工单位') {
            $scope.data.unit = $scope.data.user.unit;
        } else {
            $scope.data.units = [];
            UnitService.findByProjectId($scope.data.project._id).then(function(units) {
                angular.forEach(units, function(value) {
                    if (value.type === '施工单位') {
                        $scope.data.units.push(value);
                    }
                });
            });
        }
    });

    $scope.$watch('data.section', function() {
        if (!$scope.data.section) return;

        $scope.data.branches = [];
        SegmentService.findById($scope.data.section._id).then(function(segment) {
            _.each(segment.segments, function(value) {
                if (value.type === '分部') {
                    $scope.data.branches.push(value);
                }
            });
        });
    });

    $scope.remove = function() {
        OfflineService.remove($scope.data.evaluationId);
        _.each($scope.data.tables, function(table) {
            OfflineService.remove(table.uuid);
        });
        alert('删除成功');
        $state.go('^.dashboard');
    };

    $scope.sync = function() {
        if (!$scope.data.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择考核合同段');
            return;
        }

        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        if (!$scope.data.unit) {
            alert('请输入考核单位');
            return;
        }

        EvaluationService.create({
            wbs: $scope.data.wbs,
            project: $scope.data.project ? $scope.data.project._id : null,
            section: $scope.data.section ? $scope.data.section._id : null,
            branch: $scope.data.branch ? $scope.data.branch._id : null,
            unit: $scope.data.unit ? $scope.data.unit._id : null,
            evaluation_date: $scope.data.evaluation_date
        }).then(function(evaluation) {
            var counter = 0,
                length = evaluation.tables.length;
            _.each(evaluation.tables, function(table) {
                TableService.findById(table).then(function(remote_table) {
                    var local_table  = _.find($scope.data.tables, {file: remote_table.file});
                    if (!local_table) {
                        alert('同步失败');
                        return;
                    }

                    remote_table.items = local_table.items;
                    TableService.update(remote_table._id, remote_table).then(function(table) {
                        counter += 1;
                        if (counter === length) {
                            alert('同步成功');
                            OfflineService.remove($scope.data.evaluationId);
                            _.each($scope.data.tables, function(table) {
                                OfflineService.remove(table.uuid);
                            });
                            $state.go('^.dashboard');
                        }
                    }, function(err) {
                        alert(err);
                    });
                }, function() {
                    alert(err);
                });
            });
        }, function(err) {
            alert(err);
        });
    };
});
