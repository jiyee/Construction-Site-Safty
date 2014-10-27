app.controller('AdminitratorLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, SegmentService, UnitService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;

    $scope.changeProject = function (project) {
        $scope.project = project;
    };

    $scope.login = function () {
        if (!$scope.data.username) {
            alert('请选择用户');
            return;
        }

        if (!$scope.data.password) {
            alert('请输入密码');
            return;
        }

        // 保存到$rootScopre, 并非特别好的方式
        $rootScope._project = $scope.project;

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});