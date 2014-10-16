app.controller('EvaluationCreateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    if ($scope.data.user.segment) {
        ProjectService.findById($scope.data.user.segment.project).then(function (project) {
            $scope.data.project = project;
        });
    }

    $scope.$watch('data.project', function() {
        if (!$scope.data.project) return;

        if ($scope.data.user.unit && $scope.data.user.unit.type === '施工单位') {
            $scope.data.unit = $scope.data.user.unit;
        } else {
            $scope.data.units = [];
            UnitService.findByProjectId($scope.data.project._id).then(function (units) {
                angular.forEach(units, function (value) {
                    if (value.type === '施工单位') {
                        $scope.data.units.push(value);
                    }
                });
            });
        }
    });

    $scope.$watch('data.unit', function() {
        if (!$scope.data.unit) return;

        $scope.data.sections = [];
        SegmentService.findByUnitId($scope.data.unit._id).then(function (segments) {
            angular.forEach(segments, function (value) {
                if (value.type === '标段') {
                    $scope.data.sections.push(value);
                }
            });
        });
    });

    $scope.$watch('data.section', function() {
        if (!$scope.data.section) return;

        $scope.data.branches = [];
        SegmentService.findById($scope.data.section._id).then(function (segment) {
            angular.forEach(segment.segments, function (value) {
                if (value.type === '分部') {
                    $scope.data.branches.push(value);
                }
            });
        });
    });

    $scope.changeProject = function (project) {
        $scope.data.project = project;
    };
    $scope.changeUnit = function (unit) {
        $scope.data.unit = unit;
    };
    $scope.changeSection = function (section) {
        $scope.data.section = section;
    };
    $scope.changeBranch = function (branch) {
        $scope.data.branch = branch;
    };

    $scope.toCreate = function () {
        if (!$scope.data.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.unit) {
            alert('请选择考核单位');
            return;
        }

        if (!$scope.data.section && !$scope.data.branch) {
            alert('请选择合同段或分部');
            return;
        }

        EvaluationService.create({
           project: $scope.data.user.segment.project,
           segment: ($scope.data.branch || $scope.data.section)['_id'],
           unit: $scope.data.unit._id
        }).then(function(evaluation) {
           console.log(evaluation);
           // $state.go('^.table', {
           // tableId: check.table
           // });
        }, function(err) {
           alert(err);
        });
    };
    
    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});