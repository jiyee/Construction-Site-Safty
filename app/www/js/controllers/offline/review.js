app.controller('OfflineReviewCtrl', function($scope, $state, $stateParams, settings, OfflineService) {
    $scope.data = {};
    $scope.data.table = {};
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;

    OfflineService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        _.each(table.items, function(item) {
            if (item.index === $scope.data.itemId) {
                _.each(item.items, function(subitem) {
                    if (subitem.index === $scope.data.subItemId) {
                        $scope.data.review = subitem;
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

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.saveAndReturn = function() {
        OfflineService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            if ($scope.data.table.evaluationId) {
                $state.go('^.evaluation-tables', {
                    evaluationId: $scope.data.table.evaluationId
                });
            } else {
                $state.go('^.table', {
                    tableId: $scope.data.tableId
                });
            }
        }, function(err) {
            alert(err);
        });
    };
});