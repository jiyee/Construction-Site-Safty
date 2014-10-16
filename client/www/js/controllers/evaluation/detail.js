app.controller('EvaluationDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toDetail = function (item) {
        $state.go('^.detail', {
            evaluation_id: item._id 
        });
    };

});