app.controller('ManagerRectificationCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService) {
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
        $state.go('^.check', {
            userId: $scope.data.userId,
            checkId: $scope.data.checkId
        });
    };

    $scope.submit = function() {
        CheckService.backward($scope.data.checkId, $scope.data.check.rectification_result).then(function(check) {
            alert("整改提交完毕");
            $state.go('^.dashboard', {
                userId: $scope.data.userId
            });
        }, function(err) {
            alert(err); 
        });
    };

});