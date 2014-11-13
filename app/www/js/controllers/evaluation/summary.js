app.controller('EvaluationSummaryCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CaptureService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;

        var project = evaluation.project._id,
            section = evaluation.section._id,
            today = new Date(),
            start_date = evaluation.evaluation_date_before ? new Date(evaluation.evaluation_date_before) : new Date(today.setMonth(today.getMonth() - 1)),
            end_date = new Date();
            end_date.setDate(end_date.getDate() + 1);

            start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');
            end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join('-');

        CheckService.list(project, section, start_date, end_date).then(function (checks) {
            $scope.data.checks = checks;

            var scores = {
                '施工单位': 0,
                '监理单位': 0,
                '建设单位': 0,
                '政府部门': 0
            };
            _.each(checks, function (check) {
                if (check.checked_items) {
                    _.each(check.checked_items, function (item) {
                        if (item.status === 'FAIL') {
                            scores[check.check_user.unit.type] += parseInt(item.score, 10);
                        }
                    });
                }
            });

            $scope.data.scores = scores;
        });

        CaptureService.list(project, section, start_date, end_date).then(function (captures) {
            $scope.data.captures = captures;
            console.log(captures);
        });
    });

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toGenerate = function () {
        $state.go('^.generate', {
            evaluationId: $scope.data.evaluation._id
        });
    };

});