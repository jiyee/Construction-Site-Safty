app.controller('CheckCriterionCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.check = {};
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.users = [];

    UserService.find().then(function (users) {
        $scope.data.users = $scope.data.users.concat(users);
    });

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        // var rectifications = [];

        // angular.forEach(check.table.items, function(level1) {
        //     angular.forEach(level1.items, function(level2) {
        //         angular.forEach(level2.items, function(level3) {
        //             if (level3.status && level3.score > 0) {
        //                 rectifications.push({
        //                     name: level3.name,
        //                     image_url: level3.image_url
        //                 });
        //             }
        //         });
        //     });
        // });

        // $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toForward = function() {
        if (!$scope.data.nextUserId) {
            alert('请选择整改责任人');
            return;
        }

        if (!$scope.data.check.rectification_criterion) {
            alert('请填写整改要求');
            return;
        }

        CheckService.forward($scope.data.checkId, $scope.data.nextUserId, $scope.data.check.rectification_criterion).then(function(check) {
            alert("下达完毕");
            $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err);
        });
    };

});