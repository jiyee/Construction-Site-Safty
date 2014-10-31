app.controller('OfflineEvaluationCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, settings, wbs, OfflineService) {
    $scope.data = {};
    $scope.data.resolveWbs = wbs;
    $scope.data.evaluationId = $stateParams.evaluationId;

    // 初始化wbs列表状态
    _.each($scope.data.resolveWbs, function (item) {
        item.checked = false;
    });

    $ionicModal.fromTemplateUrl('wbs-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.wbs = [];
        _.each($scope.data.resolveWbs, function (item) {
            if (item.checked) $scope.data.wbs.push(item.name);
        });
    };

    $scope.newEvaluation = function () {
        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        OfflineService.newEvaluation({
            evaluationId: $scope.data.evaluationId,
            wbs: $scope.data.wbs.join("|")
        }).then(function(evaluation) {
            $state.go('^.evaluation-generate', {
                evaluationId: $scope.data.evaluationId
            });
        }, function (err) {
            alert(err);
        });
    };

});