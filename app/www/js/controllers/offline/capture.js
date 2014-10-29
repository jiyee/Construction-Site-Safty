app.controller('OfflineCaptureCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService) {
    $scope.data = {};
    $scope.data.captureId = $stateParams.captureId;
    $scope.data.images = [];
    $scope.data.center_x = 0;
    $scope.data.center_y = 0;

    OfflineService.findById($scope.data.captureId).then(function (capture) {
        $scope.data.name = capture.name;
        $scope.data.description = capture.description;
        $scope.data.images = capture.images;
        $scope.data.center_x = capture.center_x;
        $scope.data.center_y = capture.center_y;
    });

    var onSuccess = function(position) {
        $scope.data.center_x = position.coords.longitude;
        $scope.data.center_y = position.coords.latitude;
        $scope.$apply();
    };

    var onError = function(error) {
        $scope.data.center_x = 0;
        $scope.data.center_y = 0;
        $scope.$apply();
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $scope.capture = function() {
        function onSuccess(imageURI) {
            $scope.data.images.push(imageURI);
            $scope.$apply();
        }

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.save = function() {
        if (!$scope.data.name) {
            alert('请选择名称');
            return;
        }

        if (!$scope.data.description) {
            alert('请输入问题描述');
            return;
        }

        OfflineService.newCapture({
            captureId: $scope.data.captureId, // 这里不太一样，先生成id
            name: $scope.data.name,
            description: $scope.data.description,
            images: $scope.data.images.join("|"),
            center: [$scope.data.center_x, $scope.data.center_y]
        }).then(function(check) {
            alert('保存成功');
            $state.go('^.dashboard');
        }, function(err) {
            alert(err);
        });
    };

    $scope.remove = function() {
        OfflineService.remove($scope.data.captureId);
        alert('删除成功');
        $state.go('^.dashboard');
    };
});
