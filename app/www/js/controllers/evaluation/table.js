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

        $scope.data.fails = [];
        $scope.data.score = {};
        _.each(['SGJC', 'SGXC', 'SGXCTY', 'SGXCGL', 'SGXCSY'], function(type) {
            $scope.data.score[type] = {
                final: 0,
                pass: 0,
                fail: 0,
                total: 0
            };
        });


        // 标识考核历史记录
        var type, selected;
        _.each($scope.data.evaluation.tables, function (table) {
            type = table.file;

            _.each(table.items, function (level1) {
                selected = false;
                _.each(level1.items, function (level2) {
                    if (level2.is_selected) selected = true;
                    level2.pass = level2.fail = level2.uncheck = 0;
                    level2.score = 0;
                    _.each(level2.items, function (level3) {
                        if (level3.status === 'FAIL') {
                            level3.full_index = [table.file, level1.index, level2.index, level3.index].join('-');
                            level2.score += parseInt(level3.score, 10);
                            level2.fail += 1;
                            $scope.data.fails.push(level3);
                        } else if (level3.status === 'PASS') {
                            level2.pass += 1;
                        } else if (level3.status === 'UNCHECK') {
                            level2.uncheck += 1;
                        }
                    });

                    level2.score = Math.min(level2.score, level2.maximum);
                    $scope.data.score[type].fail += level2.score;
                });

                // 计算应得分
                if (selected) {
                    $scope.data.score[type].total += level1.maximum;
                }
            });
        });

        $scope.data.score['SGJC'].pass = $scope.data.score['SGJC'].total - $scope.data.score['SGJC'].fail;
        _.each(['SGXCTY', 'SGXCGL', 'SGXCSY'], function(type) {
            if (isNaN($scope.data.score[type].final)) return;

            $scope.data.score[type].pass = $scope.data.score[type].total - $scope.data.score[type].fail;
            $scope.data.score['SGXC'].fail += $scope.data.score[type].fail;
            $scope.data.score['SGXC'].pass += $scope.data.score[type].pass;
            $scope.data.score['SGXC'].total += $scope.data.score[type].total;
        });

        _.each(['SGJC', 'SGXC'], function(type) {
            $scope.data.score[type].final = parseInt(100 * $scope.data.score[type].pass / $scope.data.score[type].total * 100) / 100;
        });

        $scope.data.final = parseInt(100 * ($scope.data.score['SGJC'].final * 0.5 + $scope.data.score['SGXC'].final * 0.5)) / 100;
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
