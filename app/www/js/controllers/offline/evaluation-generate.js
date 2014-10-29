app.controller('OfflineEvaluationGenerateCtrl', function($scope, $rootScope, $state, $stateParams, settings, wbs, OfflineService) {
    $scope.data = {};
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        var tables = [];
        var counter = 0,
            length = $scope.data.evaluation.tables.length;
        _.each($scope.data.evaluation.tables, function(tableId) {
            OfflineService.findById(tableId).then(function(table) {
                counter += 1;
                tables.push(table);

                if (counter === length) {
                    $scope.data.evaluation.tables = tables;
                    return;
                }
            });
        });
    });

    $scope.toTables = function() {
        var counter = 0,
            length = $scope.data.evaluation.tables.length;
        _.each($scope.data.evaluation.tables, function(table) {
            OfflineService.update(table.uuid, table).then(function() {
                counter += 1;
                if (counter === length) {
                    alert('确认成功');
                    $state.go('^.evaluation-tables', {
                        evaluationId: $scope.data.evaluation.uuid
                    });
                }
            });
        });
    };
});
