app.controller('EvaluationDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.evaluationId) ? true : false;

    var AutoService = $scope.data.isOffline ? OfflineService : EvaluationService;
    AutoService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;

        $scope.data.checked_items = [];

        _.each($scope.data.evaluation.tables, function(table) {
            _.each(table.items, function(level1) {
                _.each(level1.items, function(level2) {
                    _.each(level2.items, function(level3) {
                        if (level3.status != 'UNCHECK' && level3.score > 0) {
                            level3.full_index = [level1.index, level2.index, level3.index].join('-');
                            $scope.data.checked_items.push(level3);
                        }
                    });
                });
            });
        });
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
        if ($scope.data.isOffline) {
            var evaluation = {};
            evaluation.project = $scope.data.evaluation.project._id;
            evaluation.section = $scope.data.evaluation.section._id;
            evaluation.unit = $scope.data.evaluation.unit._id;
            evaluation.wbs = $scope.data.evaluation.wbs;
            evaluation.tables = [];
            _.each($scope.data.evaluation.tables, function(table) {
                evaluation.tables.push(_.omit(table, ['_id', 'uuid', '_type_']));
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
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            evaluationId: $scope.data.evaluationId
        });
    };

    $scope.toBack = function () {
        $state.go('^.list');
    };

});