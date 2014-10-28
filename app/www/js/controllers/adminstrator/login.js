app.controller('AdministratorLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, units, ProjectService, SegmentService, UnitService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;
    $scope.data.units = units;

    $scope.$watch('data.unit', function (unit) {
        if (unit && unit._id) {
            UserService.findByUnitId(unit._id).then(function(users) {
                $scope.data.users = users;
            });
        }
    });

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
        $rootScope._data_.project = $scope.data.project;

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});