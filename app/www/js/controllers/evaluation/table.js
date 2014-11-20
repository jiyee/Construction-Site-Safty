app.controller('EvaluationTableCtrl', function($scope, $stateParams, $state, settings, TableService, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.evaluationId) ? true : false;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    var AutoService = $scope.data.isOffline ? OfflineService : EvaluationService;
    AutoService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        console.log(evaluation);

        $scope.data.checked_items = [];
        $scope.data.score = 0;

        // 标识考核历史记录
        _.each($scope.data.evaluation.tables, function (table) {
            _.each(table.items, function (level1) {
                _.each(level1.items, function (level2) {
                    level2.pass = level2.fail = level2.uncheck = 0;
                    _.each(level2.items, function (level3) {
                        if (level3.status === 'FAIL') {
                            level3.full_index = [table.file, level1.index, level2.index, level3.index].join('-');
                            $scope.data.checked_items.push(level3);
                            $scope.data.score += parseInt(level3.score, 10);
                            level2.fail += 1;
                        } else if (level3.status === 'PASS') {
                            level2.pass += 1;
                        } else if (level3.status === 'UNCHECK') {
                            level2.uncheck += 1;
                        }
                    });
                });
            });
        });
    });

    $scope.ifHideLevel2 = {};
    $scope.toggle = function(table, level1) {
        if ($scope.ifHideLevel2[table.name + level1.index] === undefined) {
            $scope.ifHideLevel2[table.name + level1.index] = true;
        } else {
            $scope.ifHideLevel2[table.name + level1.index] = !$scope.ifHideLevel2[table.name + level1.index];
        }
    };

    $scope.review = function(table, index, level1, level2) {
        $state.go("^.review", {
            evaluationId: $scope.data.evaluationId,
            tableId: table._id,
            itemId: level1.index,
            subItemId: level2.index
        });
    };

    $scope.toBack = function () {
        $state.go('^.detail', {
            evaluationId: $scope.data.evaluationId
        });
    };

    $scope.filterFn = function (level1) {
        var filter = false;
        _.each(level1.items, function(level2) {
            if (level2.is_selected) filter = true;
        });

        return filter;
    };
});
