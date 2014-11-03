app.controller('CheckCreateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, files, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.sections = [];
    $scope.data.branches = [];
    $scope.data.projectId = $scope.data.user.project ? $scope.data.user.project._id : $rootScope._data_.project ? $rootScope._data_.project._id : null;
    $scope.data.files = files;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

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

    $scope.newCheck = function () {
        CheckService.create({
            project: $scope.data.projectId || $scope.data.project._id,
            segment: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            file: $scope.data.file,
            check_target: $scope.data.check_target
        }).then(function(check) {
            $state.go('^.table', {
                tableId: check.table
            });
        }, function (err) {
            alert(err);
        });
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});