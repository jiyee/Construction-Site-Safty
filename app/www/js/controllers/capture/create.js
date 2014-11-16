app.controller('CaptureCreateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CaptureService, AuthService, categories, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projectId = $scope.data.user.project ? $scope.data.user.project._id : $rootScope.data.project ? $rootScope.data.project._id : null;
    $scope.data.categories = categories;
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

    ProjectService.find().then(function (projects) {
        $scope.data.projects = projects;
    });

    console.log($scope.data.user);
    if ($scope.data.projectId) {
        $scope.data.project = $scope.data.user.project;
        SegmentService.findByProjectId($scope.data.projectId).then(function (segments) {
            $scope.data.sections = segments;
        });
    }

    $scope.$watch('data.projectId', function (projectId) {
        if (!projectId) return;

        SegmentService.findByProjectId($scope.data.projectId).then(function (segments) {
            $scope.data.sections = segments;
        });
    });

    $scope.$watch('data.section', function(section) {
        if (!section) return;

        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.branches = segment.segments;
        });
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
        if (!$scope.data.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.section && !$scope.data.branch) {
            alert('请选择合同段或分部');
            return;
        }

        if (!$scope.data.category) {
            alert('请选择类别和细项');
            return;
        }

        if (!$scope.data.name || !$scope.data.images) {
            alert('请填写检查对象或拍照存档');
            return;
        }

        CaptureService.create({
            name: $scope.data.name,
            description: $scope.data.description,
            user: $scope.data.user._id,
            category: $scope.data.category,
            project: $scope.data.projectId || $scope.data.project._id,
            section: $scope.data.section._id,
            branch: $scope.data.branch._id,
            images: $scope.data.images.join("|"),
            center: [$scope.data.center_x, $scope.data.center_y]
        }).then(function(check) {
            alert('保存成功');
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.toBack = function() {
        $state.go('^.map', {
            userId: $scope.data.user._id
        });
    };
});
