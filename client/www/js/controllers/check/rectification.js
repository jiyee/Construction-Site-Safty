app.controller('CheckRectificationCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.check = {};
    $scope.data.checkId = $stateParams.checkId;

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
        $state.go('^.detail', {
            checkId: $scope.data.checkId
        });
    };

    $scope.toBackward = function() {
        if (!$scope.data.check.rectification_result) {
            alert('请填写整改情况');
            return;
        }

        CheckService.backward($scope.data.checkId, $scope.data.check.rectification_result).then(function(check) {
            alert("整改提交完毕");
            $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err); 
        });
    };

});