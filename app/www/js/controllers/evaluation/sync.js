app.controller('EvaluationSyncCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $ionicPopup, $filter, settings, ProjectService, SegmentService, UserService, UnitService, CaptureService, CheckService, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.ranges = [];
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    UserService.findByUnitId($scope.data.user.unit._id).then(function(users) {
        $scope.users = _.clone(users, true);
    });

    $scope.openDatePicker = function(item, type) {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.data[type];

        if (!item.start_date) {
            item.start_date = moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm');
        }

        if (!item.end_date) {
            item.end_date = moment().format('YYYY-MM-DD HH:mm');
        }

        $ionicPopup.show({
            template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
            title: "日期选择",
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                    item[type] = $scope.tmp.newDate;
                    item['formatted_' + type] = $filter('date')($scope.tmp.newDate, 'yyyy-MM-dd HH:mm');
                }
            }]
        });
    };

    $scope.addCaptureRange = function () {
        $scope.data.ranges.unshift({
            type: "CAPTURE",
            name: "安全检查",
            user: "",
            start_date: "",
            end_date: ""
        });
    };

    $scope.addCheckRange = function () {
        $scope.data.ranges.unshift({
            type: "CHECK",
            name: "日常巡检",
            user: "",
            start_date: "",
            end_date: ""
        });
    };

    $scope.sync = function() {
        var isValid = true;
        var start_date, end_date;

        _.each($scope.data.ranges, function (item) {
            if (_.isEmpty(item.username)) {
                alert('请选择关联人员');
                isValid = false;
                return;
            }

            if (!item.end_date) {
                alert('请选择终止日期');
                isValid = false;
                return;
            }

            if (!item.start_date) {
                alert('请选择起始日期');
                isValid = false;
                return;
            }

            if (!start_date) {
                start_date = item.start_date;
            }

            if (!end_date) {
                end_date = item.end_date;
            }

            start_date = item.start_date < start_date ? item.start_date : start_date;
            end_date = item.end_date > end_date ? item.end_date : end_date;
        });

        if (!isValid) {
            return;
        }

        ActivityIndicator.show('正在同步中...');

        $scope.data.sync = ['users', 'captures', 'checks'];

        $rootScope.data.evaluation = $rootScope.data.evaluation || {};
        $rootScope.data.evaluation[$scope.data.evaluationId] = {};
        // $rootScope.data.evaluation[$scope.data.evaluationId].users = $scope.data.users;
        $scope.$emit('sync', 'users');

        CaptureService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, start_date, end_date).then(function(captures) {
            console.log(captures);
            $rootScope.data.evaluation[$scope.data.evaluationId].captures = _.filter(captures, function(capture) {
                return capture.process && capture.process.status !== 'END' && capture.user && _.find($scope.data.ranges, {
                    type: "CAPTURE",
                    username: capture.user.name
                }); // 过滤选择用户，且流程已走完，表示整改完成
            });
            $scope.$emit('sync', 'captures');
        });

        CheckService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, start_date, end_date).then(function(checks) {
            console.log(checks);
            $rootScope.data.evaluation[$scope.data.evaluationId].checks = _.filter(checks, function(check) {
                return check.process && check.process.status !== 'END' && check.user && _.find($scope.data.ranges, {
                    type: "CHECK",
                    username: check.user.name
                });
            });
            $scope.$emit('sync', 'checks');
        });
    };

    $scope.$on('sync', function(evt, type) {
        $scope.data.sync = _.without($scope.data.sync, type);

        if (_.isEmpty($scope.data.sync)) {
            console.log($rootScope.data.evaluation[$scope.data.evaluationId]);
            ActivityIndicator.hide();
            alert('同步成功');

            $state.go('^.customize', {
                evaluationId: $scope.data.evaluationId
            });
        }
    });

    $scope.toBack = function() {
        $state.go('^.list');
    };
});
