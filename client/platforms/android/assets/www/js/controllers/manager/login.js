app.controller('ManagerLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, SegmentService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;

    AuthService.auth().then(function(user) {
        $state.go("^.dashboard", {
            userId: user._id,
        });
    });

    $scope.changeProject = function (project) {
        $scope.project = project;

        SegmentService.findByProjectId(project._id).then(function(segments) {
            var tree = [];
            var roots = angular.copy(segments);

            function deepLoop(root, level) {
                tree.push({
                    level: level,
                    _id: root._id,
                    name: root.name
                });
                if (root.segments) {
                    level += 1;
                    angular.forEach(root.segments, function(child) {
                        deepLoop(child, level);
                    });
                }
            }

            angular.forEach(roots, function (child) {
                deepLoop(child, 0);
            });

            $scope.data.segments = tree;
        });
    };

    $scope.changeSegment = function (segment) {
        $scope.segment = segment;

        UserService.findBySegmentId(segment._id).then(function(users) {
            $scope.data.users = users;
        });
    };

    $scope.resetSegment = function () {
        $scope.segment = null;
    };

    $scope.login = function () {
        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {

            // 保存到$rootScopre, 并非特别好的方式
            $rootScope.current = {};
            $rootScope.current.project = $scope.project;
            $rootScope.current.segment = $scope.segment;
            $rootScope.current.user = user;

            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});