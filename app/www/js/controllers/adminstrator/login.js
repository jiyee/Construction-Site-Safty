app.controller('AdministratorLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, units, UserService, AuthService, SyncService) {
    $scope.data = {};
    $scope.data.resolveUnits = units;
    $scope.data.units = [];
    $scope.data.users = [];

    $scope.$watch('data.type', function (type) {
        $scope.data.units = _.filter($scope.data.resolveUnits, {'type': type});
        $scope.data.unit = null;
        $scope.data.users = [];
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