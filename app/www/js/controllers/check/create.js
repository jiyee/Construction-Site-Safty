app.controller('CheckCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, settings, files, SegmentService, CheckService, OfflineService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.sections = [];
    $scope.data.branches = [];
    $scope.data.files = files;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    // 自动选中默认项目、标段、分部
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

        SegmentService.findByProjectId(project._id).then(function (segments) {
            $scope.data.sections = segments;
        });
    });

    $scope.$watch('data.section', function(section) {
        if (!section) return;

        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.branches = segment.segments;
        });
    });

    $scope.newCheck = function () {
        if (!$scope.data.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.file) {
            alert('请选择检查用表');
            return;
        }

        if (!$scope.data.target) {
            alert('请填写检查对象');
            return;
        }

        OfflineService.newCheck({
            project: $scope.data.project,
            section: $scope.data.section,
            branch: $scope.data.branch,
            file: $scope.data.file,
            target: $scope.data.target
        }).then(function(check) {
            $state.go('^.table', {
                tableId: check.table // 这里返回的table的uuid
            });
        }, function (err) {
            alert(err);
        });
    };

    $scope.toBack = function () {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});