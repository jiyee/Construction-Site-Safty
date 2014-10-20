app.controller('ManagerLoginCtrl', function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, SegmentService, UnitService, UserService, AuthService) {
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

                // 只列出标段和分部
                if (root.segments && root.type === '标段') {
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

        UnitService.findByProjectId(project._id).then(function (units) {
            console.log(units); 

            $scope.data.units = units;
        });
    };

    $scope.changeUnit = function (unit) {
        $scope.unit = unit;

        if ($scope.unit.type !== '施工单位') {
            UserService.findByUnitId($scope.unit._id).then(function(users) {
                $scope.data.users = users;
            });
        }
    };

    $scope.filterUnitConstructor = function (unit, index) {
        return unit.type === '建设单位';
    };

    $scope.filterUnitSupervisor = function (unit, index) {
        return unit.type === '监理单位';
    };

    $scope.filterUnitBuilder = function (unit, index) {
        return unit.type === '施工单位';
    };

    $scope.changeSegment = function (segment) {
        $scope.segment = segment;

        UserService.findBySegmentId(segment._id).then(function(users) {
            $scope.data.users = _.filter(users, function (user) {
                return user.unit.type === '施工单位';
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

        // 保存到$rootScopre, 并非特别好的方式
        $rootScope._project = $scope.project;

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

});