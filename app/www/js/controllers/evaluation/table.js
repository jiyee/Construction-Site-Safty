app.controller('EvaluationTableCtrl', function($scope, $stateParams, $state, settings, TableService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        console.log(evaluation);
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
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.filterFn = function (level1) {
        var filter = false;
        angular.forEach(level1.items, function(level2) {
            if (level2.is_selected) filter = true;
        });

        return filter;
    };
});
