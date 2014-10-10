app.controller('ManagerReviewCtrl', function($scope, $stateParams, $state, TableService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        angular.forEach(table.items, function(item, key) {
            if (item.index === $scope.data.itemId) {
                angular.forEach(item.items, function(subitem, key) {
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
            item.status = 2;
        } else if (score === 0) {
            item.status = 1;
        } else {
            item.status = 'UNCHECK';
        }

        // $scope.$apply();
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.image_url = imageURI;
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
        TableService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            console.log(table);
        }, function(err) {
            alert(err);
        });
    };
});