app.controller('EvaluationListCtrl', function($scope, $rootScope, $state, $stateParams, settings, EvaluationService, OfflineService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluations = [];

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = _.filter(evaluations, function(evaluation) {
            return evaluation.process && evaluation.process.status === 'END';
        });
    });

    OfflineService.list('evaluation').then(function(evaluations) {
        $scope.data.offlineEvaluations = evaluations;
    });

    $scope.toDetail = function (item) {
        $state.go('^.detail', {
            evaluationId: item._id
        });
    };

    $scope.toCreate = function () {
        $state.go('^.create');
    };

    $scope.toBack = function () {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

});