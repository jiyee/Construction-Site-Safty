app.controller('ManagerLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, SegmentService, UnitService, UserService, AuthService, SyncService) {
    $scope.data = {};
    $scope.data.projects = projects;

    $scope.$watch('data.project', function (project) {
        if (!project) return;

        UnitService.findByProjectId(project._id).then(function (units) {
            $scope.data.units = units;
        });
    });

    // filter过滤函数
    $scope.filterUnitConstructor = function (unit, index) {
        return unit.type === '建设单位';
    };

    $scope.filterUnitSupervisor = function (unit, index) {
        return unit.type === '监理单位';
    };

    $scope.filterUnitBuilder = function (unit, index) {
        return unit.type === '施工单位';
    };

    $scope.changeUnit = function (unit) {
        if (!unit) return;

        $scope.data.unit = unit;

        UserService.findByUnitId(unit._id).then(function(users) {
            $scope.data.users = _.filter(users, function (user) {
                return user.unit.type === unit.type;
            });
        });
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

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            SyncService.fullUpgrade();
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});