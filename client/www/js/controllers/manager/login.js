app.controller('ManagerLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, PartService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;

    AuthService.auth().then(function(user) {
        $state.go("^.dashboard", {
            userId: user._id,
        });
    });

    $scope.changeProject = function (project) {
        $scope.project = project;

        PartService.findByProjectId(project._id).then(function(parts) {
            var tree = [];
            var root = angular.copy(parts);

            function deepLoop(root, level) {
                tree.push({
                    level: level,
                    _id: root._id,
                    name: root.name
                });
                if (root.parts) {
                    level += 1;
                    angular.forEach(root.parts, function(part) {
                        deepLoop(part, level);
                    });
                }
            }

            angular.forEach(root, function (part) {
                deepLoop(part, 0);
            });

            $scope.data.parts = tree;
        });
    };

    $scope.changePart = function (part) {
        $scope.part = part;

        UserService.findByPartId(part._id).then(function(users) {
            $scope.data.users = users;
        });
    };

    $scope.resetPart = function () {
        $scope.part = null;
    };

    $scope.login = function () {
        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {

            // 保存到$rootScopre, 并非特别好的方式
            $rootScope.current = {};
            $rootScope.current.project = $scope.project;
            $rootScope.current.part = $scope.part;
            $rootScope.current.user = user;

            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});