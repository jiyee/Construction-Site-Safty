app.controller('AdministratorLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, units, ProjectService, SegmentService, UnitService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;
    $scope.data.resolveUnits = units;
    $scope.data.units = [];
    $scope.data.users = [];

    $scope.$watch('data.type', function (type) {
        $scope.data.units = _.filter($scope.data.resolveUnits, {'type': type});
    });

    $scope.$watch('data.unit', function (unit) {
        if (unit && unit._id) {
            UserService.findByUnitId(unit._id).then(function(users) {
                $scope.data.users = users;
            });
        } else {
            $scope.data.users = [];
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

        if (!$scope.data.project) {
            alert('请选择检查项目');
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