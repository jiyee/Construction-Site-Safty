app.controller('EvaluationCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, settings, SegmentService, OfflineService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.progress = [];

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    // 自动选中默认项目、标段、分部
    if ($scope.data.user.project) {
        $scope.data.project = _.find($scope.data.projects, {_id: $scope.data.user.project._id});
    }

    $scope.$watch('data.project', function (project) {
        if (!project) return;

        SegmentService.findByProjectId(project._id).then(function(segments) {
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

    // 默认进展
    $scope.progress = [{
        "name": '桥梁工程'
    }, {
        "name": '隧道工程'
    }, {
        "name": '路基路面工程'
    }, {
        "name": '水运工程'
    }];

    $ionicModal.fromTemplateUrl('progress-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.progress = [];
        _.each($scope.progress, function (item) {
            if (item.checked) $scope.data.progress.push(item.name);
        });
    };

    $scope.toCreate = function() {
        if (!$scope.data.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.progress || $scope.data.progress.length === 0) {
            alert('请选择工程进展');
            return;
        }

        OfflineService.newEvaluation({
            project: $scope.data.project,
            section: $scope.data.section,
            user: $scope.data.user,
            progress: $scope.data.progress,
            object: 'builder' // TODO 目前仅有建设单位的考核评价，缺少监理单位和建设单位
        }).then(function(evaluation) {
            $state.go('^.sync', {
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
