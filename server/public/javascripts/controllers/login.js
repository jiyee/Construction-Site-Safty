app.controller('LoginController', function($scope, $state, $stateParams, UnitService, UserService, AuthService) {
    $scope.data = {};

    UnitService.find().then(function(units) {
        $scope.data.units = units;
    });

    $scope.$watch('data.unit', function (unit) {
        if (!unit) return;

        UserService.findByUnitId(unit._id).then(function (users) {
            $scope.data.users = users;
        });
    });

    $scope.login = function () {
        if (!$scope.data.unit) {
            alert('请选择单位');
            return;
        }

        if (!$scope.data.user) {
            alert('请选择用户');
            return;
        }

        if (!$scope.data.password) {
            alert('请输入密码');
            return;
        }

        AuthService.login($scope.data.user.username, $scope.data.password).then(function (user) {
            $state.go("dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };
});