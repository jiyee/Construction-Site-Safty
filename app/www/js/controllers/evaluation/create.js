app.controller('EvaluationCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, settings, wbs, SegmentService, UnitService, OfflineService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.resolveWbs = wbs;
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;

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

    // 自动选中默认项目、标段、分部
    if ($scope.data.user.project) {
        $scope.data.project = _.find($scope.data.projects, {_id: $scope.data.user.project._id});
    }

    $scope.$watch('data.project', function (project) {
        if (!project) return;

        UnitService.findByProjectId(project._id).then(function(units) {
            $scope.data.units = _.filter(units, {type: '施工单位'});

            // 自动选中默认施工单位
            if ($scope.data.user.unit && $scope.data.user.unit.type === '施工单位') {
                $scope.data.unit = _.find($scope.data.units, {_id: $scope.data.user.unit._id});
            }
        });
    });

    $scope.$watch('data.unit', function(unit) {
        if (!unit) return;

        SegmentService.findByUnitId(unit._id).then(function(segments) {
            $scope.data.sections = _.filter(segments, {type: '标段'});

            if ($scope.data.user.section) {
                // BUG 只有延时才能解决默认选中问题
                $timeout(function() {
                    $scope.data.section = _.find($scope.data.sections, {
                        _id: $scope.data.user.section._id
                    });
                }, 100);
            }
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

    $scope.toCreate = function() {
        if (!$scope.data.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.unit) {
            alert('请选择考核单位');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        OfflineService.newEvaluation({
            project: $scope.data.project,
            section: $scope.data.section,
            unit: $scope.data.unit,
            user: $scope.data.user,
            wbs: $scope.data.wbs,
            object: 'builder' // TODO 目前仅有建设单位的考核评价，缺少监理单位和建设单位
        }).then(function(evaluation) {
            $state.go('^.customize', {
                evaluationId: evaluation.uuid
            });
        }, function(err) {
            alert(err);
        });
    };

    $scope.toBack = function() {
        $state.go('^.list');
    };
});
