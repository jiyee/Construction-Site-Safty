app.controller('OfflineEvaluationCtrl', function($scope, $rootScope, $state, $stateParams, settings, wbs, OfflineService) {
    $scope.wbs = wbs;
    $scope.data = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    $scope.newEvaluation = function () {
        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        OfflineService.newEvaluation({
            evaluationId: $scope.data.evaluationId,
            wbs: $scope.data.wbs
        }).then(function(evaluation) {
            // $state.go('^.table', {
                // tableId: evaluation.table
            // });
        }, function (err) {
            alert(err);
        });
    };

});