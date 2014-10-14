app.controller('ManagerCheckCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    $scope.data.checkId = $stateParams.checkId;

    $scope.current = $rootScope.current;

    if (!$scope.current) {
        $scope.current = {};
        UserService.findById($scope.data.userId).then(function(user) {
            $scope.current.user = user;
            $scope.current.segment = user.segment;
        });

        // TODO 这里因为数据结构设计问题，暂时写死
        ProjectService.find().then(function(project) {
            $scope.current.project = project[0];
            $scope.data.project = project[0];
        });
    }

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        var table = check.table,
            rectifications = [];

        angular.forEach(table.items, function(level1) {
            angular.forEach(level1.items, function(level2) {
                angular.forEach(level2.items, function(level3) {
                    if (level3.status && level3.score > 0) {
                        rectifications.push({
                            name: level3.name,
                            image_url: level3.image_url
                        });
                    }
                });
            });
        });

        $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go('^.dashboard', {
            userId: $scope.data.userId
        });
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            userId: $scope.data.userId,
            tableId: $scope.data.check.table._id
        });
    };

    $scope.toStartUp = function() {
        $state.go('^.startup', {
            userId: $scope.data.userId,
            checkId: $scope.data.check._id
        });
    };

});