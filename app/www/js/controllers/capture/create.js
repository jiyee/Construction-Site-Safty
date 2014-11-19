app.controller('CaptureCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, settings, categories, SegmentService, CaptureService, OfflineService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.sections = [];
    $scope.data.branches = [];
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

    // 自动选中默认项目、标段
    if ($scope.data.user.project) {
        $scope.data.project = _.find($scope.data.projects, {_id: $scope.data.user.project._id});
        SegmentService.findByProjectId($scope.data.user.project._id).then(function (segments) {
            $scope.data.sections = segments;

            if ($scope.data.user.section) {
                // BUG 只有延时才能解决默认选中问题
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

        SegmentService.findByProjectId(project._id).then(function (segments) {
            $scope.data.sections = segments;
        });
    });

    $scope.$watch('data.section', function(section) {
        if (!section) return;

        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.branches = segment.segments;

            if ($scope.data.user.branch) {
                // BUG 只有延时才能解决默认选中问题
                $timeout(function() {
                    $scope.data.branch = _.find($scope.data.branches, {
                        _id: $scope.data.user.branch._id
                    });
                }, 100);
            }
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
            $scope.data.images.push({
                uri: imageURI,
                date: Date.now(),
                center: [$scope.data.center_x, $scope.data.center_y]
            });
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

        if (!$scope.data.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.category) {
            alert('请选择类别和细项');
            return;
        }

        if (!$scope.data.object || !$scope.data.images) {
            alert('请填写检查对象或拍照存档');
            return;
        }

        // 离线重构, 离线保存均保持对象，等到同步时保存_id
        OfflineService.newCapture({
            object: $scope.data.object,
            comment: $scope.data.comment,
            user: $scope.data.user,
            category: $scope.data.category,
            project: $scope.data.project,
            section: $scope.data.section,
            branch: $scope.data.branch,
            images: $scope.data.images
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
