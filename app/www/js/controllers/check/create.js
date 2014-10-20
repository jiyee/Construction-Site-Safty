app.controller('CheckCreateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, files, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.segments = [];
    $scope.data.projectId = $scope.data.user.segment ? $scope.data.user.segment.project : $rootScope._project._id;
    $scope.data.files = files;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    SegmentService.findByProjectId($scope.data.projectId).then(function (segments) {
        $scope.data.segments = $scope.data.segments.concat(segments);
    });

    $scope.changeSection = function (section) {
        if (!section) return;

        $scope.data.section = section;
        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.segments = $scope.data.segments.concat(segment.segments);
        });
    };

    $scope.changeBranch = function (branch) {
        if (!branch) return;

        $scope.data.branch = branch;
    };

    $scope.newCheck = function () {
        CheckService.create({
            project: $scope.data.projectId,
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