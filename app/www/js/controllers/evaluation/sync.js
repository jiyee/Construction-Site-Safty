app.controller('EvaluationSyncCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, settings, ProjectService, SegmentService, UserService, UnitService, CaptureService, CheckService, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.users = [];
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    UserService.findByUnitId($scope.data.user.unit._id).then(function(users) {
        $scope.users = users;
    });

    $ionicModal.fromTemplateUrl('users-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.users = [];
        $scope.data.usernames = [];
        _.each($scope.users, function (item) {
            if (item.checked) {
                $scope.data.usernames.push(item.name);
                $scope.data.users.push(item);
            }
        });
    };

    var today = new Date();
    var end_date = new Date(today.setDate(today.getDate()));
    var start_date = new Date(today.setMonth(today.getMonth() - 1));

    $scope.data.end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join('-');
    $scope.data.start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');

    $scope.sync = function() {
        if (!$scope.data.evaluation) {
            alert('参数错误');
            return;
        }

        if (!$scope.data.evaluation.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.evaluation.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.end_date) {
            alert('请选择终止日期');
            return;
        }

        if (!$scope.data.start_date) {
            alert('请选择起始日期');
            return;
        }

        $scope.data.sync = ['users', 'captures', 'checks'];

        $rootScope.data.evaluation = $rootScope.data.evaluation || {};
        $rootScope.data.evaluation[$scope.data.evaluationId] = {};
        $rootScope.data.evaluation[$scope.data.evaluationId].users = $scope.data.users;
        $scope.$emit('sync', 'users');

        CaptureService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, $scope.data.start_date, $scope.data.end_date).then(function(captures) {
            $rootScope.data.evaluation[$scope.data.evaluationId].captures = captures;
            $scope.$emit('sync', 'captures');
        });

        CheckService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, $scope.data.start_date, $scope.data.end_date).then(function(checks) {
            $rootScope.data.evaluation[$scope.data.evaluationId].checks = checks;
            $scope.$emit('sync', 'checks');
        });
    };

    $scope.$on('sync', function(evt, type) {
        $scope.data.sync = _.without($scope.data.sync, type);

        if (_.isEmpty($scope.data.sync)) {
            alert('同步成功');
            $state.go('^.customize', {
                evaluationId: $scope.data.evaluationId
            });
        }
    });

});