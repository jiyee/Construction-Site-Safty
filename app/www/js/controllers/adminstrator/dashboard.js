app.controller('AdministratorDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, UserService, CaptureService, CheckService, EvaluationService, AuthService, OfflineService, GeolocationService, SyncService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.position = [0, 0];

    // 根据定位获取所在项目、标段和分部
    GeolocationService.getGeolocation().then(function(position) {
        $scope.data.position = position;
        $rootScope.data.position = position;
    }, function(error) {
        $scope.data.position = [0, 0];
        $rootScope.data.position = [0, 0];
    });

    OfflineService.list().then(function(list) {
        // 只导入安全检查和考核评价
        list = _.filter(list, function(item) {
            return item._type_ === 'capture' ||
                item._type_ === 'evaluation';
        });

        if (list.length === 0) return;

        var popup = $ionicPopup.show({
            template: '',
            title: '您有' + list.length + '条离线记录，是否数据同步？',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }, ]
        });

        popup.then(function(bool) {
            if (!bool) return;

            $state.go("sync.dashboard");
        });
    });

    // 加载用户待办列表
    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;
    });

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
    });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    if ($scope.data.user.unit) {
        $scope.data.group = $scope.data.user.unit;
        UserService.findByUnitId($scope.data.user.unit._id).then(function (users) {
            $scope.data.groupUsers = users;
        });
    }

    $scope.toDetail = function(item) {
        if (item.type === 'capture') {
            $state.go('capture.detail', {
                captureId: item._id
            });
        } else if (item.type === 'check') {
            $state.go('check.detail', {
                checkId: item._id
            });
        } else if (item.type === 'evaluation') {
            $state.go('evaluation.summary', {
                evaluationId: item._id
            });
        }
    };

    $scope.sync = function() {
        SyncService.fullUpgrade().then(function() {
            alert('离线数据同步成功');
        }, function() {
            alert('离线数据同步失败');
        });
    };

    $scope.toStandard = function() {

    };

    $scope.toCaptureMap = function() {
        $state.go('capture.map', {});
    };

    $scope.toEvaluation = function() {
        $state.go('evaluation.create', {});
    };

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $state.go('welcome');
        }, function(err) {
            alert(err);
            $state.go('welcome');
        });
    };
});
