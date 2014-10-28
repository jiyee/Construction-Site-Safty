app.controller('CaptureCreateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CaptureService, AuthService, files, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.project = $rootScope._data_.project;
    $scope.data.images = [];
    $scope.data.center_x = 0;
    $scope.data.center_y = 0;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

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

        CaptureService.create({
            name: $scope.data.name,
            description: $scope.data.description,
            user: $scope.data.user._id,
            project: $scope.data.project._id,
            images: $scope.data.images.join("|"),
            center: [$scope.data.center_x, $scope.data.center_y]
        }).then(function(check) {
            alert('保存成功');
            // 还原状态
            $scope.data.name = '';
            $scope.data.description = '';
            $scope.data.images = [];
        }, function(err) {
            alert(err);
        });
    };

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
