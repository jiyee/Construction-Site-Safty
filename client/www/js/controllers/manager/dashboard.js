app.controller('ManagerDashboardCtrl', function($scope, $rootScope, $state, $stateParams, UserService, CheckService, AuthService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    
    $scope.$watch('current.part', function() {
        if ($scope.current.part) {
            UserService.findByPartId($scope.current.part._id).then(function (users) {
                $scope.data.partUsers = users;
            });
        }
    });

    $scope.current = $rootScope.current;

    if (!$scope.current) {
        $scope.current = {};
        UserService.findById($scope.data.userId).then(function(user) {
            $scope.current.user = user;
            $scope.current.part = user.part;
        });
    }

    CheckService.findByUserId($scope.data.userId).then(function(checks) {
        $scope.data.checks = checks;
    });

    $scope.toTarget = function () {
        $state.go('^.target', {
            userId: $scope.current.user._id
        });
    };

    $scope.toCheck = function (item) {
        $state.go('^.check', {
            userId: $scope.current.user._id,
            checkId: item._id
        });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    };
});