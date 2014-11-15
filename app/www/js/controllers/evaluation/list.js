app.controller('EvaluationListCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluations = [];

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
    });

    $scope.toBack = function () {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toDetail = function (item) {
        $state.go('^.detail', {
            evaluationId: item._id
        });
    };

    $scope.toSummary = function (item) {
        $state.go('^.summary', {
            evaluationId: item._id
        });
    };

    $scope.toCreate = function () {
        $state.go('^.create');
    };

});