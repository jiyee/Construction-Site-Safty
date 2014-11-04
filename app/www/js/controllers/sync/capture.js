app.controller('SyncCaptureCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService, CaptureService, resolveProjects, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.captureId = $stateParams.captureId;
    $scope.data.project = $scope.data.user.project ? $scope.data.user.project : $rootScope._data_.project ? $rootScope._data_.project : null;

    OfflineService.findById($scope.data.captureId).then(function (capture) {
        $scope.data.name = capture.name;
        $scope.data.description = capture.description;
        $scope.data.category = capture.category;
        $scope.data.images = capture.images;
        $scope.data.center_x = capture.center_x;
        $scope.data.center_y = capture.center_y;
    });

    ProjectService.find().then(function (projects) {
        $scope.data.projects = projects;
    });

    if ($scope.data.projectId) {
        $scope.data.project = $scope.data.user.project;
        SegmentService.findByProjectId($scope.data.projectId).then(function (segments) {
            $scope.data.sections = segments;
        });
    } else {
        $scope.$watch('data.project', function (project) {
            if (!project) return;

            SegmentService.findByProjectId($scope.data.project._id).then(function (segments) {
                $scope.data.sections = segments;
            });
        });
    }

    $scope.$watch('data.section', function(section) {
        if (!section) return;

        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.branches = segment.segments;
        });
    });

    $scope.remove = function() {
        OfflineService.remove($scope.data.captureId);
        alert('删除成功');
        $state.go('^.dashboard');
    };

    $scope.sync = function() {
        if (!$scope.data.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.name) {
            alert('请输入名称');
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
            category: $scope.data.category,
            project: $scope.data.project._id,
            segment: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            images: $scope.data.images ? $scope.data.images.join("|") : "",
            center: [$scope.data.center_x, $scope.data.center_y]
        }).then(function(check) {
            alert('同步成功');
            OfflineService.remove($scope.data.captureId);
            $state.go('^.dashboard');
        }, function(err) {
            alert(err);
        });
    };
});
