app.controller('CaptureCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, settings, categories, ProjectService, SegmentService, CaptureService, AuthService, OfflineService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
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

    if ($scope.data.user.project) {
        $scope.data.project = _.find($scope.data.projects, {_id: $scope.data.user.project._id});
        SegmentService.findByProjectId($scope.data.user.project._id).then(function (segments) {
            $scope.data.sections = segments;

            if ($scope.data.user.section) {
                // BUG 只有延时才能解决默认选中问题
                // TODO 分部默认选中
                $timeout(function() {
                    $scope.data.section = _.find($scope.data.sections, {
                        _id: $scope.data.user.section._id
                    });
                }, 100);
            }
        });
    }

    $scope.$watch('data.project', function (project) {
        if (!project) return;

        SegmentService.findByProjectId($scope.data.project._id).then(function (segments) {
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

        // 离线重构, 离线保存均保持对象，等到同步时保存_id
        OfflineService.newCapture({
            name: $scope.data.name,
            description: $scope.data.description,
            user: $scope.data.user,
            category: $scope.data.category,
            project: $scope.data.project,
            section: $scope.data.section,
            branch: $scope.data.branch,
            images: $scope.data.images,
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
