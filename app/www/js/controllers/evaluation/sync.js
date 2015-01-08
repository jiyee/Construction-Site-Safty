app.controller('EvaluationSyncCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, $ionicPopup, $filter, settings, ProjectService, SegmentService, UserService, UnitService, CaptureService, CheckService, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.users = [];
    $scope.data.users2 = [];
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.isCaptures = true;
    $scope.data.isChecks = true;

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    UserService.findByUnitId($scope.data.user.unit._id).then(function(users) {
        $scope.users = _.clone(users, true);
        $scope.data.users = [_.find($scope.users, {
            name: $scope.data.user.name
        })];
        $scope.data.users[0].checked = true;
        $scope.data.usernames = [$scope.data.user.name];

        $scope.users2 = _.clone(users, true);
        $scope.data.users2 = [_.find($scope.users2, {
            name: $scope.data.user.name
        })];
        $scope.data.users2[0].checked = true;
        $scope.data.usernames2 = [$scope.data.user.name];
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
        _.each($scope.users, function(item) {
            if (item.checked) {
                $scope.data.usernames.push(item.name);
                $scope.data.users.push(item);
            }
        });
    };

    $scope.openDatePicker = function(type) {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.data[type];

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
                    $scope.data[type] = $scope.tmp.newDate;
                }
            }]
        });
    };

    $scope.$watch('data.start_date', function(unformattedDate) {
        $scope.data.formattedStartDate = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
    });

    $scope.$watch('data.end_date', function(unformattedDate) {
        $scope.data.formattedEndDate = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
    });

    $scope.data.end_date = moment().format('YYYY-MM-DD HH:mm');
    $scope.data.start_date = moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm');

    //////////////////
    $ionicModal.fromTemplateUrl('users-modal2.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal2 = modal;
    });
    $scope.openModal2 = function($event) {
        $scope.modal2.show($event);
    };
    $scope.closeModal2 = function() {
        $scope.modal2.hide();

        $scope.data.users2 = [];
        $scope.data.usernames2 = [];
        _.each($scope.users2, function(item) {
            if (item.checked) {
                $scope.data.usernames2.push(item.name);
                $scope.data.users2.push(item);
            }
        });
    };

    $scope.openDatePicker2 = function(type) {
        $scope.tmp = {};
        $scope.tmp.newDate2 = $scope.data[type];

        $ionicPopup.show({
            template: '<datetimepicker ng-model="tmp.newDate2"></datetimepicker>',
            title: "日期选择",
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                    $scope.data[type] = $scope.tmp.newDate2;
                }
            }]
        });
    };

    $scope.$watch('data.start_date2', function(unformattedDate) {
        $scope.data.formattedStartDate2 = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
    });

    $scope.$watch('data.end_date2', function(unformattedDate) {
        $scope.data.formattedEndDate2 = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
    });

    $scope.data.end_date2 = moment().format('YYYY-MM-DD HH:mm');
    $scope.data.start_date2 = moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm');
    //////////////////

    $scope.sync = function() {
        if (_.isEmpty($scope.data.users) || _.isEmpty($scope.data.users2)) {
            alert('请选择关联人员');
            return;
        }

        if (!$scope.data.end_date || !$scope.data.end_date2) {
            alert('请选择终止日期');
            return;
        }

        if (!$scope.data.start_date || !$scope.data.start_date2) {
            alert('请选择起始日期');
            return;
        }

        $scope.data.sync = ['users', 'captures', 'checks'];

        $rootScope.data.evaluation = $rootScope.data.evaluation || {};
        $rootScope.data.evaluation[$scope.data.evaluationId] = {};
        $rootScope.data.evaluation[$scope.data.evaluationId].users = $scope.data.users;
        $scope.$emit('sync', 'users');

        if ($scope.data.isCaptures) {
            CaptureService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, $scope.data.start_date, $scope.data.end_date).then(function(captures) {
                $rootScope.data.evaluation[$scope.data.evaluationId].captures = _.filter(captures, function(capture) {
                    return capture.process && capture.process.status !== 'END' && capture.user && _.find($scope.data.users, {
                        name: capture.user.name
                    }); // 过滤选择用户，且流程已走完，表示整改完成
                });
                $scope.$emit('sync', 'captures');
            });
        } else {
            $scope.$emit('sync', 'captures');
        }

        if ($scope.data.isChecks) {
            CheckService.list($scope.data.evaluation.project._id, $scope.data.evaluation.section._id, $scope.data.start_date2, $scope.data.end_date2).then(function(checks) {
                $rootScope.data.evaluation[$scope.data.evaluationId].checks = _.filter(checks, function(check) {
                    return check.process && check.process.status !== 'END' && check.user && _.find($scope.data.users2, {
                        name: check.user.name
                    });
                });
                $scope.$emit('sync', 'checks');
            });
        } else {
            $scope.$emit('sync', 'checks');
        }
    };

    $scope.$on('sync', function(evt, type) {
        $scope.data.sync = _.without($scope.data.sync, type);

        if (_.isEmpty($scope.data.sync)) {
            if ($scope.data.isChecks || $scope.data.isCaptures) {
                alert('同步成功');
            }

            $state.go('^.customize', {
                evaluationId: $scope.data.evaluationId
            });
        }
    });

    $scope.skip = function() {
        $state.go('^.customize', {
            evaluationId: $scope.data.evaluationId
        });
    };
});
