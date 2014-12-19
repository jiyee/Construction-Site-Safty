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
        $scope.data.users = [_.find($scope.users, {name: $scope.data.user.name})];
        $scope.data.users[0].checked = true;
        $scope.data.usernames = [$scope.data.user.name];
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
        if (_.isEmpty($scope.data.users)) {
            alert('请选择关联人员');
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
            $rootScope.data.evaluation[$scope.data.evaluationId].captures = _.filter(captures, function(capture) {
                return capture.process && capture.process.status !== 'END' && capture.user && _.find($scope.data.users, {name: capture.user.name}); // 过滤选择用户，且流程已走完，表示整改完成
            });
            $scope.$emit('sync', 'captures');
        });

        CheckService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, $scope.data.start_date, $scope.data.end_date).then(function(checks) {
            $rootScope.data.evaluation[$scope.data.evaluationId].checks = _.filter(checks, function(check) {
                return check.process &&  check.process.status !== 'END' && check.user && _.find($scope.data.users, {name: check.user.name});
            });
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