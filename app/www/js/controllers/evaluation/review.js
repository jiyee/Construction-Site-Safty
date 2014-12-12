app.controller('EvaluationReviewCtrl', function($scope, $stateParams, $state, settings, TableService, EvaluationService, CaptureService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.evaluationId) ? true : false;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    // 用户在线时，同步显示安全检查
    if (!$scope.data.isOffline) {
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

            // TODO 这里原取标段或分部
            CaptureService.list(project, section, start_date, end_date).then(function(captures) {
                $scope.data.captures = captures;
            });
        });
    }

    var AutoService = $scope.data.isOffline ? OfflineService : TableService;
    AutoService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        _.each(table.items, function(level1) {
            if (level1.index === $scope.data.itemId) {
                _.each(level1.items, function(level2) {
                    if (level2.index === $scope.data.subItemId) {
                        $scope.data.review = level2;
                        return;
                    }
                });
            }
        });
    });

    $scope.changeScore = function(item, score) {
        if (score > 0) {
            item.status = 'FAIL';
        } else if (score === 0) {
            item.status = 'PASS';
        } else {
            item.status = 'UNCHECK';
        }
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.images = item.images || [];
            item.images.push(imageURI);
            $scope.$apply();
        }

        function onFail(message) {
            alert(message);
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.saveAndReturn = function() {
        AutoService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            $state.go('^.table', {
                evaluationId: $scope.data.evaluationId
            });
        }, function(err) {
            alert(err);
        });
    };
});
