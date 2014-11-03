app.controller('EvaluationCreateCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, settings, wbs, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.resolveWbs = wbs;
    $scope.data.user = resolveUser;
    $scope.data.projectId = $scope.data.user.project ? $scope.data.user.project._id : $rootScope._data_.project ? $rootScope._data_.project._id : null;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    // 初始化wbs列表状态
    _.each($scope.data.resolveWbs, function (item) {
        item.checked = false;
    });

    ProjectService.find().then(function (projects) {
        $scope.data.projects = projects;
    });

    if ($scope.data.projectId) {
        $scope.data.project = $scope.data.user.project;
    }

    $scope.$watch('data.project', function() {
        if (!$scope.data.project) return;

        if ($scope.data.user.unit && $scope.data.user.unit.type === '施工单位') {
            $scope.data.unit = $scope.data.user.unit;
        } else {
            $scope.data.units = [];
            UnitService.findByProjectId($scope.data.project._id).then(function(units) {
                angular.forEach(units, function(value) {
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
        SegmentService.findByUnitId($scope.data.unit._id).then(function(segments) {
            angular.forEach(segments, function(value) {
                if (value.type === '标段') {
                    $scope.data.sections.push(value);
                }
            });
        });
    });

    $scope.$watch('data.section', function() {
        if (!$scope.data.section) return;

        $scope.data.branches = [];
        SegmentService.findById($scope.data.section._id).then(function(segment) {
            angular.forEach(segment.segments, function(value) {
                if (value.type === '分部') {
                    $scope.data.branches.push(value);
                }
            });
        });
    });

    $ionicModal.fromTemplateUrl('wbs-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.wbs = [];
        _.each($scope.data.resolveWbs, function (item) {
            if (item.checked) $scope.data.wbs.push(item.name);
        });
    };

    $scope.changeProject = function(project) {
        $scope.data.project = project;
    };
    $scope.changeUnit = function(unit) {
        $scope.data.unit = unit;
    };
    $scope.changeSection = function(section) {
        $scope.data.section = section;
    };
    $scope.changeBranch = function(branch) {
        $scope.data.branch = branch;
    };

    $scope.toCreate = function() {
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

        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        EvaluationService.create({
            project: $scope.data.projectId || $scope.data.project._id,
            segment: ($scope.data.branch || $scope.data.section)['_id'],
            unit: $scope.data.unit._id,
            wbs: $scope.data.wbs.join("|")
        }).then(function(evaluation) {
            $state.go('^.summary', {
                evaluationId: evaluation._id
            });
        }, function(err) {
            alert(err);
        });
    };

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
